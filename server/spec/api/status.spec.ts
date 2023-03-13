import { beforeAll, describe, expect, test } from "@jest/globals";
import testApiFetcher, { getTestSessionToken } from "./mock/api";

describe("status api tests", () => {
    const statusRequest = testApiFetcher.path("/status").method("get").create();
    let sessionToken: string = "";

    beforeAll(async () => {
        let got = await getTestSessionToken();
        if (got === undefined) throw new Error;
        sessionToken = got;
    });

    test("getting status while not authed works", () => {
        statusRequest({}, {
            headers: {
                "Cookie": ``,
            }
        }).then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.okay).toBe(true);
            expect(response.data.authenticated).toBe(false);
        }).catch((e) => {
            throw new Error;
        });
    });

    test("getting status while authenticated works", () => {
        statusRequest({}, {
            headers: {
                "Cookie": `sessionToken=${sessionToken};`
            }
        }).then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.okay).toBe(true);
            expect(response.data.authenticated).toBe(true);
        }).catch((e) => {
            throw new Error;
        });
    });
});