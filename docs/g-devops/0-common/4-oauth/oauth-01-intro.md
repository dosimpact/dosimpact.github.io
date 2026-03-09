---
sidebar_position: 1
---

# Udemy Transcript Summaries

## 2026-03-09

### Course: The Nuts and Bolts of OAuth 2.0

#### Lecture 1 — Intro to this Course
- Instructor Aaron Parecki introduces the course goal: make OAuth understandable beyond reading specs.
- OAuth docs are complex because they are precise standards and spread across many related specs/extensions.
- Course focus is not just “quick setup,” but understanding core security concepts behind OAuth.
- Part 1: building OAuth clients/apps (server-side, mobile, SPA) + OpenID Connect basics.
- Part 2: protecting APIs (token lifetime tradeoffs, token validation, revoked apps/tokens, scope design).

#### Lecture 2 — A Brief History of OAuth
- Before OAuth, APIs often used Basic Auth, requiring third-party apps to collect and store user passwords.
- Mid-2000s providers created separate, incompatible delegation systems (e.g., FlickrAuth, AuthSub, BBAuth).
- OAuth 1 emerged (2007) to standardize delegated API access without password sharing.
- OAuth 1 became limiting for developer usability and mobile-era security/scalability needs.
- OAuth 2 evolved to improve usability and architecture, including bearer tokens and separation of authorization server vs API server.
- OAuth 2.0 finalized in 2012, then expanded via newer specs and best practices (native apps, device flow, security BCP).

#### Lecture 3 — How OAuth Improves Application Security
- Traditional app login patterns often require apps to handle user passwords directly, which creates trust and security risks.
- Password-sharing is especially dangerous for third-party apps: users give full-account power when the app only needs limited actions.
- Revoking a single app is hard in password-based models; users often must change their password and break all other sessions/apps.
- From API/operator perspective, password-based login makes app identity weak, abuse detection harder, and MFA rollout difficult to scale across many clients.
- OAuth improves security by redirecting users to the authorization server for login, so apps never see passwords.
- This model enables safer delegation, better control/revocation, and more scalable security evolution for both first-party and third-party ecosystems.

#### Lecture 4 — OAuth vs OpenID Connect
- OAuth and OpenID Connect are commonly used together, but they solve different problems and should not be treated as the same protocol.
- OAuth is for delegated authorization (what an app can access on behalf of a user), not for proving user identity by itself.
- OpenID Connect is an identity layer built on top of OAuth that standardizes authentication and user identity information.
- In practice: use OAuth access tokens to call APIs, and use OpenID Connect artifacts (e.g., ID token/userinfo) when you need login/identity.
- Mixing the two concepts leads to common architecture mistakes, so the key is to separate “API authorization” from “user authentication.”
