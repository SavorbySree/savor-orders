# Savor by Sree · Orders

Private order book for Savor by Sree: orders, menu, bake list and deliveries.
Works on phones, tablets and laptops, and can be added to the home screen like an app.

## How it works
- Orders are stored in the Savor by Sree Supabase database (Ireland, eu-west-1), not in this repository.
- Every device that logs in sees the same orders, and changes appear on the others within a second or two.
- Only the owner's login can see or change orders. The main website can only add new orders.
- `config.js` holds the database address and the *publishable* key. That key is meant to be public.
  Never put the secret / service_role key in this repository.

## Put it online (GitHub Pages)
1. Create a repository, e.g. `savor-orders`, and upload every file in this folder (including `.nojekyll`).
2. Settings → Pages → Source: Deploy from a branch → main → / (root) → Save.
3. Live after a minute at `https://YOUR-USERNAME.github.io/savor-orders/`.

## Use your own domain (orders.savorbysree.ie)
1. At your domain provider, add a DNS record: Type `CNAME`, Name `orders`, Value `YOUR-USERNAME.github.io`.
2. Repository → Settings → Pages → Custom domain → `orders.savorbysree.ie` → Save, then tick Enforce HTTPS.

## Install
- iPhone: Safari → Share → Add to Home Screen.
- Android: Chrome → ⋮ → Install app, or use the Savor Orders APK.
