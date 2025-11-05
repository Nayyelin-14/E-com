import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userInfo: {
    email: string;
    role: string;
    name: string;
  } | null;
}

const initialAuthState: AuthState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
