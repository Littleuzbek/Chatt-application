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
            let imgForProfile = URL.createObjectURL(action.payload)

            state.newProfileImg = imgForProfile;
        }
    }
})

export const menuActions = menuSlice.actions

export default menuSlice