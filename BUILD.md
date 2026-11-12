# Building Tiri Vault Desktop

The relay address and the Filecoin network are **built into** the app. A build always targets one relay.

| Setting | Example (testnet) | Meaning |
|---|---|---|
| `VITE_API_HOST` | `https://relay.tiri.app` | Relay API |
| `VITE_WS_URL` | `wss://relay.tiri.app` | Relay WebSocket (same host, `wss://`) |
| `VITE_FILECOIN_NETWORK` | `calibration` | `calibration` (testnet) or `mainnet` |
| `VITE_FILECOIN_RPC_URL` | *(empty)* | Optional; defaults to the public Glif endpoint of the network |

The build writes these hosts into the app's Content-Security-Policy automatically, so the app may connect only to its relay and its Filecoin endpoint.

## Option A: GitHub Actions (recommended)

1. In GitHub → `Tiri-vault-desktop` → Settings → Secrets and variables → Actions → **Variables**, add `VITE_API_HOST`, `VITE_WS_URL` and `VITE_FILECOIN_NETWORK` with the values above.
2. Every pull request and every push to `main` builds a Windows installer. Download it from the workflow run → **Artifacts** (`TiriVault-windows-<commit>`).
3. To publish a version:
   ```bash
   npm version 0.3.0 --no-git-tag-version   # updates package.json
   git commit -am "Release 0.3.0" && git tag v0.3.0 && git push --follow-tags
   ```
   The workflow checks that the tag matches `package.json`, builds, and creates a **draft** GitHub Release with `TiriVault-Setup-0.3.0.exe` attached. Review the draft and click Publish.

## Option B: on a Windows PC

Needs Node.js 20 or newer and Git.

```powershell
git clone https://github.com/Boring-Software-Nation/Tiri-vault-desktop
cd Tiri-vault-desktop
npm ci
copy .env.example .env      # then edit .env: VITE_API_HOST, VITE_WS_URL, VITE_FILECOIN_NETWORK
npm run build:win
```

The installer appears in `release\<version>\TiriVault-Setup-<version>.exe`.

For local development against a relay on your machine, keep `.env` as copied (`http://localhost:3003`) and run `npm run dev`.

## Other platforms

`npm run build:mac` (on a Mac, produces a `.dmg`) and `npm run build:linux` (an AppImage) work the same way. CI builds only Windows for now.

## Code signing (before public release)

The installer is **not signed**, so Windows SmartScreen shows "Windows protected your PC → More info → Run anyway". That's fine for testers. For public release, buy a code-signing certificate (an EV or Azure Trusted Signing certificate removes the warning fastest) and add it to the workflow; electron-builder signs automatically when `CSC_LINK` / `CSC_KEY_PASSWORD` (or the Azure settings) are present.

## Notes

- `appId` in `electron-builder.yml` (`com.tirivault.desktop`) identifies the app to Windows. Don't change it after the first public release.
- There is no auto-update yet; users install new versions from the GitHub Release.
