export function extractSymbols(content) {
    const symbols = new Set();
    for (const match of content.matchAll(/`([A-Za-z_][\w.]*)`/g)) {
        symbols.add(match[1]);
    }
    for (const match of content.matchAll(/\b(use[A-Z]\w*)\b/g)) {
        symbols.add(match[1]);
    }
    for (const match of content.matchAll(/\b([A-Z][A-Za-z0-9_]{2,})\b/g)) {
        if (/^(TRTC|TX|ITX|ITRTC|V2TX|Login|Device|Room|Live|Call|CoGuest|CoHost|Battle|Gift|Barrage|Like|Seat|Audience|Beauty|Audio)/.test(match[1])) {
            symbols.add(match[1]);
        }
    }
    return [...symbols].slice(0, 50);
}
export function extractErrorCodes(content) {
    const codes = new Set();
    for (const match of content.matchAll(/\b(\d{5,7})\b/g)) {
        codes.add(match[1]);
    }
    for (const match of content.matchAll(/\b(ERR_[A-Z0-9_]+)\b/g)) {
        codes.add(match[1]);
    }
    return [...codes];
}
