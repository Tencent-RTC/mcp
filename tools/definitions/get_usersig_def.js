const TOOL_DESCRIPTION = `
Purpose:
Generate a test userSig from the MCP environment variables SDKAppID and secretKey for local IM or TRTC testing.

Typical use cases:
generate a userSig for a specific userID, create a test credential, local debugging credential, userSig for this userID, SDKAppID, secretKey, IM login credential, TRTC login credential

Input:
- userID

Returns:
- content: [{ type: 'text', text: userSig result or an error message }]

Boundaries:
- Use this tool only when the userID is already known and you need a test credential.
- It does not explain userSig principles, issuing flow, or production authentication design.
- It is for development and testing only.
- Production systems should issue userSig from a server.
`;
export const GET_USERSIG_DEFINITION = {
    name: 'get_usersig',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: {
        userID: 'The userID used to log in to the Tencent Cloud application.',
    },
};
