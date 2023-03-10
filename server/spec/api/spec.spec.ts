// This is meta, huh?

import { beforeAll, describe, expect, test } from "@jest/globals";
import testApiFetcher from "./mock/api";

describe("oa-spec can be fetched and is valid", () => {
    const getOaSpec = testApiFetcher.path("/oa-spec.json").method("get").create();
    let oaSpec: string = "";
    
    beforeAll(async () => {
        await getOaSpec({}, {})
            .then((response) => {
                if (response.status !== 200) throw new Error("Not 200 Status");
                oaSpec = JSON.stringify(response.data);
            })
            .catch(e => {
                throw new Error("Shouldn't Catch")
            });
    });

    test("is oa-spec.json a valid json doc", () => {
        expect(() => JSON.parse(oaSpec)).not.toThrowError();
    });

    test("did oa-spec.json get successfully?", () => {
        expect(oaSpec).not.toBe("");
    });
});