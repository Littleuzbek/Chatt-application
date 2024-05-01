import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import uiSlice from "./uiSlice";
import menuSlice from "./menuSlice";
import chatSlice from "./ChatSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    menu: menuSlice.reducer,
    chat: chatSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
