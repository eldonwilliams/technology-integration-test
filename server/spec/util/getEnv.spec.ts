import {test, expect, describe, beforeEach, jest, afterEach} from "@jest/globals";
import {getEnvNumber, getEnvString} from "../../src/util/getEnv";

describe("getEnv tests", () => {
    const mockEnvironment = {
        ...process.env,
        "astring": "string",
        "anumber": "10",
        "afloat": "3.1415",
    }
    const env = process.env;
    
    /**
     * I don't know much about Jest or mocking, but I feel like this could be done once and cleaned
     * Once testing on this block was finished since the environment is only read from and not changed?
     */

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...mockEnvironment, };
    });

    afterEach(() => {
        process.env = env;
    });

    test("can it get string variables", () => {
        expect(getEnvString("astring", "(SHOULDN'T RETURN)")).toBe("string");
    });

    test("can getString fail gracefully", () => {
        expect(getEnvString("notakey")).toBeUndefined();
        expect(getEnvString("notakey", "hi")).toBe("hi");
    });

    test("can it get number variables", () => {
        expect(getEnvNumber("anumber", -1)).toBe(10);
    });

    test("can it get floats", () => {
        expect(getEnvNumber("afloat")).toBeCloseTo(3.1415, 0.1);
    });

    test("can getNumber fail gracefully for NaN", () => {
        expect(getEnvNumber("astring")).toBeUndefined();
        expect(getEnvNumber("astring", 10)).toBe(10);
    });

    test("can getNumber fail gracefully for undefined", () => {
        expect(getEnvNumber("notakey")).toBeUndefined();
        expect(getEnvNumber("notakey", 10)).toBe(10);
    });
})