import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authorized: false,
    showSignInForm: true,
    showForgotPasswrodForm: true
  },
  reducers: {
    userAuthorized(state, action) {
      state.authorized = action.payload;
    },
    showSignInForm(state,action){
      state.showSignInForm = action.payload
    },
    showForgotPasswordForm(state,action){
      state.showForgotPasswrodForm = action.payload
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice;
