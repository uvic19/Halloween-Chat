import React, { useState } from 'react';
import './addUser.css';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Use the first document found
        const userData = querySnapshot.docs[0].data();
        setUser(userData);
      } else {
        setUser(null); // Reset user if not found
        console.log("No such user!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    
    try {
      const newChatRef = doc(chatRef);
      
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      // Prepare the chat object
      const chatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        updatedAt: Date.now(),
      };
  
      // Check if the user document exists for the user
      const userChatDocRef = doc(userChatsRef, user.id);
      const userChatDoc = await getDoc(userChatDocRef);
  
      if (!userChatDoc.exists()) {
        // Create the userchats document if it doesn't exist
        await setDoc(userChatDocRef, { chats: [] });
      }
  
      // Update the user's chats
      await updateDoc(userChatDocRef, {
        chats: arrayUnion(chatData),
      });
  
      // Check if the current user document exists
      const currentUserChatDocRef = doc(userChatsRef, currentUser.id);
      const currentUserChatDoc = await getDoc(currentUserChatDocRef);
  
      if (!currentUserChatDoc.exists()) {
        // Create the current user's userchats document if it doesn't exist
        await setDoc(currentUserChatDocRef, { chats: [] });
      }
  
      // Update the current user's chats
      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
  
      console.log("Chat added successfully!");
  
    } catch (err) {
      console.error("Error adding chat:", err);
    }
  };
  
  


  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder='Username' name='username' />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
