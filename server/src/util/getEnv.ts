/**
 * Looks for a environment variable and returns as a string
 * If not found it will return def or undefined.
 * 
 * @see getEnvNumber For the number version
 * 
 * @param key The key to search for
 * @param def The default value
 * @returns 
 */
function getEnvString(key: string, def?: string): string | undefined {
    let v = process.env[key] ?? def ?? undefined;
    if (v == '') v = def ?? undefined;
    return v;
}

/**
 * Looks for a environment variable and returns as a number
 * If not found or is NaN it will return def or undefined, respectively.
 * 
 * **NaN values will ALWAYS return undefined**
 * 
 * @see getEnvString For the string version
 * 
 * @param key The key to search for
 * @param def The default value
 * @param float Should use parseFloat or parseInt : default false
 * @returns 
 */
function getEnvNumber(key: string, def?: number, float: boolean = false ): number | undefined {
    let v = getEnvString(key, def?.toString());
    if (v == undefined) return undefined;
    let n = (float ? parseFloat : parseInt)(v);
    if (Number.isNaN(n)) return undefined;
    return n;
}