import { createSlice } from "@reduxjs/toolkit";

export interface AuthSliceState {
    /**
     * Is the browser currently logged in
     */
    authenticated: boolean;
    /**
     * undefined if authenticated false.
     */
    whois: string | undefined;
}



const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false,
        whois: undefined,
    } as AuthSliceState,
    reducers: {
        updateAuthentication(state, event) {
            if (event.payload.who === undefined) {
                state.authenticated = false;
                state.whois = undefined;
                return;
            }
            state.authenticated = true;
            state.whois = event.payload.who;
        },
    }
});

export const { updateAuthentication, } = authSlice.actions;
export default authSlice.reducer;