import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import testApiFetcher, { getTestSessionToken } from "./mock/api";
import { createClient } from "redis";
import { getEnvString } from "../../src/util/getEnv";

describe("account tests", () => {
    const redisClient = createClient({ url: getEnvString("REDIS_URL", "redis://redis:6379"), });

    beforeAll((done) => {
        redisClient
            .connect()
            .catch(() => {
                throw new Error;
            })
            .finally(done);
    })

    afterAll((done) => {
        redisClient
            .disconnect()
            .finally(done);
    })

    describe("signup works", () => {
        beforeEach((done) => {
            redisClient.flushAll();
            done();
        });

        const signupRequest = testApiFetcher.path("/account/signup").method("post").create();
        
        test("account creation works at all", async () => {
            const req = signupRequest({ username: "test", password: "HelloWorld32#", });
            await expect(req).resolves.toBeDefined();
        });

        test("conflicts work", async () => {
            const goodRequest = signupRequest({ username: "test", password: "HelloWorld32#", });
            expect(goodRequest).resolves.toBeDefined();
            await goodRequest;
            const conflictingRequest = signupRequest({ username: "test", password: "HelloWorld32#", });
            await conflictingRequest.catch((e) => {
                if (!(e instanceof signupRequest.Error)) throw new Error;
                expect(e.status).toBe(409);
            });
        });

        describe("input validation tests", () => {
            function runValidationTest(what: string, input: Parameters<typeof signupRequest>[0], username: boolean, password: boolean) {
                test(what, async () => await signupRequest(input).catch((e) => {
                    if (!(e instanceof signupRequest.Error)) throw new Error;
                    const error = e.getActualType();
                    expect(error.status).toBe(400);
                    if (error.status !== 400) throw new Error;
                    if (username)
                        expect(error.data.details.username.length).toBeGreaterThan(0);
                    if (password)
                        expect(error.data.details.password.length).toBeGreaterThan(0);
                }));
            }

            runValidationTest("does username validation work", ({ username: "LoudMouth!", password: "HelloWorld32#", }), true, false);
            runValidationTest("does password validation work", { username: "test", password: "ihatenumbers"}, false, true);
            runValidationTest("do both validations work", { username: "LoudMouth!!", password: "numbrhatr"}, true, true);
        });

        test("must be logged out", async () => {
            await signupRequest({ username: "test2", password: "HelloWorld32#", }, {
                headers: {
                    "Cookie": `sessionToken=${await getTestSessionToken()};`,
                }
            }).catch((e) => {
                if (!(e instanceof signupRequest.Error)) throw new Error;
                const error = e.getActualType();
                expect(error.status).toBe(403);
                expect(error.data.err).toBe("LoggedIn")
            });
        });
    });
});