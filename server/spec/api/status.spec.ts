import { describe, expect, test } from "@jest/globals"
import testApiFetcher from "./api";

describe("status api tests", () => {
    const statusRequest = testApiFetcher.path("/status").method("get").create();

    test("getting status while not authed works", () => {
        statusRequest({}, {}).then((value) => {
            expect(value.status).toBe(200);
            expect(value.data.okay).toBe(true);
            expect(value.data.authenticated).toBe(false);
        }).catch((e) => {
            throw new Error(e.toString());
        });
    });
});