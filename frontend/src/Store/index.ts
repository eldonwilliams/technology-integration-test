import { configureStore } from "@reduxjs/toolkit"
import ApiSlice from "./ApiSlice";
import AuthSlice from "./AuthSlice"

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        api: ApiSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;