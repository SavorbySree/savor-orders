/* Savor by Sree · Orders — runs fully on the phone, data saved on the device */
(function () {
'use strict';

/* ---------- constants ---------- */
var LEGACY_KEY = 'sbs.data.v1', DRAFT_KEY = 'sbs.draft.v1';
var CLOUD = !!(window.SBS_CONFIG && window.SBS_CONFIG.url && window.supabase && window.supabase.createClient);
var KEY = CLOUD ? 'sbs.cloud.v1' : LEGACY_KEY;
var VERSION = '2.2.0';
var SLOTS = ['5–6 pm', '6–7 pm', '7–8 pm', '8–9 pm', '9–10 pm', '10–11 pm'];
var SOURCES = [['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['website', 'Website'], ['phone', 'Phone call'], ['market', 'Market'], ['other', 'Other']];
var STATUS = { pending: 'To confirm', confirmed: 'Confirmed', ready: 'Ready', delivered: 'Delivered', cancelled: 'Cancelled' };
var CATS = ['Bundles', 'Cookies', 'Brownies', 'Cheesecakes', 'Basque', 'Tiramisu', 'Tres Leches', 'Savoury', 'Cakes', 'Add-ons'];
var ALLERGENS = ['Gluten', 'Milk', 'Eggs', 'Nuts', 'Peanuts', 'Soya', 'Sesame', 'Celery', 'Mustard', 'Sulphites', 'Lupin', 'Fish', 'Crustaceans', 'Molluscs'];
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
function defaultMenu() {
  var p4 = function (price) { return [opt('Pack of 4', price)]; };
  return [
    m('share-box', 'Bundles', 'Share Box', [opt('Bundle', 32)], { includes: ['Chocochip Cookies · Pack of 4', 'Brownie · Sharing tray'] }),
    m('treat-box', 'Bundles', 'Treat Box', [opt('Bundle', 32)], { includes: ['Chocochip Cookies · Pack of 4', 'Cheesecakes or Basque · Pack of 4'] }),
    m('dessert-duo', 'Bundles', 'Dessert Duo', [opt('Bundle', 38)], { includes: ['Tiramisu · Sharing tray', 'Brownie · Sharing tray'] }),
    m('birthday-bundle', 'Bundles', 'Birthday Bundle', [opt('Bundle', 48)], { includes: ['6 inch cake', 'Chocochip Cookies · Pack of 4', 'Candles and card'] }),
    m('diwali-hamper', 'Bundles', 'Diwali Delights hamper', [opt('Hamper', 30)], { seasonal: true, includes: ['Diwali Delights hamper'] }),
    m('cookie-chocochip', 'Cookies', 'Chocochip Cookies', p4(16)),
    m('cookie-pistachio', 'Cookies', 'Pistachio NYC Cookies', p4(16)),
    m('cookie-gulab', 'Cookies', 'Gulab Jamun Cookies', p4(16), { seasonal: true }),
    m('brownie', 'Brownies', 'Brownie', [opt('Sharing tray', 20), opt('Celebration tray', 38)]),
    m('cheesecake', 'Cheesecakes', 'Cheesecakes', p4(20)),
    m('basque', 'Basque', 'Burnt Basque', p4(20)),
    m('tiramisu', 'Tiramisu', 'Tiramisu', [opt('Sharing tray', 22), opt('Celebration tray', 40)]),
    m('tl-rasmalai', 'Tres Leches', 'Rasmalai Tres Leches', [opt('Sharing tray', 25), opt('Celebration tray', 40)]),
    m('tl-rose', 'Tres Leches', 'Rose & Pistachio Tres Leches', [opt('Sharing tray', 25), opt('Celebration tray', 40)]),
    m('tl-classic', 'Tres Leches', 'Classic Tres Leches with Fruits', [opt('Sharing tray', 20), opt('Celebration tray', 35)]),
    m('savoury', 'Savoury', 'Savoury Bakes', p4(16)),
    m('cake', 'Cakes', 'Celebration cake', [opt('6 inch, 3 layers (~1 kg, serves 8–10)', 35), opt('10 inch (~1.5 kg, serves 10–15)', 50), opt('Custom (quote)', 0)]),
    m('addon-twoflav', 'Add-ons', 'Two-flavour cake', [opt('Extra', 5)]),
    m('addon-fondant', 'Add-ons', 'Fondant finish', [opt('Per 0.5 kg', 5)]),
    m('addon-candles', 'Add-ons', 'Candles', [opt('Set', 0.75)]),
    m('addon-knife', 'Add-ons', 'Wooden knife', [opt('Each', 0.75)]),
    m('addon-card', 'Add-ons', 'Personalised greeting card', [opt('Each', 2.99)])
  ];
}
function defaultSettings() {
  return {
    confirmMsg: 'Hi {name}, thank you for ordering with Savor by Sree! Your order {ref} is confirmed.\n\n{items}\n\n{when_line}\nTotal: {total}\n\nSee you soon!',
    readyMsg: 'Hi {name}, your Savor by Sree order {ref} is ready for {mode} ({when}).',
    onwayMsg: 'Hi {name}, your Savor by Sree order is on its way! We should be with you around {slot}.'
  };
}
function defaultNotices() { return { topbar: '', topbarUntil: '', paused: false, pauseMessage: 'We’re not taking new orders right now. Message us on WhatsApp and we’ll let you know when we reopen.', closedDates: [], noticeDays: 2 }; }
function fresh() { return { v: 1, seq: 1000, menu: defaultMenu(), orders: [], settings: defaultSettings(), bake: {}, offers: [], markets: [], notices: defaultNotices() }; }
var store = (function () { try { var t = '__t'; localStorage.setItem(t, t); localStorage.removeItem(t); return localStorage; } catch (e) { var mem = {}; return { getItem: function (k) { return mem[k] || null; }, setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } }; } })();
function load() {
  try {
    var d = JSON.parse(store.getItem(KEY));
    if (d && d.menu && d.orders) { d.settings = Object.assign(defaultSettings(), d.settings || {}); d.bake = d.bake || {}; d.offers = d.offers || []; d.markets = d.markets || []; d.notices = Object.assign(defaultNotices(), d.notices || {}); return d; }
  } catch (e) {}
  return fresh();
}
var db = load();
function save() { try { store.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('Could not save: phone storage is full'); } }

/* ---------- shared online database (Supabase) ---------- */
var sb = null, net = { checked: !CLOUD, user: null, offline: false, syncing: false, chan: null, lastPull: 0 };
var FIELD = { name: 'name', phone: 'phone', source: 'source', items: 'items', mode: 'mode', date: 'order_date', address: 'address', fee: 'fee', notes: 'notes', paid: 'paid', paidAmount: 'paid_amount', status: 'status' };
var ORDER_KEYS = ['name', 'phone', 'source', 'items', 'mode', 'date', 'slot', 'address', 'fee', 'notes', 'paidAmount', 'paid'];
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
    else if (k === 'items') v = (v || []).map(function (l) { return { menuId: l.menuId || null, name: l.name, option: l.option || '', price: num(l.price), qty: l.qty || 1 }; });
    r[c] = v;
  });
  return r;
}
function fromRow(r) {
  var slot = r.slot || '', known = !slot || SLOTS.indexOf(slot) >= 0;
  return { id: r.id, ref: r.ref, status: r.status, source: r.source || 'other', name: r.name || '', phone: r.phone || '', mode: r.mode || 'collection',
    date: r.order_date || '', slot: known ? slot : 'other', slotOther: known ? '' : slot, address: r.address || '', fee: r.fee == null ? '' : String(+r.fee),
    notes: r.notes || '', paid: !!r.paid, paidAmount: r.paid_amount == null ? 0 : +r.paid_amount, items: Array.isArray(r.items) ? r.items : [], createdAt: Date.parse(r.created_at) || 0, updatedAt: Date.parse(r.updated_at) || 0 };
}
function toMenuRow(it, i) { return { id: it.id, cat: it.cat, name: it.name, description: it.description || null, allergens: it.allergens || [], options: it.options || [], includes: it.includes || [], active: it.active !== false, seasonal: !!it.seasonal, sort: i == null ? (it.sort || 0) : i }; }
function fromMenuRow(r) { return { id: r.id, cat: r.cat, name: r.name, description: r.description || '', allergens: Array.isArray(r.allergens) ? r.allergens : [], options: r.options || [], includes: r.includes || [], active: !!r.active, seasonal: !!r.seasonal, sort: r.sort || 0 }; }
function newId() { try { if (crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {} return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }); }
function fromOfferRow(r) { return { id: r.id, title: r.title || '', details: r.details || '', percentOff: r.percent_off == null ? '' : +r.percent_off, amountOff: r.amount_off == null ? '' : +r.amount_off, itemIds: Array.isArray(r.item_ids) ? r.item_ids : [], startsOn: r.starts_on || '', endsOn: r.ends_on || '', active: r.active !== false, sort: r.sort || 0 }; }
function toOfferRow(o) { return { id: o.id, title: o.title, details: o.details || null, percent_off: o.percentOff === '' || o.percentOff == null ? null : num(o.percentOff), amount_off: o.amountOff === '' || o.amountOff == null ? null : num(o.amountOff), item_ids: o.itemIds || [], starts_on: o.startsOn || null, ends_on: o.endsOn || null, active: !!o.active, sort: o.sort || 0 }; }
function fromMarketRow(r) { return { id: r.id, name: r.name || '', place: r.place || '', address: r.address || '', mapsUrl: r.maps_url || '', repeat: r.repeat || 'once', weekday: r.weekday == null ? 6 : +r.weekday, date: r.market_date || '', startTime: r.start_time || '', endTime: r.end_time || '', startsOn: r.starts_on || '', endsOn: r.ends_on || '', skipDates: Array.isArray(r.skip_dates) ? r.skip_dates : [], notes: r.notes || '', active: r.active !== false, sort: r.sort || 0 }; }
function toMarketRow(m) { return { id: m.id, name: m.name, place: m.place || null, address: m.address || null, maps_url: m.mapsUrl || null, repeat: m.repeat, weekday: m.repeat === 'weekly' ? m.weekday : null, market_date: m.repeat === 'once' ? (m.date || null) : null, start_time: m.startTime || null, end_time: m.endTime || null, starts_on: m.startsOn || null, ends_on: m.endsOn || null, skip_dates: m.skipDates || [], notes: m.notes || null, active: !!m.active, sort: m.sort || 0 }; }
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
    if (!res[5].error) res[5].data.forEach(function (row) { if (row.key === 'notices') db.notices = Object.assign(defaultNotices(), row.value || {}); });
    db.orders = res[0].data.map(fromRow);
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
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, function (p) { if (p.new && p.new.key === 'notices') { db.notices = Object.assign(defaultNotices(), p.new.value || {}); save(); softRender(); } })
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
  if (!force && (r === 'new' || r === 'edit' || r === 'offer' || r === 'market' || r === 'notices' || (r === 'menu' && curRoute().split('/')[2]) || typing)) { var b = document.querySelector('.tabs'); if (b && r !== 'new' && r !== 'edit') b.outerHTML = tabsHtml(r); return; }
  if (!document.getElementById('modal').hidden) { if (force) closeModal(); else { ui.pendingRender = true; return; } }
  rerender();
}
function saveSetting(key, value) { if (!CLOUD) { save(); return; } remote(sb.from('settings').upsert({ key: key, value: value })); }
var settingTimer = null;
function saveMessagesSoon() { save(); clearTimeout(settingTimer); settingTimer = setTimeout(function () { saveSetting('messages', db.settings); }, 700); }
function getOrder(id) { for (var i = 0; i < db.orders.length; i++) if (db.orders[i].id === id) return db.orders[i]; return null; }
function getItem(id) { for (var i = 0; i < db.menu.length; i++) if (db.menu[i].id === id) return db.menu[i]; return null; }
function subtotal(o) { return (o.items || []).reduce(function (s, l) { return s + num(l.price) * (l.qty || 0); }, 0); }
function orderTotal(o) { return subtotal(o) + (o.mode === 'delivery' ? num(o.fee) : 0); }
function totalLabel(o) { var t = money(orderTotal(o)); return (o.mode === 'delivery' && (o.fee === '' || o.fee == null)) ? t + ' + delivery' : t; }
/* Payments: amount collected so far. Older orders that were only ticked "paid" count as fully paid. */
function collected(o) { var a = num(o.paidAmount); if (!a && o.paid) return orderTotal(o); return a; }
function pendingAmt(o) { return Math.max(0, Math.round((orderTotal(o) - collected(o)) * 100) / 100); }
function isPaid(o) { var t = orderTotal(o); return t > 0 ? collected(o) >= t - 0.004 : !!o.paid; }
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
  var out = [], t = today();
  if (m.repeat === 'once') { if (m.date && m.date >= t) out.push(m.date); return out; }
  var d = parseIso(m.startsOn && m.startsOn > t ? m.startsOn : t), guard = 0;
  while (d.getDay() !== +m.weekday && guard++ < 7) d.setDate(d.getDate() + 1);
  for (var i = 0; out.length < (count || 4) && i < 60; i++) { var s = iso(d); if (m.endsOn && s > m.endsOn) break; if ((m.skipDates || []).indexOf(s) < 0) out.push(s); d.setDate(d.getDate() + 7); }
  return out;
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
function itemsText(o) { return (o.items || []).map(function (l) { return '• ' + l.qty + ' × ' + l.name + (optText(l) ? ' (' + optText(l) + ')' : '') + ' ' + money(num(l.price) * l.qty); }).join('\n'); }
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
    mk('Ciara Byrne', '086 000 2202', 'whatsapp', [L('cookie-pistachio', 0, 2)], 'collection', 2, '6–7 pm', 'pending'),
    mk('Ananya Rao', '089 000 3303', 'instagram', [L('diwali-hamper', 0, 3)], 'delivery', 4, '8–9 pm', 'pending', false, 'D08 XY12'),
    mk('Seán Murphy', '085 000 4404', 'whatsapp', [L('tiramisu', 1)], 'collection', 1, '5–6 pm', 'confirmed', true),
    mk('Meera Shah', '087 000 5505', 'website', [L('dessert-duo')], 'delivery', 1, '9–10 pm', 'confirmed', false, 'D06 K2P4', 5),
    mk('Aoife Kelly', '083 000 6606', 'whatsapp', [L('basque'), L('cookie-chocochip')], 'collection', 0, '6–7 pm', 'ready', true),
    mk('Arjun Menon', '087 000 7707', 'phone', [L('cake', 1), L('addon-candles'), L('addon-card')], 'delivery', 0, '8–9 pm', 'confirmed', false, 'D15 X2Y3', 6, 'Chocolate ganache finish, 10 inch'),
    mk('Niamh Walsh', '086 000 8808', 'instagram', [L('tl-rasmalai')], 'collection', -1, '7–8 pm', 'delivered', true)
  ];
}
function hasSamples() { return db.orders.some(function (o) { return o.sample; }); }

/* ---------- draft (order being added / edited) ---------- */
var draft = null;
function blankDraft() { return { key: 'new', id: null, name: '', phone: '', source: 'whatsapp', items: [], mode: 'collection', date: addDays(today(), 2), slot: '6–7 pm', slotOther: '', address: '', fee: '', notes: '', paid: false, paidAmount: '' }; }
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
    draft = JSON.parse(JSON.stringify(o)); draft.key = key; draft.paidAmount = collected(o) || '';
  }
  saveDraft();
  return draft;
}
function draftHasContent(d) { return d && (d.name || d.phone || (d.items && d.items.length) || d.notes || d.address); }

/* ---------- UI shell ---------- */
var app = document.getElementById('app');
var ui = { ordersTab: 'pending', q: '', day: today(), menuCat: 'Bundles', pickCat: 'Bundles' };

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
  return '<header class="top"><div class="top-inner"><div class="top-row"><img class="logo" src="logo.jpg" alt="" width="46" height="46"><div class="brand"><b>Savor by Sree</b><small>Orders · ' + esc(fmtDate(today(), true)) + (window.SBS_PREVIEW ? ' · preview with sample orders' : '') + '</small></div></div>' +
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
  return '<article class="card order-card"><a class="body" href="#/order/' + o.id + '">' +
    '<div class="row">' + sourcePill(o.source) + '<span class="ref">' + esc(o.ref) + '</span><span class="total">' + esc(totalLabel(o)) + '</span></div>' +
    '<div class="name">' + esc(o.name || 'No name') + '</div><div class="items-line">' + esc(itemsSummary(o)) + '</div>' +
    '<div class="meta">' + I.cal + '<span>' + esc(fmtDate(o.date)) + (slotOf(o) ? ', ' + esc(slotOf(o)) : '') + '</span><span aria-hidden="true">·</span><span>' + (o.mode === 'delivery' ? 'Delivery' : 'Collection') + '</span>' +
    (o.status !== 'pending' && o.status !== 'cancelled' ? payPill(o, true) : '') + (o.status === 'ready' || o.status === 'cancelled' ? statusPill(o.status) : '') + '</div></a>' + actions + '</article>';
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
      '<div class="btns">' + (pendingAmt(o) > 0 ? '<button class="btn sm" data-act="payAdd" data-id="' + o.id + '">' + I.plus + 'Record payment</button><button class="btn sm ghost" data-act="payFull" data-id="' + o.id + '">Paid in full</button>'
        : '<button class="btn sm ghost" data-act="payReset" data-id="' + o.id + '">Change payment</button>') + '</div></section>' +
    '<section class="card" style="display:flex;flex-direction:column;gap:10px"><div class="section-title" style="margin:0">Message the customer</div>' + msgs + '</section>' +
    '<div class="btns"><a class="btn ghost" href="#/edit/' + o.id + '">Edit order</a><button class="btn danger" data-act="cancelOrder" data-id="' + o.id + '">' + (o.status === 'cancelled' ? 'Delete' : 'Cancel order') + '</button></div>' +
    (o.status !== 'cancelled' ? '<button class="btn sm ghost" data-act="deleteOrder" data-id="' + o.id + '" style="align-self:center;border:0;color:var(--red);background:transparent">Delete permanently</button>' : '') +
    '<p class="hint" style="text-align:center;font-size:12px;color:var(--muted);margin:0">Added ' + esc(new Date(o.createdAt || Date.now()).toLocaleString('en-IE', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })) + '</p>' +
    '</main><div class="bar">' + main + '</div>';
}

/* ---------- Add / edit form ---------- */
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
      '<div class="field"><label for="fPaid">Paid so far (€)</label><input class="input" id="fPaid" inputmode="decimal" data-draft="paidAmount" value="' + esc(d.paidAmount === 0 ? '' : (d.paidAmount == null ? '' : d.paidAmount)) + '" placeholder="0"><span class="hint">For a deposit, enter the amount received. Leave empty if nothing is paid yet.</span></div>' +
    '</section>' +
    '</main><div class="bar"><div class="sum big" style="border:0;margin:0;padding:0"><span>Total</span><span id="fTotal">' + esc(totalLabel(d)) + '</span></div><button class="btn block" data-act="saveOrder">' + I.check + (isNew ? 'Save order' : 'Save changes') + '</button></div>';
}

function viewPicker(key) {
  var d = ensureDraft(key);
  if (!d) { go('#/orders', true); return null; }
  var cat = ui.pickCat;
  var used = {};
  db.menu.forEach(function (it) { if (it.active) used[it.cat] = 1; });
  var cats = CATS.filter(function (c) { return used[c]; });
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
  return '<header class="top"><div class="top-inner"><div class="top-row"><div class="brand"><b>' + esc(fmtDate(day, true)) + '</b><small>' + live.length + ' to hand over · ' + done.length + ' done · ' + money(due) + '</small></div>' +
    (day !== t ? '<button class="btn sm ghost" data-act="day" data-v="' + t + '">Today</button>' : '') + '</div><div class="days" role="group" aria-label="Pick a day">' + strip + '</div></div></header>' +
    '<main>' + (pend.length ? '<a class="card" href="#/orders" data-act="ordersTabGo" style="text-decoration:none;color:var(--warn);font-weight:700;font-size:14px;background:var(--paper)">' + pend.length + ' order' + (pend.length > 1 ? 's' : '') + ' for this day still to confirm</a>' : '') +
    '<section class="card"><div class="section-title" style="margin:0 0 6px">Bake list <small>' + (keys.length ? doneCount + ' of ' + keys.length + ' done' : '') + '</small></div>' + bakeHtml + '</section>' +
    '<div class="section-title">Hand-overs</div>' + (hand || '<div class="card" style="font-size:14px;color:var(--muted)">No collections or deliveries for this day.</div>') + '</main>' + tabsHtml('today');
}

/* ---------- Menu ---------- */
function viewMenu() {
  var cat = ui.menuCat;
  var cats = CATS.slice();
  db.menu.forEach(function (it) { if (cats.indexOf(it.cat) < 0) cats.push(it.cat); });
  var chips = cats.map(function (c) { var n = db.menu.filter(function (it) { return it.cat === c; }).length; return '<button class="chip" data-act="menuCat" data-v="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + ' <small>' + n + '</small></button>'; }).join('');
  var rows = db.menu.filter(function (it) { return it.cat === cat; }).map(function (it) {
    return '<article class="card menu-row' + (it.active ? '' : ' off') + '"><a href="#/menu/edit/' + it.id + '"><span class="nm">' + esc(it.name) + (it.seasonal ? ' <span class="pill p-pending" style="height:20px;font-size:11px">Seasonal</span>' : '') + '</span><span class="pr">' +
      esc(it.options.map(function (o) { return o.label + ' ' + (o.price ? money(o.price) : 'quote'); }).join(' · ')) + '</span>' + (it.allergens && it.allergens.length ? '<span class="pr" style="color:var(--muted);font-size:12px">Contains: ' + esc(it.allergens.join(', ')) + '</span>' : '') + '</a>' +
      '<label class="sw"><input type="checkbox" data-act="menuActive" data-id="' + it.id + '"' + (it.active ? ' checked' : '') + '>' + (it.active ? 'On' : 'Off') + '</label></article>';
  }).join('') || '<div class="empty"><b>No items in ' + esc(cat) + '</b></div>';
  return siteHeader('menu', '<a class="btn sm" href="#/menu/new">' + I.plus + 'Item</a>', '<div class="chips" role="group" aria-label="Category" style="margin-top:12px">' + chips + '</div>') + '<main><p class="intro">Items switched off are hidden on the website and when adding orders. Hampers and bundles are under Bundles.</p>' + rows + '</main>' + tabsHtml('menu');
}
function viewMenuEdit(id) {
  var it = id ? getItem(id) : null;
  if (id && !it) { go('#/menu', true); return null; }
  var v = it || { name: '', cat: ui.menuCat, options: [{ label: 'Pack of 4', price: '' }], includes: [], active: true, seasonal: false };
  var cats = CATS.slice(); db.menu.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
  var optRows = v.options.map(function (o, i) {
    return '<div class="opt-row"><input class="input" data-opt="label" data-i="' + i + '" value="' + esc(o.label) + '" placeholder="Size, e.g. Sharing tray" aria-label="Size ' + (i + 1) + '"><label class="price-wrap">€<input class="price-in" inputmode="decimal" data-opt="price" data-i="' + i + '" value="' + esc(o.price) + '" aria-label="Price ' + (i + 1) + '"></label></div>';
  }).join('');
  return topBack(it ? 'Edit item' : 'New item', it ? it.cat : '') +
    '<main class="has-bar"><form id="menuForm" class="card" style="display:flex;flex-direction:column;gap:14px" onsubmit="return false">' +
    '<div class="field"><label for="mName">Name</label><input class="input" id="mName" name="name" value="' + esc(v.name) + '"' + (it ? '' : ' data-autofocus') + '></div>' +
    '<div class="field"><label for="mCat">Category</label><select class="input" id="mCat" name="cat">' + cats.map(function (c) { return '<option' + (c === v.cat ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
    '<div class="field"><span class="label">Sizes and prices</span><div id="optRows" style="display:flex;flex-direction:column;gap:8px">' + optRows + '</div><button type="button" class="btn sm ghost" data-act="addOptRow">' + I.plus + 'Add a size</button><span class="hint">Leave the price at 0 for “by quote”. Clear a size’s name to remove it.</span></div>' +
    '<div class="field"><label for="mDesc">Description (shown on the website)</label><textarea class="input" id="mDesc" name="description" placeholder="e.g. Rich chocolate brownie with walnuts">' + esc(v.description || '') + '</textarea></div>' +
    '<div class="field"><span class="label">Allergens</span><div class="wrap-chips" id="allergenChips">' + ALLERGENS.map(function (a) { var on = (v.allergens || []).indexOf(a) >= 0; return '<label class="chip" style="cursor:pointer"><input type="checkbox" name="allergen" value="' + a + '"' + (on ? ' checked' : '') + ' style="accent-color:var(--brown)">' + a + '</label>'; }).join('') + '</div><span class="hint">The 14 EU allergens. Shown on the website menu.</span></div>' +
    '<div class="field"><label for="mInc">What’s inside (bundles)</label><textarea class="input" id="mInc" name="includes" placeholder="One per line, e.g. Brownie · Sharing tray">' + esc((v.includes || []).join('\n')) + '</textarea><span class="hint">Used to build the bake list.</span></div>' +
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
  return '<header class="top"><div class="top-inner"><div class="top-row"><div class="brand"><b>Website</b><small>Changes show on the website straight away</small></div>' + (right || '') + '</div>' +
    '<nav class="segnav" aria-label="Website sections">' + tabs + '</nav>' + (extra || '') + '</div></header>' +
    (CLOUD && net.user && net.siteReady === false && cur !== 'menu' ? '<div class="setup-warn" role="alert">Offers, markets and notices need the latest setup code in Supabase. Run it in the SQL Editor, then tap Refresh on the More page.</div>' : '');
}
function viewOffers() {
  var list = db.offers.slice().sort(function (a, b) { return (b.startsOn || '').localeCompare(a.startsOn || ''); });
  var cards = list.map(function (of) {
    var st = offerState(of), n = (of.itemIds || []).length;
    return '<article class="card menu-row' + (of.active ? '' : ' off') + '"><a href="#/offer/' + of.id + '"><span class="nm">' + esc(of.title) + ' <span class="pill ' + st[1] + '" style="height:20px;font-size:11px">' + esc(st[0]) + '</span></span>' +
      '<span class="pr">' + esc(offerLabel(of)) + (n ? ' · ' + n + ' item' + (n > 1 ? 's' : '') : ' · shown on the website only') + '</span>' +
      '<span class="pr" style="color:var(--muted);font-size:12px">' + esc((of.startsOn ? fmtDate(of.startsOn, true) : 'From now') + ' – ' + (of.endsOn ? fmtDate(of.endsOn, true) : 'no end date')) + '</span></a>' +
      '<label class="sw"><input type="checkbox" data-act="offerActive" data-id="' + of.id + '"' + (of.active ? ' checked' : '') + '>' + (of.active ? 'On' : 'Off') + '</label></article>';
  }).join('') || '<div class="empty"><b>No offers yet</b><p>Create an offer to show it on the website. If you pick items, the discount is also applied when you add them to an order.</p></div>';
  return siteHeader('offers', '<a class="btn sm" href="#/offer/new">' + I.plus + 'Offer</a>') + '<main>' + cards + '</main>' + tabsHtml('menu');
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
    '<div class="field"><label for="oTitle">Offer name</label><input class="input" id="oTitle" name="title" value="' + esc(v.title) + '" placeholder="e.g. Diwali week: 15% off Tres Leches"' + (of ? '' : ' data-autofocus') + '></div>' +
    '<div class="field"><label for="oDetails">Details for the website</label><textarea class="input" id="oDetails" name="details" placeholder="e.g. Order by Friday for collection on the weekend.">' + esc(v.details) + '</textarea></div>' +
    '<div class="field"><span class="label">Discount</span><div class="toggle" role="group" aria-label="Discount type"><button type="button" data-act="offerKind" data-v="percent" aria-pressed="' + (ui.offerKind === 'percent') + '">% off</button><button type="button" data-act="offerKind" data-v="amount" aria-pressed="' + (ui.offerKind === 'amount') + '">€ off each</button></div>' +
      '<input class="input" id="oValue" name="value" inputmode="decimal" value="' + esc(ui.offerKind === 'amount' ? v.amountOff : v.percentOff) + '" placeholder="' + (ui.offerKind === 'amount' ? 'e.g. 5' : 'e.g. 15') + '" aria-label="Discount amount"><span class="hint">Leave empty for a message-only offer, such as “Free candles with every cake”.</span></div>' +
    '<div class="grid2"><div class="field"><label for="oStart">Starts</label><input class="input" id="oStart" name="startsOn" type="date" value="' + esc(v.startsOn) + '"></div><div class="field"><label for="oEnd">Ends</label><input class="input" id="oEnd" name="endsOn" type="date" value="' + esc(v.endsOn) + '"></div></div>' +
    '<div class="field"><span class="label">Items the discount applies to</span><span class="hint">Picked items show the offer price on the website and when you add them to an order.</span>' + picks + '</div>' +
    '<label class="check"><input type="checkbox" name="active"' + (v.active ? ' checked' : '') + '>Offer switched on</label>' +
    '</form>' + (of ? '<button class="btn danger block" data-act="offerDelete" data-id="' + of.id + '">Delete offer</button>' : '') +
    '</main><div class="bar"><button class="btn block" data-act="offerSave" data-id="' + (of ? of.id : '') + '">' + I.check + 'Save offer</button></div>';
}
function viewMarkets() {
  var list = db.markets.slice().sort(function (a, b) { return (marketDates(a, 1)[0] || '9').localeCompare(marketDates(b, 1)[0] || '9'); });
  var cards = list.map(function (m) {
    var next = marketDates(m, 4), tt = timeText(m);
    return '<article class="card menu-row' + (m.active ? '' : ' off') + '"><a href="#/market/' + m.id + '"><span class="nm">' + esc(m.name) + (m.repeat === 'weekly' ? ' <span class="pill p-ready" style="height:20px;font-size:11px">Every ' + DAYS_LONG[m.weekday] + '</span>' : '') + '</span>' +
      '<span class="pr">' + esc([m.place, tt].filter(Boolean).join(' · ') || 'Add the place and times') + '</span>' +
      '<span class="pr" style="color:var(--muted);font-size:12px">' + (next.length ? 'Next: ' + esc(next.map(function (x) { return fmtDate(x, true); }).join(', ')) : 'No upcoming dates') + '</span></a>' +
      '<label class="sw"><input type="checkbox" data-act="marketActive" data-id="' + m.id + '"' + (m.active ? ' checked' : '') + '>' + (m.active ? 'On' : 'Off') + '</label></article>';
  }).join('') || '<div class="empty"><b>No markets yet</b><p>Add the markets and events where customers can find you. They show on the website with the next dates.</p></div>';
  return siteHeader('markets', '<a class="btn sm" href="#/market/new" data-act="mkNew">' + I.plus + 'Market</a>') + '<main>' + cards + '</main>' + tabsHtml('menu');
}
function viewMarketEdit(id) {
  var m = id ? byId(db.markets, id) : null;
  if (id && !m) { go('#/markets', true); return null; }
  if (!ui.mDraft || ui.mDraft._for !== (id || 'new')) { ui.mDraft = JSON.parse(JSON.stringify(m || { name: '', place: '', address: '', mapsUrl: '', repeat: 'weekly', weekday: 6, date: '', startTime: '10:00', endTime: '16:00', startsOn: '', endsOn: '', skipDates: [], notes: '', active: true })); ui.mDraft._for = id || 'new'; }
  var v = ui.mDraft;
  var days = DAYS_LONG.map(function (dn, i) { return '<option value="' + i + '"' + (+v.weekday === i ? ' selected' : '') + '>' + dn + '</option>'; }).join('');
  var skips = (v.skipDates || []).slice().sort().map(function (x) { return '<span class="chip">' + esc(fmtDate(x, true)) + '<button type="button" class="chip-x" data-act="skipDel" data-v="' + x + '" aria-label="Remove ' + esc(fmtDate(x, true)) + '">' + I.x + '</button></span>'; }).join('');
  return topBack(m ? 'Edit market' : 'New market', 'Website › Markets') +
    '<main class="has-bar"><form id="marketForm" class="card" style="display:flex;flex-direction:column;gap:14px" onsubmit="return false">' +
    '<div class="field"><label for="mkName">Market name</label><input class="input" id="mkName" data-mk="name" value="' + esc(v.name) + '" placeholder="e.g. Temple Bar Food Market"' + (m ? '' : ' data-autofocus') + '></div>' +
    '<div class="field"><label for="mkPlace">Place</label><input class="input" id="mkPlace" data-mk="place" value="' + esc(v.place) + '" placeholder="e.g. Meeting House Square"></div>' +
    '<div class="field"><label for="mkAddr">Address or Eircode (for directions)</label><input class="input" id="mkAddr" data-mk="address" value="' + esc(v.address) + '" placeholder="e.g. Meeting House Square, Temple Bar, Dublin 2"></div>' +
    '<div class="field"><span class="label">How often</span><div class="toggle" role="group" aria-label="How often"><button type="button" data-act="mkRepeat" data-v="weekly" aria-pressed="' + (v.repeat === 'weekly') + '">Every week</button><button type="button" data-act="mkRepeat" data-v="once" aria-pressed="' + (v.repeat === 'once') + '">One date</button></div></div>' +
    (v.repeat === 'weekly' ?
      '<div class="field"><label for="mkDay">Day</label><select class="input" id="mkDay" data-mk="weekday">' + days + '</select></div>' +
      '<div class="grid2"><div class="field"><label for="mkFrom">From (optional)</label><input class="input" id="mkFrom" type="date" data-mk="startsOn" value="' + esc(v.startsOn) + '"></div><div class="field"><label for="mkTo">Until (optional)</label><input class="input" id="mkTo" type="date" data-mk="endsOn" value="' + esc(v.endsOn) + '"></div></div>' +
      '<div class="field"><span class="label">Weeks you’re not there</span><div class="wrap-chips">' + (skips || '<span class="hint">None</span>') + '</div><div class="opt-row"><label class="sr" for="mkSkip">Date to skip</label><input class="input" id="mkSkip" type="date"><button type="button" class="btn sm ghost" data-act="skipAdd">Skip date</button></div></div>'
      : '<div class="field"><label for="mkDate">Date</label><input class="input" id="mkDate" type="date" data-mk="date" value="' + esc(v.date) + '"></div>') +
    '<div class="grid2"><div class="field"><label for="mkStart">Opens</label><input class="input" id="mkStart" type="time" data-mk="startTime" value="' + esc(v.startTime) + '"></div><div class="field"><label for="mkEnd">Closes</label><input class="input" id="mkEnd" type="time" data-mk="endTime" value="' + esc(v.endTime) + '"></div></div>' +
    '<div class="field"><label for="mkNotes">Note for the website (optional)</label><textarea class="input" id="mkNotes" data-mk="notes" placeholder="e.g. Pre-order and collect at our stall">' + esc(v.notes) + '</textarea></div>' +
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
  function block(title, X) { return '<div class="section-title">' + title + ' <small>' + X.n + ' order' + (X.n === 1 ? '' : 's') + '</small></div><div class="stats"><div class="stat"><small>Total</small><b>' + money(X.total) + '</b></div><div class="stat"><small>Collected</small><b style="color:var(--green)">' + money(X.got) + '</b></div><div class="stat"><small>Pending</small><b style="color:var(--warn)">' + money(X.due) + '</b></div></div>'; }
  var s = db.settings;
  return '<header class="top"><div class="top-inner"><div class="top-row"><div class="brand"><b>More</b><small>Money, messages and settings</small></div></div></div></header><main>' +
    '<p style="margin:0;font-size:13px;color:var(--muted)">Confirmed, ready and delivered orders, by order date. Orders still to confirm are not counted.</p>' +
    block('This week', W) + block(MONTHS[d.getMonth()] + ' ' + d.getFullYear(), M) +
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
  mkRepeat: function (el) { ui.mDraft.repeat = el.dataset.v; rerender(); },
  skipAdd: function () { var x = $('#mkSkip').value; if (!x) { toast('Pick a date first'); return; } if (ui.mDraft.skipDates.indexOf(x) < 0) ui.mDraft.skipDates.push(x); rerender(); },
  skipDel: function (el) { ui.mDraft.skipDates = ui.mDraft.skipDates.filter(function (x) { return x !== el.dataset.v; }); rerender(); },
  marketSave: function (el) {
    var v = ui.mDraft;
    if (!String(v.name || '').trim()) { toast('Give the market a name'); return; }
    if (v.repeat === 'once' && !v.date) { toast('Pick the date'); return; }
    if (v.startsOn && v.endsOn && v.endsOn < v.startsOn) { toast('The “until” date is before the “from” date'); return; }
    var m = el.dataset.id ? byId(db.markets, el.dataset.id) : null, isNew = !m, before = m ? JSON.parse(JSON.stringify(m)) : null;
    if (!m) m = { id: newId(), sort: db.markets.length };
    var copy = JSON.parse(JSON.stringify(v)); delete copy._for; copy.id = m.id; copy.sort = m.sort; copy.name = copy.name.trim(); copy.weekday = +copy.weekday;
    copy.mapsUrl = copy.address ? mapsUrl(copy.address) : '';
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
function setPaid(o, amount) {
  var prevA = o.paidAmount, prevP = o.paid;
  o.paidAmount = Math.round(amount * 100) / 100; o.paid = isPaid(o); o.updatedAt = Date.now();
  remote(CLOUD && sb.from('orders').update({ paid_amount: o.paidAmount, paid: o.paid }).eq('id', o.id), function () { o.paidAmount = prevA; o.paid = prevP; });
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
  status: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return;
    setStatus(o, el.dataset.v);
    toast(o.name + ': ' + STATUS[el.dataset.v]);
    rerender();
  },
  payAdd: function (el) {
    var o = getOrder(el.dataset.id); if (!o) return; var due = pendingAmt(o);
    modal({ title: 'Record a payment', text: o.name + ' · ' + money(collected(o)) + ' paid of ' + totalLabel(o) + ' · ' + money(due) + ' pending',
      html: '<div class="field"><label for="payAmt">Amount received (€)</label><input class="input" id="payAmt" inputmode="decimal" value="' + (Math.round(due * 100) / 100) + '"></div>',
      buttons: [{ label: 'Save payment', fn: function () { var v = num($('#payAmt').value); if (!(v > 0)) { toast('Enter the amount received'); return false; } setPaid(o, collected(o) + v); } }, { label: 'Cancel', kind: 'ghost' }] });
  },
  payFull: function (el) { var o = getOrder(el.dataset.id); if (o) setPaid(o, orderTotal(o)); },
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
    if (CLOUD) {
      if (ui.saving) return;
      ui.saving = true; if (el) { el.disabled = true; el.lastChild.textContent = 'Saving…'; }
      var isNew = d.key === 'new';
      var q = isNew ? sb.from('orders').insert(Object.assign(toRow(d, ORDER_KEYS), { status: 'pending' })).select().single()
                    : sb.from('orders').update(toRow(d, ORDER_KEYS)).eq('id', d.id).select().single();
      Promise.resolve(q).then(function (r) {
        if (r.error) throw r.error;
        var o = fromRow(r.data); upsertLocalOrder(o); save(); clearDraft(); setOffline(false);
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
    ['name', 'phone', 'source', 'items', 'mode', 'date', 'slot', 'slotOther', 'address', 'fee', 'notes', 'paidAmount'].forEach(function (k) { o[k] = d[k]; }); o.paidAmount = num(o.paidAmount); o.paid = isPaid(o);
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
    for (var i = 0; i < labels.length; i++) { var lb = labels[i].value.trim(); if (lb) opts.push({ label: lb, price: num(prices[i].value) }); }
    if (!opts.length) opts.push({ label: 'Each', price: 0 });
    var it = el.dataset.id ? getItem(el.dataset.id) : null, isNew = !it, before = it ? JSON.parse(JSON.stringify(it)) : null;
    if (!it) { it = { id: uid(), sort: db.menu.length }; db.menu.push(it); }
    it.name = name; it.cat = f['cat'].value; it.options = opts; it.includes = f['includes'].value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    it.seasonal = f['seasonal'].checked; it.active = f['active'].checked;
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
    var r = toRow(o, ORDER_KEYS.concat(['status'])); if (!r.name) r.name = 'No name';
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
  if (rep) { e.preventDefault(); ui.nDraft = null; ui.mDraft = null; go(rep.getAttribute('href'), true); return; }
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
  if (t.dataset.line != null && draft) { draft.items[+t.dataset.line].price = t.value; saveDraft(); var tt = $('#fTotal'); if (tt) tt.textContent = totalLabel(draft); }
  if (t.dataset.setting) { db.settings[t.dataset.setting] = t.value; saveMessagesSoon(); }
  if (t.dataset.mk && ui.mDraft) ui.mDraft[t.dataset.mk] = t.type === 'checkbox' ? t.checked : t.value;
  if (t.dataset.nt && ui.nDraft) { ui.nDraft[t.dataset.nt] = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.nt === 'paused') rerender(); }
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset.draft && draft && (t.type === 'checkbox' || t.tagName === 'SELECT' || t.type === 'date')) { draft[t.dataset.draft] = t.type === 'checkbox' ? t.checked : t.value; saveDraft(); if (t.type !== 'checkbox') rerender(); }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.getElementById('modal').hidden) closeModal(); });
document.addEventListener('submit', function (e) { if (e.target.id === 'loginForm') { e.preventDefault(); ACT.login(); } });

/* ---------- start ---------- */
if (window.SBS_PREVIEW && !db.orders.length && !store.getItem('sbs.preview.seeded')) { db.orders = sampleOrders(); save(); try { store.setItem('sbs.preview.seeded', '1'); } catch (e) {} }
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
