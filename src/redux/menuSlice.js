import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        toggleSettings: false,
        settingsAnimation: 'settings',
        toggleProfileEdit: false,
        newProfileImg: false,
    },
    reducers:{
        onToggleSettings(state,action){
            state.toggleSettings = action.payload
        },
        onSettingsAnimation(state,action){
            state.settingsAnimation = action.payload
        },
        onToggleProfileEdit(state,action){
            state.toggleProfileEdit = action.payload
        },
        onSetProfileImg(state,action){
            const newURL = action.payload === false?
            false
            :
            URL.createObjectURL(action.payload);

            state.newProfileImg = newURL;
        }
    }
})

export const menuActions = menuSlice.actions

export default menuSlice