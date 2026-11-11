<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8a15ea72-2cba-4795-bd7a-0b7cb1502c5e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase guest data

The guest app reads public event details and uploaded event photos from Firestore, and writes guest wishes directly to the same `wedding-app-on-air` project used by Studio. Studio users must first sign in once to publish the event. Email/password credentials are used only by the Studio; guest access remains public and is constrained by the deployed Firestore rules.

From the workspace root, deploy the Firestore and Storage rules with:

```sh
npx firebase-tools login
npx firebase-tools deploy --project wedding-app-on-air --only firestore:rules,storage
```

If dependency installation fails because of the existing Vite/Vite PWA peer-version mismatch, use `npm install --legacy-peer-deps`.
