# Mercado Pago Admin Plugin (fe-admin)

Admin-side payments list for Mercado Pago with per-country filter +
refund action.

## Routes

| Path | Purpose |
|------|---------|
| `/admin/mercado-pago/payments` | Payments list (7 LATAM countries) |

## Config

Per-country access tokens are surfaced by core Settings → Plugins →
Mercado Pago, driven by the backend plugin's `admin-config.json`.

## Backend

Pairs with [`vbwd-plugin-mercado-pago`](https://github.com/VBWD-platform/vbwd-plugin-mercado-pago).

---

**Core:** [vbwd-fe-admin](https://github.com/VBWD-platform/vbwd-fe-admin)
