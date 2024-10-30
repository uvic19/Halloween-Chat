import React, { useEffect, useRef, useState } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

const Chat = () => {
  const [chat, setChat] = useState({ messages: [] }); // Initialize with an empty messages array
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
    name: "", // Add a new field to hold the file name
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for the file input

  // Scroll to the bottom when the component mounts or updates
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Fetch chat messages from Firestore
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data() || { messages: [] }); // Ensure messages is always an array
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImg({
        file: selectedFile,
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name, // Set file name for placeholder
      });
    }
  };

  const handleSend = async () => {
    // Check if the current user is blocked from sending messages to the receiver
    if (isCurrentUserBlocked || isReceiverBlocked) {
      alert("You cannot send messages to this user.");
      return; // Exit if blocked
    }
  
    // Exit if there is neither text nor an image to send
    if (text === "" && !img.file) return;
  
    let imgUrl = null;
  
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
  
      const newMessage = {
        senderId: currentUser.id,
        createdAt: new Date(),
        ...(text && { text }), // Add text only if it exists
        ...(imgUrl && { img: imgUrl }), // Add img only if imgUrl is set
      };
  
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(newMessage),
      });
  
      const userIDs = [currentUser.id, user.id];
  
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);
  
        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);
  
          if (chatIndex > -1) {
            userChatsData.chats[chatIndex].lastMessage = text || "[Image]";
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = Date.now();
  
            await updateDoc(userChatRef, {
              chats: userChatsData.chats,
            });
          }
        }
      });
  
      // Clear input after sending
      setText("");
      setImg({ file: null, url: "", name: "" });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
  
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username || "Jane Doe"}</span>
            <p>Lorem ipsum dolor sit</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message.createdAt.toString()}>
            <div className="text">
              {message.img && <img src={message.img} alt="Sent image" />}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input 
            type="file" 
            id='file' 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            onChange={handleImg} 
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input 
          type="text" 
          placeholder={img.name || 'Type a message...'} 
          onChange={e => setText(e.target.value)} 
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked} // Disable input if blocked
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} theme="dark" />
          </div>
        </div>
        <button 
          className='sendButton' 
          onClick={handleSend} 
          disabled={isCurrentUserBlocked || isReceiverBlocked} // Disable button if blocked
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
