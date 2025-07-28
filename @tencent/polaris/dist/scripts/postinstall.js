"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const kContent = isUtf8Encoding()
    ? `${colorFactory(96)}感谢您使用北极星 (${colorFactory(94)} https://git.woa.com/polaris/polaris-nodejs ${colorFactory(96)}) SDK ！${colorFactory()}\n\n`
        + `${colorFactory(96)}如有任何疑问或建议，可通过下述渠道向我们反馈：${colorFactory()}\n`
        + `${colorFactory(96)}>${colorFactory(94)} https://git.woa.com/polaris/polaris-nodejs/issues ${colorFactory()}\n`
        + `${colorFactory(96)}>${colorFactory(94)} wxwork://message?username=superzheng ${colorFactory()}\n\n`
        + `${colorFactory(96)}联系 (${colorFactory(94)} https://git.woa.com/superzheng ${colorFactory(96)}) 为自己寻找一个更好的工作环境 -:)${colorFactory()}\n`
    : `${colorFactory(96)}Thank you for using polaris (${colorFactory(94)} https://git.woa.com/polaris/polaris-nodejs ${colorFactory(96)}) SDK!${colorFactory()}\n\n`
        + `${colorFactory(96)}If you have any issue or advice, you can give us feedback:${colorFactory()}\n`
        + `${colorFactory(96)}>${colorFactory(94)} https://git.woa.com/polaris/polaris-nodejs/issues ${colorFactory()}\n`
        + `${colorFactory(96)}>${colorFactory(94)} wxwork://message?username=superzheng ${colorFactory()}\n\n`
        + `${colorFactory(96)}Contact (${colorFactory(94)} https://git.woa.com/superzheng ${colorFactory(96)}) for a better job -:)${colorFactory()}\n`;
const kMinutes = 601000;
const kDataFile = "polaris-install.data";
function not(it) {
    return !it || it === "0" || it === "false";
}
function colorFactory(color) {
    if (not(process.env.npm_config_color) || !process.stdout.hasColors()) {
        return "";
    }
    return `\u001B[${color || 0}m`;
}
function isUtf8Encoding() {
    var _a;
    const { env: { LANG, LC_CTYPE } } = process;
    const language = ((_a = LANG !== null && LANG !== void 0 ? LANG : LC_CTYPE) !== null && _a !== void 0 ? _a : "").toLowerCase();
    if (language.indexOf("utf-8") !== -1 || language.indexOf("utf8") !== -1) {
        return true;
    }
    if (process.platform === "win32") {
        return true;
    }
    return false;
}
function isShowInfo() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { env: { ADBLOCK, CI, DISABLE_OPENCOLLECTIVE, OPEN_SOURCE_CONTRIBUTOR, npm_config_loglevel } } = process;
    const isSilent = typeof npm_config_loglevel === "string" && ["silent", "error", "warn"].indexOf(npm_config_loglevel) !== -1;
    if (not(ADBLOCK) && not(CI) && not(DISABLE_OPENCOLLECTIVE) && not(OPEN_SOURCE_CONTRIBUTOR) && !isSilent) {
        const file = (0, path_1.join)((0, os_1.tmpdir)(), kDataFile);
        let contents = [];
        try {
            const delta = Date.now() - (0, fs_1.statSync)(file).mtime.getTime();
            if (delta >= 0 && delta < 3 * kMinutes) {
                contents = JSON.parse((0, fs_1.readFileSync)(file, "utf8"));
                if (contents.indexOf(kContent) !== -1) {
                    return false;
                }
            }
        }
        catch (_a) {
            contents = [];
        }
        try {
            contents.push(kContent);
            (0, fs_1.writeFileSync)(file, JSON.stringify(contents), "utf8");
        }
        catch ( /* (empty function) */_b) { /* (empty function) */ }
        return true;
    }
    return false;
}
if (isShowInfo()) {
    console.log(kContent);
}
//# sourceMappingURL=postinstall.js.map