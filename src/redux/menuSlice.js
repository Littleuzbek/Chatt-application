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
    newMembers: [],
    newGroup: false,
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
    onSetNewMembers(state, action) {
      try {
        const value = action.payload.value;
        const type = action.payload.type;

        if (type === "add") {
          const memberExist = state.newMembers.find(
            (member) => member?.uid === value.uid
          );

          if (!memberExist) {
            state.newMembers.push({
              displayName: value.displayName,
              photoURL: value.photoURL,
              uid: value.uid,
            });
          }
        }

        if (type === "remove") {
          state.newMembers = state.newMembers.filter(
            (member) => member.uid !== value.uid
          );
        }
      } catch (err) {
        console.log(err);
      }
    },
    onSetNewGroup(state,action){
      state.newGroup = action.payload
    },
  },
});

export const menuActions = menuSlice.actions;

export default menuSlice;
