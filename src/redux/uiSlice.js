import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: 'ui',
    initialState:{
        loader: true,
        unloaded: false,
        progress: null,
        viewContentValue: '',
        viewContent: false,
        backDrop: false,
        forwardList: false,
        forwardingUserId: '',
        listClick: false,
        messageClick: false,
        doubleDelete: false,
        passwordCondition: '',
    },
    reducers:{
        setLoader(state,action){
            state.loader = action.payload;
        },
        setUnloaded(state,action){
            state.unloaded = action.payload;
        },
        setProgress(state,action){
            state.progress = action.payload;
        },
        setViewContentValue(state,action){
            state.viewContentValue = action.payload
        },
        setViewContent(state,action){
            state.viewContent = action.payload
        },
        setBackDrop(state,action){
            state.backDrop = action.payload
        },
        setForwardList(state,action){
            state.forwardList = action.payload
        },
        setForwardingUserId(state,action){
            state.forwardingUserId = action.payload
        },
        setClickValue(state,action){
            const actions = action.payload

            if(actions.type === 'list'){
                state.listClick = actions.value
            }else if(actions.type === 'message'){
                state.messageClick = actions.value
            }
        },
        setDoubleDelete(state,action){
            state.doubleDelete = action.payload
        },
        setPasswordCondition(state,action){
            state.passwordCondition = action.payload
        }
    }
})

export const uiActions = uiSlice.actions;

export default uiSlice 