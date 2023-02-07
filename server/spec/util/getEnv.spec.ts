import {test, expect, describe} from "@jest/globals";

test('The stuff to work', () => {
    expect(3).toBeGreaterThan(0);
});

test('Yes', () => {
    expect(32).not.toBe(31);
});