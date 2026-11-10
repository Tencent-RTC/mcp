function normalizeError(error) {
    if (error instanceof Error) {
        return {
            error_code: error.name || 'Error',
            error_msg: error.message?.slice(0, 256) || 'Unknown error',
        };
    }
    return {
        error_code: 'UnknownError',
        error_msg: String(error).slice(0, 256),
    };
}
export { normalizeError, };
