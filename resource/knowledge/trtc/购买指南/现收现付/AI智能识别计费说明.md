---
sync_node_id: '164923761771335680'
nav_path:
  - "购买指南"
  - "现收现付"
  - "AI 智能识别计费说明"
product: "trtc"
---
These billing instructions apply to three services: Speech-to-Text , AI Real-Time Translation and Text-to-Speech.
- ​​Speech-to-Text:​​ Transcribes spoken audio into text using Speech-to-Text. This is commonly used to generate real-time captions.

- ​​AI Real-Time Translation:​​ Translates transcribed text into target languages to deliver real-time multilingual subtitles.

- Text-to-Speech: Converts text into speech in real-time using TTS (Text to Speech) technology.

### Billing Instructions

Speech-to-Text, AI Real-Time Translation, and Text-to-Speech are available without a monthly subscription. Each account receives 10,000 free minutes per month, which can be used across these services. Once your free quota is exhausted, charges automatically switch to pay-as-you-go if that billing option is enabled.

### Speech-to-Text

This service recognizes and transcribes audio streams from specified users or all users in a TRTC room.
- Third-party STT is not supported in AI Real-Time Translation scenarios to ensure consistency and output quality.

- Billing mode: Postpaid. 

- Billing cycle: Daily. Specific billing details and the statement issuance time are subject to [Billing Statement](https://console.tencentcloud.com/expense/bill/overview).

### AI Real-Time Translation

This service translates transcribed content into one or more specified target languages in real-time.
- Billing mode: Postpaid.

- Billing cycle: Daily. Specific billing details and the statement issuance time are subject to [Billing Statement](https://console.tencentcloud.com/expense/bill/overview).

### Text-to-Speech

 This service converts text to natural, fluent speech in real-time, enabling live voice output.
- Billing mode: Postpaid.

- Billing cycle: Daily. Specific billing details and the statement issuance time are subject to [Billing Statement](https://console.tencentcloud.com/expense/bill/overview).

## Pricing

The following table provides the list prices and language support details for the Speech-to-Text, AI Real-Time Translation and Real-Time Text-to-Speech services:
| ServiceType | Model Type | Unit Price | Support Languages |
| --- | --- | --- | --- |
| Audio File Recognition | 0.2 (USD/hour) |  |  |
| Text-to-Speech | Advanced | 0.1 (USD/1,000 characters) | Supports real-time conversion of text in 30+ languages, including Chinese, English, Japanese, Korean, Spanish, French, German, and Arabic, into natural, fluent speech with a variety of voices. |
| Basic | 0.06 (USD/1,000 characters) | Supports Chinese, English, Japanese, Korean, and Cantonese (dialect). |  |
| Voice Cloning | Basic | $3.00 / request | Pay-per-use, post-paid. |
| Standard |  |  |  |

## Metering & Usage Notes

> **Note:**
> - Speech-to-Text and AI Real-Time Translation Service duration is metered in seconds and accumulated on a per SDKAppID basis. For billing, the total daily seconds are converted to minutes, and any remaining seconds are rounded up to the next full minute.
> - When Speech-to-Text or AI Real-Time Translation is enabled in a TRTC room, a robot will join as a virtual participant to subscribe to the relevant audio/video streams. This subscription incurs [audio and video usage duration](https://trtc.io/document/42734).
> - Billing for the Text-to-Speech is based on the daily cumulative character count, measured at the character level. The pricing unit is 1,000 characters, calculated to three decimal places.
> - For Speech Synthesis (TTS) billing, the character count is calculated as follows: each Chinese character (including Japanese Kanji, Korean Hanja, and other CJK ideographs) counts as 2 characters. All other characters—including English letters, characters from other languages, punctuation marks, symbols, spaces, and line breaks—count as 1 character.

### Speech-to-Text
- Only the duration of audio streams actively undergoing recognition is billed.

- In multi-stream scenarios, the cumulative duration of all input streams is used for billing.

- The system activates the STT for speech-to-text service only after the user turns on the microphone. The duration matches the length of time the microphone remains active.

### AI Real-Time Translation
- Billed based on the duration of the input audio streams actively translated.  

- If a single input stream is translated into multiple target languages, billing is calculated as Input Duration × Number of Output Languages

### Text-to-Speech
- Usage is measured based on the number of input text characters for real-time speech synthesis.

- For each individual broadcaster stream, charges are applied according to the number of characters that need to be synthesized.

## Billing Examples

All billing figures in the following examples are calculated and rounded to three decimal places.

**Consider the following use case:**
- **Users A and B：**Engage in a conversation in Chinese

- **Viewer C:**  Requires English captions and English speech output

- **Viewer D:**  Requires Japanese captions and Japanese speech output

   The system processes the conversation through the following steps:

1. Speech-to-Text (Real-time Speech Recognition) (converting Chinese speech to text)

2. Real-Time Translation (translating text to English and Japanese)

3. Text-to-Speech (converting translated text to speech)

   **Usage Details:**

- Conversation duration: 10 minutes

- Total text characters: 26 thousand characters (The text character counts in this example are provided for illustrative purposes only)

- User A's English text: 8 thousand characters

- User A's Japanese text: 5 thousand characters

- User B's English text: 8 thousand characters

- User B's Japanese text: 5 thousand characters

   **The corresponding charges are calculated as follows:**

   |Billing Type|User A|User B|Subtotal|
   |---------|---------|---------|---------|
   |Speech-to-Text(Real-time Speech Recognition)|10 minutes|10 minutes|20 minutes|
   |AI Real-Time Translation|10 minutes × 2|10 minutes × 2|40 minutes|
   |Text-to-Speech|8 thousand English characters + 5 thousand Japanese characters|8 thousand English characters + 5 thousand Japanese characters|26 thousand characters|

- Speech-to-Text (Real-time Speech Recognition): A total of 20 minutes of usage, at a unit price of 0.5 USD/hour (0.0083 USD/minute), totaling 0.17 USD.

- Real-time Translation: A total of 40 minutes of usage, at a unit price of 0.016 USD/minute, totaling 0.64 USD.

- Text-to-Speech: A total of 26,000 characters of usage, at a unit price of 0.06 USD/thousand characters, totaling 1.56 USD.

   Therefore, in this scenario, you need to pay 2.37 USD.

## Integration Guide

For integration steps, please refer to the [Speech-to-Text and Translation Integration Instructions](https://trtc.io/document/66148).

To configure Text-to-Speech (TTS) in Conversational AI, refer to [Conversational AI TTS Configuration](https://trtc.io/document/68340).
