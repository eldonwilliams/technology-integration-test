import { join, } from "path";
import { getEnvString } from "./util/getEnv";
import { copyFile, rm as deleteFile } from "fs";

export function generateTests() {
    let shouldGen = getEnvString("GEN_TEST_REPORTS", "true")?.toLowerCase() === "true";
    if (!shouldGen) return;
    let reportSrc = join(__dirname, "../jest.report.txt")
    let reportDest = join(__dirname, "../jest-reports/jest.report.txt")
    console.log("GEN_TEST_REPORTS was true")
    copyFile(reportSrc, reportDest, (err) => {
        if (err) return console.log(`${err} <- Something went wrong whilst saving`);
        deleteFile(reportSrc, ()=>{});
    });
}