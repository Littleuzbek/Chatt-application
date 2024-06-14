import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: "null",
    user: false,
    chatType: "",
    forwardingMessage: "",
    deletingUser: "",
    viewContentValue: "",
    videoChangedProgress: 0,
    contentType: "",
    searchResult: false,
    messages: [],
    chatDeleted: false,
  },
  reducers: {
    changeUser(state, action) {
      try {
        const newUser = action.payload;

        state.user = newUser;
        if (newUser !== false) {
          state.chatId =
            auth.currentUser.uid > newUser.value.uid
              ? auth.currentUser.uid + newUser.value.uid
              : newUser.value.uid + auth.currentUser.uid;
        }else{
          state.chatId = false;
        }
      } catch (err) {
        console.log(err);
      }
    },
    setForwardingMessage(state, action) {
      state.forwardingMessage = action.payload;
    },
    setDeletingUser(state, action) {
      state.deletingUser = action.payload;
    },
    setViewContentValue(state, action) {
      state.viewContentValue = action.payload;
    },
    setChangedProgress(state, action) {
      state.mediaProgress = action.payload;
    },
    setContentType(state, action) {
      state.contentType = action.payload;
    },
    setSearchResult(state, action) {
      state.searchResult = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setChatDeleted(state) {
      state.chatDeleted = !state.chatDeleted;
    },
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice;
