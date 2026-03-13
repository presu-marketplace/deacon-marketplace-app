# Codebase Review: Defects & Improvements

Full audit of the **deacon-marketplace-app** codebase performed on 2026-03-13.
This document catalogs every defect, security vulnerability, and improvement found,
organized by severity.

---

## CRITICAL - Security Issues

### 1. Open redirect in auth callback

**File:** `src/app/auth/callback/CallbackBody.tsx:42-44`

```tsx
if (/^https?:\/\//.test(next)) {
  window.location.href = next
}
```

The `next` parameter comes directly from the URL query string (`?next=`).
An attacker can craft a URL like `/auth/callback?next=https://evil.com` and,
after OAuth login, the user is redirected to a malicious site.

**Fix:** Validate that `next` belongs to the app's own origin before redirecting.

---

### 2. No server-side auth on API routes

**Files:**
- `src/app/api/provider-profiles/route.ts`
- `src/app/api/providers/route.ts`

Both routes use `getSupabaseAdmin()` (the service role key) to query data but
neither verifies the caller is authenticated or authorized. Anyone can call
`/api/provider-profiles?ids=<any-uuid>` and retrieve full names, emails, phone
numbers, addresses, and tax IDs.

**Fix:** Validate the user's session (e.g. via `supabase.auth.getUser()` with
the caller's token) and check permissions before returning data.

---

### 3. No server-side validation on create-user-folder

**File:** `src/app/api/create-user-folder/route.ts:10`

The `userId` comes directly from the request body without verifying it matches
the authenticated user's session. A malicious actor could pass any `userId` to
create or modify profiles for arbitrary users, potentially escalating roles
(e.g. making themselves a `provider`).

**Fix:** Extract the user ID from the authenticated session, not from the
request body.

---

### 4. Client-only PDF upload validation

**File:** `src/app/services/[service]/ServiceFormClient.tsx`

File uploads check `f.type === 'application/pdf'` on the client only. MIME
types can be spoofed by renaming files.

**Fix:** Add server-side content-type validation (e.g. magic-byte check) in the
upload handler.

---

## HIGH - Bugs & Defects

### 5. Infinite loop in useUser hook

**File:** `src/features/auth/useUser.ts:23-80`

The `syncAvatar` effect depends on `user` in its dependency array but also
calls `setUser(fresh.user)` inside the effect body. Every time the avatar is
synced it updates `user`, which re-triggers the effect, creating a loop of
`updateUser` -> `refreshSession` -> `getUser` -> `setUser` -> repeat.

**Fix:** Separate the avatar-sync trigger from the `user` state. Use a ref or
a dedicated flag to track whether sync has already run for the current user ID.

---

### 6. Deprecated `images.domains` in Next.js config

**File:** `next.config.ts:5`

Next.js 15 has deprecated `images.domains` in favor of `images.remotePatterns`.

**Fix:**
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    { protocol: 'https', hostname: 'payeutapaokdwxqxesyz.supabase.co' },
  ],
},
```

---

### 7. Invalid Font Awesome integrity hash

**File:** `src/app/layout.tsx:33`

The `integrity` attribute value appears incorrect for the referenced version of
Font Awesome. If the browser enforces SRI and the hash doesn't match, the
entire stylesheet fails to load and all FA icons break.

**Fix:** Remove the `integrity` attribute or regenerate the correct hash from
the cdnjs resource page.

---

### 8. Duplicated `<style jsx>` spinner across auth forms

**Files:**
- `src/app/auth/login/components/LoginForm.tsx:176`
- `src/app/auth/register/components/RegisterForm.tsx:196`
- `src/app/auth/forgot-password/components/ForgotPasswordForm.tsx:105`

The `.loader` CSS is copy-pasted in three files. While `styled-jsx` is bundled
with Next.js so it works, the duplication is fragile and any fix must be
applied in three places.

**Fix:** Extract the spinner into a shared `<Spinner />` component or a global
CSS class.

---

### 9. `fetchFromApi` not memoized inside component

**File:** `src/app/activity/ActivityPageClient.tsx:375`

The function is defined inside the component body without `useCallback`. It is
used inside `useEffect` blocks without being in their dependency arrays, which
means effects that depend on it may hold stale closures.

**Fix:** Wrap `fetchFromApi` with `useCallback` or extract it outside the
component.

---

## MEDIUM - Logic & Consistency Issues

### 10. Flash-of-wrong-locale (FOWL) on hydration

**Affected files:**
- `src/app/HomeClient.tsx`
- `src/app/cards/market-comparison/MarketComparisonClient.tsx`
- `src/app/cards/join-us/JoinUsClient.tsx`
- `src/app/cards/sustainability/SustainabilityClient.tsx`
- `src/app/services/ServicesClient.tsx`
- `src/app/services/[service]/ServiceFormClient.tsx`
- `src/app/under-construction/page.tsx`

Multiple pages initialize `useState<'en'|'es'>('en')` then detect the browser
language in a `useEffect`. Users on Spanish browsers see English flash before
the effect runs. Worse, `JoinUsClient` and `SustainabilityClient` default to
`'es'`, so English users see Spanish first.

**Fix:** Use a consistent locale initialization strategy. Either:
- Read `searchParams` synchronously in the initial state (as `HelpClient` does
  with `useMemo`), or
- Accept a `locale` prop from a parent server component.

---

### 11. `navigator.language` accessed without SSR guard

**Affected files:** `MarketComparisonClient`, `JoinUsClient`,
`SustainabilityClient`, `UnderConstruction`, `HomeClient`, `ServicesClient`,
`ServiceFormClient`

While these are `'use client'` components, accessing `navigator` without a
`typeof navigator !== 'undefined'` guard is fragile and inconsistent with
other files (`HelpClient`, `PrivacyClient`) that do include the guard.

**Fix:** Add guards or adopt a shared `getInitialLocale()` utility.

---

### 12. Language toggle clobbers query params

**Affected files:** `JoinUsClient`, `SustainabilityClient`,
`MarketComparisonClient`

These toggle locale with `router.push('?lang=...')`, discarding any other query
parameters in the URL. `HomeClient` does a full `window.location.href` reload.
`HelpClient` correctly uses `router.replace`.

**Fix:** Use a shared `toggleLocale` utility that preserves existing query
params and uses `router.replace`.

---

### 13. `<Link>` wrapping `<button>` - invalid HTML

**File:** `src/app/cards/market-comparison/MarketComparisonClient.tsx`

Produces `<a><button>` which is invalid per HTML spec and causes unpredictable
behavior in screen readers.

**Fix:** Use `<Link>` with button-like Tailwind styling directly, or use a
`<button>` with `router.push()`.

---

### 14. `animate-fadeIn` CSS class undefined

**File:** `src/app/under-construction/page.tsx`

The class is used but never defined in `globals.css` or a Tailwind extension.
The fade-in animation silently fails.

**Fix:** Add the keyframe definition to `globals.css` or use Tailwind's built-in
`animate-` utilities.

---

### 15. Due date fabricated on the frontend

**Files:**
- `src/app/activity/ActivityPageClient.tsx:550-551`
- `src/app/activity/ServiceRequestModal.tsx:253-254`

When `service_deadline` is null, the code fabricates a due date from
`request_created_at + 3 days`. This business logic is in the frontend
(duplicated in two places) rather than the backend, so the two calculations
could diverge.

**Fix:** Compute the default deadline on the backend when the request is created.

---

### 16. Stepper hardcoded to step 2

**File:** `src/app/services/[service]/ServiceFormClient.tsx`

`currentStep={2}` is always 2 regardless of actual form progress, making the
stepper purely decorative.

**Fix:** Wire the stepper to the actual form step state, or remove it if multi-
step flow isn't needed yet.

---

## LOW - Improvements & Code Quality

### 17. Duplicate locale / markdown / layout logic (DRY violation)

**Files:** `PrivacyClient`, `TermsClient`, `SitemapClient`,
`AccessibilityClient`

These files share nearly identical locale initialization, breadcrumb rendering,
markdown rendering, and Navbar/Footer composition.

**Improvement:** Extract a shared `LegalPageLayout` component.

---

### 18. Inline translation objects recreated every render

**Affected files:** Most page-level components.

Translation objects like `const t = { ... }` are defined inside the component
body without `useMemo`, creating new references on every render and causing
unnecessary child re-renders.

**Improvement:** Wrap with `useMemo` keyed on `locale`, or move to a dictionary
file pattern (as `dictionaries.ts` does for the Help page).

---

### 19. Missing Footer on card pages

**Files:** `MarketComparisonClient`, `JoinUsClient`, `SustainabilityClient`

These pages don't render a Footer while all other card pages do.

**Improvement:** Add the shared Footer component for consistent layout.

---

### 20. No loading state for services fetch

**File:** `src/app/services/ServicesClient.tsx`

The services grid is empty until the Supabase fetch resolves, with no skeleton
loader or spinner.

**Improvement:** Add a loading skeleton or spinner while data loads.

---

### 21. Accessibility gaps

| Gap | Affected files |
|-----|---------------|
| No global `focus-visible` styles | `globals.css` |
| Missing skip-to-content links | All pages except `AccessibilityClient` and `HelpClient` |
| Breadcrumb `<nav>` missing `aria-label` | `PrivacyClient`, `TermsClient`, `SitemapClient` |
| Logout SVG icon missing `aria-hidden` | `SideMenu.tsx` |

---

### 22. Signed avatar URLs expire after 1 hour

**Files:** `src/components/layout/UserMenu.tsx:51`, `SideMenu.tsx`

`createSignedUrl(path, 60 * 60)` gives a 1-hour TTL. For long-lived sessions
avatars break silently with no refresh mechanism.

**Improvement:** Use public URLs for avatars (the bucket is already public), or
implement a refresh interval.

---

### 23. Empty catch blocks swallow errors

**Files:** `ServiceFormClient.tsx`, `ServicesClient.tsx`

Errors from form submission and service fetch are silently swallowed with bare
`catch {}`, giving users no feedback when something fails.

**Improvement:** Show a user-facing error message and log the error for
debugging.

---

### 24. No client-side form validation

**File:** `src/app/services/[service]/ServiceFormClient.tsx`

All form fields are optional from the UI's perspective. Users can submit a
completely empty form. The submit button is never disabled.

**Improvement:** Add required field indicators, validation messages, and disable
submit until minimum fields are filled.

---

## Summary

| Priority | Count | Key Areas |
|----------|-------|-----------|
| **Critical** | 4 | Open redirect, unauthenticated APIs, role escalation, file upload validation |
| **High** | 5 | useUser infinite loop, deprecated config, SRI hash, stale closures |
| **Medium** | 7 | Locale flash, invalid HTML, missing CSS, inconsistent locale handling |
| **Low** | 8 | DRY violations, accessibility, missing loading states, expired URLs |

### Recommended fix order

1. Security issues (1-4) — immediate priority
2. useUser infinite loop (5) — causes excessive API calls in production
3. Deprecated config & broken SRI hash (6-7) — quick wins
4. Locale consistency (10-12) — improves UX across the board
5. Everything else — incremental improvement
