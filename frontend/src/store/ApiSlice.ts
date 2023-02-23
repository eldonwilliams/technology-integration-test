import { createSlice } from "@reduxjs/toolkit";
import { FarmIdleBackend } from "../api-client";

export interface ApiSliceState {
    farmIdleClient: FarmIdleBackend;
}

const apiState = createSlice({
    name: 'api',
    initialState: {
        farmIdleClient: new FarmIdleBackend({
            BASE: import.meta.env.VITE_API_URL
        }),
    } as ApiSliceState,
    reducers: {

    }
});

export const {} = apiState.actions;
export default apiState.reducer;