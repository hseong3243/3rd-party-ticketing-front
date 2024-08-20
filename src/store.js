import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  memberId: null,
  accessToken: null,
  login: (memberId, accessToken) => set({ 
    isLoggedIn: true, 
    memberId, 
    accessToken 
  }),
  logout: () => set({ 
    isLoggedIn: false, 
    memberId: null, 
    accessToken: null 
  }),
}));

export default useAuthStore;