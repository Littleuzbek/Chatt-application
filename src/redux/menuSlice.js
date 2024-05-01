import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        toggleSettings: false,
        settingsAnimation: 'settings',
        toggleProfileEdit: false,
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
        }
    }
})

export const menuActions = menuSlice.actions

export default menuSlice