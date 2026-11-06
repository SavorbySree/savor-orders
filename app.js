/* Savor by Sree · Orders — runs fully on the phone, data saved on the device */
(function () {
'use strict';

/* ---------- constants ---------- */
var LEGACY_KEY = 'sbs.data.v1', DRAFT_KEY = 'sbs.draft.v1';
var CLOUD = !!(window.SBS_CONFIG && window.SBS_CONFIG.url && window.supabase && window.supabase.createClient);
var KEY = CLOUD ? 'sbs.cloud.v1' : LEGACY_KEY;
var VERSION = '2.5.0';
var SLOTS = ['5–6 pm', '6–7 pm', '7–8 pm', '8–9 pm', '9–10 pm', '10–11 pm'];
var SOURCES = [['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['website', 'Website'], ['phone', 'Phone call'], ['market', 'Market'], ['other', 'Other']];
var STATUS = { pending: 'To confirm', confirmed: 'Confirmed', ready: 'Ready', delivered: 'Delivered', cancelled: 'Cancelled' };
var CATS = ['Bundles', 'Cookies', 'Brownies', 'Cheesecakes', 'Basque', 'Tiramisu', 'Tres Leches', 'Savoury', 'Cakes', 'Add-ons'];
var ALLERGENS = ['Wheat', 'Milk', 'Eggs', 'Soya', 'Sesame', 'Mustard', 'Sulphites', 'Celery', 'Lupin', 'Peanuts', 'Nuts', 'Almonds', 'Hazelnuts', 'Pistachio', 'Cashew', 'Walnuts', 'Fish', 'Crustaceans', 'Molluscs'];
var BADGES = ['Best seller', 'Our recommends', 'Customer favourite', 'Season special'];
var DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var I = {
  plus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  cake: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21h14"/><path d="M6 21v-7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7"/><path d="M6 16c2 1.2 4 1.2 6 0s4-1.2 6 0"/><path d="M12 12V8"/><path d="M12 5.5c.8-.8.8-2 0-2.5-.8.5-.8 1.7 0 2.5z"/></svg>',
  orders: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v13H8l-4 4z"/><path d="M8 9h8M8 13h5"/></svg>',
  today: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21h14"/><path d="M6 21v-7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7"/><path d="M6 16c2 1.2 4 1.2 6 0s4-1.2 6 0"/><path d="M12 12V8"/></svg>',
  more: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  cal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6z"/></svg>',
  ig: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>',
  web: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  paste: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h4"/></svg>'
};

/* ---------- helpers ---------- */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function money(n) { n = Number(n) || 0; var s = Math.abs(n % 1) > 0.001 ? n.toFixed(2) : String(Math.round(n)); return (n < 0 ? '−€' + s.replace('-', '') : '€' + s); }
function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(',', '.').replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return iso(new Date()); }
function parseIso(s) { var p = String(s || '').split('-'); return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1); }
function addDays(s, n) { var d = parseIso(s); d.setDate(d.getDate() + n); return iso(d); }
function fmtDate(s, long) {
  if (!s) return 'No date';
  var d = parseIso(s), t = today();
  if (!long) { if (s === t) return 'Today'; if (s === addDays(t, 1)) return 'Tomorrow'; }
  return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
}
function daysBetween(a, b) { return Math.round((parseIso(b) - parseIso(a)) / 86400000); }
function slotOf(o) { return o.slot === 'other' ? (o.slotOther || '') : (o.slot || ''); }
function slotRank(o) { var i = SLOTS.indexOf(o.slot); return i < 0 ? 99 : i; }
function normPhone(p) {
  var d = String(p || '').replace(/[^\d+]/g, '');
  if (!d) return '';
  if (d.indexOf('+') === 0) d = d.slice(1);
  else if (d.indexOf('00') === 0) d = d.slice(2);
  else if (d.indexOf('0') === 0) d = '353' + d.slice(1);
  else if (d.length <= 9 && d.charAt(0) === '8') d = '353' + d;
  return d.replace(/\D/g, '');
}
function waUrl(phone, text) { var n = normPhone(phone); return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : ''); }
function mapsUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }

/* ---------- data ---------- */
function opt(label, price) { return { label: label, price: price }; }
function m(id, cat, name, options, extra) { var o = { id: id, cat: cat, name: name, options: options, includes: [], active: true, seasonal: false }; for (var k in (extra || {})) o[k] = extra[k]; return o; }
/* The full website menu (same as the shared database). Used to start a new database and by "Reset menu". */
var MENU_ROWS = [{"id": "share-box", "cat": "Bundles", "name": "Share Box", "description": "Cookies and brownies to share, in one order.", "options": [{"label": "Bundle", "price": 32}], "includes": ["Pack of 4 Chocochip NYC cookies", "Brownie sharing tray (serves 4)"], "badge": "Save €4", "tags": [], "seasonal": false, "allergens": [], "active": true, "sort": 0}, {"id": "treat-box", "cat": "Bundles", "name": "Treat Box", "description": "Something chewy and something creamy.", "options": [{"label": "Bundle", "price": 32}], "includes": ["Pack of 4 Chocochip NYC cookies", "Pack of 4 cheesecakes or Burnt Basque"], "badge": "Save €4", "tags": [], "seasonal": false, "allergens": [], "active": true, "sort": 1}, {"id": "dessert-duo", "cat": "Bundles", "name": "Dessert Duo", "description": "Two of our sharing trays, one price.", "options": [{"label": "Bundle", "price": 38}], "includes": ["Tiramisu sharing tray (serves 4)", "Brownie sharing tray (serves 4)"], "badge": "Save €4", "tags": [], "seasonal": false, "allergens": [], "active": true, "sort": 2}, {"id": "birthday-bundle", "cat": "Bundles", "name": "Birthday Bundle", "description": "A celebration cake with cookies on the side, plus candles and a card on us.", "options": [{"label": "Bundle", "price": 48}], "includes": ["6 inch, 3 layer celebration cake (from €35)", "Pack of 4 Chocochip NYC cookies", "Candles", "Personalised greeting card"], "badge": "Save €3", "tags": [], "seasonal": false, "allergens": [], "active": true, "sort": 3}, {"id": "diwali-delights", "cat": "Bundles", "name": "Hamper 1: Diwali Delights", "description": "Our festive favourites in one gift-ready box, handmade in small batches.", "options": [{"label": "Hamper", "price": 30}], "includes": ["Gulab Jamun NYC Cookie", "Fudgy Chocolate Brownie", "Motichoor Basque Cheesecake", "Filter Kaapi Tiramisu (120 ml)", "Rasmalai Tres Leches", "Mini Ghee Jar", "Ladoo Candle", "Festive Diwali Stickers"], "badge": "Season special", "tags": ["Hamper"], "seasonal": true, "allergens": [], "active": true, "sort": 4}, {"id": "pistachio-nyc-cookie", "cat": "Cookies", "name": "Pistachio NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Pistachio", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 5}, {"id": "matcha-nyc-cookie", "cat": "Cookies", "name": "Matcha NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 6}, {"id": "nutella-ferrero-nyc-cookie", "cat": "Cookies", "name": "Nutella Ferrero NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Hazelnuts", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 7}, {"id": "gulab-jamun-nyc-cookie", "cat": "Cookies", "name": "Gulab Jamun NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Almonds", "Pistachio"], "badge": "Season special", "tags": [], "seasonal": true, "description": null, "includes": [], "active": true, "sort": 8}, {"id": "og-chocochip-nyc-cookie", "cat": "Cookies", "name": "OG Chocochip NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 9}, {"id": "kinder-bueno-nyc-cookie", "cat": "Cookies", "name": "Kinder Bueno NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Hazelnuts", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 10}, {"id": "raspberry-white-chocolate-nyc-cookie", "cat": "Cookies", "name": "Raspberry White Chocolate NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 11}, {"id": "oreo-nyc-cookie", "cat": "Cookies", "name": "Oreo NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 12}, {"id": "red-velvet-nyc-cookie", "cat": "Cookies", "name": "Red Velvet NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 13}, {"id": "triple-chocolate-nyc-cookie", "cat": "Cookies", "name": "Triple Chocolate NYC Cookie", "options": [{"label": "Pack of 4", "price": 16, "note": "4 cookies"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 14}, {"id": "fudgy-chocolate-brownie", "cat": "Brownies", "name": "Fudgy Chocolate Brownie", "options": [{"label": "Sharing tray", "price": 20, "note": "Serves 4"}, {"label": "Celebration tray", "price": 38, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 15}, {"id": "mango-cheesecake", "cat": "Cheesecakes", "name": "Mango Cheesecake", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Soya", "Sulphites"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 16}, {"id": "raspberry-white-chocolate-cheesecake", "cat": "Cheesecakes", "name": "Raspberry White Chocolate Cheesecake", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 17}, {"id": "lemon-meringue-cheesecake", "cat": "Cheesecakes", "name": "Lemon Meringue Cheesecake", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 18}, {"id": "biscoff-cheesecake", "cat": "Cheesecakes", "name": "Biscoff Cheesecake", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 19}, {"id": "classic-vanilla-burnt-basque", "cat": "Basque", "name": "Classic Vanilla Burnt Basque", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 20}, {"id": "motichoor-basque-cheesecake", "cat": "Basque", "name": "Motichoor Basque Cheesecake", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Nuts"], "badge": "Season special", "tags": [], "seasonal": true, "description": null, "includes": [], "active": true, "sort": 21}, {"id": "baileys-burnt-basque", "cat": "Basque", "name": "Baileys Burnt Basque", "options": [{"label": "Pack of 4", "price": 20, "note": "4 pieces"}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": ["Contains alcohol"], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 22}, {"id": "classic-tiramisu", "cat": "Tiramisu", "name": "Classic Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 23}, {"id": "filter-kaapi-tiramisu", "cat": "Tiramisu", "name": "Filter Kaapi Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 24}, {"id": "chocolate-hazelnut-tiramisu", "cat": "Tiramisu", "name": "Chocolate Hazelnut Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Hazelnuts", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 25}, {"id": "pistachio-tiramisu", "cat": "Tiramisu", "name": "Pistachio Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Pistachio", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 26}, {"id": "lemon-tiramisu", "cat": "Tiramisu", "name": "Lemon Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 27}, {"id": "berry-swirl-tiramisu", "cat": "Tiramisu", "name": "Berry Swirl Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 28}, {"id": "baileys-tiramisu", "cat": "Tiramisu", "name": "Baileys Tiramisu", "options": [{"label": "Sharing tray", "price": 22, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": ["Contains alcohol"], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 29}, {"id": "rasmalai-tres-leches", "cat": "Tres Leches", "name": "Rasmalai Tres Leches", "options": [{"label": "Sharing tray", "price": 25, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Almonds", "Pistachio"], "badge": "Season special", "tags": [], "seasonal": true, "description": null, "includes": [], "active": true, "sort": 30}, {"id": "rose-and-pistachio-tres-leches", "cat": "Tres Leches", "name": "Rose & Pistachio Tres Leches", "options": [{"label": "Sharing tray", "price": 25, "note": "Serves 4"}, {"label": "Celebration tray", "price": 40, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk", "Pistachio"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 31}, {"id": "classic-tres-leches-with-fruits", "cat": "Tres Leches", "name": "Classic Tres Leches with Fruits", "options": [{"label": "Sharing tray", "price": 20, "note": "Serves 4"}, {"label": "Celebration tray", "price": 35, "note": "Serves up to 8"}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 32}, {"id": "paneer-tikka-slider", "cat": "Savoury", "name": "Paneer Tikka Slider", "options": [{"label": "Pack of 4", "price": 16, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 33}, {"id": "korean-garlic-cream-bun", "cat": "Savoury", "name": "Korean Garlic Cream Bun", "options": [{"label": "Pack of 4", "price": 16, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Sesame", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 34}, {"id": "aloo-samosa-scroll", "cat": "Savoury", "name": "Aloo Samosa Scroll", "options": [{"label": "Pack of 4", "price": 16, "note": "4 pieces"}], "allergens": ["Wheat", "Milk", "Mustard"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 35}, {"id": "classic-vanilla-cake", "cat": "Cakes", "name": "Classic Vanilla Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 36}, {"id": "biscoff-cake", "cat": "Cakes", "name": "Biscoff Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 37}, {"id": "mango-cake", "cat": "Cakes", "name": "Mango Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 38}, {"id": "fresh-fruit-cake", "cat": "Cakes", "name": "Fresh Fruit Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 39}, {"id": "pineapple-cake", "cat": "Cakes", "name": "Pineapple Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 40}, {"id": "berrylicious-cake", "cat": "Cakes", "name": "Berrylicious Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 41}, {"id": "cookies-and-cream-cake", "cat": "Cakes", "name": "Cookies & Cream Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 42}, {"id": "gulab-jamun-cake", "cat": "Cakes", "name": "Gulab Jamun Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Almonds", "Pistachio"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 43}, {"id": "rasmalai-cake", "cat": "Cakes", "name": "Rasmalai Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Almonds", "Pistachio"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 44}, {"id": "belgian-chocolate-cake", "cat": "Cakes", "name": "Belgian Chocolate Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 45}, {"id": "chocolate-fudge-cake", "cat": "Cakes", "name": "Chocolate Fudge Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 46}, {"id": "ferrero-rocher-cake", "cat": "Cakes", "name": "Ferrero Rocher Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Hazelnuts", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 47}, {"id": "matilda-cake", "cat": "Cakes", "name": "Matilda Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 48}, {"id": "black-forest-cake", "cat": "Cakes", "name": "Black Forest Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 49}, {"id": "red-velvet-cake", "cat": "Cakes", "name": "Red Velvet Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 50}, {"id": "coffee-cake", "cat": "Cakes", "name": "Coffee Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 51}, {"id": "birthday-cake", "cat": "Cakes", "name": "Birthday Cake", "options": [{"label": "6 inch, 3 layers", "price": 35, "note": "around 1 kg, 8–10 servings"}, {"label": "10 inch", "price": 50, "note": "around 1.5 kg, 10–15 servings"}, {"label": "Custom (quote)", "price": 0}], "allergens": ["Wheat", "Milk", "Soya"], "badge": null, "tags": [], "seasonal": false, "description": null, "includes": [], "active": true, "sort": 52}, {"id": "addon-candle", "cat": "Add-ons", "name": "Candles", "options": [{"label": "Each", "price": 0.75}], "description": null, "includes": [], "allergens": [], "badge": null, "tags": [], "active": true, "seasonal": false, "sort": 53}, {"id": "addon-knife", "cat": "Add-ons", "name": "Wooden knife", "options": [{"label": "Each", "price": 0.75}], "description": null, "includes": [], "allergens": [], "badge": null, "tags": [], "active": true, "seasonal": false, "sort": 54}, {"id": "addon-card", "cat": "Add-ons", "name": "Personalised greeting card", "options": [{"label": "Each", "price": 2.99}], "description": null, "includes": [], "allergens": [], "badge": null, "tags": [], "active": true, "seasonal": false, "sort": 55}, {"id": "addon-twoflav", "cat": "Add-ons", "name": "Two-flavour cake", "options": [{"label": "Extra", "price": 5}], "description": null, "includes": [], "allergens": [], "badge": null, "tags": [], "active": true, "seasonal": false, "sort": 56}, {"id": "addon-fondant", "cat": "Add-ons", "name": "Fondant finish", "options": [{"label": "Per 0.5 kg", "price": 5}], "description": null, "includes": [], "allergens": [], "badge": null, "tags": [], "active": true, "seasonal": false, "sort": 57}];
function defaultMenu() { return MENU_ROWS.map(function (r) { return fromMenuRow(JSON.parse(JSON.stringify(r))); }); }
function defaultSettings() {
  return {
    confirmMsg: 'Hi {name}, thank you for ordering with Savor by Sree! Your order {ref} is confirmed.\n\n{items}\n\n{when_line}\nTotal: {total}\n\nSee you soon!',
    readyMsg: 'Hi {name}, your Savor by Sree order {ref} is ready for {mode} ({when}).',
    onwayMsg: 'Hi {name}, your Savor by Sree order is on its way! We should be with you around {slot}.'
  };
}
function defaultNotices() { return { topbar: '', topbarUntil: '', paused: false, pauseMessage: 'We’re not taking new orders right now. Message us on WhatsApp and we’ll let you know when we reopen.', closedDates: [], noticeDays: 2 }; }
function fresh() { return { v: 1, seq: 1000, menu: defaultMenu(), orders: [], settings: defaultSettings(), bake: {}, offers: [], markets: [], notices: defaultNotices(), sections: null }; }
var store = (function () { try { var t = '__t'; localStorage.setItem(t, t); localStorage.removeItem(t); return localStorage; } catch (e) { var mem = {}; return { getItem: function (k) { return mem[k] || null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } }; } })();
function load() {
  try {
    var d = JSON.parse(store.getItem(KEY));
    if (d && d.menu && d.orders) { d.settings = Object.assign(defaultSettings(), d.settings || {}); d.bake = d.bake || {}; d.offers = d.offers || []; d.markets = d.markets || []; d.notices = Object.assign(defaultNotices(), d.notices || {}); d.sections = d.sections || null; return d; }
  } catch (e) {}
  return fresh();
}
var db = load();
function save() { try { store.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('Could not save: phone storage is full'); } }

/* ---------- shared online database (Supabase) ---------- */
var sb = null, net = { checked: !CLOUD, user: null, offline: false, syncing: false, chan: null, lastPull: 0 };
var FIELD = { name: 'name', phone: 'phone', source: 'source', items: 'items', mode: 'mode', date: 'order_date', address: 'address', fee: 'fee', notes: 'notes', paid: 'paid', paidAmount: 'paid_amount', status: 'status', payments: 'payments', discount: 'discount' };
var BASE_KEYS = ['name', 'phone', 'source', 'items', 'mode', 'date', 'slot', 'address', 'fee', 'notes', 'paidAmount', 'paid'];
var ORDER_KEYS = BASE_KEYS.concat(['payments', 'discount']);
/* payments + discount columns arrive with the 2.5 database update; until it is run they are kept on this device only */
function orderKeys() { return !CLOUD || net.v25 ? ORDER_KEYS : BASE_KEYS; }
function toRow(o, keys) {
  var r = {};
  keys.forEach(function (k) {
    if (k === 'slot' || k === 'slotOther') { r.slot = o.slot === 'other' ? (o.slotOther || null) : (o.slot || null); return; }
    var c = FIELD[k]; if (!c) return;
    var v = o[k];
    if (k === 'fee') v = (v === '' || v == null) ? null : num(v);
    else if (k === 'paidAmount') v = Math.round(num(v) * 100) / 100;
    else if (k === 'paid') v = isPaid(o);
    else if (k === 'date' || k === 'phone' || k === 'address' || k === 'notes') v = v ? String(v) : null;
    else if (k === 'name') v = String(v || '').trim();
    else if (k === 'payments') v = (v || []).map(cleanPay).filter(function (x) { return x.amount > 0; });
    else if (k === 'discount') v = discountAmt(o) > 0 ? { type: o.discount.type === 'percent' ? 'percent' : 'amount', value: num(o.discount.value), note: o.discount.note || '' } : null;
    else if (k === 'items') v = (v || []).map(function (l) { return { menuId: l.menuId || null, name: l.name, option: l.option || '', price: num(l.price), qty: l.qty || 1 }; });
    r[c] = v;
  });
  return r;
}
function fromRow(r) {
  var slot = r.slot || '', known = !slot || SLOTS.indexOf(slot) >= 0;
  return { id: r.id, ref: r.ref, status: r.status, source: r.source || 'other', name: r.name || '', phone: r.phone || '', mode: r.mode || 'collection',
    date: r.order_date || '', slot: known ? slot : 'other', slotOther: known ? '' : slot, address: r.address || '', fee: r.fee == null ? '' : String(+r.fee),
    notes: r.notes || '', paid: !!r.paid, paidAmount: r.paid_amount == null ? 0 : +r.paid_amount, items: Array.isArray(r.items) ? r.items : [], payments: Array.isArray(r.payments) ? r.payments : [], discount: r.discount && num(r.discount.value) > 0 ? r.discount : null, createdAt: Date.parse(r.created_at) || 0, updatedAt: Date.parse(r.updated_at) || 0 };
}
function toMenuRow(it, i) { return { id: it.id, cat: it.cat, name: it.name, description: it.description || null, allergens: it.allergens || [], badge: it.badge || null, tags: it.tags || [], options: it.options || [], includes: it.includes || [], active: it.active !== false, seasonal: !!it.seasonal, sort: i == null ? (it.sort || 0) : i }; }
function fromMenuRow(r) { return { id: r.id, cat: r.cat, name: r.name, description: r.description || '', allergens: Array.isArray(r.allergens) ? r.allergens : [], badge: r.badge || '', tags: Array.isArray(r.tags) ? r.tags : [], options: r.options || [], includes: r.includes || [], active: !!r.active, seasonal: !!r.seasonal, sort: r.sort || 0 }; }
function newId() { try { if (crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {} return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }); }
function fromOfferRow(r) { return { id: r.id, title: r.title || '', details: r.details || '', percentOff: r.percent_off == null ? '' : +r.percent_off, amountOff: r.amount_off == null ? '' : +r.amount_off, itemIds: Array.isArray(r.item_ids) ? r.item_ids : [], startsOn: r.starts_on || '', endsOn: r.ends_on || '', active: r.active !== false, sort: r.sort || 0 }; }
function toOfferRow(o) { return { id: o.id, title: o.title, details: o.details || null, percent_off: o.percentOff === '' || o.percentOff == null ? null : num(o.percentOff), amount_off: o.amountOff === '' || o.amountOff == null ? null : num(o.amountOff), item_ids: o.itemIds || [], starts_on: o.startsOn || null, ends_on: o.endsOn || null, active: !!o.active, sort: o.sort || 0 }; }
function fromMarketRow(r) {
  var legacyDays = r.repeat === 'weekly' && r.weekday != null ? [+r.weekday] : [];
  var once = r.repeat === 'once' && r.market_date;
  var st = r.status || (once ? (r.market_date >= today() ? 'upcoming' : 'past') : 'active');
  return { id: r.id, name: r.name || '', kind: r.kind || 'Market', status: st, place: r.place || '', address: r.address || '', mapsUrl: r.maps_url || '',
    days: Array.isArray(r.days) && r.days.length ? r.days.map(Number) : legacyDays, startTime: r.start_time || '', endTime: r.end_time || '',
    startsOn: r.starts_on || (once ? r.market_date : ''), endsOn: r.ends_on || (once ? r.market_date : ''), skipDates: Array.isArray(r.skip_dates) ? r.skip_dates : [],
    notes: r.notes || '', description: r.description || '', active: r.active !== false, sort: r.sort || 0 };
}
function toMarketRow(m) {
  var days = (m.days || []).map(Number), single = !days.length && m.startsOn && m.startsOn === m.endsOn;
  return { id: m.id, name: m.name, kind: m.kind || 'Market', status: m.status || 'active', place: m.place || null, address: m.address || null, maps_url: m.mapsUrl || null,
    days: days, repeat: days.length ? 'weekly' : single ? 'once' : 'regular', weekday: days.length ? days[0] : null, market_date: single ? m.startsOn : null,
    start_time: m.startTime || null, end_time: m.endTime || null, starts_on: m.startsOn || null, ends_on: m.endsOn || null, skip_dates: m.skipDates || [],
    notes: m.notes || null, description: m.description || null, active: !!m.active, sort: m.sort || 0 };
}
function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function upsertLocalOrder(o) { var ex = getOrder(o.id); if (ex) Object.assign(ex, o); else db.orders.push(o); }
function netMsg(e) {
  var m = String((e && (e.message || e.error_description || e.msg)) || e || '');
  if ((typeof navigator !== 'undefined' && navigator.onLine === false) || /fetch|network|load failed|timeout/i.test(m)) return 'No internet connection. Not saved, please try again.';
  if (/jwt|token|auth|401|permission|row-level|policy/i.test(m)) return 'Please log in again, then try once more.';
  return 'Couldn’t save: ' + m;
}
/* Run a change online. The screen updates straight away; if the save fails it is put back and a message explains why. */
function remote(q, undo, ok) {
  if (!CLOUD) { save(); return; }
  save();
  Promise.resolve(q).then(function (r) {
    if (r && r.error) throw r.error;
    setOffline(false);
    if (ok) ok(r ? r.data : null);
    save();
  }).catch(function (e) {
    if (undo) undo();
    save(); softRender(true); toast(netMsg(e));
  });
}
function setOffline(v) {
  if (net.offline === v) return;
  net.offline = v;
  var b = document.getElementById('netbar');
  if (!b) { b = document.createElement('div'); b.id = 'netbar'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
  b.textContent = v ? 'No internet · showing the last saved copy. Changes need internet.' : '';
  b.hidden = !v;
}
function pull() {
  if (!CLOUD || !net.user || net.syncing) return Promise.resolve();
  net.syncing = true;
  return Promise.all([
    sb.from('orders').select('*').order('created_at', { ascending: true }).limit(5000),
    sb.from('menu_items').select('*').order('sort', { ascending: true }),
    sb.from('settings').select('*'),
    sb.from('offers').select('*').order('created_at', { ascending: false }),
    sb.from('markets').select('*').order('created_at', { ascending: true }),
    sb.from('site_content').select('*')
  ]).then(function (res) {
    res.slice(0, 3).forEach(function (r) { if (r.error) throw r.error; });
    net.siteReady = !res[3].error && !res[4].error && !res[5].error;
    if (!res[3].error) db.offers = res[3].data.map(fromOfferRow);
    if (!res[4].error) db.markets = res[4].data.map(fromMarketRow);
    if (!res[5].error) res[5].data.forEach(function (row) { if (row.key === 'notices') db.notices = Object.assign(defaultNotices(), row.value || {}); else if (row.key === 'sections' && Array.isArray(row.value)) db.sections = row.value; });
    db.orders = res[0].data.map(fromRow);
    if (res[0].data.length) net.v25 = 'payments' in res[0].data[0] && 'discount' in res[0].data[0];
    else sb.from('orders').select('payments,discount').limit(1).then(function (r) { net.v25 = !r.error; });
    if (res[1].data.length) db.menu = res[1].data.map(fromMenuRow);
    else { db.menu = defaultMenu(); sb.from('menu_items').upsert(db.menu.map(toMenuRow)).then(function () {}); }
    db.bake = {};
    res[2].data.forEach(function (row) {
      if (row.key === 'messages') db.settings = Object.assign(defaultSettings(), row.value || {});
      else if (row.key.indexOf('bake:') === 0) db.bake[row.key.slice(5)] = row.value || {};
    });
    net.lastPull = Date.now(); setOffline(false); save(); softRender();
  }).catch(function (e) {
    var m = String((e && e.message) || e);
    if (/jwt|token|auth|401/i.test(m)) { toast('Please log in again'); }
    setOffline(true); softRender();
  }).then(function () { net.syncing = false; });
}
function subscribe() {
  if (!CLOUD || net.chan) return;
  net.chan = sb.channel('sbs-orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, function (p) {
      if (p.eventType === 'DELETE') { var id = p.old && p.old.id; db.orders = db.orders.filter(function (o) { return o.id !== id; }); }
      else if (p.new) { var o = fromRow(p.new), isNew = !getOrder(o.id); upsertLocalOrder(o); if (isNew && p.eventType === 'INSERT' && o.status === 'pending' && net.ready) toast('New order · ' + (o.name || o.ref)); }
      save(); softRender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, function (p) {
      if (p.eventType === 'DELETE') { var id = p.old && p.old.id; db.menu = db.menu.filter(function (x) { return x.id !== id; }); }
      else if (p.new) { var it = fromMenuRow(p.new), ex = getItem(it.id); if (ex) Object.assign(ex, it); else db.menu.push(it); db.menu.sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); }); }
      save(); softRender();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, function (p) { liveList('offers', fromOfferRow, p); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'markets' }, function (p) { liveList('markets', fromMarketRow, p); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, function (p) { if (p.new && p.new.key === 'notices') { db.notices = Object.assign(defaultNotices(), p.new.value || {}); save(); softRender(); } else if (p.new && p.new.key === 'sections') { db.sections = p.new.value || null; save(); softRender(); } })
    .subscribe(function (st) { if (st === 'SUBSCRIBED') pull(); });
}
function liveList(name, from, p) {
  if (p.eventType === 'DELETE') { var id = p.old && p.old.id; db[name] = db[name].filter(function (x) { return x.id !== id; }); }
  else if (p.new) { var it = from(p.new), ex = byId(db[name], it.id); if (ex) Object.assign(ex, it); else db[name].push(it); }
  save(); softRender();
}
function startCloud() { subscribe(); pull().then(function () { net.ready = true; }); }
/* Re-draw for changes made on another device, unless the person is typing in a form. */
function softRender(force) {
  var r = curRoute().split('/')[1] || '';
  var a = document.activeElement;
  var typing = a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type !== 'checkbox' && a.dataset.field !== 'q') || a.tagName === 'SELECT');
  if (!force && (r === 'new' || r === 'edit' || r === 'offer' || r === 'market' || r === 'bundle' || r === 'notices' || (r === 'menu' && curRoute().split('/')[2]) || typing)) { var b = document.querySelector('.tabs'); if (b && r !== 'new' && r !== 'edit') b.outerHTML = tabsHtml(r); return; }
  if (!document.getElementById('modal').hidden) { if (force) closeModal(); else { ui.pendingRender = true; return; } }
  rerender();
}
function saveSetting(key, value) { if (!CLOUD) { save(); return; } remote(sb.from('settings').upsert({ key: key, value: value })); }
var settingTimer = null;
function saveMessagesSoon() { save(); clearTimeout(settingTimer); settingTimer = setTimeout(function () { saveSetting('messages', db.settings); }, 700); }
function getOrder(id) { for (var i = 0; i < db.orders.length; i++) if (db.orders[i].id === id) return db.orders[i]; return null; }
function getItem(id) { for (var i = 0; i < db.menu.length; i++) if (db.menu[i].id === id) return db.menu[i]; return null; }
function subtotal(o) { return (o.items || []).reduce(function (s, l) { return s + num(l.price) * (l.qty || 0); }, 0); }
/* Order discount: a % or € amount off the items (not the delivery fee). */
function discountAmt(o) {
  var d = o.discount; if (!d || !(num(d.value) > 0)) return 0;
  var sub = subtotal(o), v = num(d.value);
  return Math.round((d.type === 'percent' ? sub * Math.min(100, v) / 100 : Math.min(sub, v)) * 100) / 100;
}
function discountLabel(o) { var d = o.discount; if (!discountAmt(o)) return ''; return 'Discount' + (d.type === 'percent' ? ' (' + (+num(d.value)) + '%)' : '') + (d.note ? ' · ' + d.note : ''); }
function orderTotal(o) { return Math.max(0, subtotal(o) - discountAmt(o)) + (o.mode === 'delivery' ? num(o.fee) : 0); }
function totalLabel(o) { var t = money(orderTotal(o)); return (o.mode === 'delivery' && (o.fee === '' || o.fee == null)) ? t + ' + delivery' : t; }
/* Payments: amount collected so far. Older orders that were only ticked "paid" count as fully paid. */
function collected(o) { var a = num(o.paidAmount); if (!a && o.paid) return orderTotal(o); return a; }
function pendingAmt(o) { return Math.max(0, Math.round((orderTotal(o) - collected(o)) * 100) / 100); }
function isPaid(o) { var t = orderTotal(o); return t > 0 ? collected(o) >= t - 0.004 : !!o.paid; }
var PAY_METHODS = ['SumUp', 'Revolut', 'Bank transfer', 'Cash'];
function cleanPay(x) { return { amount: Math.round(num(x.amount) * 100) / 100, date: x.date || '', parts: (x.parts || []).filter(function (p) { return p.method; }).map(function (p) { return { method: p.method, amount: Math.round(num(p.amount) * 100) / 100 }; }) }; }
function paySum(o) { return (o.payments || []).reduce(function (s, x) { return s + num(x.amount); }, 0); }
/* Money collected before payment methods were recorded (or typed as one figure) */
function earlierPaid(o) { return Math.max(0, Math.round((collected(o) - paySum(o)) * 100) / 100); }
function payMethodText(x) { var p = x.parts || []; if (!p.length) return 'Method not recorded'; return p.length === 1 ? p[0].method : p.map(function (q) { return money(q.amount) + ' ' + q.method; }).join(' + '); }
function payRowsHtml(o, act) {
  var rows = (o.payments || []).map(function (x, i) {
    return '<div class="pay-row"><div class="grow"><b>' + money(x.amount) + '</b><span>' + esc(payMethodText(x)) + (x.date ? ' · ' + esc(fmtDate(x.date)) : '') + '</span></div>' +
      '<button class="icon-btn" data-act="' + act + '" data-i="' + i + '"' + (o.id ? ' data-id="' + o.id + '"' : '') + ' aria-label="Remove this payment">' + I.x + '</button></div>';
  });
  var e = earlierPaid(o);
  if (e > 0) rows.unshift('<div class="pay-row"><div class="grow"><b>' + money(e) + '</b><span>Paid earlier · method not recorded</span></div><button class="icon-btn" data-act="' + act + '" data-i="earlier"' + (o.id ? ' data-id="' + o.id + '"' : '') + ' aria-label="Remove this payment">' + I.x + '</button></div>');
  return rows.length ? '<div class="pay-list">' + rows.join('') + '</div>' : '';
}
/* One editor for every payment: one method, or split across two; date received is optional. */
function openPayModal(title, text, amount, onSave, opt) {
  opt = opt || {};
  var chips = function (grp, sel) { return '<div class="wrap-chips" role="group" data-grp="' + grp + '">' + PAY_METHODS.map(function (m) { return '<button type="button" class="chip" data-act="pmPick" data-v="' + m + '" aria-pressed="' + (m === sel) + '">' + m + '</button>'; }).join('') + '</div>'; };
  var amt = Math.round(amount * 100) / 100 || '';
  modal({ title: title, text: text,
    html: '<div class="pay-editor">' +
      '<div class="toggle" role="group" aria-label="How it was paid"><button type="button" data-act="pmMode" data-v="one" aria-pressed="true">One method</button><button type="button" data-act="pmMode" data-v="split" aria-pressed="false">Split in two</button></div>' +
      '<div id="pmOne" class="pay-block"><div class="field"><label for="pmAmt">Amount received (€)</label><input class="input" id="pmAmt" inputmode="decimal" value="' + amt + '"></div><div class="field"><span class="label">Paid by</span>' + chips('one', '') + '</div></div>' +
      '<div id="pmSplit" class="pay-block" hidden>' +
        '<div class="field"><span class="label">First method</span>' + chips('a', '') + '<label class="price-wrap wide">€<input class="price-in" id="pmA1" inputmode="decimal" placeholder="Amount" aria-label="First amount"></label></div>' +
        '<div class="field"><span class="label">Second method</span>' + chips('b', '') + '<label class="price-wrap wide">€<input class="price-in" id="pmA2" inputmode="decimal" placeholder="Amount" aria-label="Second amount"></label></div>' +
        '<div class="hint" id="pmSplitTot">Total: ' + money(0) + '</div></div>' +
      '<div class="field"><label for="pmDate">Date received <small>(optional)</small></label><input class="input" id="pmDate" type="date" value="' + today() + '"></div>' +
    '</div>',
    buttons: [{ label: opt.saveLabel || 'Save payment', fn: function () {
      var pick = function (g) { var b = document.querySelector('[data-grp="' + g + '"] [aria-pressed="true"]'); return b ? b.dataset.v : ''; };
      var split = !$('#pmSplit').hidden, entry;
      if (!split) {
        var v = num($('#pmAmt').value), m = pick('one');
        if (!(v > 0)) { toast('Enter the amount received'); return false; }
        if (!m) { toast('Pick how it was paid'); return false; }
        entry = { amount: v, parts: [{ method: m, amount: v }] };
      } else {
        var m1 = pick('a'), m2 = pick('b'), a1 = num($('#pmA1').value), a2 = num($('#pmA2').value);
        if (!m1 || !m2) { toast('Pick both payment methods'); return false; }
        if (m1 === m2) { toast('Pick two different methods'); return false; }
        if (!(a1 > 0) || !(a2 > 0)) { toast('Enter both amounts'); return false; }
        entry = { amount: a1 + a2, parts: [{ method: m1, amount: a1 }, { method: m2, amount: a2 }] };
      }
      entry.date = $('#pmDate').value || '';
      onSave(cleanPay(entry));
    } }].concat(opt.extra || []).concat([{ label: 'Cancel', kind: 'ghost' }]) });
}
function methodTotals(list) {
  var t = {};
  list.forEach(function (o) {
    if (o.status === 'cancelled') return;
    (o.payments || []).forEach(function (x) { (x.parts || []).forEach(function (p) { t[p.method] = (t[p.method] || 0) + num(p.amount); }); });
    var e = earlierPaid(o); if (e > 0) t['Method not recorded'] = (t['Method not recorded'] || 0) + e;
  });
  return t;
}
function payState(o) { if (isPaid(o)) return 'paid'; return collected(o) > 0 ? 'part' : 'unpaid'; }
function payPill(o, small) {
  var st = payState(o), h = small ? ';height:22px' : '';
  if (st === 'paid') return '<span class="pill p-ok" style="' + h + '">Paid</span>';
  if (st === 'part') return '<span class="pill p-part" style="' + h + '">Part paid · ' + money(pendingAmt(o)) + ' due</span>';
  return '<span class="pill p-due" style="' + h + '">' + money(pendingAmt(o)) + (o.mode === 'delivery' && (o.fee === '' || o.fee == null) ? ' + del.' : '') + ' due</span>';
}
/* Offers: live on a date when switched on and the date is inside its start/end dates. */
function offerLive(of, day) { day = day || today(); return of.active && (!of.startsOn || of.startsOn <= day) && (!of.endsOn || of.endsOn >= day); }
function offerState(of) { var t = today(); if (!of.active) return ['Off', 'p-delivered']; if (of.endsOn && of.endsOn < t) return ['Ended', 'p-delivered']; if (of.startsOn && of.startsOn > t) return ['Starts ' + fmtDate(of.startsOn), 'p-ready']; return ['Live now', 'p-confirmed']; }
function offerLabel(of) { return num(of.percentOff) > 0 ? num(of.percentOff) + '% off' : num(of.amountOff) > 0 ? money(num(of.amountOff)) + ' off' : 'Message only'; }
function offerFor(itemId) { var best = null, bestCut = 0; (db.offers || []).forEach(function (of) { if (!offerLive(of) || (of.itemIds || []).indexOf(itemId) < 0) return; var cut = num(of.percentOff) > 0 ? num(of.percentOff) / 100 * 100 : num(of.amountOff); if (!best || cut > bestCut) { best = of; bestCut = cut; } }); return best; }
function offerPrice(price, of) { if (!of || !price) return price; var p = num(of.percentOff) > 0 ? price * (1 - num(of.percentOff) / 100) : price - num(of.amountOff); return Math.max(0, Math.round(p * 100) / 100); }
/* Markets: the next dates a market is on. */
function marketDates(m, count) {
  var out = [], t = today(), days = (m.days || []).map(Number);
  if (!days.length) { if (m.startsOn && m.startsOn >= t && (!m.endsOn || m.endsOn === m.startsOn)) out.push(m.startsOn); return out; }
  var d = parseIso(m.startsOn && m.startsOn > t ? m.startsOn : t);
  for (var i = 0; out.length < (count || 4) && i < 180; i++) {
    var s = iso(d); if (m.endsOn && s > m.endsOn) break;
    if (days.indexOf(d.getDay()) >= 0 && (m.skipDates || []).indexOf(s) < 0) out.push(s);
    d.setDate(d.getDate() + 1);
  }
  return out;
}
function daysText(days) {
  days = (days || []).map(Number); if (!days.length) return '';
  if (days.length === 7) return 'Every day';
  var order = [1, 2, 3, 4, 5, 6, 0], names = order.filter(function (d) { return days.indexOf(d) >= 0; }).map(function (d) { return days.length === 1 ? 'Every ' + DAYS_LONG[d] : DAYS[d]; });
  return names.join(', ');
}
function timeText(m) { var f = function (x) { if (!x) return ''; var h = +x.split(':')[0], mi = x.split(':')[1]; return (h % 12 || 12) + (mi && mi !== '00' ? ':' + mi : '') + (h < 12 ? 'am' : 'pm'); }; return m.startTime ? f(m.startTime) + (m.endTime ? '–' + f(m.endTime) : '') : ''; }
function moneySummary(list) {
  var live = list.filter(function (o) { return o.status !== 'cancelled' && o.status !== 'pending'; });
  return { n: live.length, total: live.reduce(function (s, o) { return s + orderTotal(o); }, 0), got: live.reduce(function (s, o) { return s + Math.min(collected(o), orderTotal(o) || collected(o)); }, 0), due: live.reduce(function (s, o) { return s + pendingAmt(o); }, 0) };
}
var PLAIN = { Bundle: 1, Hamper: 1, Each: 1, Set: 1, Extra: 1 };
function optText(l) { return l.option && !PLAIN[l.option] ? l.option : ''; }
function itemsSummary(o) {
  var it = o.items || [];
  if (!it.length) return 'No items yet';
  var first = it.slice(0, 2).map(function (l) { return l.qty + ' × ' + l.name + (optText(l) && it.length < 3 ? ' (' + optText(l) + ')' : ''); }).join(', ');
  return first + (it.length > 2 ? ' + ' + (it.length - 2) + ' more' : '');
}
function itemsText(o) { return (o.items || []).map(function (l) { return '• ' + l.qty + ' × ' + l.name + (optText(l) ? ' (' + optText(l) + ')' : '') + ' ' + money(num(l.price) * l.qty); }).join('\n') + (discountAmt(o) ? '\n' + discountLabel(o) + ': −' + money(discountAmt(o)) : ''); }
function whenText(o) { var s = slotOf(o); return fmtDate(o.date, true) + (s ? ', ' + s : ''); }
function fillTemplate(t, o) {
  var mode = o.mode === 'delivery' ? 'delivery' : 'collection';
  var line = o.mode === 'delivery' ? 'Delivery: ' + whenText(o) + (o.address ? ' to ' + o.address : '') : 'Collection: ' + whenText(o);
  var vals = { name: (o.name || '').split(' ')[0], ref: o.ref || '', items: itemsText(o), total: totalLabel(o), when: whenText(o), when_line: line, mode: mode, slot: slotOf(o) || 'your time slot', address: o.address || '' };
  return String(t || '').replace(/\{(\w+)\}/g, function (all, k) { return vals[k] != null ? vals[k] : all; });
}
function sourceLabel(s) { for (var i = 0; i < SOURCES.length; i++) if (SOURCES[i][0] === s) return SOURCES[i][1]; return 'Other'; }
function sourcePill(s) {
  var cls = s === 'whatsapp' ? 'p-wa' : s === 'instagram' ? 'p-ig' : s === 'website' ? 'p-web' : 'p-other';
  var ic = s === 'whatsapp' ? I.wa.replace(/18/g, '14') : s === 'instagram' ? I.ig : s === 'website' ? I.web : '';
  return '<span class="pill ' + cls + '">' + ic + esc(sourceLabel(s)) + '</span>';
}
function statusPill(st) { return '<span class="pill p-' + st + '">' + esc(STATUS[st] || st) + '</span>'; }
function sortActive(a, b) { return (a.date || '9').localeCompare(b.date || '9') || slotRank(a) - slotRank(b) || (a.createdAt || 0) - (b.createdAt || 0); }

/* ---------- sample orders (to try the app; easy to remove) ---------- */
function sampleOrders() {
  var t = today(), now = Date.now();
  function L(id, oi, qty) { var it = getItem(id); if (!it) return null; var o = it.options[oi || 0]; return { menuId: it.id, name: it.name, option: o.label, price: o.price, qty: qty || 1 }; }
  function mk(name, phone, src, items, mode, off, slot, status, paid, addr, fee, notes) {
    db.seq = (db.seq || 1000) + 1;
    return { id: uid(), ref: 'SBS-' + db.seq, name: name, phone: phone, source: src, items: items.filter(Boolean), mode: mode, date: addDays(t, off), slot: slot, slotOther: '', address: addr || '', fee: fee == null ? '' : fee, paidAmount: 0, notes: notes || '', paid: !!paid, status: status, createdAt: now - (8 - off) * 3600000, updatedAt: now, sample: true };
  }
  return [
    mk('Priya Nair', '087 000 1101', 'website', [L('birthday-bundle')], 'delivery', 3, '7–8 pm', 'pending', false, 'D15 AB12', null, 'Rasmalai flavour, buttercream. On cake: Happy 5th Birthday Aarav'),
    mk('Ciara Byrne', '086 000 2202', 'whatsapp', [L('pistachio-nyc-cookie', 0, 2)], 'collection', 2, '6–7 pm', 'pending'),
    mk('Ananya Rao', '089 000 3303', 'instagram', [L('diwali-delights', 0, 3)], 'delivery', 4, '8–9 pm', 'pending', false, 'D08 XY12'),
    mk('Seán Murphy', '085 000 4404', 'whatsapp', [L('classic-tiramisu', 1)], 'collection', 1, '5–6 pm', 'confirmed', true),
    mk('Meera Shah', '087 000 5505', 'website', [L('dessert-duo')], 'delivery', 1, '9–10 pm', 'confirmed', false, 'D06 K2P4', 5),
    mk('Aoife Kelly', '083 000 6606', 'whatsapp', [L('classic-vanilla-burnt-basque'), L('og-chocochip-nyc-cookie')], 'collection', 0, '6–7 pm', 'ready', true),
    mk('Arjun Menon', '087 000 7707', 'phone', [L('belgian-chocolate-cake', 1), L('addon-candle'), L('addon-card')], 'delivery', 0, '8–9 pm', 'confirmed', false, 'D15 X2Y3', 6, 'Chocolate ganache finish, 10 inch'),
    mk('Niamh Walsh', '086 000 8808', 'instagram', [L('rasmalai-tres-leches')], 'collection', -1, '7–8 pm', 'delivered', true)
  ];
}
function hasSamples() { return db.orders.some(function (o) { return o.sample; }); }

/* ---------- draft (order being added / edited) ---------- */
var draft = null;
function blankDraft() { return { key: 'new', id: null, name: '', phone: '', source: 'whatsapp', items: [], mode: 'collection', date: addDays(today(), 2), slot: '6–7 pm', slotOther: '', address: '', fee: '', notes: '', paid: false, paidAmount: 0, payments: [], discount: null }; }
function loadDraft() { try { var d = JSON.parse(store.getItem(DRAFT_KEY)); if (d && d.key) return d; } catch (e) {} return null; }
function saveDraft() { try { store.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (e) {} }
function clearDraft() { draft = null; store.removeItem(DRAFT_KEY); }
function ensureDraft(key) {
  if (!draft) draft = loadDraft();
  if (draft && draft.key === key) return draft;
  if (key === 'new') { draft = blankDraft(); }
  else {
    var o = getOrder(key.slice(5));
    if (!o) return null;
    draft = JSON.parse(JSON.stringify(o)); draft.key = key; draft.paidAmount = collected(o) || 0; draft.payments = draft.payments || []; draft.discount = draft.discount || null;
  }
  saveDraft();
  return draft;
}
function draftHasContent(d) { return d && (d.name || d.phone || (d.items && d.items.length) || d.notes || d.address); }

/* ---------- UI shell ---------- */
var app = document.getElementById('app');
var ui = { ordersTab: 'pending', q: '', day: today(), menuCat: 'Cookies', pickCat: 'Bundles' };

function tabsHtml(cur) {
  var pend = db.orders.filter(function (o) { return o.status === 'pending'; }).length;
  function t(id, href, label, icon, badge) {
    return '<a href="' + href + '" data-replace="1"' + (cur === id ? ' aria-current="page"' : '') + '><span class="badge">' + icon + (badge ? '<i>' + badge + '</i>' : '') + '</span>' + label + '</a>';
  }
  return '<nav class="tabs" aria-label="Main"><span class="side-brand" aria-hidden="true"><img src="logo.jpg" alt="" width="52" height="52">Savor by Sree</span>' + t('orders', '#/orders', 'Orders', I.orders, pend) + t('today', '#/today', 'Today', I.today) + t('menu', '#/menu', 'Website', I.menu) + t('more', '#/more', 'More', I.more) + '</nav>';
}
function topBack(title, sub, right) {
  return '<header class="top"><div class="top-row top-inner"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button><div class="grow">' + (sub ? '<div class="sub">' + esc(sub) + '</div>' : '') + '<h1>' + esc(title) + '</h1></div>' + (right || '') + '</div></header>';
}
function toast(msg) { var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2600); }
var modalButtons = [];
function modal(opts) {
  var el = document.getElementById('modal');
  modalButtons = opts.buttons || [];
  el.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mTitle"><h2 id="mTitle">' + esc(opts.title) + '</h2>' + (opts.text ? '<p>' + esc(opts.text) + '</p>' : '') + (opts.html || '') +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">' + modalButtons.map(function (b, i) {
      if (b.href) return '<a class="btn block ' + (b.kind || '') + '" href="' + esc(b.href) + '" target="_blank" rel="noopener" data-mb="' + i + '">' + (b.icon || '') + esc(b.label) + '</a>';
      return '<button class="btn block ' + (b.kind || '') + '" data-mb="' + i + '">' + (b.icon || '') + esc(b.label) + '</button>';
    }).join('') + '</div></div>';
  el.hidden = false;
  var f = el.querySelector('textarea,input,[data-mb]'); if (f) setTimeout(function () { f.focus(); }, 50);
}
function closeModal() { var el = document.getElementById('modal'); el.hidden = true; el.innerHTML = ''; if (ui.pendingRender) { ui.pendingRender = false; setTimeout(rerender, 0); } }
function ask(title, text, okLabel, fn, kind) { modal({ title: title, text: text, buttons: [{ label: okLabel, kind: kind || '', fn: fn }, { label: 'Cancel', kind: 'ghost' }] }); }

/* Routing: the address bar's #/… normally; an in-page history when SBS_MEMORY_ROUTER is set (preview pages). */
var MEM = !!window.SBS_MEMORY_ROUTER, stack = ['/orders'];
function curRoute() { return MEM ? stack[stack.length - 1] : (location.hash.replace(/^#/, '') || '/orders'); }
function go(h, replace) {
  h = String(h).replace(/^#/, '');
  if (MEM) { if (replace) stack[stack.length - 1] = h; else stack.push(h); ui.navCount++; render(); return; }
  if (replace) location.replace('#' + h); else location.hash = h;
}
function back(fallback) {
  if (MEM) { if (stack.length > 1) { stack.pop(); render(); } else go(fallback || '/orders', true); return; }
  if (history.length > 1 && ui.navCount > 0) history.back(); else go(fallback || '/orders', true);
}

/* ---------- router ---------- */
ui.navCount = 0;
window.addEventListener('hashchange', function () { if (MEM) return; ui.navCount++; render(); });
function render() {
  var h = curRoute();
  var parts = h.split('/').filter(Boolean);
  var r = parts[0];
  var html;
  try {
    if (CLOUD && !net.checked) html = '<main><div class="empty" style="padding-top:30vh">' + I.cake + '<b>Opening your orders…</b></div></main>';
    else if (CLOUD && !net.user) html = viewLogin();
    else if (r === 'orders') html = viewOrders();
    else if (r === 'today') html = viewToday();
    else if (r === 'offers') html = viewOffers();
    else if (r === 'offer') html = viewOfferEdit(parts[1] === 'new' ? null : parts[1]);
    else if (r === 'markets') html = viewMarkets();
    else if (r === 'market') html = viewMarketEdit(parts[1] === 'new' ? null : parts[1]);
    else if (r === 'notices') html = viewNotices();
    else if (r === 'bundle') html = viewBundleEdit(parts[1] === 'new' ? null : parts[1], parts[1] === 'new' ? decodeURIComponent(parts[2] || 'Bundle') : null);
    else if (r === 'sections') html = viewSections();
    else if (r === 'menu' && parts[1] === 'edit') html = viewMenuEdit(parts[2]);
    else if (r === 'menu' && parts[1] === 'new') html = viewMenuEdit(null);
    else if (r === 'menu') html = viewMenu();
    else if (r === 'more') html = viewMore();
    else if (r === 'order') html = viewDetail(parts[1]);
    else if (r === 'new' && parts[1] === 'items') html = viewPicker('new');
    else if (r === 'new') html = viewForm('new');
    else if (r === 'edit' && parts[2] === 'items') html = viewPicker('edit:' + parts[1]);
    else if (r === 'edit') html = viewForm('edit:' + parts[1]);
    else { go('#/orders', true); return; }
  } catch (e) {
    html = '<main><div class="empty"><b>Something went wrong</b><p>' + esc(e.message) + '</p><a class="btn" href="#/orders">Back to orders</a></div></main>';
  }
  if (html == null) return;
  app.innerHTML = html;
  window.scrollTo(0, ui.keepScroll || 0); ui.keepScroll = 0;
  var af = app.querySelector('[data-autofocus]'); if (af) af.focus();
}
function rerender() { ui.keepScroll = window.scrollY; render(); }

/* ---------- Orders ---------- */
function viewOrders() {
  var tab = ui.ordersTab, q = ui.q.trim().toLowerCase();
  var groups = {
    pending: db.orders.filter(function (o) { return o.status === 'pending'; }),
    active: db.orders.filter(function (o) { return o.status === 'confirmed' || o.status === 'ready'; }),
    done: db.orders.filter(function (o) { return o.status === 'delivered' || o.status === 'cancelled'; })
  };
  var list = groups[tab].slice();
  if (q) list = list.filter(function (o) { return [o.name, o.phone, o.ref, o.notes, itemsSummary(o)].join(' ').toLowerCase().indexOf(q) >= 0; });
  if (tab === 'done') list.sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || (b.updatedAt || 0) - (a.updatedAt || 0); });
  else list.sort(sortActive);
  var segs = [['pending', 'To confirm'], ['active', 'Confirmed'], ['done', 'Done']].map(function (s) {
    return '<button data-act="ordersTab" data-v="' + s[0] + '" aria-pressed="' + (tab === s[0]) + '">' + s[1] + ' <em>' + groups[s[0]].length + '</em></button>';
  }).join('');
  return '<header class="top hero"><div class="top-inner"><div class="top-row"><img class="logo" src="logo.jpg" alt="" width="46" height="46"><div class="brand"><b>Savor by Sree</b><small>Orders · ' + esc(fmtDate(today(), true)) + (window.SBS_PREVIEW ? ' · preview with sample orders' : '') + '</small></div></div>' +
    '<label class="search"><span class="sr">Search orders</span>' + I.search + '<input type="search" placeholder="Search name, phone or order no." value="' + esc(ui.q) + '" data-field="q"></label></div></header>' +
    '<main><div class="seg" role="group" aria-label="Order status">' + segs + '</div><div id="olist" style="display:flex;flex-direction:column;gap:12px">' + listHtml(list, tab, q) + '</div></main>' +
    '<a class="fab" href="#/new">' + I.plus + 'New order</a>' + tabsHtml('orders');
}
function listHtml(list, tab, q) {
  var cards = list.slice(0, tab === 'done' ? 80 : 500).map(orderCard).join('');
  if (list.length) return cards;
  return '<div class="empty">' + I.cake + '<b>' + (q ? 'No matching orders' : tab === 'pending' ? 'Nothing to confirm' : tab === 'active' ? 'No confirmed orders' : 'No finished orders yet') + '</b>' +
    (!q && tab === 'pending' ? '<p>When a WhatsApp or Instagram order comes in, tap New order. You can paste the WhatsApp message to fill it in.</p>' + (!db.orders.length && !CLOUD ? '<button class="btn sm ghost" data-act="samplesAdd">Try it with sample orders</button>' : '') : '') + '</div>';
}
function orderCard(o) {
  var actions = '';
  if (o.status === 'pending') actions = '<div class="btns"><button class="btn sm" data-act="confirm" data-id="' + o.id + '">' + I.check + 'Confirm</button>' + (o.phone ? '<a class="btn sm wa" href="' + esc(waUrl(o.phone)) + '" target="_blank" rel="noopener">' + I.wa + 'Chat</a>' : '') + '</div>';
  else if (o.status === 'confirmed') actions = '<div class="btns"><button class="btn sm ghost" data-act="status" data-v="ready" data-id="' + o.id + '">Mark ready</button><button class="btn sm ghost" data-act="status" data-v="delivered" data-id="' + o.id + '">' + (o.mode === 'delivery' ? 'Delivered' : 'Collected') + '</button></div>';
  else if (o.status === 'ready') actions = '<div class="btns"><button class="btn sm" data-act="status" data-v="delivered" data-id="' + o.id + '">' + (o.mode === 'delivery' ? 'Delivered' : 'Collected') + '</button></div>';
  return '<article class="card order-card st-' + o.status + '"><a class="body" href="#/order/' + o.id + '">' +
    '<div class="row">' + sourcePill(o.source) + '<span class="ref">' + esc(o.ref) + '</span><span class="total">' + esc(totalLabel(o)) + '</span></div>' +
    '<div class="who"><span class="avatar" aria-hidden="true">' + esc((o.name || '?').trim().charAt(0).toUpperCase() || '?') + '</span><div class="name">' + esc(o.name || 'No name') + '</div></div><div class="items-line">' + esc(itemsSummary(o)) + '</div>' +
    '<div class="meta">' + I.cal + '<span>' + esc(fmtDate(o.date)) + (slotOf(o) ? ', ' + esc(slotOf(o)) : '') + '</span><span aria-hidden="true">·</span><span>' + (o.mode === 'delivery' ? 'Delivery' : 'Collection') + '</span>' +
    (o.status === 'ready' || o.status === 'cancelled' ? statusPill(o.status) : '') + '</div>' +
    (o.status !== 'cancelled' ? '<div class="money-line"><span>Total <b>' + esc(totalLabel(o)) + '</b></span><span>Collected <b class="ok">' + money(collected(o)) + '</b></span><span>Pending <b class="' + (pendingAmt(o) > 0 ? 'due' : 'ok') + '">' + money(pendingAmt(o)) + '</b></span></div>' : '') +
    '</a>' + actions + '</article>';
}

/* ---------- Order detail ---------- */
function viewDetail(id) {
  var o = getOrder(id);
  if (!o) return topBack('Order not found') + '<main><div class="empty"><b>This order was deleted</b><a class="btn" href="#/orders">Back to orders</a></div></main>';
  var order = ['pending', 'confirmed', 'ready', 'delivered'];
  var idx = order.indexOf(o.status);
  var steps = '<div class="steps" aria-hidden="true">' + order.map(function (s, i) { return '<i class="' + (idx >= i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
  var lines = (o.items || []).map(function (l) {
    return '<div class="line"><div class="grow"><div class="nm">' + l.qty + ' × ' + esc(l.name) + '</div>' + (optText(l) ? '<div class="op">' + esc(optText(l)) + '</div>' : '') + '</div><b>' + money(num(l.price) * l.qty) + '</b></div>';
  }).join('') || '<p class="hint">No items</p>';
  var sums = '<div class="sum"><span>Items</span><b>' + money(subtotal(o)) + '</b></div>' +
    (discountAmt(o) ? '<div class="sum disc"><span>' + esc(discountLabel(o)) + '</span><b>−' + money(discountAmt(o)) + '</b></div>' : '') +
    (o.mode === 'delivery' ? '<div class="sum"><span>Delivery</span><b>' + (o.fee === '' || o.fee == null ? 'Not set' : money(num(o.fee))) + '</b></div>' : '') +
    '<div class="sum big"><span>Total</span><span>' + esc(totalLabel(o)) + '</span></div>';
  var main = '';
  if (o.status === 'pending') main = '<button class="btn block" data-act="confirm" data-id="' + o.id + '">' + I.check + 'Confirm order</button>';
  else if (o.status === 'confirmed') main = '<button class="btn block" data-act="status" data-v="ready" data-id="' + o.id + '">Mark ready</button>';
  else if (o.status === 'ready') main = '<button class="btn block" data-act="status" data-v="delivered" data-id="' + o.id + '">' + I.check + (o.mode === 'delivery' ? 'Mark delivered' : 'Mark collected') + '</button>';
  else main = '<button class="btn block ghost" data-act="status" data-v="confirmed" data-id="' + o.id + '">Reopen order</button>';
  var links = '<div class="links">' +
    '<a class="btn sm wa" href="' + esc(waUrl(o.phone)) + '" target="_blank" rel="noopener">' + I.wa + 'WhatsApp</a>' +
    (o.phone ? '<a class="btn sm ghost" href="tel:' + esc(String(o.phone).replace(/[^\d+]/g, '')) + '">' + I.phone + 'Call</a>' : '') +
    (o.mode === 'delivery' && o.address ? '<a class="btn sm ghost" href="' + esc(mapsUrl(o.address)) + '" target="_blank" rel="noopener">' + I.pin + 'Maps</a>' : '') + '</div>';
  var msgs = '<div class="btns">' +
    '<a class="btn sm ghost" href="' + esc(waUrl(o.phone, fillTemplate(db.settings.confirmMsg, o))) + '" target="_blank" rel="noopener">Send confirmation</a>' +
    '<a class="btn sm ghost" href="' + esc(waUrl(o.phone, fillTemplate(o.mode === 'delivery' && o.status === 'ready' ? db.settings.onwayMsg : db.settings.readyMsg, o))) + '" target="_blank" rel="noopener">' + (o.mode === 'delivery' && o.status === 'ready' ? 'On my way' : 'Ready message') + '</a></div>';
  return topBack(o.name || 'No name', o.ref + ' · ' + sourceLabel(o.source), statusPill(o.status)) +
    '<main class="has-bar">' +
    '<section class="card" style="display:flex;flex-direction:column;gap:12px">' + steps +
      '<dl class="kv"><div><dt>' + (o.mode === 'delivery' ? 'Delivery' : 'Collection') + '</dt><dd>' + esc(fmtDate(o.date, true)) + '</dd></div><div><dt>Time</dt><dd>' + esc(slotOf(o) || 'Not set') + '</dd></div>' +
      '<div><dt>Phone</dt><dd>' + esc(o.phone || 'Not added') + '</dd></div><div><dt>Payment</dt><dd style="color:' + (isPaid(o) ? 'var(--green)' : 'var(--warn)') + '">' + (payState(o) === 'paid' ? 'Paid' : payState(o) === 'part' ? 'Part paid' : 'Not paid yet') + '</dd></div>' +
      (o.mode === 'delivery' ? '<div style="grid-column:1/-1"><dt>Address / Eircode</dt><dd>' + esc(o.address || 'Not added') + '</dd></div>' : '') + '</dl>' + links + '</section>' +
    '<section class="card"><div class="section-title" style="margin:0 0 8px">Items</div>' + lines + '<div style="margin-top:8px">' + sums + '</div></section>' +
    (o.notes ? '<section class="card"><div class="section-title" style="margin:0 0 8px">Notes</div><div class="note">' + esc(o.notes) + '</div></section>' : '') +
    '<section class="card" style="display:flex;flex-direction:column;gap:12px"><div class="section-title" style="margin:0">Payment ' + payPill(o) + '</div>' +
      '<div class="paygrid"><div><small>Total</small><b>' + esc(totalLabel(o)) + '</b></div><div><small>Collected</small><b class="ok">' + money(collected(o)) + '</b></div><div><small>Pending</small><b class="' + (pendingAmt(o) > 0 ? 'due' : 'ok') + '">' + money(pendingAmt(o)) + '</b></div></div>' +
      payRowsHtml(o, 'payRemove') +
      (CLOUD && net.v25 === false ? '<p class="hint warn-note">Payment methods and discounts are only kept on this phone until the database update is run in Supabase.</p>' : '') +
      (pendingAmt(o) > 0 ? '<div class="btns"><button class="btn sm" data-act="payAdd" data-id="' + o.id + '">' + I.plus + 'Record payment</button><button class="btn sm ghost" data-act="payFull" data-id="' + o.id + '">Paid in full</button></div>' : '') + '</section>' +
    '<section class="card" style="display:flex;flex-direction:column;gap:10px"><div class="section-title" style="margin:0">Message the customer</div>' + msgs + '</section>' +
    '<button class="btn block ghost" data-act="statusPick" data-id="' + o.id + '">Change status</button>' +
    '<div class="btns"><a class="btn ghost" href="#/edit/' + o.id + '">Edit order</a><button class="btn danger" data-act="cancelOrder" data-id="' + o.id + '">' + (o.status === 'cancelled' ? 'Delete' : 'Cancel order') + '</button></div>' +
    (o.status !== 'cancelled' ? '<button class="btn sm ghost" data-act="deleteOrder" data-id="' + o.id + '" style="align-self:center;border:0;color:var(--red);background:transparent">Delete permanently</button>' : '') +
    '<p class="hint" style="text-align:center;font-size:12px;color:var(--muted);margin:0">Added ' + esc(new Date(o.createdAt || Date.now()).toLocaleString('en-IE', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })) + '</p>' +
    '</main><div class="bar">' + main + '</div>';
}

/* ---------- Add / edit form ---------- */
function formPayCard(d) {
  var head = '<section class="card" style="display:flex;flex-direction:column;gap:12px"><div class="section-title" style="margin:0">Payment</div>';
  var nums = function (got) { return '<div class="paygrid"><div><small>Total</small><b id="fpTot">' + esc(totalLabel(d)) + '</b></div><div><small>Collected</small><b class="ok" id="fpGot">' + money(got) + '</b></div><div><small>Pending</small><b class="due" id="fpDue">' + money(Math.max(0, orderTotal(d) - got)) + '</b></div></div>'; };
  if (collected(d) > 0) /* payments already recorded on this order */
    return head + nums(collected(d)) + payRowsHtml(d, 'draftPayRemove') + '<button class="btn block ghost" data-act="draftPayAdd">' + I.plus + 'Add another payment</button></section>';
  var plan = d.payPlan || 'none', got = plan === 'full' ? orderTotal(d) : plan === 'deposit' ? num(d.payAmt) : 0;
  var chips = PAY_METHODS.map(function (m) { return '<button type="button" class="chip" data-act="fPayMethod" data-v="' + m + '" aria-pressed="' + (d.payMethod === m) + '">' + m + '</button>'; }).join('');
  return head +
    '<div class="toggle three" role="group" aria-label="Payment so far"><button data-act="payPlan" data-v="none" aria-pressed="' + (plan === 'none') + '">Not paid yet</button><button data-act="payPlan" data-v="deposit" aria-pressed="' + (plan === 'deposit') + '">Deposit</button><button data-act="payPlan" data-v="full" aria-pressed="' + (plan === 'full') + '">Paid in full</button></div>' +
    nums(got) +
    (plan === 'none' ? '' :
      (plan === 'deposit' ? '<div class="field"><label for="fPayAmt">Deposit received (€)</label><input class="input" id="fPayAmt" inputmode="decimal" data-draft="payAmt" value="' + esc(d.payAmt || '') + '" placeholder="e.g. 15"></div>' : '') +
      '<div class="field"><span class="label">Paid by</span><div class="wrap-chips">' + chips + '</div></div>' +
      '<div class="field"><label for="fPayDate">' + (plan === 'deposit' ? 'Deposit received on' : 'Paid on') + '</label><input class="input" id="fPayDate" type="date" data-draft="payDate" value="' + esc(d.payDate || today()) + '"></div>' +
      '<p class="hint" style="margin:0">' + (plan === 'deposit' ? 'When you finish the order, the app asks for the balance and how they paid.' : 'Need two methods? Save, then use Record payment on the order.') + '</p>') +
  '</section>';
}
function viewForm(key) {
  var d = ensureDraft(key);
  if (!d) { go('#/orders', true); return null; }
  var isNew = key === 'new';
  var lead = daysBetween(today(), d.date);
  var srcChips = SOURCES.map(function (s) { return '<button class="chip" data-act="draftSet" data-f="source" data-v="' + s[0] + '" aria-pressed="' + (d.source === s[0]) + '">' + esc(s[1]) + '</button>'; }).join('');
  var lines = d.items.map(function (l, i) {
    return '<div class="line"><div class="grow"><div class="nm">' + esc(l.name) + '</div>' + (l.option ? '<div class="op">' + esc(l.option) + '</div>' : '') +
      '<div class="row" style="margin-top:8px"><div class="stepper"><button data-act="qty" data-i="' + i + '" data-v="-1" aria-label="One less">−</button><span>' + l.qty + '</span><button data-act="qty" data-i="' + i + '" data-v="1" aria-label="One more">+</button></div>' +
      '<label class="price-wrap" style="margin-left:auto"><span class="sr">Price each</span>€<input class="price-in" inputmode="decimal" data-line="' + i + '" value="' + esc(l.price) + '"></label></div></div>' +
      '<button class="icon-btn" data-act="rmLine" data-i="' + i + '" aria-label="Remove ' + esc(l.name) + '">' + I.x + '</button></div>';
  }).join('');
  var slotSel = '<select class="input" id="fSlot" data-draft="slot">' + SLOTS.map(function (s) { return '<option' + (d.slot === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '<option value="other"' + (d.slot === 'other' ? ' selected' : '') + '>Other time…</option></select>';
  return topBack(isNew ? 'New order' : 'Edit order', isNew ? '' : d.ref, isNew ? '<button class="icon-btn" data-act="pasteOpen" aria-label="Paste WhatsApp message">' + I.paste + '</button>' : '') +
    '<main class="has-bar">' +
    (isNew && !draftHasContent(d) ? '<button class="card" data-act="pasteOpen" style="border:1.5px dashed var(--line);display:flex;gap:12px;align-items:center;text-align:left;color:var(--ink)"><span class="mark" style="background:#DCF5E3;color:var(--green)">' + I.paste + '</span><span><b style="display:block;font-size:15px">Paste a WhatsApp order</b><span style="font-size:13px;color:var(--muted)">Copy the website order message in WhatsApp, then tap here to fill everything in.</span></span></button>' : '') +
    (isNew && draftHasContent(d) ? '<div class="row" style="justify-content:space-between"><span class="hint" style="font-size:13px;color:var(--muted)">Unsaved order kept for you</span><button class="btn sm ghost" data-act="discard">Start over</button></div>' : '') +
    '<section class="card" style="display:flex;flex-direction:column;gap:14px">' +
      '<div class="field"><label for="fName">Customer name</label><input class="input" id="fName" data-draft="name" value="' + esc(d.name) + '" autocomplete="off" autocapitalize="words"' + (isNew && !d.name ? ' data-autofocus' : '') + '></div>' +
      '<div class="field"><label for="fPhone">Phone (for WhatsApp replies)</label><input class="input" id="fPhone" data-draft="phone" type="tel" inputmode="tel" value="' + esc(d.phone) + '" placeholder="087 123 4567"></div>' +
      '<div class="field"><span class="label">Came from</span><div class="wrap-chips">' + srcChips + '</div></div>' +
    '</section>' +
    '<section class="card" style="display:flex;flex-direction:column;gap:10px"><div class="section-title" style="margin:0">Items <small>' + money(subtotal(d)) + '</small></div>' +
      (lines || '<p style="margin:0;font-size:14px;color:var(--muted)">No items yet.</p>') +
      '<a class="btn block ghost" href="#/' + (isNew ? 'new' : 'edit/' + d.id) + '/items">' + I.plus + 'Add from menu</a>' +
      '<button class="btn block ghost" data-act="customLine">' + I.plus + 'Add something not on the menu</button></section>' +
    '<section class="card" style="display:flex;flex-direction:column;gap:14px">' +
      '<div class="toggle" role="group" aria-label="Collection or delivery"><button data-act="draftSet" data-f="mode" data-v="collection" aria-pressed="' + (d.mode !== 'delivery') + '">Collection</button><button data-act="draftSet" data-f="mode" data-v="delivery" aria-pressed="' + (d.mode === 'delivery') + '">Delivery</button></div>' +
      '<div class="grid2"><div class="field"><label for="fDate">Date</label><input class="input" id="fDate" type="date" data-draft="date" value="' + esc(d.date) + '"></div><div class="field"><label for="fSlot">Time slot</label>' + slotSel + '</div></div>' +
      (isNew && d.date && lead < (+db.notices.noticeDays || 0) ? '<div class="warn" style="font-size:12px;color:var(--warn);font-weight:600;margin-top:-6px">Less than ' + db.notices.noticeDays + ' days’ notice</div>' : '') +
      (d.date && (db.notices.closedDates || []).indexOf(d.date) >= 0 ? '<div class="warn" style="font-size:12px;color:var(--red);font-weight:600;margin-top:-6px">' + fmtDate(d.date, true) + ' is marked as closed in Website › Notices</div>' : '') +
      (d.slot === 'other' ? '<div class="field"><label for="fSlotO">Time</label><input class="input" id="fSlotO" data-draft="slotOther" value="' + esc(d.slotOther) + '" placeholder="e.g. 4:30 pm"></div>' : '') +
      (d.mode === 'delivery' ? '<div class="field"><label for="fAddr">Delivery address or Eircode</label><input class="input" id="fAddr" data-draft="address" value="' + esc(d.address) + '" autocapitalize="characters"></div>' +
        '<div class="field"><label for="fFee">Delivery fee (€)</label><input class="input" id="fFee" inputmode="decimal" data-draft="fee" value="' + esc(d.fee) + '" placeholder="Leave empty until agreed"></div>' : '') +
      '<div class="field"><label for="fNotes">Notes</label><textarea class="input" id="fNotes" data-draft="notes" placeholder="Allergies, occasion, message on the cake, flavour…">' + esc(d.notes) + '</textarea><span class="hint">Allergies count as health information. Only note them when they matter for this order.</span></div>' +
    '</section>' +
    '<section class="card" style="display:flex;flex-direction:column;gap:12px"><div class="section-title" style="margin:0">Discount <small id="fDisc">' + (discountAmt(d) ? '−' + money(discountAmt(d)) : '') + '</small></div>' +
      '<div class="toggle three" role="group" aria-label="Discount type"><button data-act="discType" data-v="" aria-pressed="' + !d.discount + '">None</button><button data-act="discType" data-v="percent" aria-pressed="' + !!(d.discount && d.discount.type === 'percent') + '">% off</button><button data-act="discType" data-v="amount" aria-pressed="' + !!(d.discount && d.discount.type === 'amount') + '">€ off</button></div>' +
      (d.discount ? '<div class="grid2"><div class="field"><label for="fDiscV">' + (d.discount.type === 'percent' ? 'Percent off' : 'Amount off (€)') + '</label><input class="input" id="fDiscV" inputmode="decimal" data-disc="value" value="' + esc(d.discount.value) + '" placeholder="' + (d.discount.type === 'percent' ? 'e.g. 10' : 'e.g. 5') + '"></div>' +
        '<div class="field"><label for="fDiscN">Reason <small>(optional)</small></label><input class="input" id="fDiscN" data-disc="note" value="' + esc(d.discount.note || '') + '" placeholder="e.g. Friends & family"></div></div>' : '') +
    '</section>' +
    formPayCard(d) +
    '</main><div class="bar"><div class="sum big" style="border:0;margin:0;padding:0"><span>Total</span><span id="fTotal">' + esc(totalLabel(d)) + '</span></div><button class="btn block" data-act="saveOrder">' + I.check + (isNew ? 'Save order' : 'Save changes') + '</button></div>';
}

function viewPicker(key) {
  var d = ensureDraft(key);
  if (!d) { go('#/orders', true); return null; }
  var cat = ui.pickCat;
  var used = {};
  db.menu.forEach(function (it) { if (it.active) used[it.cat] = 1; });
  var cats = menuCats(true).filter(function (c) { return used[c]; });
  db.menu.forEach(function (it) { if (it.active && cats.indexOf(it.cat) < 0) cats.push(it.cat); });
  if (cats.indexOf(cat) < 0) cat = ui.pickCat = cats[0];
  var inCart = {};
  d.items.forEach(function (l) { var k = l.menuId + '|' + String(l.option || '').split(' · ')[0]; inCart[k] = (inCart[k] || 0) + l.qty; });
  var chips = cats.map(function (c) { return '<button class="chip" data-act="pickCat" data-v="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + '</button>'; }).join('');
  var items = db.menu.filter(function (it) { return it.active && it.cat === cat; }).map(function (it) {
    return '<div class="card pick-item"><div class="nm">' + esc(it.name) + '</div>' + (it.includes && it.includes.length > 1 ? '<div style="font-size:12px;color:var(--muted)">' + esc(it.includes.join(' · ')) + '</div>' : '') +
      '<div class="pick-opts">' + it.options.map(function (op, oi) {
        var n = inCart[it.id + '|' + op.label] || 0;
        var of = offerFor(it.id), np = offerPrice(op.price, of);
        return '<div class="pick-opt"><span class="lb">' + esc(op.label) + (of && op.price ? '<br><span class="offer-tag">' + esc(of.title) + '</span>' : '') + '</span><span class="pr">' + (op.price ? (of && np !== op.price ? '<s>' + money(op.price) + '</s> ' + money(np) : money(op.price)) : 'Quote') + '</span><button class="add-btn" data-act="pickAdd" data-id="' + it.id + '" data-o="' + oi + '" aria-label="Add ' + esc(it.name + ' ' + op.label) + '">' + (n ? 'Added ' + n : 'Add') + '</button></div>';
      }).join('') + '</div></div>';
  }).join('');
  var count = d.items.reduce(function (s, l) { return s + l.qty; }, 0);
  return topBack('Add items', d.name || (key === 'new' ? 'New order' : d.ref)) +
    '<main class="has-bar"><div class="chips" role="group" aria-label="Category">' + chips + '</div>' + items + '</main>' +
    '<div class="bar"><button class="btn block" data-act="back">' + I.check + 'Done · ' + count + ' item' + (count === 1 ? '' : 's') + ' · ' + money(subtotal(d)) + '</button></div>';
}

/* ---------- WhatsApp message parser (website order format) ---------- */
function parseMessage(txt) {
  var out = { items: [] }, t = String(txt || '').replace(/\r/g, '');
  var g = function (re) { var mm = t.match(re); return mm ? mm[1].trim() : ''; };
  out.name = g(/^\s*Name\s*:\s*(.+)$/im);
  var phone = g(/^\s*(?:Phone|Mobile|Number)\s*:\s*(.+)$/im); if (phone) out.phone = phone;
  var mode = t.match(/^\s*(Delivery|Collection|Pickup|Pick-up)\s*:\s*(.+)$/im);
  if (mode) {
    out.mode = /deliver/i.test(mode[1]) ? 'delivery' : 'collection';
    var when = mode[2];
    var dm = when.match(/(\d{1,2})\s+([A-Za-z]{3})/);
    if (dm) {
      var mi = MONTHS.map(function (x) { return x.toLowerCase(); }).indexOf(dm[2].toLowerCase());
      if (mi >= 0) {
        var now = new Date(), y = now.getFullYear();
        var cand = new Date(y, mi, +dm[1]);
        if (cand < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60)) cand = new Date(y + 1, mi, +dm[1]);
        out.date = iso(cand);
      }
    }
    var sm = when.match(/(\d{1,2})\s*[–\-]\s*(\d{1,2})\s*pm/i);
    if (sm) { var s = sm[1] + '–' + sm[2] + ' pm'; if (SLOTS.indexOf(s) >= 0) out.slot = s; else { out.slot = 'other'; out.slotOther = s; } }
  }
  out.address = g(/^\s*(?:Delivery address|Address|Eircode)\s*:\s*(.+)$/im);
  var notes = g(/^\s*Notes?\s*:\s*([\s\S]+?)(?:\n\s*(?:Estimated total|Total)\s*:|$)/im);
  if (notes) out.notes = notes;
  t.split('\n').forEach(function (line) {
    var mm = line.match(/^\s*[•\-*·]\s*(\d+)\s*[×xX]\s*(.+?)\s*(?:\((.*)\))?\s*$/);
    if (!mm) return;
    var qty = +mm[1], nm = mm[2].trim(), inside = mm[3] || '';
    var price = 0, label = '';
    var pm = inside.match(/€\s*([\d.,]+)/); if (pm) price = num(pm[1]);
    label = inside.replace(/·?\s*€\s*[\d.,]+/, '').replace(/[·\s]+$/, '').trim();
    var hit = matchMenu(nm, label);
    if (hit) out.items.push({ menuId: hit.item.id, name: hit.item.name, option: hit.opt.label, price: price || hit.opt.price, qty: qty });
    else out.items.push({ menuId: null, name: nm, option: label, price: price, qty: qty });
  });
  if (/savor by sree|place an order/i.test(t)) out.source = 'whatsapp';
  return out;
}
function words(s) { return String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9 ]/g, ' ').replace(/\bcookies?\b|\btray\b|\bcake\b/g, ' ').split(/\s+/).filter(Boolean); }
function matchMenu(name, label) {
  var w = words(name), best = null, bestScore = 0;
  db.menu.forEach(function (it) {
    var iw = words(it.name); if (!iw.length) return;
    var hits = iw.filter(function (x) { return w.indexOf(x) >= 0; }).length;
    if (hits < iw.length) return;
    var score = hits / Math.max(iw.length, w.length) + hits * 0.01;
    if (score > bestScore) { bestScore = score; best = it; }
  });
  if (!best) return null;
  var lw = String(label || '').toLowerCase(), op = best.options[0];
  best.options.forEach(function (o) { var k = o.label.toLowerCase().split(/[ ,(]/)[0]; if (k && lw.indexOf(k) >= 0) op = o; });
  return { item: best, opt: op };
}

/* ---------- Today ---------- */
function viewToday() {
  var day = ui.day, t = today();
  var strip = '';
  for (var i = -1; i < 13; i++) {
    var dd = addDays(t, i), d = parseIso(dd);
    var c = db.orders.filter(function (o) { return o.date === dd && (o.status === 'confirmed' || o.status === 'ready' || o.status === 'pending'); }).length;
    strip += '<button class="day" data-act="day" data-v="' + dd + '" aria-pressed="' + (dd === day) + '" aria-label="' + fmtDate(dd, true) + ', ' + c + ' orders"><small>' + (i === 0 ? 'Today' : DAYS[d.getDay()]) + '</small><b>' + d.getDate() + '</b><i class="' + (c ? '' : 'zero') + '">' + (c || '') + '</i></button>';
  }
  var dayOrders = db.orders.filter(function (o) { return o.date === day && o.status !== 'cancelled'; });
  var live = dayOrders.filter(function (o) { return o.status === 'confirmed' || o.status === 'ready'; }).sort(sortActive);
  var pend = dayOrders.filter(function (o) { return o.status === 'pending'; });
  var done = dayOrders.filter(function (o) { return o.status === 'delivered'; });
  var bake = {}, keys = [];
  live.forEach(function (o) {
    (o.items || []).forEach(function (l) {
      var it = l.menuId ? getItem(l.menuId) : null;
      var parts = it && it.includes && it.includes.length && it.cat === 'Bundles' ? it.includes : [l.name + (optText(l) ? ' · ' + optText(l) : '')];
      parts.forEach(function (p) { if (!bake[p]) { bake[p] = { qty: 0, who: [] }; keys.push(p); } bake[p].qty += l.qty; if (bake[p].who.indexOf(o.name) < 0) bake[p].who.push(o.name); });
    });
  });
  var ticks = db.bake[day] || {};
  var doneCount = keys.filter(function (k) { return ticks[k]; }).length;
  var bakeHtml = keys.length ? keys.map(function (k, i) {
    return '<label class="check" style="align-items:flex-start;padding:6px 0"><input type="checkbox" data-act="bake" data-k="' + esc(k) + '"' + (ticks[k] ? ' checked' : '') + ' style="margin-top:2px"><span class="grow"><b>' + bake[k].qty + ' × ' + esc(k) + '</b><br><span style="font-size:12px;color:var(--muted);font-weight:500">' + esc(bake[k].who.join(', ')) + '</span></span></label>';
  }).join('') : '<p style="margin:0;font-size:14px;color:var(--muted)">Nothing confirmed to bake for this day.</p>';
  var hand = live.map(function (o) {
    var s = slotOf(o), sm = s.match(/^(\d{1,2}–\d{1,2})\s*(pm|am)?/i);
    return '<article class="card" style="display:flex;flex-direction:column;gap:10px"><a href="#/order/' + o.id + '" class="row" style="text-decoration:none;color:var(--ink);align-items:center">' +
      '<div class="slot"><b>' + esc(sm ? sm[1] : (s || '–')) + '</b><small>' + esc(sm && sm[2] ? sm[2].toUpperCase() : '') + '</small></div>' +
      '<div class="grow"><div class="name" style="font-size:15px">' + esc(o.name) + '</div><div style="font-size:13px;color:var(--muted)">' + (o.mode === 'delivery' ? 'Delivery' + (o.address ? ' · ' + esc(o.address) : '') : 'Collection') + '</div></div>' +
      payPill(o) + '</a>' +
      '<div class="btns">' + (o.mode === 'delivery' ? (o.address ? '<a class="btn sm ghost" href="' + esc(mapsUrl(o.address)) + '" target="_blank" rel="noopener">' + I.pin + 'Maps</a>' : '') + '<a class="btn sm wa" href="' + esc(waUrl(o.phone, fillTemplate(db.settings.onwayMsg, o))) + '" target="_blank" rel="noopener">' + I.wa + 'On my way</a>'
        : '<a class="btn sm wa" href="' + esc(waUrl(o.phone, fillTemplate(db.settings.readyMsg, o))) + '" target="_blank" rel="noopener">' + I.wa + 'Ready</a>') +
      '<button class="btn sm" data-act="status" data-v="delivered" data-id="' + o.id + '">' + (o.mode === 'delivery' ? 'Delivered' : 'Collected') + '</button></div></article>';
  }).join('');
  var due = live.reduce(function (s, o) { return s + orderTotal(o); }, 0);
  return '<header class="top hero"><div class="top-inner"><div class="top-row"><div class="brand"><b>' + esc(fmtDate(day, true)) + '</b><small>' + live.length + ' to hand over · ' + done.length + ' done · ' + money(due) + '</small></div>' +
    (day !== t ? '<button class="btn sm ghost" data-act="day" data-v="' + t + '">Today</button>' : '') + '</div><div class="days" role="group" aria-label="Pick a day">' + strip + '</div></div></header>' +
    '<main>' + (pend.length ? '<a class="card" href="#/orders" data-act="ordersTabGo" style="text-decoration:none;color:var(--warn);font-weight:700;font-size:14px;background:var(--paper)">' + pend.length + ' order' + (pend.length > 1 ? 's' : '') + ' for this day still to confirm</a>' : '') +
    '<section class="card"><div class="section-title" style="margin:0 0 6px">Bake list <small>' + (keys.length ? doneCount + ' of ' + keys.length + ' done' : '') + '</small></div>' + bakeHtml + '</section>' +
    '<div class="section-title">Hand-overs</div>' + (hand || '<div class="card" style="font-size:14px;color:var(--muted)">No collections or deliveries for this day.</div>') + '</main>' + tabsHtml('today');
}

/* ---------- Menu ---------- */
function viewMenu() {
  var cats = menuCats(false), cat = cats.indexOf(ui.menuCat) >= 0 ? ui.menuCat : (ui.menuCat = cats[0]);
  var chips = cats.map(function (c) { var n = db.menu.filter(function (it) { return it.cat === c; }).length; return '<button class="chip" data-act="menuCat" data-v="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + ' <small>' + n + '</small></button>'; }).join('');
  var rows = db.menu.filter(function (it) { return it.cat === cat; }).map(function (it) {
    return '<article class="card menu-row' + (it.active ? '' : ' off') + '"><a href="#/menu/edit/' + it.id + '"><span class="nm">' + esc(it.name) + (it.badge ? ' <span class="pill p-ready" style="height:20px;font-size:11px">' + esc(it.badge) + '</span>' : '') + ((it.tags || []).indexOf('Contains alcohol') >= 0 ? ' <span class="pill p-cancelled" style="height:20px;font-size:11px">Alcohol</span>' : '') + (it.seasonal && !it.badge ? ' <span class="pill p-pending" style="height:20px;font-size:11px">Seasonal</span>' : '') + '</span><span class="pr">' +
      esc(it.options.map(function (o) { return o.label + ' ' + (o.price ? money(o.price) : 'quote'); }).join(' · ')) + '</span>' + (it.allergens && it.allergens.length ? '<span class="pr" style="color:var(--muted);font-size:12px">Contains: ' + esc(it.allergens.join(', ')) + '</span>' : '') + '</a>' +
      '<label class="sw"><input type="checkbox" data-act="menuActive" data-id="' + it.id + '"' + (it.active ? ' checked' : '') + '>' + (it.active ? 'On' : 'Off') + '</label></article>';
  }).join('') || '<div class="empty"><b>No items in ' + esc(cat) + '</b></div>';
  return siteHeader('menu', '<a class="btn sm ghost" href="#/sections">Sections</a><a class="btn sm" href="#/menu/new">' + I.plus + 'Item</a>', '<div class="chips" role="group" aria-label="Category" style="margin-top:12px">' + chips + '</div>') + '<main><p class="intro">Items switched off are hidden on the website and when adding orders. Bundles, hampers and packs are under Offers. To add a new heading, like “Mini Cookies”, tap Sections.</p>' + rows + '</main>' + tabsHtml('menu');
}
function viewMenuEdit(id) {
  var it = id ? getItem(id) : null;
  if (id && !it) { go('#/menu', true); return null; }
  if (it && it.cat === 'Bundles') { go('#/bundle/' + it.id, true); return null; }
  var v = it || { name: '', cat: ui.menuCat, options: [{ label: 'Pack of 4', price: '' }], includes: [], active: true, seasonal: false };
  var cats = menuCats(false);
  var optRows = v.options.map(function (o, i) {
    return '<div class="opt-row"><input class="input" data-opt="label" data-i="' + i + '" value="' + esc(o.label) + '" placeholder="Size, e.g. Sharing tray" aria-label="Size ' + (i + 1) + '"><label class="price-wrap">€<input class="price-in" inputmode="decimal" data-opt="price" data-i="' + i + '" value="' + esc(o.price) + '" aria-label="Price ' + (i + 1) + '"></label></div>';
  }).join('');
  return topBack(it ? 'Edit item' : 'New item', it ? it.cat : '') +
    '<main class="has-bar"><form id="menuForm" class="card" style="display:flex;flex-direction:column;gap:14px" onsubmit="return false">' +
    '<div class="field"><label for="mName">Name</label><input class="input" id="mName" name="name" value="' + esc(v.name) + '"' + (it ? '' : ' data-autofocus') + '></div>' +
    '<div class="field"><label for="mCat">Section</label><select class="input" id="mCat" name="cat">' + cats.map(function (c) { var sx = sections().filter(function (x) { return x.key === c; })[0]; return '<option value="' + esc(c) + '"' + (c === v.cat ? ' selected' : '') + '>' + esc(sx ? sx.title : c) + '</option>'; }).join('') + '</select><span class="hint">Need a new heading? Add it under Menu › Sections first.</span></div>' +
    '<div class="field"><span class="label">Sizes and prices</span><div id="optRows" style="display:flex;flex-direction:column;gap:8px">' + optRows + '</div><button type="button" class="btn sm ghost" data-act="addOptRow">' + I.plus + 'Add a size</button><span class="hint">Leave the price at 0 for “by quote”. Clear a size’s name to remove it.</span></div>' +
    '<div class="field"><label for="mDesc">Description (shown on the website)</label><textarea class="input" id="mDesc" name="description" placeholder="e.g. Rich chocolate brownie with walnuts">' + esc(v.description || '') + '</textarea></div>' +
    '<div class="field"><span class="label">Allergens</span><div class="wrap-chips" id="allergenChips">' + ALLERGENS.map(function (a) { var on = (v.allergens || []).indexOf(a) >= 0; return '<label class="chip" style="cursor:pointer"><input type="checkbox" name="allergen" value="' + a + '"' + (on ? ' checked' : '') + ' style="accent-color:var(--brown)">' + a + '</label>'; }).join('') + '</div><span class="hint">The 14 EU allergens. Shown on the website menu.</span></div>' +
    '<div class="field"><label for="mBadge">Badge on the website (optional)</label><input class="input" id="mBadge" name="badge" list="badgeList" value="' + esc(v.badge || '') + '" placeholder="e.g. Best seller"><datalist id="badgeList">' + BADGES.concat(['Save €3', 'Save €4']).map(function (b) { return '<option value="' + esc(b) + '">'; }).join('') + '</datalist></div>' +
    '<label class="check"><input type="checkbox" name="alcohol"' + ((v.tags || []).indexOf('Contains alcohol') >= 0 ? ' checked' : '') + '>Contains alcohol</label>' +
    '<label class="check"><input type="checkbox" name="seasonal"' + (v.seasonal ? ' checked' : '') + '>Seasonal item</label>' +
    '<label class="check"><input type="checkbox" name="active"' + (v.active ? ' checked' : '') + '>Available for orders</label>' +
    '</form>' + (it ? '<button class="btn danger block" data-act="menuDelete" data-id="' + it.id + '">Delete item</button>' : '') +
    '</main><div class="bar"><button class="btn block" data-act="menuSave" data-id="' + (it ? it.id : '') + '">' + I.check + 'Save item</button></div>';
}

/* ---------- Login ---------- */
function viewLogin() {
  return '<main class="login-page"><div class="login-inner">' +
    '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center"><img class="login-logo" src="logo.jpg" alt="Savor by Sree, Sweet Atelier" width="150" height="150"><span class="login-tag">Orders</span></div>' +
    '<form id="loginForm" class="card" style="display:flex;flex-direction:column;gap:14px" novalidate>' +
      '<div class="field"><label for="lEmail">Email</label><input class="input" id="lEmail" type="email" autocomplete="username" inputmode="email" autocapitalize="none" spellcheck="false"></div>' +
      '<div class="field"><label for="lPass">Password</label><input class="input" id="lPass" type="password" autocomplete="current-password"></div>' +
      '<p id="lErr" role="alert" style="margin:0;font-size:14px;color:var(--red);font-weight:600;min-height:1em"></p>' +
      '<button class="btn block" id="lBtn" type="submit">Log in</button>' +
      '<p style="margin:0;font-size:13px;color:var(--muted);line-height:1.5;text-align:center">You stay logged in on this device until you log out.</p>' +
    '</form></div></main>';
}

/* ---------- Website: offers, markets, notices ---------- */
function siteHeader(cur, right, extra) {
  var tabs = [['menu', '#/menu', 'Menu'], ['offers', '#/offers', 'Offers'], ['markets', '#/markets', 'Markets'], ['notices', '#/notices', 'Notices']].map(function (x) {
    return '<a class="segl" href="' + x[1] + '" data-replace="1"' + (x[0] === cur ? ' aria-current="page"' : '') + '>' + x[2] + '</a>';
  }).join('');
  return '<header class="top hero"><div class="top-inner"><div class="top-row"><div class="brand"><b>Website</b><small>Changes show on the website straight away</small></div>' + (right || '') + '</div>' +
    '<nav class="segnav" aria-label="Website sections">' + tabs + '</nav>' + (extra || '') + '</div></header>' +
    (CLOUD && net.user && net.siteReady === false && cur !== 'menu' ? '<div class="setup-warn" role="alert">Offers, markets and notices need the latest setup code in Supabase. Run it in the SQL Editor, then tap Refresh on the More page.</div>' : '');
}
function viewOffers() {
  var bundles = db.menu.filter(function (it) { return it.cat === 'Bundles'; });
  var bcards = bundles.map(function (it) {
    var ty = bundleType(it), p = (it.options[0] || {}).price;
    return '<article class="card menu-row' + (it.active ? '' : ' off') + '"><a href="#/bundle/' + it.id + '"><span class="nm">' + esc(it.name) + ' <span class="pill ' + (ty === 'Hamper' ? 'p-pending' : ty === 'Pack' ? 'p-ready' : 'p-confirmed') + '" style="height:20px;font-size:11px">' + ty + '</span>' + (it.badge ? ' <span class="pill p-delivered" style="height:20px;font-size:11px">' + esc(it.badge) + '</span>' : '') + '</span>' +
      '<span class="pr">' + (p ? money(p) : 'No price') + ' · ' + (it.includes || []).length + ' line' + ((it.includes || []).length === 1 ? '' : 's') + '</span>' +
      '<span class="pr" style="color:var(--muted);font-size:12px">' + esc((it.includes || []).slice(0, 3).join(' · ') + ((it.includes || []).length > 3 ? ' …' : '')) + '</span></a>' +
      '<label class="sw"><input type="checkbox" data-act="menuActive" data-id="' + it.id + '"' + (it.active ? ' checked' : '') + '>' + (it.active ? 'On site' : 'Hidden') + '</label></article>';
  }).join('') || '<div class="card" style="font-size:14px;color:var(--muted)">No bundles yet.</div>';
  var list = db.offers.slice().sort(function (a, b) { return (b.startsOn || '').localeCompare(a.startsOn || ''); });
  var dcards = list.map(function (of) {
    var st = offerState(of), n = (of.itemIds || []).length;
    return '<article class="card menu-row' + (of.active ? '' : ' off') + '"><a href="#/offer/' + of.id + '"><span class="nm">' + esc(of.title) + ' <span class="pill ' + st[1] + '" style="height:20px;font-size:11px">' + esc(st[0]) + '</span></span>' +
      '<span class="pr">' + esc(offerLabel(of)) + (n ? ' · ' + n + ' item' + (n > 1 ? 's' : '') : ' · shown on the website only') + '</span>' +
      '<span class="pr" style="color:var(--muted);font-size:12px">' + esc((of.startsOn ? fmtDate(of.startsOn, true) : 'From now') + ' – ' + (of.endsOn ? fmtDate(of.endsOn, true) : 'no end date')) + '</span></a>' +
      '<label class="sw"><input type="checkbox" data-act="offerActive" data-id="' + of.id + '"' + (of.active ? ' checked' : '') + '>' + (of.active ? 'On' : 'Off') + '</label></article>';
  }).join('') || '<div class="card" style="font-size:14px;color:var(--muted)">No discounts running. Nothing shows on the website until you add one.</div>';
  return siteHeader('offers', '<button class="btn sm" data-act="offerNew">' + I.plus + 'New</button>') +
    '<main><div class="section-title">Bundles, hampers &amp; packs <small>' + bundles.length + '</small></div>' + bcards +
    '<div class="section-title">Discounts <small>' + list.length + '</small></div>' + dcards + '</main>' + tabsHtml('menu');
}
function bundleType(it) { var t = it.tags || []; return t.indexOf('Hamper') >= 0 ? 'Hamper' : t.indexOf('Pack') >= 0 ? 'Pack' : 'Bundle'; }
function viewBundleEdit(id, type) {
  var it = id ? getItem(id) : null;
  if (id && !it) { go('#/offers', true); return null; }
  var key = id || 'new:' + (type || 'Bundle');
  if (!ui.bDraft || ui.bDraft._for !== key) {
    ui.bDraft = it ? { type: bundleType(it), name: it.name, description: it.description || '', price: (it.options[0] || {}).price || '', badge: it.badge || '', seasonal: !!it.seasonal, active: it.active !== false,
      lines: (it.includes || []).map(function (s) { var mm = String(s).match(/^(\d+)\s*[×x]\s*(.+)$/); return mm ? { qty: +mm[1], text: mm[2] } : { qty: 1, text: s }; }) }
      : { type: type || 'Bundle', name: '', description: '', price: '', badge: '', seasonal: type === 'Hamper', active: true, lines: [{ qty: 1, text: '' }, { qty: 1, text: '' }] };
    if (!ui.bDraft.lines.length) ui.bDraft.lines.push({ qty: 1, text: '' });
    ui.bDraft._for = key;
  }
  var v = ui.bDraft;
  var types = ['Bundle', 'Hamper', 'Pack'].map(function (t) { return '<button type="button" data-act="bType" data-v="' + t + '" aria-pressed="' + (v.type === t) + '">' + t + '</button>'; }).join('');
  var lines = v.lines.map(function (l, i) {
    return '<div class="opt-row"><label class="sr" for="blq' + i + '">Quantity ' + (i + 1) + '</label><input class="input" id="blq' + i + '" style="width:64px;flex:none;text-align:center" inputmode="numeric" data-bl="qty" data-i="' + i + '" value="' + esc(l.qty) + '">' +
      '<label class="sr" for="blt' + i + '">Item ' + (i + 1) + '</label><input class="input" id="blt' + i + '" data-bl="text" data-i="' + i + '" value="' + esc(l.text) + '" placeholder="e.g. Pack of 4 Chocochip NYC cookies">' +
      '<button type="button" class="icon-btn" data-act="blDel" data-i="' + i + '" aria-label="Remove line ' + (i + 1) + '">' + I.x + '</button></div>';
  }).join('');
  return topBack(it ? 'Edit ' + v.type.toLowerCase() : 'New ' + v.type.toLowerCase(), 'Website › Offers') +
    '<main class="has-bar"><form id="bundleForm" class="card" style="display:flex;flex-direction:column;gap:14px" onsubmit="return false">' +
    '<div class="field"><span class="label">Type</span><div class="toggle" role="group" aria-label="Type">' + types + '</div></div>' +
    '<div class="field"><label for="bName">Name</label><input class="input" id="bName" data-bd="name" value="' + esc(v.name) + '" placeholder="e.g. Movie Night Box"' + (it ? '' : ' data-autofocus') + '></div>' +
    '<div class="field"><label for="bDesc">Short description</label><textarea class="input" id="bDesc" data-bd="description" placeholder="e.g. Cookies and brownies to share, in one order.">' + esc(v.description) + '</textarea></div>' +
    '<div class="field"><span class="label">What’s inside</span><span class="hint">Type each line yourself: how many, and what.</span><div style="display:flex;flex-direction:column;gap:8px">' + lines + '</div><button type="button" class="btn sm ghost" data-act="blAdd">' + I.plus + 'Add a line</button></div>' +
    '<div class="grid2"><div class="field"><label for="bPrice">Price (€)</label><input class="input" id="bPrice" inputmode="decimal" data-bd="price" value="' + esc(v.price) + '"></div><div class="field"><label for="bBadge">Badge (optional)</label><input class="input" id="bBadge" data-bd="badge" list="bBadgeList" value="' + esc(v.badge) + '" placeholder="e.g. Save €4"><datalist id="bBadgeList"><option value="Save €3"><option value="Save €4"><option value="Season special"><option value="Best seller"></datalist></div></div>' +
    '<label class="check"><input type="checkbox" data-bd="seasonal"' + (v.seasonal ? ' checked' : '') + '>Seasonal</label>' +
    '<label class="check"><input type="checkbox" data-bd="active"' + (v.active ? ' checked' : '') + '>Show on the website and when adding orders</label>' +
    '</form>' + (it ? '<button class="btn danger block" data-act="bundleDelete" data-id="' + it.id + '">Delete ' + v.type.toLowerCase() + '</button>' : '') +
    '</main><div class="bar"><button class="btn block" data-act="bundleSave" data-id="' + (it ? it.id : '') + '">' + I.check + 'Save ' + v.type.toLowerCase() + '</button></div>';
}
/* ---------- Menu sections ---------- */
var DEFAULT_SECTIONS = [
  { key: 'Cookies', id: 'cookies', title: 'Chunky NYC Cookies', line: 'Gooey in the middle, crisp at the edges.', active: true },
  { key: 'Brownies', id: 'brownies', title: 'Brownies', line: 'Fudgy, rich and made to order.', active: true },
  { key: 'Cheesecakes', id: 'cheesecakes', title: 'Cheesecakes', line: 'Creamy, baked fresh, never from a shelf.', active: true },
  { key: 'Basque', id: 'basque', title: 'Burnt Basque Cheesecakes', line: 'Burnt on top, silky inside.', active: true },
  { key: 'Tiramisu', id: 'tiramisu', title: 'Tiramisu', line: 'Layered by hand and set overnight.', active: true },
  { key: 'Tres Leches', id: 'tresleches', title: 'Tres Leches', line: 'Soaked in three milks, topped with fruit.', active: true },
  { key: 'Savoury', id: 'savoury', title: 'Savoury Bakes', line: 'Savoury bakes with an Indian and global twist.', active: true },
  { key: 'Cakes', id: 'cakes', title: 'Celebration Cakes', line: 'Celebration cakes, made your way.', active: true }];
function sections() { return db.sections && db.sections.length ? db.sections : DEFAULT_SECTIONS; }
function menuCats(withBundles) {
  var out = sections().map(function (x) { return x.key; });
  db.menu.forEach(function (it) { if (it.cat !== 'Bundles' && it.cat !== 'Add-ons' && out.indexOf(it.cat) < 0) out.push(it.cat); });
  out.push('Add-ons'); if (withBundles) out.unshift('Bundles');
  return out;
}
function saveSections(list, undo) {
  var before = db.sections; db.sections = list;
  remote(CLOUD && sb.from('site_content').upsert({ key: 'sections', value: list }), function () { db.sections = before; if (undo) undo(); });
}
function viewSections() {
  var list = sections();
  var cards = list.map(function (x, i) {
    var n = db.menu.filter(function (it) { return it.cat === x.key; }).length;
    return '<article class="card" style="display:flex;gap:10px;align-items:center' + (x.active === false ? ';opacity:.6' : '') + '"><div class="grow" style="display:flex;flex-direction:column;gap:3px"><span style="font-weight:700;font-size:15px">' + esc(x.title) + '</span><span style="font-size:13px;color:#4A3218">Tab: ' + esc(x.key) + ' · ' + n + ' item' + (n === 1 ? '' : 's') + (x.active === false ? ' · hidden' : '') + '</span>' + (x.line ? '<span style="font-size:12px;color:var(--muted)">' + esc(x.line) + '</span>' : '') + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:4px"><button class="icon-btn" data-act="secMove" data-i="' + i + '" data-v="-1" aria-label="Move ' + esc(x.title) + ' up"' + (i === 0 ? ' disabled' : '') + '>▲</button><button class="icon-btn" data-act="secMove" data-i="' + i + '" data-v="1" aria-label="Move ' + esc(x.title) + ' down"' + (i === list.length - 1 ? ' disabled' : '') + '>▼</button></div>' +
      '<button class="btn sm ghost" data-act="secEdit" data-i="' + i + '">Edit</button></article>';
  }).join('');
  return topBack('Menu sections', 'Website › Menu', '<button class="btn sm" data-act="secEdit" data-i="-1">' + I.plus + 'Section</button>') +
    '<main><p class="intro">Sections are the headings on the website menu, like “Chunky NYC Cookies”. The order here is the order on the website.</p>' + cards + '</main>';
}
function viewOfferEdit(id) {
  var of = id ? byId(db.offers, id) : null;
  if (id && !of) { go('#/offers', true); return null; }
  var v = of || { title: '', details: '', percentOff: '', amountOff: '', itemIds: [], startsOn: today(), endsOn: '', active: true };
  ui.offerKind = ui.offerKind && ui.offerFor === (id || 'new') ? ui.offerKind : (num(v.amountOff) > 0 ? 'amount' : 'percent'); ui.offerFor = id || 'new';
  var groups = {}; db.menu.forEach(function (it) { (groups[it.cat] = groups[it.cat] || []).push(it); });
  var picks = Object.keys(groups).map(function (c) {
    return '<div class="field"><span class="label" style="font-size:12px;color:var(--muted)">' + esc(c) + '</span><div class="wrap-chips">' + groups[c].map(function (it) {
      var on = (v.itemIds || []).indexOf(it.id) >= 0;
      return '<label class="chip" style="cursor:pointer"><input type="checkbox" name="offerItem" value="' + esc(it.id) + '"' + (on ? ' checked' : '') + ' style="accent-color:var(--brown)">' + esc(it.name) + '</label>';
    }).join('') + '</div></div>';
  }).join('');
  return topBack(of ? 'Edit offer' : 'New offer', 'Website › Offers') +
    '<main class="has-bar"><form id="offerForm" class="card" style="display:flex;flex-direction:column;gap:14px" onsubmit="return false">' +
    '<div class="field"><label for="oTitle">Offer name</label><input class="input" id="oTitle" name="title" value="' + esc(v.title) + '" placeholder="e.g. Christmas week offer"' + (of ? '' : ' data-autofocus') + '></div>' +
    '<div class="field"><label for="oDetails">Details for the website</label><textarea class="input" id="oDetails" name="details" placeholder="e.g. Order by Friday for the weekend.">' + esc(v.details) + '</textarea></div>' +
    '<div class="field"><span class="label">Discount</span><div class="toggle" role="group" aria-label="Discount type"><button type="button" data-act="offerKind" data-v="percent" aria-pressed="' + (ui.offerKind === 'percent') + '">% off</button><button type="button" data-act="offerKind" data-v="amount" aria-pressed="' + (ui.offerKind === 'amount') + '">€ off each</button></div>' +
      '<input class="input" id="oValue" name="value" inputmode="decimal" value="' + esc(ui.offerKind === 'amount' ? v.amountOff : v.percentOff) + '" placeholder="' + (ui.offerKind === 'amount' ? 'e.g. 5' : 'e.g. 15') + '" aria-label="Discount amount"><span class="hint">Leave empty for a message-only offer, such as “Free candles with every cake”.</span></div>' +
    '<div class="grid2"><div class="field"><label for="oStart">Starts</label><input class="input" id="oStart" name="startsOn" type="date" value="' + esc(v.startsOn) + '"></div><div class="field"><label for="oEnd">Ends</label><input class="input" id="oEnd" name="endsOn" type="date" value="' + esc(v.endsOn) + '"></div></div>' +
    '<div class="field"><span class="label">Items the discount applies to</span><span class="hint">Picked items show the offer price on the website and when you add them to an order.</span>' + picks + '</div>' +
    '<label class="check"><input type="checkbox" name="active"' + (v.active ? ' checked' : '') + '>Offer switched on</label>' +
    '</form>' + (of ? '<button class="btn danger block" data-act="offerDelete" data-id="' + of.id + '">Delete offer</button>' : '') +
    '</main><div class="bar"><button class="btn block" data-act="offerSave" data-id="' + (of ? of.id : '') + '">' + I.check + 'Save offer</button></div>';
}
function viewMarkets() {
  var groups = [['active', 'Trading now', 'Shown on the website under “Where we’re trading”.'], ['upcoming', 'Upcoming', 'Shown on the website under “Coming up”.'], ['past', 'Past', 'Shown on the website in “Our story” only.']];
  var html = groups.map(function (g) {
    var list = db.markets.filter(function (m) { return (m.status || 'active') === g[0]; }).sort(function (a, b) {
      if (g[0] === 'past') return (b.endsOn || b.startsOn || '').localeCompare(a.endsOn || a.startsOn || '') || (a.sort || 0) - (b.sort || 0);
      return (marketDates(a, 1)[0] || '9').localeCompare(marketDates(b, 1)[0] || '9') || (a.sort || 0) - (b.sort || 0);
    });
    var cards = list.map(function (m) {
      var next = m.status === 'past' ? [] : marketDates(m, 3), tt = timeText(m), when = daysText(m.days);
      var range = m.startsOn || m.endsOn ? (m.startsOn ? fmtDate(m.startsOn, true) : '') + (m.endsOn && m.endsOn !== m.startsOn ? ' – ' + fmtDate(m.endsOn, true) : '') : '';
      return '<article class="card menu-row' + (m.active ? '' : ' off') + '"><a href="#/market/' + m.id + '"><span class="nm">' + esc(m.name) + ' <span class="pill p-delivered" style="height:20px;font-size:11px">' + esc(m.kind || 'Market') + '</span></span>' +
        '<span class="pr">' + esc([when, tt].filter(Boolean).join(' · ') || (m.status === 'past' ? '' : 'No fixed days')) + (m.place ? (when || tt ? ' · ' : '') + esc(m.place.split(',')[0]) : '') + '</span>' +
        (next.length ? '<span class="pr" style="color:var(--muted);font-size:12px">Next: ' + esc(next.map(function (x) { return fmtDate(x, true); }).join(', ')) + '</span>' : range ? '<span class="pr" style="color:var(--muted);font-size:12px">' + esc(range) + '</span>' : '') + '</a>' +
        '<label class="sw"><input type="checkbox" data-act="marketActive" data-id="' + m.id + '"' + (m.active ? ' checked' : '') + '>' + (m.active ? 'On site' : 'Hidden') + '</label></article>';
    }).join('');
    return '<div class="section-title">' + g[1] + ' <small>' + list.length + '</small></div><p class="intro" style="margin-top:-6px">' + g[2] + '</p>' + (cards || '<div class="card" style="font-size:14px;color:var(--muted)">None yet.</div>');
  }).join('');
  return siteHeader('markets', '<a class="btn sm" href="#/market/new" data-act="mkNew">' + I.plus + 'Market</a>') + '<main>' + html + '</main>' + tabsHtml('menu');
}
function viewMarketEdit(id) {
  var m = id ? byId(db.markets, id) : null;
  if (id && !m) { go('#/markets', true); return null; }
  if (!ui.mDraft || ui.mDraft._for !== (id || 'new')) { ui.mDraft = JSON.parse(JSON.stringify(m || { name: '', kind: 'Market', status: 'active', place: '', address: '', mapsUrl: '', days: [6], startTime: '10:00', endTime: '16:00', startsOn: '', endsOn: '', skipDates: [], notes: '', description: '', active: true })); ui.mDraft._for = id || 'new'; }
  var v = ui.mDraft;
  var dayBtns = [1, 2, 3, 4, 5, 6, 0].map(function (d) { var on = (v.days || []).indexOf(d) >= 0; return '<button type="button" class="chip" data-act="dayToggle" data-v="' + d + '" aria-pressed="' + on + '">' + DAYS[d] + '</button>'; }).join('');
  var skips = (v.skipDates || []).slice().sort().map(function (x) { return '<span class="chip">' + esc(fmtDate(x, true)) + '<button type="button" class="chip-x" data-act="skipDel" data-v="' + x + '" aria-label="Remove ' + esc(fmtDate(x, true)) + '">' + I.x + '</button></span>'; }).join('');
  var st = [['active', 'Trading now'], ['upcoming', 'Upcoming'], ['past', 'Past']].map(function (x) { return '<button type="button" data-act="mkStatus" data-v="' + x[0] + '" aria-pressed="' + (v.status === x[0]) + '">' + x[1] + '</button>'; }).join('');
  var kinds = ['Market', 'Festival', 'Community'].map(function (k) { return '<option value="' + k + '"' + (v.kind === k ? ' selected' : '') + '>' + (k === 'Community' ? 'Community event' : k) + '</option>'; }).join('');
  return topBack(m ? 'Edit market' : 'New market', 'Website › Markets') +
    '<main class="has-bar"><form id="marketForm" class="card" style="display:flex;flex-direction:column;gap:14px" onsubmit="return false">' +
    '<div class="field"><label for="mkName">Name</label><input class="input" id="mkName" data-mk="name" value="' + esc(v.name) + '" placeholder="e.g. Meeting House Square Food & Farmers Market"' + (m ? '' : ' data-autofocus') + '></div>' +
    '<div class="grid2"><div class="field"><label for="mkKind">Type</label><select class="input" id="mkKind" data-mk="kind">' + kinds + '</select></div><div class="field"><label for="mkPlace">Place</label><input class="input" id="mkPlace" data-mk="place" value="' + esc(v.place) + '" placeholder="e.g. Temple Bar, Dublin 2"></div></div>' +
    '<div class="field"><span class="label">Status</span><div class="toggle" role="group" aria-label="Status">' + st + '</div></div>' +
    '<div class="field"><span class="label">Days</span><div class="wrap-chips" role="group" aria-label="Days">' + dayBtns + '</div><span class="hint">Leave all unticked if there are no fixed days.</span></div>' +
    '<div class="grid2"><div class="field"><label for="mkStart">Opens</label><input class="input" id="mkStart" type="time" data-mk="startTime" value="' + esc(v.startTime) + '"></div><div class="field"><label for="mkEnd">Closes</label><input class="input" id="mkEnd" type="time" data-mk="endTime" value="' + esc(v.endTime) + '"></div></div>' +
    '<div class="grid2"><div class="field"><label for="mkFrom">From date (optional)</label><input class="input" id="mkFrom" type="date" data-mk="startsOn" value="' + esc(v.startsOn) + '"></div><div class="field"><label for="mkTo">Until date (optional)</label><input class="input" id="mkTo" type="date" data-mk="endsOn" value="' + esc(v.endsOn) + '"></div></div>' +
    '<span class="hint" style="margin-top:-8px">For a one-day event, put the same date in both.</span>' +
    ((v.days || []).length ? '<div class="field"><span class="label">Dates you’re not there</span><div class="wrap-chips">' + (skips || '<span class="hint">None</span>') + '</div><div class="opt-row"><label class="sr" for="mkSkip">Date to skip</label><input class="input" id="mkSkip" type="date"><button type="button" class="btn sm ghost" data-act="skipAdd">Skip date</button></div></div>' : '') +
    '<div class="field"><label for="mkAddr">Address or Eircode (for directions)</label><input class="input" id="mkAddr" data-mk="address" value="' + esc(v.address) + '" placeholder="e.g. Meeting House Square, Temple Bar, Dublin 2"></div>' +
    '<div class="field"><label for="mkNotes">Short note (optional)</label><input class="input" id="mkNotes" data-mk="notes" value="' + esc(v.notes) + '" placeholder="e.g. Pre-order on WhatsApp"></div>' +
    '<div class="field"><label for="mkDesc">For “Our story” on the website</label><textarea class="input" id="mkDesc" data-mk="description" placeholder="One or two sentences about this market">' + esc(v.description) + '</textarea></div>' +
    '<label class="check"><input type="checkbox" data-mk="active"' + (v.active ? ' checked' : '') + '>Show on the website</label>' +
    '</form>' + (m ? '<button class="btn danger block" data-act="marketDelete" data-id="' + m.id + '">Delete market</button>' : '') +
    '</main><div class="bar"><button class="btn block" data-act="marketSave" data-id="' + (m ? m.id : '') + '">' + I.check + 'Save market</button></div>';
}
function viewNotices() {
  if (!ui.nDraft) ui.nDraft = JSON.parse(JSON.stringify(db.notices));
  var v = ui.nDraft;
  var closed = (v.closedDates || []).slice().sort().filter(function (x) { return x >= addDays(today(), -1); }).map(function (x) { return '<span class="chip">' + esc(fmtDate(x, true)) + '<button type="button" class="chip-x" data-act="closedDel" data-v="' + x + '" aria-label="Remove ' + esc(fmtDate(x, true)) + '">' + I.x + '</button></span>'; }).join('');
  var nd = [0, 1, 2, 3, 4, 5, 7].map(function (n) { return '<option value="' + n + '"' + (+v.noticeDays === n ? ' selected' : '') + '>' + (n === 0 ? 'Same day' : n + ' day' + (n > 1 ? 's' : '')) + '</option>'; }).join('');
  return siteHeader('notices') + '<main class="has-bar has-tabs-bar">' +
    '<section class="card" style="display:flex;flex-direction:column;gap:14px"><div class="section-title" style="margin:0">Top bar message</div>' +
      '<div class="field"><label for="nTop">Message (replaces the festival greeting)</label><textarea class="input" id="nTop" data-nt="topbar" placeholder="e.g. Christmas orders close on 20 December">' + esc(v.topbar) + '</textarea><span class="hint">Leave empty to show the usual festival greeting.</span></div>' +
      '<div class="field"><label for="nTopUntil">Show until (optional)</label><input class="input" id="nTopUntil" type="date" data-nt="topbarUntil" value="' + esc(v.topbarUntil) + '"></div></section>' +
    '<section class="card" style="display:flex;flex-direction:column;gap:14px"><div class="section-title" style="margin:0">Taking orders</div>' +
      '<label class="check"><input type="checkbox" data-nt="paused"' + (v.paused ? ' checked' : '') + '>Pause orders on the website</label>' +
      (v.paused ? '<div class="field"><label for="nPause">Message to customers</label><textarea class="input" id="nPause" data-nt="pauseMessage">' + esc(v.pauseMessage) + '</textarea></div>' : '') +
      '<div class="field"><label for="nDays">Notice customers must give</label><select class="input" id="nDays" data-nt="noticeDays">' + nd + '</select><span class="hint">The website won’t offer dates sooner than this.</span></div>' +
      '<div class="field"><span class="label">Closed dates (no collections or deliveries)</span><div class="wrap-chips">' + (closed || '<span class="hint">None</span>') + '</div><div class="opt-row"><label class="sr" for="nClosed">Closed date</label><input class="input" id="nClosed" type="date"><button type="button" class="btn sm ghost" data-act="closedAdd">Add date</button></div></div></section>' +
    '</main><div class="bar over-tabs"><button class="btn block" data-act="noticesSave">' + I.check + 'Save notices</button></div>' + tabsHtml('menu');
}

/* ---------- More ---------- */
function viewMore() {
  var t = today(), d = parseIso(t), dow = (d.getDay() + 6) % 7;
  var wkStart = addDays(t, -dow), wkEnd = addDays(wkStart, 6);
  var wk = db.orders.filter(function (o) { return o.date >= wkStart && o.date <= wkEnd && o.status !== 'cancelled'; });
  var mStart = t.slice(0, 8) + '01', mEnd = t.slice(0, 8) + '31';
  var W = moneySummary(wk), M = moneySummary(db.orders.filter(function (o) { return o.date >= mStart && o.date <= mEnd; }));
  var owing = db.orders.filter(function (o) { return o.status !== 'cancelled' && o.status !== 'pending' && pendingAmt(o) > 0; }).sort(sortActive);
  function block(title, X, list) {
    var mt = methodTotals(list), keys = PAY_METHODS.concat(['Method not recorded']).filter(function (k) { return mt[k] > 0; });
    return '<div class="section-title">' + title + ' <small>' + X.n + ' order' + (X.n === 1 ? '' : 's') + '</small></div><div class="stats"><div class="stat"><small>Total</small><b>' + money(X.total) + '</b></div><div class="stat"><small>Collected</small><b style="color:var(--green)">' + money(X.got) + '</b></div><div class="stat"><small>Pending</small><b style="color:var(--warn)">' + money(X.due) + '</b></div></div>' +
      (keys.length ? '<div class="method-row">' + keys.map(function (k) { return '<span class="mchip"><small>' + esc(k) + '</small><b>' + money(mt[k]) + '</b></span>'; }).join('') + '</div>' : ''); }
  var mList = db.orders.filter(function (o) { return o.date >= mStart && o.date <= mEnd && o.status !== 'pending'; });
  var s = db.settings;
  return '<header class="top hero"><div class="top-inner"><div class="top-row"><div class="brand"><b>More</b><small>Money, messages and settings</small></div></div></div></header><main>' +
    '<p style="margin:0;font-size:13px;color:var(--muted)">Confirmed, ready and delivered orders, by order date. Orders still to confirm are not counted.</p>' +
    block('This week', W, wk.filter(function (o) { return o.status !== 'pending'; })) + block(MONTHS[d.getMonth()] + ' ' + d.getFullYear(), M, mList) +
    '<div class="section-title">Still to collect <small>' + money(owing.reduce(function (s, o) { return s + pendingAmt(o); }, 0)) + '</small></div>' +
    (owing.length ? '<section class="card" style="padding:4px 14px">' + owing.slice(0, 30).map(function (o) { return '<a class="owe" href="#/order/' + o.id + '"><span class="grow"><b>' + esc(o.name) + '</b><small>' + esc(o.ref + ' · ' + fmtDate(o.date)) + '</small></span>' + payPill(o, true) + '</a>'; }).join('') + '</section>' : '<div class="card" style="font-size:14px;color:var(--muted)">Nothing owed. Every confirmed order is paid.</div>') +
    '<div class="section-title">WhatsApp messages</div><section class="card" style="display:flex;flex-direction:column;gap:14px">' +
      '<p style="margin:0;font-size:13px;color:var(--muted);line-height:1.5">Words in curly brackets are filled in for each order: {name} {ref} {items} {total} {when} {when_line} {mode} {slot} {address}</p>' +
      '<div class="field"><label for="sConf">Order confirmed</label><textarea class="input" id="sConf" data-setting="confirmMsg" rows="6">' + esc(s.confirmMsg) + '</textarea></div>' +
      '<div class="field"><label for="sReady">Ready</label><textarea class="input" id="sReady" data-setting="readyMsg">' + esc(s.readyMsg) + '</textarea></div>' +
      '<div class="field"><label for="sWay">On my way (deliveries)</label><textarea class="input" id="sWay" data-setting="onwayMsg">' + esc(s.onwayMsg) + '</textarea></div>' +
      '<button class="btn sm ghost" data-act="resetMsgs">Reset to the original wording</button></section>' +
    (CLOUD ? cloudSection() :
    '<div class="section-title">Backup and the other phone</div><section class="card" style="display:flex;flex-direction:column;gap:10px">' +
      '<p style="margin:0;font-size:14px;line-height:1.5;color:#4A3218">Orders are saved on this phone only. Copy a backup and keep it in WhatsApp (message yourself) or Notes. Paste it on the other phone to bring the orders across.</p>' +
      '<button class="btn block" data-act="backupCopy">Copy backup</button><button class="btn block ghost" data-act="restoreOpen">Paste a backup</button></section>' +
    '<div class="section-title">Sample orders</div><section class="card" style="display:flex;flex-direction:column;gap:10px"><p style="margin:0;font-size:14px;line-height:1.5;color:#4A3218">Sample orders are made-up customers for trying the app. Your own orders are never touched.</p>' +
      (hasSamples() ? '<button class="btn block ghost" data-act="samplesRemove">Remove sample orders</button>' : '<button class="btn block ghost" data-act="samplesAdd">Add sample orders</button>') + '</section>') +
    '<div class="section-title">Customer data (GDPR)</div><section class="card" style="display:flex;flex-direction:column;gap:10px">' +
      '<p style="margin:0;font-size:14px;line-height:1.5;color:#4A3218">Keep customer details only as long as you need them. To remove one customer, search for them on Orders, open each order and choose Delete permanently.</p>' +
      '<button class="btn block ghost" data-act="purgeOld" data-m="12">Delete finished orders over 12 months old</button>' +
      '<button class="btn block ghost" data-act="purgeOld" data-m="24">Delete finished orders over 24 months old</button></section>' +
    '<div class="section-title">Menu</div><section class="card"><button class="btn block ghost" data-act="resetMenu">Reset menu to the website prices</button></section>' +
    '<p style="text-align:center;font-size:12px;color:var(--muted);margin:8px 0">Savor by Sree Orders · version ' + VERSION + ' · ' + db.orders.length + ' orders' + (CLOUD ? ' · shared online' : ' saved on this device') + '</p></main>' + tabsHtml('more');
}
function cloudSection() {
  var legacy = legacyOrders();
  return '<div class="section-title">Your account</div><section class="card" style="display:flex;flex-direction:column;gap:10px">' +
      '<p style="margin:0;font-size:14px;line-height:1.5;color:#4A3218">Logged in as <b>' + esc(net.user && net.user.email || '') + '</b>. Orders are shared by every phone and computer you log in on, and update live.</p>' +
      '<p style="margin:0;font-size:13px;color:var(--muted)">' + (net.offline ? 'Offline right now.' : 'Last updated ' + (net.lastPull ? new Date(net.lastPull).toLocaleTimeString('en-IE', { hour: 'numeric', minute: '2-digit' }) : 'just now') + '.') + '</p>' +
      '<div class="btns"><button class="btn sm ghost" data-act="refresh">Refresh now</button><button class="btn sm danger" data-act="logout">Log out</button></div></section>' +
    (legacy.length ? '<div class="section-title">Orders saved on this device</div><section class="card" style="display:flex;flex-direction:column;gap:10px"><p style="margin:0;font-size:14px;line-height:1.5;color:#4A3218">' + legacy.length + ' order' + (legacy.length > 1 ? 's were' : ' was') + ' saved on this device before the shared list. Upload ' + (legacy.length > 1 ? 'them' : 'it') + ' once so every device sees ' + (legacy.length > 1 ? 'them' : 'it') + '.</p><button class="btn block" data-act="uploadLocal">Upload ' + legacy.length + ' order' + (legacy.length > 1 ? 's' : '') + '</button></section>' : '') +
    '<div class="section-title">Extra copy</div><section class="card" style="display:flex;flex-direction:column;gap:10px"><p style="margin:0;font-size:14px;line-height:1.5;color:#4A3218">A backup contains customers’ names, phones and addresses, so keep it private.</p>' +
      '<button class="btn block ghost" data-act="backupCopy">Copy backup</button><button class="btn block ghost" data-act="restoreOpen">Add orders from a backup</button></section>';
}

/* ---------- actions ---------- */
/* Marking an order done: settle any balance (method + date), or confirm it was paid in full. */
function finishOrder(o) {
  var done = o.mode === 'delivery' ? 'Delivered' : 'Collected', due = pendingAmt(o);
  var finished = function () { toast(o.name + ': ' + done); rerender(); };
  if (due > 0) {
    openPayModal('Finish order · balance due', o.name + ' · ' + money(collected(o)) + ' paid of ' + totalLabel(o) + '. Record the remaining ' + money(due) + ' and how they paid.', due, function (x) {
      setPaid(o, collected(o) + x.amount, (o.payments || []).concat([x]), 'delivered'); finished();
    }, { saveLabel: 'Save payment and finish', extra: [{ label: 'Finish, balance still due', kind: 'ghost', fn: function () { setStatus(o, 'delivered'); finished(); } }] });
    return;
  }
  var how = (o.payments || []).map(function (x) { return money(x.amount) + ' ' + payMethodText(x) + (x.date ? ' (' + fmtDate(x.date) + ')' : ''); }).join(', ');
  modal({ title: 'Finish order', text: o.name + ' · paid in full: ' + money(collected(o)) + (how ? '. ' + how : '') + '.', buttons: [
    { label: 'Mark ' + done.toLowerCase(), fn: function () { setStatus(o, 'delivered'); finished(); } }, { label: 'Cancel', kind: 'ghost' }] });
}
function setStatus(o, st) {
  var prev = o.status; o.status = st; o.updatedAt = Date.now();
  remote(CLOUD && sb.from('orders').update({ status: st }).eq('id', o.id).select().single(), function () { o.status = prev; }, function (row) { if (row) upsertLocalOrder(fromRow(row)); });
}
function saveRowTo(list, table, toRowFn, item, isNew, before) {
  if (isNew) db[list].push(item);
  remote(CLOUD && sb.from(table).upsert(toRowFn(item)), function () { if (isNew) db[list] = db[list].filter(function (x) { return x !== item; }); else Object.assign(item, before); });
}
function deleteRowFrom(list, table, id) {
  var before = db[list].slice(); db[list] = db[list].filter(function (x) { return x.id !== id; });
  remote(CLOUD && sb.from(table).delete().eq('id', id), function () { db[list] = before; });
}
var SITE_ACT = {
  mkNew: function () { ui.mDraft = null; },
  offerNew: function () {
    modal({ title: 'What would you like to add?', buttons: [
      { label: 'Discount (% or € off)', fn: function () { ui.offerFor = null; go('#/offer/new'); } },
      { label: 'Bundle', kind: 'ghost', fn: function () { ui.bDraft = null; go('#/bundle/new/Bundle'); } },
      { label: 'Hamper', kind: 'ghost', fn: function () { ui.bDraft = null; go('#/bundle/new/Hamper'); } },
      { label: 'Pack', kind: 'ghost', fn: function () { ui.bDraft = null; go('#/bundle/new/Pack'); } },
      { label: 'Cancel', kind: 'ghost' }] });
  },
  bType: function (el) { ui.bDraft.type = el.dataset.v; rerender(); },
  blAdd: function () { ui.bDraft.lines.push({ qty: 1, text: '' }); rerender(); var f = $('#blt' + (ui.bDraft.lines.length - 1)); if (f) f.focus(); },
  blDel: function (el) { ui.bDraft.lines.splice(+el.dataset.i, 1); if (!ui.bDraft.lines.length) ui.bDraft.lines.push({ qty: 1, text: '' }); rerender(); },
  bundleSave: function (el) {
    var v = ui.bDraft, name = String(v.name || '').trim(), price = num(v.price);
    var lines = v.lines.filter(function (l) { return String(l.text || '').trim(); }).map(function (l) { var q = Math.max(1, parseInt(l.qty, 10) || 1); return (q > 1 ? q + ' × ' : '') + String(l.text).trim(); });
    if (!name) { toast('Give it a name'); return; }
    if (!lines.length) { toast('Add at least one line to what’s inside'); return; }
    if (!(price > 0)) { toast('Add the price'); return; }
    var it = el.dataset.id ? getItem(el.dataset.id) : null, isNew = !it, before = it ? JSON.parse(JSON.stringify(it)) : null;
    if (!it) { var base = name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bundle', idv = base, k = 2; while (getItem(idv)) idv = base + '-' + k++; it = { id: idv, cat: 'Bundles', allergens: [], sort: -1 }; }
    var tags = (it.tags || []).filter(function (x) { return x !== 'Hamper' && x !== 'Pack'; }); if (v.type !== 'Bundle') tags.push(v.type);
    Object.assign(it, { name: name, description: String(v.description || '').trim(), options: [{ label: v.type, price: price }], includes: lines, badge: String(v.badge || '').trim(), tags: tags, seasonal: !!v.seasonal, active: !!v.active });
    if (isNew) { var firstNon = db.menu.findIndex(function (x) { return x.cat !== 'Bundles'; }); it.sort = db.menu.filter(function (x) { return x.cat === 'Bundles'; }).length; db.menu.splice(firstNon < 0 ? db.menu.length : firstNon, 0, it); }
    remote(CLOUD && sb.from('menu_items').upsert(toMenuRow(it)), function () { if (isNew) db.menu = db.menu.filter(function (x) { return x !== it; }); else Object.assign(it, before); });
    ui.bDraft = null; toast('Saved ' + name); back('#/offers');
  },
  bundleDelete: function (el) { ask('Delete this bundle?', 'It disappears from the website. Orders already saved keep their items.', 'Delete', function () { var before = db.menu.slice(); db.menu = db.menu.filter(function (x) { return x.id !== el.dataset.id; }); remote(CLOUD && sb.from('menu_items').delete().eq('id', el.dataset.id), function () { db.menu = before; }); ui.bDraft = null; back('#/offers'); }, 'danger'); },
  secMove: function (el) { var list = sections().slice(), i = +el.dataset.i, j = i + (+el.dataset.v); if (j < 0 || j >= list.length) return; var t = list[i]; list[i] = list[j]; list[j] = t; saveSections(list); rerender(); },
  secEdit: function (el) {
    var i = +el.dataset.i, list = sections().slice(), x = i >= 0 ? list[i] : { key: '', title: '', line: '', active: true };
    var n = i >= 0 ? db.menu.filter(function (it) { return it.cat === x.key; }).length : 0;
    var btns = [{ label: i >= 0 ? 'Save section' : 'Add section', fn: function () {
      var key = $('#sKey').value.trim(), title = $('#sTitle').value.trim() || key, line = $('#sLine').value.trim(), on = $('#sOn').checked;
      if (!key) { toast('Add a tab name'); return false; }
      if (key === 'Bundles' || key === 'Add-ons' || list.some(function (y, k) { return k !== i && y.key.toLowerCase() === key.toLowerCase(); })) { toast('There is already a section called ' + key); return false; }
      var nx = { key: key, id: x.id || key.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), title: title, line: line, active: on };
      if (i >= 0 && x.key !== key) {
        db.menu.forEach(function (it) { if (it.cat === x.key) it.cat = key; });
        remote(CLOUD && sb.from('menu_items').update({ cat: key }).eq('cat', x.key), function () { db.menu.forEach(function (it) { if (it.cat === key) it.cat = x.key; }); });
        if (ui.menuCat === x.key) ui.menuCat = key;
      }
      if (i >= 0) list[i] = nx; else list.push(nx);
      saveSections(list); toast(i >= 0 ? 'Section saved' : 'Section added. Add items to it from Menu › + Item'); rerender();
    } }];
    if (i >= 0) btns.push({ label: 'Delete section', kind: 'danger', fn: function () {
      if (n) { toast('Move or delete its ' + n + ' item' + (n > 1 ? 's' : '') + ' first'); return false; }
      list.splice(i, 1); saveSections(list); toast('Section deleted'); rerender();
    } });
    btns.push({ label: 'Cancel', kind: 'ghost' });
    modal({ title: i >= 0 ? 'Edit section' : 'New section', html:
      '<div class="field"><label for="sKey">Tab name (short)</label><input class="input" id="sKey" value="' + esc(x.key) + '" placeholder="e.g. Mini Cookies"></div>' +
      '<div class="field"><label for="sTitle">Heading on the website</label><input class="input" id="sTitle" value="' + esc(x.title) + '" placeholder="e.g. Mini NYC Cookies"></div>' +
      '<div class="field"><label for="sLine">One-line description</label><input class="input" id="sLine" value="' + esc(x.line || '') + '" placeholder="e.g. Bite-sized, baked fresh to order."></div>' +
      '<label class="check"><input type="checkbox" id="sOn"' + (x.active !== false ? ' checked' : '') + '>Show on the website</label>' +
      (x.id === 'cakes' ? '<p class="hint" style="margin:0">This section uses the cake builder on the website.</p>' : ''), buttons: btns });
  },
  offerKind: function (el) { ui.offerKind = el.dataset.v; var f = $('#oValue'); if (f) { f.placeholder = el.dataset.v === 'amount' ? 'e.g. 5' : 'e.g. 15'; } [].forEach.call(el.parentNode.children, function (b) { b.setAttribute('aria-pressed', b === el); }); },
  offerActive: function (el) { var of = byId(db.offers, el.dataset.id), v = el.checked; of.active = v; remote(CLOUD && sb.from('offers').update({ active: v }).eq('id', of.id), function () { of.active = !v; }); rerender(); },
  offerSave: function (el) {
    var f = $('#offerForm').elements, title = f['title'].value.trim();
    if (!title) { toast('Give the offer a name'); return; }
    var val = num(f['value'].value);
    if (ui.offerKind === 'percent' && val > 90) { toast('A percentage discount can be at most 90%'); return; }
    var start = f['startsOn'].value, end = f['endsOn'].value;
    if (start && end && end < start) { toast('The end date is before the start date'); return; }
    var items = [].slice.call(document.querySelectorAll('input[name=offerItem]:checked')).map(function (x) { return x.value; });
    var of = el.dataset.id ? byId(db.offers, el.dataset.id) : null, isNew = !of, before = of ? JSON.parse(JSON.stringify(of)) : null;
    if (!of) of = { id: newId(), sort: 0 };
    Object.assign(of, { title: title, details: f['details'].value.trim(), percentOff: ui.offerKind === 'percent' && val > 0 ? val : '', amountOff: ui.offerKind === 'amount' && val > 0 ? val : '', itemIds: items, startsOn: start, endsOn: end, active: f['active'].checked });
    saveRowTo('offers', 'offers', toOfferRow, of, isNew, before);
    toast('Saved ' + title); ui.offerFor = null; back('#/offers');
  },
  offerDelete: function (el) { ask('Delete this offer?', 'It disappears from the website. Orders already saved keep their prices.', 'Delete offer', function () { deleteRowFrom('offers', 'offers', el.dataset.id); back('#/offers'); }, 'danger'); },
  marketActive: function (el) { var m = byId(db.markets, el.dataset.id), v = el.checked; m.active = v; remote(CLOUD && sb.from('markets').update({ active: v }).eq('id', m.id), function () { m.active = !v; }); rerender(); },
  mkStatus: function (el) { ui.mDraft.status = el.dataset.v; rerender(); },
  dayToggle: function (el) { var d = +el.dataset.v, a = ui.mDraft.days || (ui.mDraft.days = []), i = a.indexOf(d); if (i >= 0) a.splice(i, 1); else a.push(d); rerender(); },
  skipAdd: function () { var x = $('#mkSkip').value; if (!x) { toast('Pick a date first'); return; } if (ui.mDraft.skipDates.indexOf(x) < 0) ui.mDraft.skipDates.push(x); rerender(); },
  skipDel: function (el) { ui.mDraft.skipDates = ui.mDraft.skipDates.filter(function (x) { return x !== el.dataset.v; }); rerender(); },
  marketSave: function (el) {
    var v = ui.mDraft;
    if (!String(v.name || '').trim()) { toast('Give the market a name'); return; }
    if (v.startsOn && v.endsOn && v.endsOn < v.startsOn) { toast('The “until” date is before the “from” date'); return; }
    if (v.startTime && v.endTime && v.endTime <= v.startTime) { toast('The closing time is before the opening time'); return; }
    var m = el.dataset.id ? byId(db.markets, el.dataset.id) : null, isNew = !m, before = m ? JSON.parse(JSON.stringify(m)) : null;
    if (!m) m = { id: newId(), sort: db.markets.length };
    var copy = JSON.parse(JSON.stringify(v)); delete copy._for; copy.id = m.id; copy.sort = m.sort; copy.name = copy.name.trim();
    copy.days = (copy.days || []).map(Number).sort(); copy.mapsUrl = copy.address ? mapsUrl(copy.address) : '';
    Object.assign(m, copy);
    saveRowTo('markets', 'markets', toMarketRow, m, isNew, before);
    ui.mDraft = null; toast('Saved ' + m.name); back('#/markets');
  },
  marketDelete: function (el) { ask('Delete this market?', 'It disappears from the website.', 'Delete market', function () { deleteRowFrom('markets', 'markets', el.dataset.id); ui.mDraft = null; back('#/markets'); }, 'danger'); },
  closedAdd: function () { var x = $('#nClosed').value; if (!x) { toast('Pick a date first'); return; } if (ui.nDraft.closedDates.indexOf(x) < 0) ui.nDraft.closedDates.push(x); rerender(); },
  closedDel: function (el) { ui.nDraft.closedDates = ui.nDraft.closedDates.filter(function (x) { return x !== el.dataset.v; }); rerender(); },
  noticesSave: function () {
    var before = db.notices, v = JSON.parse(JSON.stringify(ui.nDraft));
    v.noticeDays = +v.noticeDays || 0; v.closedDates = (v.closedDates || []).filter(function (x) { return x >= addDays(today(), -1); }).sort();
    db.notices = v;
    remote(CLOUD && sb.from('site_content').upsert({ key: 'notices', value: v }), function () { db.notices = before; ui.nDraft = null; });
    ui.nDraft = null; toast('Notices saved'); rerender();
  }
};
function setPaid(o, amount, payments, status) {
  var prevA = o.paidAmount, prevP = o.paid, prevL = o.payments, prevS = o.status;
  if (payments) o.payments = payments; if (status) o.status = status;
  o.paidAmount = Math.round(amount * 100) / 100; o.paid = isPaid(o); o.updatedAt = Date.now();
  var upd = { paid_amount: o.paidAmount, paid: o.paid }; if (net.v25 || !CLOUD) upd.payments = toRow(o, ['payments']).payments; if (status) upd.status = status;
  remote(CLOUD && sb.from('orders').update(upd).eq('id', o.id), function () { o.paidAmount = prevA; o.paid = prevP; o.payments = prevL; o.status = prevS; });
  rerender(); toast(o.paid ? o.name + ' · paid in full' : money(o.paidAmount) + ' collected · ' + money(pendingAmt(o)) + ' pending');
}
function deleteOrder(o, done) {
  var before = db.orders.slice();
  db.orders = db.orders.filter(function (x) { return x.id !== o.id; });
  remote(CLOUD && sb.from('orders').delete().eq('id', o.id), function () { db.orders = before; });
  if (done) done();
}
var ACT = {
  back: function () { back(); },
  ordersTab: function (el) { ui.ordersTab = el.dataset.v; rerender(); },
  ordersTabGo: function () { ui.ordersTab = 'pending'; },
  confirm: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    setStatus(o, 'confirmed');
    var btns = [{ label: 'Send confirmation on WhatsApp', kind: 'wa', icon: I.wa, href: waUrl(o.phone, fillTemplate(db.settings.confirmMsg, o)) }, { label: 'Done', kind: 'ghost' }];
    modal({ title: 'Order confirmed', text: o.name + ' · ' + whenText(o) + (o.phone ? '' : '. No phone number on this order, so WhatsApp will ask you to pick the chat.'), buttons: btns });
    rerender();
  },
  statusPick: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    var label = function (st) { return st === 'delivered' ? (o.mode === 'delivery' ? 'Delivered' : 'Collected') : STATUS[st]; };
    modal({ title: 'Change status', text: 'Now: ' + label(o.status) + '. Move it back or forward to any stage.',
      buttons: ['pending', 'confirmed', 'ready', 'delivered', 'cancelled'].filter(function (st) { return st !== o.status; }).map(function (st) {
        return { label: label(st), kind: st === 'cancelled' ? 'danger' : 'ghost', fn: function () { if (st === 'delivered') { setTimeout(function () { finishOrder(o); }, 0); return; } setStatus(o, st); toast(o.name + ': ' + label(st)); rerender(); } };
      }).concat([{ label: 'Keep as it is', kind: 'ghost' }]) });
  },
  status: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    if (el.dataset.v === 'delivered') return finishOrder(o);
    setStatus(o, el.dataset.v);
    toast(o.name + ': ' + STATUS[el.dataset.v]);
    rerender();
  },
  payAdd: function (el, ev, full) {
    var o = getOrder(el.dataset.id); if (!o) return; var due = pendingAmt(o);
    openPayModal(full ? 'Paid in full' : 'Record a payment', o.name + ' · ' + money(collected(o)) + ' paid of ' + totalLabel(o) + ' · ' + money(due) + ' pending', due, function (x) {
      setPaid(o, collected(o) + x.amount, (o.payments || []).concat([x]));
    });
  },
  payFull: function (el) { ACT.payAdd(el, null, true); },
  payRemove: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return; var i = el.dataset.i;
    var amt = i === 'earlier' ? earlierPaid(o) : num(o.payments[+i].amount);
    ask('Remove this payment?', money(amt) + ' will go back to pending for ' + o.name + '.', 'Remove', function () {
      var list = (o.payments || []).slice(); if (i !== 'earlier') list.splice(+i, 1);
      var left = i === 'earlier' ? paySum(o) : Math.max(0, collected(o) - amt);
      if (i === 'earlier') o.paid = false;
      setPaid(o, left, list);
    }, 'danger');
  },
  payPlan: function (el) { draft.payPlan = el.dataset.v; if (!draft.payDate) draft.payDate = today(); saveDraft(); rerender(); if (el.dataset.v === 'deposit') setTimeout(function () { var f = $('#fPayAmt'); if (f) f.focus(); }, 30); },
  fPayMethod: function (el) { draft.payMethod = el.dataset.v; saveDraft(); rerender(); },
  draftPayAdd: function () {
    var d = draft; openPayModal('Record a payment', 'Total ' + totalLabel(d) + (collected(d) > 0 ? ' · ' + money(collected(d)) + ' already paid' : ''), pendingAmt(d), function (x) {
      d.payments = (d.payments || []).concat([x]); d.paidAmount = Math.round((num(d.paidAmount) + x.amount) * 100) / 100; saveDraft(); rerender();
    });
  },
  draftPayRemove: function (el) {
    var d = draft, i = el.dataset.i;
    if (i === 'earlier') { d.paidAmount = paySum(d); d.paid = false; } else { d.paidAmount = Math.max(0, num(d.paidAmount) - num(d.payments[+i].amount)); d.payments.splice(+i, 1); }
    saveDraft(); rerender();
  },
  pmMode: function (el) {
    var split = el.dataset.v === 'split';
    el.parentNode.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); });
    $('#pmOne').hidden = split; $('#pmSplit').hidden = !split;
  },
  pmPick: function (el) { el.parentNode.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); }); },
  discType: function (el) {
    var v = el.dataset.v; draft.discount = v ? { type: v, value: draft.discount ? draft.discount.value : '', note: draft.discount ? draft.discount.note : '' } : null;
    saveDraft(); rerender(); if (v) setTimeout(function () { var f = $('#fDiscV'); if (f) f.focus(); }, 30);
  },
  payReset: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    modal({ title: 'Change payment', text: 'Set how much ' + o.name + ' has paid in total for this order.',
      html: '<div class="field"><label for="payTot">Total paid so far (€)</label><input class="input" id="payTot" inputmode="decimal" value="' + (Math.round(collected(o) * 100) / 100) + '"></div>',
      buttons: [{ label: 'Save', fn: function () { setPaid(o, Math.max(0, num($('#payTot').value))); } }, { label: 'Cancel', kind: 'ghost' }] });
  },
  paid: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return; var v = el.checked; o.paid = v; o.updatedAt = Date.now();
    remote(CLOUD && sb.from('orders').update({ paid: v }).eq('id', o.id), function () { o.paid = !v; });
    toast(v ? 'Marked as paid' : 'Marked as not paid');
  },
  deleteOrder: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    ask('Delete this order for good?', 'Use this when a customer asks you to remove their details, or for orders entered by mistake. It is removed from every device and can’t be undone.', 'Delete permanently', function () { deleteOrder(o, function () { go('#/orders', true); toast('Order deleted'); }); }, 'danger');
  },
  cancelOrder: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    if (o.status === 'cancelled') {
      ask('Delete this order?', 'It will be removed for good' + (CLOUD ? ', on every device.' : '.'), 'Delete order', function () { deleteOrder(o, function () { go('#/orders', true); toast('Order deleted'); }); }, 'danger');
    } else {
      ask('Cancel this order?', 'It moves to Done as cancelled. You can reopen it later.', 'Cancel order', function () { setStatus(o, 'cancelled'); rerender(); toast('Order cancelled'); }, 'danger');
    }
  },
  draftSet: function (el) { draft[el.dataset.f] = el.dataset.v; saveDraft(); rerender(); },
  qty: function (el) { var l = draft.items[+el.dataset.i]; l.qty = Math.max(1, l.qty + (+el.dataset.v)); saveDraft(); rerender(); },
  rmLine: function (el) { draft.items.splice(+el.dataset.i, 1); saveDraft(); rerender(); },
  customLine: function () {
    modal({ title: 'Something not on the menu', html: '<div class="field"><label for="cName">What is it?</label><input class="input" id="cName" placeholder="e.g. Custom unicorn cake, 1.5 kg"></div><div class="grid2"><div class="field"><label for="cPrice">Price each (€)</label><input class="input" id="cPrice" inputmode="decimal"></div><div class="field"><label for="cQty">How many</label><input class="input" id="cQty" inputmode="numeric" value="1"></div></div>',
      buttons: [{ label: 'Add to order', fn: function () {
        var n = $('#cName').value.trim(); if (!n) { toast('Type what it is first'); return false; }
        draft.items.push({ menuId: null, name: n, option: '', price: num($('#cPrice').value), qty: Math.max(1, parseInt($('#cQty').value, 10) || 1) });
        saveDraft(); rerender();
      } }, { label: 'Cancel', kind: 'ghost' }] });
  },
  pickCat: function (el) { ui.pickCat = el.dataset.v; rerender(); },
  pickAdd: function (el) {
    var it = getItem(el.dataset.id), op = it.options[+el.dataset.o];
    var ex = null; draft.items.forEach(function (l) { if (l.menuId === it.id && (l.option === op.label || l.option.indexOf(op.label + ' · ') === 0)) ex = l; });
    var of = offerFor(it.id);
    if (ex) ex.qty++; else draft.items.push({ menuId: it.id, name: it.name, option: op.label + (of && op.price ? ' · ' + of.title : ''), price: offerPrice(op.price, of), qty: 1 });
    saveDraft(); rerender(); toast('Added ' + it.name);
  },
  discard: function () { ask('Start a new order?', 'The unsaved order will be cleared.', 'Clear it', function () { clearDraft(); ensureDraft('new'); rerender(); }, 'danger'); },
  pasteOpen: function () {
    modal({ title: 'Paste the WhatsApp message', text: 'In WhatsApp, press and hold the order message, tap Copy, then paste it here.', html: '<textarea class="input" id="pasteBox" rows="9" placeholder="Hi Savor by Sree, I’d like to place an order…"></textarea>',
      buttons: [{ label: 'Fill in the order', fn: function () {
        var p = parseMessage($('#pasteBox').value);
        if (!p.name && !p.items.length && !p.date) { toast('Couldn’t read that message. Fill the order in by hand.'); return false; }
        ['name', 'phone', 'mode', 'date', 'slot', 'slotOther', 'address', 'notes', 'source'].forEach(function (k) { if (p[k]) draft[k] = p[k]; });
        if (p.items.length) draft.items = draft.items.concat(p.items);
        if (!draft.notes && p.notes) draft.notes = p.notes;
        saveDraft(); rerender();
        var unknown = p.items.filter(function (l) { return !l.menuId; }).length;
        toast('Filled in ' + p.items.length + ' item' + (p.items.length === 1 ? '' : 's') + (unknown ? ' · ' + unknown + ' not matched to the menu' : '') + '. Add a phone number to reply.');
      } }, { label: 'Cancel', kind: 'ghost' }] });
  },
  saveOrder: function (el) {
    var d = draft;
    if (!d.name.trim()) { toast('Add the customer’s name'); $('#fName') && $('#fName').focus(); return; }
    if (!d.items.length) { toast('Add at least one item'); return; }
    if (collected(d) <= 0 && (d.payPlan === 'deposit' || d.payPlan === 'full')) {
      var pa = d.payPlan === 'full' ? orderTotal(d) : num(d.payAmt);
      if (!(pa > 0)) { toast('Enter the deposit amount'); $('#fPayAmt') && $('#fPayAmt').focus(); return; }
      if (pa > orderTotal(d) + 0.001) { toast('The deposit is more than the order total'); return; }
      if (!d.payMethod) { toast('Pick how they paid'); return; }
      d.payments = [cleanPay({ amount: pa, date: d.payDate || today(), parts: [{ method: d.payMethod, amount: pa }] })];
      d.paidAmount = Math.round(pa * 100) / 100;
    }
    d.paid = isPaid(d);
    if (CLOUD) {
      if (ui.saving) return;
      ui.saving = true; if (el) { el.disabled = true; el.lastChild.textContent = 'Saving…'; }
      var isNew = d.key === 'new';
      var q = isNew ? sb.from('orders').insert(Object.assign(toRow(d, orderKeys()), { status: 'pending' })).select().single()
                    : sb.from('orders').update(toRow(d, orderKeys())).eq('id', d.id).select().single();
      Promise.resolve(q).then(function (r) {
        if (r.error) throw r.error;
        var o = fromRow(r.data); if (!net.v25) { o.payments = d.payments || []; o.discount = d.discount; } upsertLocalOrder(o); save(); clearDraft(); setOffline(false);
        toast(isNew ? 'Order saved · ' + o.ref : 'Changes saved');
        if (isNew) { ui.ordersTab = 'pending'; go('#/order/' + o.id, true); } else back('#/order/' + o.id);
      }).catch(function (e) {
        toast(netMsg(e) + ' Your order is kept on this screen.');
        if (el) { el.disabled = false; el.lastChild.textContent = isNew ? 'Save order' : 'Save changes'; }
      }).then(function () { ui.saving = false; });
      return;
    }
    var now = Date.now(), o;
    if (d.key === 'new') {
      db.seq = (db.seq || 1000) + 1;
      o = { id: uid(), ref: 'SBS-' + db.seq, status: 'pending', createdAt: now };
      db.orders.push(o);
    } else {
      o = getOrder(d.id); if (!o) { toast('That order no longer exists'); return; }
    }
    ['name', 'phone', 'source', 'items', 'mode', 'date', 'slot', 'slotOther', 'address', 'fee', 'notes', 'paidAmount', 'payments', 'discount'].forEach(function (k) { o[k] = d[k]; }); o.paidAmount = num(o.paidAmount); o.paid = isPaid(o);
    o.name = o.name.trim(); o.updatedAt = now;
    save(); var wasNew = d.key === 'new'; clearDraft();
    toast(wasNew ? 'Order saved · ' + o.ref : 'Changes saved');
    if (wasNew) { ui.ordersTab = 'pending'; go('#/order/' + o.id, true); } else back('#/order/' + o.id);
  },
  day: function (el) { ui.day = el.dataset.v; rerender(); },
  bake: function (el) { var d = ui.day; db.bake[d] = db.bake[d] || {}; if (el.checked) db.bake[d][el.dataset.k] = 1; else delete db.bake[d][el.dataset.k]; saveSetting('bake:' + d, db.bake[d]); rerender(); },
  menuCat: function (el) { ui.menuCat = el.dataset.v; rerender(); },
  menuActive: function (el) { var it = getItem(el.dataset.id), v = el.checked; it.active = v; remote(CLOUD && sb.from('menu_items').update({ active: v }).eq('id', it.id), function () { it.active = !v; }); rerender(); },
  addOptRow: function () {
    var wrap = $('#optRows'), i = wrap.children.length;
    var div = document.createElement('div'); div.className = 'opt-row';
    div.innerHTML = '<input class="input" data-opt="label" data-i="' + i + '" placeholder="Size, e.g. Celebration tray" aria-label="Size ' + (i + 1) + '"><label class="price-wrap">€<input class="price-in" inputmode="decimal" data-opt="price" data-i="' + i + '" aria-label="Price ' + (i + 1) + '"></label>';
    wrap.appendChild(div); div.querySelector('input').focus();
  },
  menuSave: function (el) {
    var form = $('#menuForm'), f = form.elements, name = f['name'].value.trim();
    if (!name) { toast('Give the item a name'); return; }
    var opts = [];
    var labels = form.querySelectorAll('[data-opt=label]'), prices = form.querySelectorAll('[data-opt=price]');
    var oldIt = el.dataset.id ? getItem(el.dataset.id) : null, notes = {};
    if (oldIt) (oldIt.options || []).forEach(function (o) { if (o.note) notes[o.label] = o.note; });
    for (var i = 0; i < labels.length; i++) { var lb = labels[i].value.trim(); if (lb) { var op = { label: lb, price: num(prices[i].value) }; if (notes[lb]) op.note = notes[lb]; opts.push(op); } }
    if (!opts.length) opts.push({ label: 'Each', price: 0 });
    var it = el.dataset.id ? getItem(el.dataset.id) : null, isNew = !it, before = it ? JSON.parse(JSON.stringify(it)) : null;
    if (!it) { it = { id: uid(), sort: db.menu.length }; db.menu.push(it); }
    it.name = name; it.cat = f['cat'].value; it.options = opts; it.includes = it.includes || [];
    it.seasonal = f['seasonal'].checked; it.active = f['active'].checked;
    it.badge = f['badge'].value.trim();
    var tg = (it.tags || []).filter(function (x) { return x !== 'Contains alcohol' && x !== 'Hamper'; }); if (f['alcohol'].checked) tg.push('Contains alcohol'); if ((before && before.tags || []).indexOf('Hamper') >= 0) tg.push('Hamper'); it.tags = tg;
    it.description = f['description'].value.trim(); it.allergens = [].slice.call(form.querySelectorAll('input[name=allergen]:checked')).map(function (x) { return x.value; });
    remote(CLOUD && sb.from('menu_items').upsert(toMenuRow(it)), function () { if (isNew) db.menu = db.menu.filter(function (x) { return x !== it; }); else Object.assign(it, before); });
    ui.menuCat = it.cat; toast('Saved ' + name); back('#/menu');
  },
  menuDelete: function (el) { ask('Delete this item?', 'Past orders keep their items. It just won’t be on the menu any more.', 'Delete item', function () { var before = db.menu.slice(); db.menu = db.menu.filter(function (x) { return x.id !== el.dataset.id; }); remote(CLOUD && sb.from('menu_items').delete().eq('id', el.dataset.id), function () { db.menu = before; }); back('#/menu'); }, 'danger'); },
  resetMsgs: function () { ask('Reset the messages?', 'Your edited wording will be replaced with the original.', 'Reset', function () { db.settings = defaultSettings(); saveSetting('messages', db.settings); rerender(); }); },
  resetMenu: function () { ask('Reset the menu?', 'Items you added or changed will be replaced by the website menu and prices. Orders are not affected.', 'Reset menu', function () {
    var before = db.menu.slice(), fresh = defaultMenu(); db.menu = fresh;
    remote(CLOUD && sb.from('menu_items').delete().neq('id', '').then(function (r) { if (r.error) return r; return sb.from('menu_items').upsert(fresh.map(toMenuRow)); }), function () { db.menu = before; });
    rerender(); toast('Menu reset'); }, 'danger'); },
  purgeOld: function (el) {
    var months = +el.dataset.m, cut = new Date(); cut.setMonth(cut.getMonth() - months); var cutoff = iso(cut);
    var old = db.orders.filter(function (o) { return (o.status === 'delivered' || o.status === 'cancelled') && o.date && o.date < cutoff; });
    if (!old.length) { toast('No finished orders older than ' + months + ' months'); return; }
    ask('Delete ' + old.length + ' old order' + (old.length > 1 ? 's' : '') + '?', 'Delivered and cancelled orders from before ' + fmtDate(cutoff, true) + ' ' + cut.getFullYear() + ' will be removed for good' + (CLOUD ? ', on every device' : '') + '. Keeping customer details only as long as you need them is part of GDPR.', 'Delete old orders', function () {
      var before = db.orders.slice();
      db.orders = db.orders.filter(function (o) { return old.indexOf(o) < 0; });
      remote(CLOUD && sb.from('orders').delete().in('status', ['delivered', 'cancelled']).lt('order_date', cutoff), function () { db.orders = before; });
      rerender(); toast('Deleted ' + old.length + ' old orders');
    }, 'danger');
  },
  login: function () {
    var em = ($('#lEmail').value || '').trim(), pw = $('#lPass').value || '', btn = $('#lBtn'), err = $('#lErr');
    if (!em || !pw) { err.textContent = 'Enter your email and password.'; return; }
    btn.disabled = true; btn.textContent = 'Logging in…'; err.textContent = '';
    sb.auth.signInWithPassword({ email: em, password: pw }).then(function (r) {
      if (r.error) throw r.error;
      net.user = r.data.user; if (curRoute() !== '/orders') go('#/orders', true); render(); startCloud();
    }).catch(function (e) {
      var m = String((e && e.message) || e);
      err.textContent = /invalid|credentials/i.test(m) ? 'That email or password isn’t right.' : /fetch|network/i.test(m) ? 'No internet connection. Check your connection and try again.' : m;
      btn.disabled = false; btn.textContent = 'Log in';
    });
  },
  logout: function () {
    ask('Log out of this device?', 'The saved copy of your orders is cleared from this device. Your orders stay safe online.', 'Log out', function () {
      if (net.chan) { try { sb.removeChannel(net.chan); } catch (e) {} net.chan = null; }
      sb.auth.signOut().then(function () {}, function () {});
      net.user = null; db = fresh(); db.menu = []; store.removeItem(KEY); clearDraft(); render();
    });
  },
  uploadLocal: function () {
    var legacy = legacyOrders();
    if (!legacy.length) return;
    ask('Upload ' + legacy.length + ' order' + (legacy.length > 1 ? 's' : '') + '?', 'These were saved on this device before the shared order list. They’ll get new order numbers.', 'Upload', function () { uploadOrders(legacy, function (n) { try { store.setItem('sbs.legacy.uploaded', '1'); } catch (e) {} toast('Uploaded ' + n + ' orders'); rerender(); }); });
  },
  refresh: function () { pull().then(function () { toast(net.offline ? 'Still offline' : 'Up to date'); }); },
  samplesAdd: function () { db.orders = db.orders.concat(sampleOrders()); save(); ui.ordersTab = 'pending'; rerender(); toast('Added 8 sample orders'); },
  samplesRemove: function () { var n = db.orders.length; db.orders = db.orders.filter(function (o) { return !o.sample; }); save(); rerender(); toast('Removed ' + (n - db.orders.length) + ' sample orders'); },
  backupCopy: function () {
    var code = 'SBSBACKUP1:' + JSON.stringify({ at: new Date().toISOString(), orders: db.orders, menu: db.menu, settings: db.settings, seq: db.seq });
    modal({ title: 'Your backup', text: 'It’s copied. Paste it into WhatsApp (message yourself) or Notes to keep it safe.', html: '<textarea class="input" id="bkBox" rows="6" readonly>' + esc(code) + '</textarea>', buttons: [{ label: 'Done', kind: 'ghost' }] });
    var ta = $('#bkBox'); ta.focus(); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    if (!ok && navigator.clipboard) navigator.clipboard.writeText(code).then(function () { ok = true; }, function () {});
    toast(ok ? 'Backup copied' : 'Select the text and copy it');
  },
  restoreOpen: function () {
    modal({ title: 'Paste a backup', text: 'Paste the backup text from the other phone.', html: '<textarea class="input" id="rsBox" rows="6" placeholder="SBSBACKUP1:…"></textarea>',
      buttons: [
        { label: CLOUD ? 'Add its orders to the shared list' : 'Add its orders to this phone', fn: function () { return restore(false); } }]
        .concat(CLOUD ? [] : [{ label: 'Replace everything on this phone', kind: 'danger', fn: function () { return restore(true); } }])
        .concat([{ label: 'Cancel', kind: 'ghost' }]) });
  }
};
Object.keys(SITE_ACT).forEach(function (k) { ACT[k] = SITE_ACT[k]; });
function legacyOrders() {
  if (!CLOUD) return [];
  try { if (store.getItem('sbs.legacy.uploaded')) return []; var d = JSON.parse(store.getItem(LEGACY_KEY)); return (d && d.orders || []).filter(function (o) { return !o.sample; }); } catch (e) { return []; }
}
function uploadOrders(list, done) {
  var have = {}; db.orders.forEach(function (o) { have[o.id] = 1; });
  var rows = list.filter(function (o) { return !have[o.id]; }).map(function (o) {
    var r = toRow(o, orderKeys().concat(['status'])); if (!r.name) r.name = 'No name';
    if (o.createdAt) r.created_at = new Date(o.createdAt).toISOString();
    return r;
  });
  if (!rows.length) { done(0); return; }
  sb.from('orders').insert(rows).select().then(function (r) {
    if (r.error) throw r.error;
    r.data.forEach(function (row) { upsertLocalOrder(fromRow(row)); }); save(); done(r.data.length);
  }).catch(function (e) { toast(netMsg(e)); });
}
function restore(replace) {
  var raw = ($('#rsBox').value || '').trim().replace(/^SBSBACKUP1:/, '');
  var b; try { b = JSON.parse(raw); } catch (e) { toast('That doesn’t look like a backup'); return false; }
  if (!b || !b.orders) { toast('That doesn’t look like a backup'); return false; }
  if (CLOUD) { closeModal(); uploadOrders(b.orders, function (n) { toast(n ? 'Added ' + n + ' orders to the shared list' : 'Those orders are already in the list'); rerender(); }); return; }
  if (replace) {
    db.orders = b.orders; if (b.menu) db.menu = b.menu; if (b.settings) db.settings = Object.assign(defaultSettings(), b.settings); db.seq = Math.max(db.seq || 1000, b.seq || 1000);
    save(); closeModal(); rerender(); toast('Restored ' + b.orders.length + ' orders'); return;
  }
  var have = {}, added = 0, updated = 0;
  db.orders.forEach(function (o) { have[o.id] = o; });
  b.orders.forEach(function (o) {
    if (!have[o.id]) { db.orders.push(o); added++; }
    else if ((o.updatedAt || 0) > (have[o.id].updatedAt || 0)) { Object.assign(have[o.id], o); updated++; }
  });
  db.seq = Math.max(db.seq || 1000, b.seq || 1000);
  save(); closeModal(); rerender(); toast(added + ' added, ' + updated + ' updated');
}

/* ---------- events ---------- */
document.addEventListener('click', function (e) {
  var mb = e.target.closest('[data-mb]');
  if (mb) {
    var b = modalButtons[+mb.dataset.mb];
    var keep = b && b.fn ? b.fn() === false : false;
    if (!keep) closeModal();
    return;
  }
  if (e.target.id === 'modal') { closeModal(); return; }
  var rep = e.target.closest('a[data-replace]');
  if (rep) { e.preventDefault(); ui.nDraft = null; ui.mDraft = null; ui.bDraft = null; go(rep.getAttribute('href'), true); return; }
  var el = e.target.closest('[data-act]');
  var link = e.target.closest('a[href^="#/"]');
  if (link && MEM) { e.preventDefault(); if (el && ACT[el.dataset.act]) ACT[el.dataset.act](el, e); go(link.getAttribute('href')); return; }
  if (!el) return;
  var a = ACT[el.dataset.act];
  if (!a) return;
  if (el.tagName !== 'A' && el.tagName !== 'INPUT') e.preventDefault();
  a(el, e);
});
document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.dataset.field === 'q') {
    ui.q = t.value;
    var tmp = document.createElement('div'); tmp.innerHTML = viewOrders();
    var nl = tmp.querySelector('#olist'), ol = $('#olist'), ns = tmp.querySelector('.seg'), os = $('.seg');
    if (nl && ol) ol.innerHTML = nl.innerHTML; if (ns && os) os.innerHTML = ns.innerHTML;
    return;
  }
  if (t.dataset.draft && draft) {
    var k = t.dataset.draft;
    draft[k] = t.type === 'checkbox' ? t.checked : t.value; saveDraft();
    if (k === 'slot' || k === 'date') { rerender(); return; }
    var tot = $('#fTotal'); if (tot) tot.textContent = totalLabel(draft);
  }
  if (t.id === 'pmA1' || t.id === 'pmA2') { var st = $('#pmSplitTot'); if (st) st.textContent = 'Total: ' + money(num($('#pmA1').value) + num($('#pmA2').value)); }
  if (draft && (t.id === 'fPayAmt' || t.dataset.disc || t.dataset.line != null)) setTimeout(function () {
    var got = draft.payPlan === 'full' ? orderTotal(draft) : draft.payPlan === 'deposit' ? num(draft.payAmt) : collected(draft);
    var a = $('#fpTot'), b = $('#fpGot'), c = $('#fpDue'); if (a) a.textContent = totalLabel(draft); if (b) b.textContent = money(got); if (c) c.textContent = money(Math.max(0, orderTotal(draft) - got));
  }, 0);
  if (t.dataset.disc && draft && draft.discount) { draft.discount[t.dataset.disc] = t.value; saveDraft(); var ft = $('#fTotal'); if (ft) ft.textContent = totalLabel(draft); var fd = $('#fDisc'); if (fd) fd.textContent = discountAmt(draft) ? '−' + money(discountAmt(draft)) : ''; }
  if (t.dataset.line != null && draft) { draft.items[+t.dataset.line].price = t.value; saveDraft(); var tt = $('#fTotal'); if (tt) tt.textContent = totalLabel(draft); }
  if (t.dataset.setting) { db.settings[t.dataset.setting] = t.value; saveMessagesSoon(); }
  if (t.dataset.mk && ui.mDraft) ui.mDraft[t.dataset.mk] = t.type === 'checkbox' ? t.checked : t.value;
  if (t.dataset.bd && ui.bDraft) ui.bDraft[t.dataset.bd] = t.type === 'checkbox' ? t.checked : t.value;
  if (t.dataset.bl && ui.bDraft) ui.bDraft.lines[+t.dataset.i][t.dataset.bl] = t.value;
  if (t.dataset.nt && ui.nDraft) { ui.nDraft[t.dataset.nt] = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.nt === 'paused') rerender(); }
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset.draft && draft && (t.type === 'checkbox' || t.tagName === 'SELECT' || t.type === 'date')) { draft[t.dataset.draft] = t.type === 'checkbox' ? t.checked : t.value; saveDraft(); if (t.type !== 'checkbox') rerender(); }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.getElementById('modal').hidden) closeModal(); });
document.addEventListener('submit', function (e) { if (e.target.id === 'loginForm') { e.preventDefault(); ACT.login(); } });

/* ---------- start ---------- */
if (window.SBS_PREVIEW && !store.getItem('sbs.preview.seeded7')) {
  db.orders = sampleOrders();
  db.orders[3].paidAmount = 20; db.orders[3].paid = false; db.orders[3].payments = [{ amount: 20, date: today(), parts: [{ method: 'Revolut', amount: 20 }] }];
  if (db.orders[2]) { db.orders[2].discount = { type: 'percent', value: 10, note: 'Friends & family' }; }
  var t0 = today();
  db.offers = [];
  db.markets = [{"name": "Meeting House Square Food & Farmers Market", "kind": "Market", "status": "active", "place": "Temple Bar, Dublin 2", "address": "Meeting House Square, Temple Bar, Dublin 2", "days": [6], "startTime": "10:00", "endTime": "", "skipDates": ["2026-11-07"], "notes": "Pre-order on WhatsApp", "description": "Saturday crowds, warm cookies and plenty of new faces in the heart of Dublin."}, {"name": "Portobello Market", "kind": "Market", "status": "active", "place": "We Love Market, Portobello", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "Our stall at the Portobello market, run by the We Love Market team."}, {"name": "Boland's Mills Market", "kind": "Market", "status": "active", "place": "We Love Market, Grand Canal Dock", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "Our stall at the We Love Market at Boland's Mills, one of Dublin's best-known spots."}, {"name": "The Digital Hub Market", "kind": "Market", "status": "active", "place": "We Love Market, The Liberties", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "Our stall at the We Love Market at the Digital Hub, with fresh bakes for the teams and neighbours around it."}, {"name": "Taste of Dublin", "kind": "Festival", "status": "past", "place": "Dublin", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "Our stall among the city's best food names, sharing our handmade bakes with thousands of food lovers."}, {"name": "Mountain View Market", "kind": "Market", "status": "past", "place": "Dublin", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "A friendly neighbourhood market where regulars started coming back every week."}, {"name": "Ireland Telugu Association", "kind": "Community", "status": "past", "place": "Community events", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "Festival and community events with the Telugu community, with bakes that taste like home."}, {"name": "Cheese & Wine Festival", "kind": "Festival", "status": "past", "place": "The Bernard Shaw, Dublin", "address": "", "days": [], "startTime": "", "endTime": "", "skipDates": [], "notes": "", "description": "A weekend of tastings and pairings at The Bernard Shaw, with our sweet side of the table."}].map(function (m, k) { return Object.assign({ id: newId(), mapsUrl: m.address ? mapsUrl(m.address) : '', startsOn: '', endsOn: '', active: true, sort: k }, m); });
  save(); try { store.setItem('sbs.preview.seeded7', '1'); } catch (e) {}
}
if (!MEM && !location.hash) { try { history.replaceState(null, '', '#/orders'); } catch (e) {} }
if (CLOUD) {
  sb = window.supabase.createClient(window.SBS_CONFIG.url, window.SBS_CONFIG.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'sbs.auth' } });
  sb.auth.getSession().then(function (r) {
    net.user = r && r.data && r.data.session ? r.data.session.user : null;
    net.checked = true; render(); if (net.user) startCloud();
  }, function () { net.checked = true; render(); });
  sb.auth.onAuthStateChange(function (ev, session) { if (ev === 'SIGNED_OUT' && net.user) { net.user = null; render(); } });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && net.user && Date.now() - net.lastPull > 15000) pull(); });
  window.addEventListener('online', function () { if (net.user) pull(); });
  window.addEventListener('offline', function () { setOffline(true); });
}
render();
if ('serviceWorker' in navigator && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(function () {}); }
})();
