const TOOL_DESCRIPTION = `
Purpose:
Generate a test userSig using SDKAppID and secretKey from MCP environment variables, for IM/TRTC local debugging.

When to call (MUST):
- User explicitly asks to generate userSig for a specific userID.
- User needs a test credential for IM/TRTC local integration debugging.

When NOT to call:
- User asks about userSig principles, production signing architecture, or security design.
- User does not provide a concrete userID yet.

Common trigger lexicon:
- generate userSig, test credential, local debug credential, userSig for userID, IM login credential, TRTC login credential

Inputs:
- userID

Outputs:
- content: [{ type: 'text', text: userSig result or error details }]

Boundaries:
- This tool is for test credential generation only.
- Production should use server-side signing.
- If required environment variables are missing, return configuration guidance.
`;
export const GET_USERSIG_DEFINITION = {
    name: 'get_usersig',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: {
        userID: 'Target userID for Tencent Cloud app login.',
    },
};
