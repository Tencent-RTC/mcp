---
sync_node_id: '167395758643748864'
nav_path:
  - "购买指南"
  - "现收现付"
  - "AI 实时对话计费说明"
product: "trtc"
---
## Billing Overview

Conversational AI is a capability within the Tencent RTC Engine that enables natural and smooth real-time voice conversations between humans and large language models.

You can experience Conversational AI by activating the **RTC Engine Free Trial**, which includes [**10,000 free minutes**](https://trtc.io/document/42735) **each month. These free minutes can be used to offset Audio Call duration, Conversational AI Service duration and the Speech AI service.**

For higher usage, RTC-Engine Monthly Packages (Lite/Standard/Pro) are available for purchase. 

## Billing Components

The fees for using real-time Conversational AI Services consist of three components:

### Audio Call Fees

Audio call fees for conversations between humans and AI: The billing standard is consistent with the audio and video duration fees. For detailed billing.

### Conversational AI Service Fees

Using Conversational AI requires payment of corresponding service fees. The billing rules are as follows:
| Billable Item | Billing Method | Unit Price (USD/Minute) |
| --- | --- | --- |
| Conversational AI Services - Voice | Daily pay-as-you-go | 0.01 USD/Minute.<br>The daily Conversational AI service fee will be deducted when the bill is issued the next day.<br>For detailed billing and invoice timing, please refer to the actual <a href="https://console.tencentcloud.com/expense/bill/overview">Billing Statement</a>. |

Usage Statistics: The overall duration of the server-side AI conversation task from start to finish. Duration is measured in seconds, aggregated by SDKAppID, and converted to minutes for daily billing. Any duration less than one minute is rounded up to one minute.

### Speech-to-Text Service Fees

The Conversational AI process involves converting speech to text for transmission to the large language model. 
- If you need to use TRTC's speech-to-text capability.

- If you choose a third-party speech-to-text service, no fees are involved here.

## Billing Example

User A purchases an RTC-Engine Monthly Package and, within its validity period, initiates a 1-on-1 real-time voice conversation with AI lasting 20 minutes. Both the human and AI exit the room, and the speech-to-text function using TRTC capability generates 10 minutes of usage. The customer needs to pay the following fees:
- **Audio Call Fee:** If the customer's free duration package is not exhausted, it will be deducted first. If the free duration package is exhausted, the post-paid fee = 0.99 / 1000 × 20 * 2 = $0.0396

- **Conversational AI Service Fee:** 0.01 × 20 = $0.2 

- **Speech-to-Text Fee:** 0.02 × 10 = $0.2

   > **Note：**
   > 
   > - Large Language Model (LLM) invocation fees and Text-to-Speech (TTS) fees are procured separately from third parties and are not included in the fee calculation in this document.
   > - During voice conversations between users and AI, the STT service for speech recognition is only active when the user’s microphone is enabled. Conversation duration is calculated based on the time the microphone is active.

## Integration Instructions

For specific steps to integrate the Conversational AI service, please refer to the [Conversational AI Service Integration Guide](https://trtc.io/document/68337).
