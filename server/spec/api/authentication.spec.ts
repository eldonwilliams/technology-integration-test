import { describe, expect, test } from "@jest/globals";
import testApiFetcher, { assureTestAccountCreated, getTestSessionToken, username, password } from "./mock/api";

describe("authentication tests", () => {
    const loginRequest = testApiFetcher.path("/authentication/login").method("post").create();
    const logoutRequest = testApiFetcher.path("/authentication/logout").method("get").create();
    const sessionRequest = testApiFetcher.path("/authentication/session").method("get").create();

    describe("login tests", () => {
        test("fake accounts should return 404", async () => {
            await loginRequest({ username: "foobar", password: "IG0tFoobared", })
                .catch((e) => {
                    if (!(e instanceof loginRequest.Error)) throw new Error;
                    expect(e.status).toBe(404)
                });
        });

        test("bad credentials give 401", async () => {
            await assureTestAccountCreated();
            await loginRequest({ username, password: "Guess8This1sWrong!", })
                .catch((e) => {
                    if (!(e instanceof loginRequest.Error)) throw new Error;
                    expect(e.status).toBe(401);
                });
        });

        test("if logged in give 403", async () => {
            const token = await getTestSessionToken();
            if (token === undefined) throw new Error;
            await loginRequest({ username: "test", password: "ThisCanBeWrong,DoesntMatter", }, {
                headers: {
                    "Cookie": `sessionToken=${token};`
                }
            }).catch((e) => {
                if (!(e instanceof loginRequest.Error)) throw new Error;
                expect(e.status).toBe(403);
            })
        });

        test("can login successfully", async () => {
            await assureTestAccountCreated();
            await expect(loginRequest({ username, password, })).resolves.toBeDefined();
        });
    });

    describe("logout tests", () => {
        test("cannot logout if not logged in", async () => {
            await expect(logoutRequest({})).rejects.toBeDefined();
        });

        test("can logout and sends right header", async () => {
            const token = await getTestSessionToken();
            if (token === undefined) throw new Error;
            const request = logoutRequest({}, {
                headers: {
                    "Cookie": `sessionToken=${token};`
                }
            })
            
            request.then((response) => {
                expect(response.headers.has("Set-Cookie")).toBe(true);
            });

            await expect(request).resolves.toBeDefined();
        });
    });

    describe("session tests", () => {
        test("will get a 401 when logged out", async () => {
            const request = sessionRequest({});
                
            request.catch((e) => {
                if (!(e instanceof sessionRequest.Error)) throw new Error;
                expect(e.status).toBe(401);
            });

            await expect(request).rejects.toBeDefined();
        });

        test("can get the session data", async () => {
            const token = await getTestSessionToken();
            if (token === undefined) throw new Error;
            const request = sessionRequest({}, {
                headers: {
                    "Cookie": `sessionToken=${token};`
                }
            })

            request.then((response) => {
                expect(response.status).toBe(200);
                expect(response.data.user).toBe(username);
            });

            await expect(request).resolves.toBeDefined();
        });
    });
});