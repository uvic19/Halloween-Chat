import React from 'react'
import './userInfo.css'
import { useChatStore } from '../../../lib/chatStore'
import { useUserStore } from '../../../lib/userStore'


const Userinfo = () => {

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore()
  const { currentUser } =useUserStore()
  return (
    <div className='userInfo'>
        <div className="user">
        <img src={currentUser?.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser?.username || "Jane Doe"}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./edit.png" alt="" />
        </div>
    </div>
  )
}

export default Userinfo
