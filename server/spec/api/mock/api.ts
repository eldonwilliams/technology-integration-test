import './fetch-polyfill';
import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "./apiTypes";
import cookie from "cookie";

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

const signupRequest = testApiFetcher.path("/account/signup").method("post").create();
const loginRequest = testApiFetcher.path("/authentication/login").method("post").create();

/** Test Username */
export const username = "test";
/** Test Password */
export const password = "HelloWorld32!";
let ready = false;

/**
 * Registers a test account with the server with reusable credentials.
 * This is useful for tests that need to test authentication stuffs.
 * 
 * Broke
 */
export const assureTestAccountCreated = () => new Promise<boolean>(async (resolve, _reject) => {
    signupRequest({ username, password })
        .then((response) => {
            if (response.status !== 201) {
                ready = false;
                return resolve(false);
            }
            ready = true;
            resolve(true);
        })
        .catch((e) => {
            if (e instanceof signupRequest.Error) {
                const error = e.getActualType();
                // 409 – Conflict. Account should still exist.
                if (error.status === 409) {
                    ready = true;
                    return resolve(true);
                }
            }
            ready = false;
            resolve(false);
        });
});

/**
 * Logs into the test account and gets a session token.
 * No cache exists for this request.
 */
export const getTestSessionToken = () => new Promise<string | undefined>(async (resolve, _reject) => {
    await assureTestAccountCreated();
    if (!ready) return resolve(undefined);

    loginRequest({ username, password })
        .then((response) => {
            if (response.status !== 200) return resolve(undefined);
            const cookieHeader = response.headers.get("Set-Cookie");
            if (cookieHeader === null) return resolve(undefined);
            resolve(cookie.parse(cookieHeader).sessionToken);
        })
        .catch((e) => {
            resolve(undefined);
        });
});

export default testApiFetcher;