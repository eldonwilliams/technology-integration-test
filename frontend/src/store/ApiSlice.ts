import { createSlice } from "@reduxjs/toolkit";
import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "../apiTypes";

const fetcher = Fetcher.for<paths>();

fetcher.configure({
    baseUrl: import.meta.env.VITE_API_URL,
    init: {
        credentials: 'include',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        }
    }
})

export type ApiClient = typeof fetcher;
export interface ApiSliceState {
    apiClient: ApiClient;
}

const apiState = createSlice({
    name: 'api',
    initialState: {
        apiClient: fetcher,
    } as ApiSliceState,
    reducers: {

    }
});

export const {} = apiState.actions;
export default apiState.reducer;