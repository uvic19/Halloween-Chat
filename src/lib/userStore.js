import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from './firebase';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      console.log("No UID found, setting currentUser to null.");
      return set({ currentUser: null, isLoading: false });
    }
  
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log("User document found:", docSnap.data());
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log("User document does not exist, setting currentUser to null.");
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log("Error fetching user info:", err);
      set({ currentUser: null, isLoading: false });
    }
}
  
}));
