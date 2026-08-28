---
title: "Web Chat SDK: login Returns 2025 (Repeat Login) Diagnosis and Fix（重复登录 / repeatLogin）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [login, 2025, repeat login, repeatLogin, web, miniprogram, concurrent calls, debounce]
version_range: ">=3.0.0"
---

# Web Chat SDK: login Returns 2025 (Repeat Login) Diagnosis and Fix

## 1. Key Takeaways

- The direct cause of `2025` is that the business side calls `login` consecutively in a short time while the SDK has not yet received the backend response for the first login request.
- Within approximately `15s` after the first `login` is initiated, if the previous login has not received a response, the SDK directly blocks subsequent `login` calls and returns `2025`.
- If the SDK has already received the login response and the same `userID` calls `login` again, it does not trigger the `2025` blocking branch; instead it returns `imResponse.data.repeatLogin = true` in `login.then`.
- The solution is to fix the `login` call logic on the business side: ensure only one in-flight `login` request exists for the same session.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| Error code `2025` | Repeat login blocking signal | When a previous `login` has not received a response, subsequent calls within a short period are directly blocked by the SDK |
| `imResponse.data.repeatLogin` | Repeat login flag | When the SDK has received a response and the same `userID` logs in again, this returns `true` in `then` |
| `login` in-flight state | Key state for concurrency control | The business side must ensure only one `login` is executing at a time |

## 3. Mechanism & Sequence

First `login` call -> SDK sends login request -> Backend response not yet received -> Business side calls `login` again within ~`15s` -> SDK directly blocks and returns `2025`.
First `login` call -> SDK has received backend response -> Business side calls `login` again with the same `userID` -> `imResponse.data.repeatLogin = true` is returned in `login.then`.

## 4. Standard Usage

1. Implement single-flight login on the business side: for the same `userID`, prohibit duplicate calls before the previous `login` completes.
2. Add a state machine (`idle`/`logging_in`/`logged_in`) or Promise reuse for `login`, reusing the in-flight login result.
3. Upon receiving `2025`, do not retry immediately; wait for the current in-flight login to complete, then decide the next action based on the result.
4. Check `imResponse.data.repeatLogin` in `login.then` and handle it as an "already logged in" branch without re-initializing the session.

## 5. Expected Results

- When login is triggered consecutively for the same `userID`, the business side only sends one real `login` request.
- Under stress testing with rapid login button clicks, `2025` no longer occurs.
- When `login` is called again after a response has been received, `repeatLogin` is consistently observed in `then` and the expected branch is followed.
- Login state initialization logic executes only once, with no duplicate conversation pulls or duplicate listeners.

## 6. Common Pitfalls

- Pitfall 1: Immediately calling `login` again upon receiving `2025`, creating a blocking loop.
- Pitfall 2: Treating `2025` and `repeatLogin=true` as the same-phase error.
- Pitfall 3: Not implementing idempotency protection in `onShow`, route changes, or reconnection callbacks, leading to concurrent login calls.

## 7. Problem Definition (retrieval hint)

When calling `login` in the Web Chat SDK, triggering the login request repeatedly in a short time returns `2025`. The business side needs to understand: under what conditions `2025` is triggered, and how it differs from `imResponse.data.repeatLogin = true`.

## 8. Alternative Queries (retrieval recall)

- Why does the Web IM SDK `login` return 2025?
- What does `login` returning 2025 mean?
- Under what circumstances does the repeat login error code 2025 occur?
- What is the difference between `repeatLogin=true` and `2025`?
