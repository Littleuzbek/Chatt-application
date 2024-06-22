import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    toggleSettings: false,
    settingsAnimation: "settings",
    toggleProfileEdit: false,
    newProfileImg: false,
    chatThemeValue: "",
    chatTheme: false,
    newGroupMembers: [],
    newChannelMembers: [],
    newGroup: false,
    newChannel: false,
  },
  reducers: {
    onToggleSettings(state, action) {
      state.toggleSettings = action.payload;
    },
    onSettingsAnimation(state, action) {
      state.settingsAnimation = action.payload;
    },
    onToggleProfileEdit(state, action) {
      state.toggleProfileEdit = action.payload;
    },
    onSetProfileImg(state, action) {
      const newURL =
        action.payload === false ? false : URL.createObjectURL(action.payload);

      state.newProfileImg = newURL;
    },
    onSetChatThemeValue(state, action) {
      state.chatThemeValue = action.payload;
    },
    onSetChatTheme(state, action) {
      state.chatTheme = action.payload;
    },
    onSetNewGroupMembers(state, action) {
      try {
        const value = action.payload.value;
        const type = action.payload.type;

        if (type === "add") {
          const memberExist = state.newGroupMembers.find(
            (member) => member?.uid === value.uid
          );

          if (!memberExist) {
            state.newGroupMembers.push({
              displayName: value.displayName,
              photoURL: value.photoURL,
              uid: value.uid,
            });
          }
        }

        if (type === "remove") {
          state.newGroupMembers = state.newGroupMembers.filter(
            (member) => member.uid !== value.uid
          );
        }

        if(action.payload === 'clear'){
          state.newGroupMembers = []
        }
      } catch (err) {
        console.log(err);
      }
    },
    onSetNewChannelMembers(state, action) {
      try {
        const value = action.payload.value;
        const type = action.payload.type;

        if (type === "add") {
          const memberExist = state.newChannelMembers.find(
            (member) => member?.uid === value.uid
          );

          if (!memberExist) {
            state.newChannelMembers.push({
              displayName: value.displayName,
              photoURL: value.photoURL,
              uid: value.uid,
            });
          }
        }

        if (type === "remove") {
          state.newChannelMembers = state.newChannelMembers.filter(
            (member) => member.uid !== value.uid
          );
        }

        if(action.payload === 'clear'){
          state.newChannelMembers = []
        }
      } catch (err) {
        console.log(err);
      }
    },
    onSetNewGroup(state,action){
      state.newGroup = action.payload;
    },
    onSetNewChannel(state,action){
      state.newChannel = action.payload;
    }
  },
});

export const menuActions = menuSlice.actions;

export default menuSlice;
