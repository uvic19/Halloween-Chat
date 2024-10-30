import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: null,
  isReceiverBlocked: null,
  changeChat:(chatId,user)=>{
    const currentUser = useUserStore.getState().currentUser

    // Check if the current user is blocked


    if(user.blocked.includes(currentUser.id)){
      return set({chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,})
    }
    // Check if the receiver is blocked

    else if(currentUser.blocked.includes(user.id)){
      return set({chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      })
    } else{

    set({chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,})
  }
  
  },
    changeBlock: ()=>{
      set(state=>({...state, isReceiverBlocked: !state.isReceiverBlocked}))
    },
  
}));
