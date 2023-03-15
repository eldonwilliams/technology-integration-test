import { readFileSync } from "fs";
import { jsonc } from "jsonc";
import path from "path";


let config: Record<string, string> | undefined;

try {
    let configContentsRaw = readFileSync(path.join(__dirname, "../../config.jsonc"));
    if (configContentsRaw.length === 0) throw new Error;
    config = jsonc.parse(configContentsRaw.toString('utf-8'));
} catch (e) {
    console.log(`Getting config file returned an error`);
    config = undefined;
}

function getValueFromConfig(key: string, isnull?: string): string | undefined {
    if (config === undefined) return isnull ?? "";
    return config[key];
}

export default getValueFromConfig;