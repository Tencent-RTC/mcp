## Function Introduction

This article mainly introduces how to use the SmallStreamAutoSwitcher plugin to enable automatic switching between large and small streams. This plugin is typically used in bandwidth-limited scenarios, where if bandwidth cannot meet the requirements for large streams causing stuttering, it automatically switches to small streams, which reduces resolution but ensures smoothness.

## Prerequisites

- TRTC Web SDK version >= 5.11.0

## Implementation Process

### Import and Register Plugin

```javascript
import SmallStreamAutoSwitcher from 'trtc-sdk-v5/plugins/small-stream-auto-switcher';
const trtc = TRTC.create({ plugins: [SmallStreamAutoSwitcher] });
```

## Plugin Start

The default switching strategy is:
- When network delay exceeds 200ms or packet loss rate exceeds 20% for 10 consecutive seconds, and frame rate fluctuates significantly, switch to small stream
- When network delay is below 100ms and packet loss rate is below 10% for 20 consecutive seconds, and frame rate returns to normal, switch back to large stream
- Only allow automatic switching to small stream 2 times, after exceeding 2 times, no longer automatically switch to small stream

```javascript
trtc.startPlugin('SmallStreamAutoSwitcher');
```

## Plugin Stop

```javascript
trtc.stopPlugin('SmallStreamAutoSwitcher');
```

## Advanced Usage

You can customize parameters to adjust the plugin's strategy, for example:

Only allow automatic switching to small stream 1 time, and do not switch back to large stream after switching.

```javascript
trtc.startPlugin('SmallStreamAutoSwitcher', {
  maxAutoSwitchToSmallCount: 1,
});
```

Below are explanations for all parameters. If not passed, default strategy will be used.

```javascript
trtc.startPlugin('SmallStreamAutoSwitcher', {
  rttPoorLimit: 200, // Delay threshold, unit: ms, when delay exceeds this value, triggers condition to switch to small stream, default 200
  lossPoorLimit: 20, // Packet loss rate threshold, unit: %, when packet loss rate exceeds this value, triggers condition to switch to small stream, default 20
  poorDuration: 10 * 1000, // Duration threshold for poor network conditions, unit: ms, when delay or packet loss rate continuously exceeds threshold for this duration, start checking whether to switch to small stream, default 10000 (10 seconds)
  rttGoodLimit: 100, // Good delay threshold, unit: ms, when delay is below this value, triggers condition to switch to large stream, default 100
  lossGoodLimit: 10, // Good packet loss rate threshold, unit: %, when packet loss rate is below this value, triggers condition to switch to large stream, default 10
  goodDuration: 20 * 1000, // Duration threshold for good network conditions, unit: ms, when delay and packet loss rate are continuously below threshold for this duration, start checking whether to switch to large stream, default 20000 (20 seconds)
  sleepTime: 30 * 1000, // Sleep time after switching, unit: ms, no automatic switching will occur during this time, default 30000 (30 seconds)
  maxAutoSwitchToSmallCount: 2, // Maximum number of automatic switches to small stream per user, after exceeding this count, no longer automatically switch to small stream, default 2
});
```

## Parameter Description

| Parameter Name | Type | Default Value | Description |
|--------|------|--------|------|
| rttPoorLimit | number | 200 | Delay threshold (ms), when network delay exceeds this value, start counting conditions for switching to small stream |
| lossPoorLimit | number | 20 | Packet loss rate threshold (%), when packet loss rate exceeds this value, start counting conditions for switching to small stream |
| poorDuration | number | 10000 | Duration threshold for poor network conditions (ms), when delay or packet loss rate continuously exceeds threshold for this duration, start checking whether to switch to small stream, default 10000 (10 seconds) |
| rttGoodLimit | number | 100 | Good delay threshold (ms), when network delay is below this value, start counting conditions for switching to large stream |
| lossGoodLimit | number | 10 | Good packet loss rate threshold (%), when packet loss rate is below this value, start counting conditions for switching to large stream |
| goodDuration | number | 20000 | Duration threshold for good network conditions (ms), when delay and packet loss rate are continuously below threshold for this duration, start checking whether to switch to large stream, default 20000 (20 seconds) |
| sleepTime | number | 30000 | Sleep time after switching (ms), no automatic switching will be triggered again during this period to avoid frequent switching |
| maxAutoSwitchToSmallCount | number | 2 | Maximum number of automatic switches to small stream allowed per user, after exceeding this count, no longer automatically switch to small stream |

## Switching Logic Description

### Conditions for Switching to Small Stream
1. Network conditions: Delay continuously exceeds `rttPoorLimit` for `poorCount` times, or packet loss rate continuously exceeds `lossPoorLimit` for `poorCount` times
2. Frame rate conditions: Large stream frame rate fluctuates significantly (difference between maximum and minimum frame rate exceeds 1/3 of maximum frame rate)
3. Limiting conditions: User is currently subscribed to large stream, automatic switch count has not reached `maxAutoSwitchToSmallCount` limit, and not in sleep period

### Conditions for Switching to Large Stream
1. Network conditions: Delay is continuously below `rttGoodLimit` for `goodCount` times, and packet loss rate is continuously below `lossGoodLimit` for `goodCount` times
2. Frame rate conditions: Small stream frame rate is stable (difference between maximum and minimum frame rate does not exceed 1/3 of maximum frame rate)
3. Limiting conditions: User is currently subscribed to small stream, and the user has only switched to small stream once, and not in sleep period

> **Note:**
> - Detection frequency is once every 2 seconds
> - The statistical window size for network quality and frame rate data automatically adapts to the maximum value of poorDuration and goodDuration
> - After each switch, it enters a sleep period of `sleepTime` duration, during which automatic switching will not be triggered again
> - Only users who have automatically switched to small stream once are allowed to switch back to large stream, users who have switched twice will remain in small stream state
