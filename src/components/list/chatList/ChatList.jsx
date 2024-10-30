import React, { useEffect, useState } from 'react';
import './chatList.css';
import AddUser from './addUser/addUser';
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

const Chatlist = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState(""); // Define input state
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userdocRef = doc(db, "users", item.receiverId);
        const userdocSnap = await getDoc(userdocRef);

        const user = userdocSnap.data();
        return { ...item, user };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    // Set isSeen to true for the selected chat
    if (chatIndex > -1) {
      userChats[chatIndex].isSeen = true; // Update local state
    }

    const userChatRef = doc(db, "userchats", currentUser.id);

    try {
      // Update Firestore to set isSeen status
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className='ChatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input 
            type="text" 
            placeholder='Search' 
            onChange={(e) => setInput(e.target.value)} // Update input on change
          />
        </div>
        <img 
          src={addMode ? "./minus.png" : "./plus.png"} 
          alt="" 
          className='add' 
          onClick={() => setAddMode(prev => !prev)} 
        />
      </div>
      {filteredChats.map(chat => (
        <div 
          className="item" 
          key={chat.chatId} 
          onClick={() => handleSelect(chat)} 
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#a84fa899",
          }}
        >
          <img 
            src={chat.user.blocked.includes(currentUser.id) 
              ? "./avatar.png" 
              : chat.user.avatar || "./avatar.png"} 
          />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default Chatlist;
