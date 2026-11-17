# Bale Mini App Playground

An independent, sample-data-only food ordering Mini App playground for learning and testing the Bale WebApp experience.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL in a browser. The app runs in standalone preview mode when it is not opened inside Bale. No real accounts, backend, payment, or production data are used.

## Scope

- Home/menu, category filtering, search
- Food details and cart
- Checkout with mock confirmation
- Order history and order details
- Profile/settings demo
- Responsive RTL Persian UI
- Bale WebApp SDK adapter with safe browser fallback

The Bale SDK bridge is loaded from `https://tapi.bale.ai/miniapp.js?3` as described in the available Bale Mini App integration reference. Runtime availability and bot-side launch configuration must be verified with a real Bale bot before production use.
