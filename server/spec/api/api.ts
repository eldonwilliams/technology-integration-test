import './fetch-polyfill';
import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "./apiTypes";

const testApiFetcher = Fetcher.for<paths>();

testApiFetcher.configure({
    baseUrl: "http://localhost:8000",
    init: {
        credentials: 'include',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        }
    },
});

export default testApiFetcher;