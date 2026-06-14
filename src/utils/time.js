/* ISO-8601 UTC timestamp, e.g. "2026-06-14 09:05:21 UTC". */
export function GetCurrentTime() {
    const iso = new Date().toISOString();          // 2026-06-14T09:05:21.123Z
    return iso.slice(0, 19).replace('T', ' ') + ' UTC';
}

export default { GetCurrentTime };
