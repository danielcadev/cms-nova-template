# Credential Rotation (Post-Exposure)

## Context

During the refactor, a plaintext local plugin store file (`src/lib/plugins/store.json`) was found containing API keys.
Even if a file is gitignored, secrets in the working tree are still high-risk (local backups, screenshots, malware, shared zip archives, etc.).

The file has been removed and plugin config/state is now stored in the database (`NovaConfig`) with encryption-at-rest for sensitive fields.

## What You Should Do Now

1. Revoke/rotate the exposed keys immediately.
2. Generate new keys.
3. Update the CMS plugin settings with the new keys.
4. If the repository was pushed to a remote, purge the secrets from Git history.

## Rotate Keys

### Google (Gemini)

- Go to Google Cloud Console -> APIs & Services -> Credentials
- Revoke the exposed API key
- Create a new API key
- Apply restrictions (recommended):
  - restrict to the Gemini API only
  - restrict by allowed IPs or HTTP referrers if applicable

### OpenRouter

- Go to https://openrouter.ai/keys
- Revoke the exposed key
- Create a new key
- Prefer a scoped key if available

## Update Nova

- Admin -> Plugins -> AI Assistant (`google-gemini`)
- Paste the new key(s)
- Ensure `ENCRYPTION_KEY` is configured (required to save sensitive plugin fields)

## Git History Purge (If Already Pushed)

If any secret was ever committed and pushed, removing it from the working tree is not enough.
You need to rewrite history and force-push, then rotate keys again.

Recommended tools:

- `git filter-repo` (preferred)
- BFG Repo-Cleaner

Note: rewriting history is disruptive and requires coordination with all collaborators.
