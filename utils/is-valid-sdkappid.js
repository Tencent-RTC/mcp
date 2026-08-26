function isValidSDKAppID(value) {
    return !!value && /^\d+$/.test(value);
}
export { isValidSDKAppID };
