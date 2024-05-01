import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatId: 'null',
        user: false,
        forwardingMessage: '',
        deletingUser: ''
    },
    reducers:{
        changeUser(state,action){
          try{
              const newUser = action.payload;
              
              state.user = newUser;
              state.chatId = 
              auth.currentUser.uid > newUser.uid? 
              auth.currentUser.uid + newUser.uid : newUser.uid + auth.currentUser.uid 
            }catch(err){console.log(err)}
        },
        setID(state,action){
            state.chatId = action.payload;
        },
        setForwardingMessage(state,action){
            state.forwardingMessage = action.payload
        },
        setDeletingUser(state,action){
            state.deletingUser = action.payload
        }
    }
})

export const chatActions = chatSlice.actions

export default chatSlice