var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.js
var { Plugin, showMessage, fetchSyncPost, openTab } = require("siyuan");
var ATTR_FAV = "custom-fav";
var ATTR_ORDER = "custom-fav-order";
var DOCK_ID = "doc-favorites-dock";
var ICON_ID = "iconDocFavorites";
var ID_RE = /^[0-9]{14}-[a-z0-9]{7}$/;
var ICON_SVG = '<symbol id="iconDocFavorites" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.6l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57-5.9-3.1-5.9 3.1 1.12-6.57-4.77-4.65 6.6-.96z"/></symbol>';
var CSS = `
.df-dock{display:flex;flex-direction:column;height:100%;width:100%;font-size:13px;color:var(--b3-theme-on-background);box-sizing:border-box;}
.df-bar{display:flex;gap:6px;align-items:center;padding:6px 8px 4px 8px;flex:none;}
.df-input{flex:1;min-width:0;height:26px;padding:0 8px;border-radius:4px;border:1px solid var(--b3-border-color);background:var(--b3-theme-surface);color:inherit;outline:none;font-size:12px;}
.df-input:focus{border-color:var(--b3-theme-primary);}
.df-refresh{width:26px;height:26px;flex:none;border-radius:4px;border:1px solid var(--b3-border-color);background:transparent;color:var(--b3-theme-on-surface);cursor:pointer;line-height:1;font-size:14px;}
.df-refresh:hover{background:var(--b3-list-hover);}
.df-list{flex:1;overflow:auto;padding:2px 4px 8px 4px;}
.df-item{display:flex;gap:8px;align-items:center;padding:5px 8px;border-radius:4px;cursor:pointer;}
.df-item:hover{background:var(--b3-list-hover);}
.df-star{flex:none;line-height:18px;color:#f5a623;font-size:13px;}
.df-main{flex:1;min-width:0;display:flex;align-items:baseline;gap:6px;overflow:hidden;}
.df-title{flex:0 1 auto;min-width:0;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.df-sub{display:none;}
.df-empty{padding:24px 12px;text-align:center;color:var(--b3-theme-on-surface);line-height:1.8;font-size:12px;}
.df-foot{flex:none;padding:5px 10px;font-size:11px;color:var(--b3-theme-on-surface);opacity:.8;border-top:1px solid var(--b3-border-color);}
.df-menu{position:fixed;z-index:9999;min-width:126px;padding:4px;border-radius:4px;border:1px solid var(--b3-border-color);background:var(--b3-menu-background,var(--b3-theme-background,#fff));box-shadow:0 3px 12px rgba(0,0,0,.18);}
.df-menu-item{display:block;width:100%;padding:6px 10px;border:none;border-radius:3px;background:transparent;color:var(--b3-theme-on-background);font-size:12px;text-align:left;cursor:pointer;}
.df-menu-item:hover{background:var(--b3-list-hover);}
.df-menu-sep{height:1px;margin:3px 4px;background:var(--b3-border-color);}
.df-modal{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;}
.df-modal__box{width:540px;max-width:92vw;max-height:82vh;display:flex;flex-direction:column;background:var(--b3-theme-background);border:1px solid var(--b3-border-color);border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);overflow:hidden;}
.df-modal__head{display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--b3-border-color);}
.df-modal__title{font-size:14px;font-weight:600;flex:1;}
.df-modal__x{border:none;background:transparent;cursor:pointer;color:var(--b3-theme-on-surface);font-size:14px;line-height:1;padding:2px 4px;}
.df-modal__x:hover{color:var(--b3-theme-on-background);}
.df-modal__desc{padding:8px 14px 4px 14px;font-size:12px;color:var(--b3-theme-on-surface);line-height:1.6;}
.df-modal__list{flex:1;overflow:auto;padding:4px 8px 8px 8px;}
.df-nb{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:4px;cursor:pointer;}
.df-nb:hover{background:var(--b3-list-hover);}
.df-nb__ck{flex:none;margin:0;}
.df-nb__name{flex:none;max-width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;}
.df-nb__path{flex:1;min-width:0;font-size:11px;color:var(--b3-theme-on-surface);opacity:.85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.df-model{flex:1;min-width:0;display:flex;align-items:center;gap:8px;padding:6px 8px;}
.df-model__name{flex:none;font-size:13px;}
.df-model__path{flex:1;min-width:0;font-size:11px;color:var(--b3-theme-on-surface);opacity:.85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.df-model__open{flex:none;padding:2px 10px;font-size:12px;border-radius:3px;border:1px solid var(--b3-border-color);background:transparent;color:inherit;cursor:pointer;}
.df-model__open:hover{background:var(--b3-list-hover);}
.df-modal__foot{display:flex;align-items:center;gap:8px;padding:10px 14px;border-top:1px solid var(--b3-border-color);}
.df-modal__tip{flex:1;font-size:12px;color:var(--b3-theme-on-surface);}
.df-btn{padding:5px 14px;border-radius:4px;border:1px solid var(--b3-border-color);background:transparent;color:inherit;cursor:pointer;font-size:12px;}
.df-btn:hover{background:var(--b3-list-hover);}
.df-btn--primary{background:var(--b3-theme-primary);color:#fff;border-color:var(--b3-theme-primary);}
.df-btn--primary:hover{opacity:.9;background:var(--b3-theme-primary);}
.df-btn:disabled{opacity:.55;cursor:not-allowed;}
.df-nb--click{cursor:pointer;padding:9px 8px;border-radius:4px;}
.df-nb__status{flex:none;font-size:12px;color:var(--b3-theme-on-surface);opacity:.9;}
.df-nb__status--ok{color:var(--b3-theme-primary);opacity:1;}
.df-nb__status--err{color:#d9480f;opacity:1;}
.df-tabs{display:flex;gap:4px;flex:1;}
.df-tab{border:none;background:transparent;color:var(--b3-theme-on-surface);font-size:13px;padding:4px 10px;border-radius:4px;cursor:pointer;}
.df-tab:hover{background:var(--b3-list-hover);}
.df-tab.is-active{background:var(--b3-theme-primary);color:#fff;}
.df-fav{display:flex;align-items:center;gap:8px;padding:8px;border-radius:4px;cursor:pointer;}
.df-fav:hover{background:var(--b3-list-hover);}
.df-fav__star{flex:none;color:#e8a33d;font-size:13px;}
.df-fav__title{flex:1;min-width:0;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.df-fav__nb{flex:none;max-width:30%;font-size:11px;color:var(--b3-theme-on-surface);opacity:.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.df-fav__del{flex:none;border:1px solid var(--b3-border-color);background:transparent;color:var(--b3-theme-on-surface);font-size:11px;line-height:1;padding:4px 8px;border-radius:3px;cursor:pointer;opacity:.7;}
.df-fav__del:hover{opacity:1;color:#d9480f;border-color:#d9480f;}
.df-fav__del:disabled{opacity:.4;cursor:not-allowed;}
`;
module.exports = class DocFavoritesPlugin extends Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "onTreeMenu", ({ detail }) => {
      if (!detail || !detail.menu) return;
      const ids = this.pickDocIds(detail.elements);
      if (!ids.length) return;
      const favCount = ids.filter((id) => this.favs.has(id)).length;
      try {
        detail.menu.addSeparator();
      } catch (e) {
      }
      if (favCount === ids.length) {
        detail.menu.addItem({ label: "\u2605 \u53D6\u6D88\u6536\u85CF", click: () => this.removeFav(ids) });
      } else if (favCount === 0) {
        detail.menu.addItem({ label: "\u2606 \u6536\u85CF\u5230\u6536\u85CF\u5939", click: () => this.addFav(ids) });
      } else {
        detail.menu.addItem({ label: `\u2606 \u6536\u85CF\u672A\u6536\u85CF\u7684 ${ids.length - favCount} \u7BC7`, click: () => this.addFav(ids) });
        detail.menu.addItem({ label: `\u2605 \u53D6\u6D88\u5DF2\u6536\u85CF\u7684 ${favCount} \u7BC7`, click: () => this.removeFav(ids) });
      }
    });
    /* ===== 自动刷新（文档删除、改名后清单跟着变） ===== */
    __publicField(this, "onWsMain", (ev) => {
      const cmd = ev && ev.detail && ev.detail.cmd;
      if (cmd !== "transactions") return;
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        this.refreshTimer = 0;
        this.refreshFavs(true);
      }, 3e3);
    });
    /* ===== 双击 Ctrl 快速建日记 ===== */
    __publicField(this, "onKeyDown", (e) => {
      if (e.key === "Escape" && this.diaryModal) {
        this.closeDiaryDialog();
        e.stopPropagation();
        return;
      }
      if (e.key !== "Control") {
        this.lastCtrlAt = 0;
        return;
      }
      if (e.repeat || e.shiftKey || e.altKey || e.metaKey) return;
      const now = Date.now();
      if (this.lastCtrlAt && now - this.lastCtrlAt <= 350) {
        this.lastCtrlAt = 0;
        this.openDiaryDialog();
        return;
      }
      this.lastCtrlAt = now;
    });
  }
  async onload() {
    this.addIcons(ICON_SVG);
    this.favs = /* @__PURE__ */ new Map();
    this.nbMap = {};
    this.dockId = "";
    this.dockEl = null;
    this.listEl = null;
    this.footEl = null;
    this.searchText = "";
    this.refreshTimer = 0;
    this.loading = false;
    this.loaded = false;
    this.lastCtrlAt = 0;
    this.diaryModal = null;
    this.diaryCreating = false;
    this.injectGlobalStyle();
    window.addEventListener("keydown", this.onKeyDown, true);
    /* 插件重载（不一定走 onLayoutReady）时也刷新一次，顺带完成旧属性迁移 */
    setTimeout(() => this.refreshFavs(true), 600);
  }
  injectGlobalStyle() {
    if (document.getElementById("df-global-style")) return;
    const style = document.createElement("style");
    style.id = "df-global-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }
  onLayoutReady() {
    this.removeFavDock();
    this.eventBus.on("open-menu-doctree", this.onTreeMenu);
    this.eventBus.on("ws-main", this.onWsMain);
    setTimeout(() => this.refreshFavs(true), 800);
  }
  /* 左侧收藏面板已停用：清掉历史注册的 dock，只保留双击 Ctrl 弹窗 */
  removeFavDock() {
    const ids = [...new Set([DOCK_ID, this.dockId].filter(Boolean))];
    ids.forEach((id) => {
      try {
        this.removeDock(id);
      } catch (e) {
      }
    });
    this.dockId = "";
    this.dockEl = null;
    this.listEl = null;
    this.footEl = null;
  }
  onunload() {
    window.removeEventListener("keydown", this.onKeyDown, true);
    this.closeDiaryDialog();
    this.eventBus.off("open-menu-doctree", this.onTreeMenu);
    this.eventBus.off("ws-main", this.onWsMain);
    this.closeItemMenu();
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = 0;
    }
    this.removeFavDock();
  }
  /* ===== 侧栏面板 ===== */
  addFavDock() {
    const self = this;
    let ret = null;
    try {
      ret = this.addDock({
        id: DOCK_ID,
        config: {
          position: "LeftBottom",
          size: { width: 280, height: 0 },
          icon: ICON_ID,
          title: this.i18n && this.i18n.dockTitle || "\u6536\u85CF\u5939"
        },
        data: {},
        type: "doc-favorites",
        init(dock) {
          self.dockEl = dock && dock.element || this && this.element || null;
          self.buildDockUI();
          self.refreshFavs(true);
        },
        update() {
          if (!self.dockEl || !self.listEl || !self.dockEl.contains(self.listEl)) {
            self.buildDockUI();
          } else {
            self.renderList();
          }
        },
        destroy() {
          self.dockEl = null;
          self.listEl = null;
          self.footEl = null;
        }
      });
    } catch (e) {
      console.error("[doc-favorites] \u9762\u677F\u521B\u5EFA\u5931\u8D25", e);
    }
    this.dockId = ret && ret.id || DOCK_ID;
  }
  buildDockUI() {
    const el = this.dockEl;
    if (!el) return;
    el.innerHTML = "";
    el.classList.add("df-dock");
    this.injectGlobalStyle();
    const bar = document.createElement("div");
    bar.className = "df-bar";
    const input = document.createElement("input");
    input.className = "df-input";
    input.type = "text";
    input.placeholder = this.i18n && this.i18n.searchPlaceholder || "\u641C\u7D22\u6536\u85CF\u2026";
    input.addEventListener("input", () => {
      this.searchText = input.value.trim().toLowerCase();
      this.renderList();
    });
    const btn = document.createElement("button");
    btn.className = "df-refresh";
    btn.textContent = "\u27F3";
    btn.title = this.i18n && this.i18n.refresh || "\u5237\u65B0";
    btn.addEventListener("click", () => this.refreshFavs());
    bar.append(input, btn);
    const list = document.createElement("div");
    list.className = "df-list";
    const foot = document.createElement("div");
    foot.className = "df-foot";
    el.append(bar, list, foot);
    this.listEl = list;
    this.footEl = foot;
    this.renderList();
  }
  /* ===== 数据 ===== */
  stamp() {
    const d = /* @__PURE__ */ new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }
  /* custom-fav 的值：新格式是 JSON {"at","order"}；旧格式是纯数字时间戳 */
  parseFav(raw, oldOrder) {
    const s = String(raw || "").trim();
    if (!s) return null;
    if (s.charAt(0) === "{") {
      try {
        const o = JSON.parse(s);
        if (o && typeof o === "object") {
          const order = Number(o.order);
          return { at: String(o.at || "0"), order: Number.isFinite(order) ? order : 0, legacy: false };
        }
      } catch (e) { /* 不是合法 JSON，按旧格式处理 */ }
    }
    const order = Number.isFinite(Number(oldOrder)) ? Number(oldOrder) : 0;
    return { at: s, order, legacy: true };
  }
  favValue(at, order) {
    return JSON.stringify({ at: String(at), order: Number(order) || 0 });
  }
  items() {
    return Array.from(this.favs.values()).sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return String(b.at).localeCompare(String(a.at));
    });
  }
  async refreshFavs(silent) {
    if (this.loading) return;
    this.loading = true;
    try {
      const favRes = await fetchSyncPost("/api/query/sql", {
        stmt: `SELECT block_id FROM attributes WHERE name = '${ATTR_FAV}' LIMIT 1000`
      });
      const rows = favRes && favRes.data || [];
      const idsSet = /* @__PURE__ */ new Set();
      rows.forEach((r) => {
        const id = String(r.block_id || "");
        if (ID_RE.test(id)) idsSet.add(id);
      });
      for (const id of this.favs.keys()) idsSet.add(id);
      const ids = Array.from(idsSet);
      if (!ids.length) {
        this.favs = /* @__PURE__ */ new Map();
        this.loaded = true;
        this.renderList();
        return;
      }
      const live = {};
      const legacyFix = [];
      const attrsRes = await fetchSyncPost("/api/attr/batchGetBlockAttrs", { ids });
      const rawAttrs = attrsRes && attrsRes.data || {};
      Object.keys(rawAttrs).forEach((id) => {
        const a = rawAttrs[id] || {};
        const p = this.parseFav(a[ATTR_FAV], a[ATTR_ORDER]);
        if (!p) return;
        live[id] = { at: p.at, order: p.order, title: a.title || "" };
        if (p.legacy) legacyFix.push({ id, at: p.at, order: p.order });
      });
      /* 旧的双属性（custom-fav + custom-fav-order）合并进一个 JSON，顺手清掉旧属性 */
      for (const it of legacyFix) {
        try {
          await fetchSyncPost("/api/attr/setBlockAttrs", {
            id: it.id,
            attrs: { [ATTR_FAV]: this.favValue(it.at, it.order), [ATTR_ORDER]: "" }
          });
        } catch (e) { /* 单条迁移失败不影响整体 */ }
      }
      const atMap = {};
      const orders = {};
      Object.keys(live).forEach((id) => {
        atMap[id] = live[id].at;
        orders[id] = Number.isFinite(live[id].order) ? live[id].order : 0;
      });
      const meta = {};
      if (ids.length) {
        const inList = ids.map((i) => "'" + i + "'").join(",");
        const metaRes = await fetchSyncPost("/api/query/sql", {
          stmt: `SELECT id, box, hpath, content FROM blocks WHERE type='d' AND id IN (${inList}) LIMIT 1000`
        });
        (metaRes && metaRes.data || []).forEach((b) => {
          meta[b.id] = b;
        });
      }
      const nbRes = await fetchSyncPost("/api/notebook/lsNotebooks", {});
      this.nbMap = {};
      (((nbRes || {}).data || {}).notebooks || []).forEach((n) => {
        this.nbMap[n.id] = n.name;
      });
      const fresh = /* @__PURE__ */ new Map();
      Object.keys(live).forEach((id) => {
        const b = meta[id] || {};
        const title = b.content || live[id].title || "\u672A\u547D\u540D\u6587\u6863";
        fresh.set(id, {
          id,
          at: atMap[id],
          order: orders[id],
          title,
          hpath: b.hpath || "",
          box: b.box || "",
          nbName: this.nbMap[b.box] || ""
        });
      });
      this.favs = fresh;
      this.loaded = true;
    } catch (e) {
      console.error("[doc-favorites] \u8BFB\u53D6\u6536\u85CF\u5931\u8D25", e);
      if (!silent) showMessage("\u8BFB\u53D6\u6536\u85CF\u5931\u8D25\uFF1A" + (e && e.message || e), 5e3, "error");
    } finally {
      this.loading = false;
      this.renderList();
    }
  }
  /* ===== 渲染 ===== */
  renderList() {
    const list = this.listEl;
    if (!list) return;
    const all = this.items();
    const kw = this.searchText;
    const shown = kw ? all.filter((it) => (it.title + " " + it.hpath + " " + it.nbName).toLowerCase().includes(kw)) : all;
    list.innerHTML = "";
    if (!shown.length) {
      const empty = document.createElement("div");
      empty.className = "df-empty";
      empty.innerHTML = "";
      if (!this.loaded) {
        empty.textContent = "\u52A0\u8F7D\u4E2D\u2026";
      } else if (!all.length) {
        empty.textContent = "\u8FD8\u6CA1\u6709\u6536\u85CF\u3002\n\u5728\u6587\u6863\u6811\u91CC\u53F3\u952E\u6587\u6863\uFF0C\u9009\u300C\u2606 \u6536\u85CF\u5230\u6536\u85CF\u5939\u300D\u3002";
        empty.style.whiteSpace = "pre-line";
      } else {
        empty.textContent = "\u6CA1\u6709\u5339\u914D\u7684\u6536\u85CF";
      }
      list.appendChild(empty);
    } else {
      shown.forEach((it) => list.appendChild(this.buildItem(it)));
    }
    if (this.footEl) {
      this.footEl.textContent = kw ? `\u663E\u793A ${shown.length} / \u5171 ${all.length} \u7BC7` : `\u5171 ${all.length} \u7BC7\u6536\u85CF \xB7 \u53F3\u952E\u6761\u76EE\u53EF\u7F6E\u9876\u6216\u53D6\u6D88`;
    }
  }
  buildItem(it) {
    const row = document.createElement("div");
    row.className = "df-item";
    row.dataset.id = it.id;
    row.title = it.hpath || it.title;
    const star = document.createElement("div");
    star.className = "df-star";
    star.textContent = "\u2605";
    const main = document.createElement("div");
    main.className = "df-main";
    const title = document.createElement("div");
    title.className = "df-title";
    title.textContent = it.title;
    const sub = document.createElement("div");
    sub.className = "df-sub";
    const parts = String(it.hpath || "").split("/").filter(Boolean);
    const dir = parts.slice(0, -1).join(" / ");
    sub.textContent = (it.nbName ? it.nbName : "") + (dir ? " \xB7 " + dir : "");
    main.append(title, sub);
    row.append(star, main);
    row.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.openDoc(it.id);
    });
    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.itemMenu(it, e);
    });
    return row;
  }
  openDoc(id) {
    try {
      openTab({ app: this.app, doc: { id } });
    } catch (e) {
      console.error("[doc-favorites] \u6253\u5F00\u6587\u6863\u5931\u8D25", e);
      showMessage("\u6253\u5F00\u6587\u6863\u5931\u8D25\uFF1A" + (e && e.message || e), 5e3, "error");
    }
  }
  itemMenu(it, ev) {
    this.closeItemMenu();
    const menu = document.createElement("div");
    menu.className = "df-menu";
    [["\u7F6E\u9876", "top"], ["\u4E0A\u79FB\u4E00\u4F4D", "up"], ["\u4E0B\u79FB\u4E00\u4F4D", "down"]].forEach((pair) => {
      const btn = document.createElement("button");
      btn.className = "df-menu-item";
      btn.textContent = pair[0];
      btn.addEventListener("click", () => {
        this.closeItemMenu();
        this.reorder(it.id, pair[1]);
      });
      menu.appendChild(btn);
    });
    const sep = document.createElement("div");
    sep.className = "df-menu-sep";
    menu.appendChild(sep);
    const del = document.createElement("button");
    del.className = "df-menu-item";
    del.textContent = "\u53D6\u6D88\u6536\u85CF";
    del.addEventListener("click", () => {
      this.closeItemMenu();
      this.removeFav([it.id]);
    });
    menu.appendChild(del);
    const x = Math.min(Math.max(6, ev.clientX || 100), window.innerWidth - 150);
    const y = Math.min(Math.max(6, ev.clientY || 100), window.innerHeight - 170);
    menu.style.left = x + "px";
    menu.style.top = y + "px";
    document.body.appendChild(menu);
    this._menuEl = menu;
    this._menuOutside = (e) => {
      if (!menu.contains(e.target)) this.closeItemMenu();
    };
    this._menuEsc = (e) => {
      if (e.key === "Escape") this.closeItemMenu();
    };
    setTimeout(() => {
      document.addEventListener("mousedown", this._menuOutside, true);
      document.addEventListener("keydown", this._menuEsc);
    }, 0);
  }
  closeItemMenu() {
    if (this._menuOutside) {
      document.removeEventListener("mousedown", this._menuOutside, true);
      this._menuOutside = null;
    }
    if (this._menuEsc) {
      document.removeEventListener("keydown", this._menuEsc);
      this._menuEsc = null;
    }
    if (this._menuEl) {
      this._menuEl.remove();
      this._menuEl = null;
    }
  }
  /* ===== 收藏 / 取消 ===== */
  async addFav(ids) {
    const list = this.items();
    const min = list.length ? Math.min(...list.map((x) => x.order)) : 0;
    let added = 0;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (this.favs.has(id)) continue;
      try {
        await fetchSyncPost("/api/attr/setBlockAttrs", {
          id,
          attrs: { [ATTR_FAV]: this.favValue(this.stamp(), min - 1 - i) }
        });
        added++;
      } catch (e) {
        console.error("[doc-favorites] \u6536\u85CF\u5931\u8D25", id, e);
      }
    }
    if (added) {
      try {
        const r = await fetchSyncPost("/api/attr/batchGetBlockAttrs", { ids });
        const attrs = r && r.data || {};
        Object.keys(attrs).forEach((id) => {
          const a = attrs[id] || {};
          const p = this.parseFav(a[ATTR_FAV], a[ATTR_ORDER]);
          if (!p) return;
          const old = this.favs.get(id) || {};
          this.favs.set(id, {
            id,
            at: p.at,
            order: p.order,
            title: a.title || old.title || "\u672A\u547D\u540D\u6587\u6863",
            hpath: old.hpath || "",
            box: old.box || "",
            nbName: old.nbName || ""
          });
        });
        this.renderList();
      } catch (e) {
        console.error("[doc-favorites] \u6536\u85CF\u56DE\u586B\u5931\u8D25", e);
      }
    }
    showMessage(added ? `\u5DF2\u6536\u85CF ${added} \u7BC7\u6587\u6863` : "\u8FD9\u4E9B\u6587\u6863\u5DF2\u5728\u6536\u85CF\u5939\u4E2D", 3e3);
    await this.refreshFavs(true);
  }
  async removeFav(ids) {
    let removed = 0;
    for (const id of ids) {
      try {
        await fetchSyncPost("/api/attr/setBlockAttrs", {
          id,
          attrs: { [ATTR_FAV]: "", [ATTR_ORDER]: "" }
        });
        this.favs.delete(id);
        removed++;
      } catch (e) {
        console.error("[doc-favorites] \u53D6\u6D88\u6536\u85CF\u5931\u8D25", id, e);
      }
    }
    this.renderList();
    showMessage(removed ? `\u5DF2\u53D6\u6D88\u6536\u85CF ${removed} \u7BC7\u6587\u6863` : "\u53D6\u6D88\u6536\u85CF\u5931\u8D25", 3e3);
    await this.refreshFavs(true);
  }
  async reorder(id, action) {
    let list = this.items();
    const idx = list.findIndex((x) => x.id === id);
    if (idx < 0) return;
    try {
      for (let i = 0; i < list.length; i++) {
        if (list[i].order !== i) {
          await fetchSyncPost("/api/attr/setBlockAttrs", {
            id: list[i].id,
            attrs: { [ATTR_FAV]: this.favValue(list[i].at, i) }
          });
        }
      }
    } catch (e) {
      console.error("[doc-favorites] \u5F52\u4E00\u5316\u987A\u5E8F\u5931\u8D25", e);
    }
    list = this.items();
    const idx2 = list.findIndex((x) => x.id === id);
    const pairs = [];
    if (action === "top") {
      if (idx2 === 0) return;
      pairs.push([id, -1]);
      for (let i = 0; i < idx2; i++) pairs.push([list[i].id, i + 1]);
    } else if (action === "up") {
      if (idx2 <= 0) return;
      pairs.push([list[idx2 - 1].id, idx2], [id, idx2 - 1]);
    } else if (action === "down") {
      if (idx2 >= list.length - 1) return;
      pairs.push([list[idx2 + 1].id, idx2], [id, idx2 + 1]);
    } else {
      return;
    }
    for (const [bid, ord] of pairs) {
      const it = this.favs.get(bid) || {};
      await fetchSyncPost("/api/attr/setBlockAttrs", {
        id: bid,
        attrs: { [ATTR_FAV]: this.favValue(it.at || "0", ord) }
      });
    }
    await this.refreshFavs();
  }
  /* ===== 文档树右键菜单 ===== */
  pickDocIds(els) {
    const out = [];
    (els || []).forEach((el) => {
      if (!el) return;
      const node = el.closest ? el.closest('li[data-type="navigation-file"]') : null;
      const raw = node ? node.getAttribute("data-node-id") : el.getAttribute ? el.getAttribute("data-node-id") : "";
      const id = String(raw || "");
      if (ID_RE.test(id) && !out.includes(id)) out.push(id);
    });
    return out;
  }
  closeDiaryDialog() {
    if (this.diaryModal && this.diaryModal.parentNode) {
      this.diaryModal.parentNode.removeChild(this.diaryModal);
    }
    this.diaryModal = null;
    this.diaryDone = false;
    this.diaryCreating = false;
  }
  /* Go 时间格式 -> 今天的实际字符串（一次性替换，避免把年份里的 02 当成"日"） */
  goDateFormat(layout) {
    const d = /* @__PURE__ */ new Date();
    const p = (n) => String(n).padStart(2, "0");
    const map = {
      "2006": String(d.getFullYear()),
      "06": p(d.getFullYear() % 100),
      "01": p(d.getMonth() + 1),
      "02": p(d.getDate()),
      "15": p(d.getHours()),
      "04": p(d.getMinutes()),
      "05": p(d.getSeconds()),
      "1": String(d.getMonth() + 1),
      "2": String(d.getDate())
    };
    return String(layout).replace(/2006|06|01|02|15|04|05|1|2/g, (m) => map[m] !== void 0 ? map[m] : m);
  }
  fillDiaryPath(tpl) {
    if (!tpl) return "\uFF08\u672A\u914D\u7F6E\u65E5\u8BB0\u8DEF\u5F84\uFF0C\u5C06\u5EFA\u5728\u7B14\u8BB0\u672C\u6839\u76EE\u5F55\uFF09";
    return String(tpl).replace(/\{\{\s*now\s*\|\s*date\s+"([^"]*)"\s*\}\}/g, (m, f) => this.goDateFormat(f));
  }
  /* 主窗口显示哪些笔记本；返回 null 表示还没配置过（首次安装/别人的电脑） */
  loadDiaryBoxes() {
    try {
      const s = window.localStorage.getItem("df.diary.boxes");
      if (s) {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string");
      }
    } catch (e) {
    }
    return null;
  }
  saveDiaryBoxes(ids) {
    try {
      window.localStorage.setItem("df.diary.boxes", JSON.stringify(ids));
    } catch (e) {
    }
  }
  /* 读全部打开的笔记本及其日记路径 */
  async readNotebooks() {
    const boxes = [];
    const nbRes = await fetchSyncPost("/api/notebook/lsNotebooks", {});
    const nbs = (nbRes.data && nbRes.data.notebooks || []).filter((n) => !n.closed);
    for (const nb of nbs) {
      let tpl = "";
      try {
        const c = await fetchSyncPost("/api/notebook/getNotebookConf", { notebook: nb.id });
        tpl = c.data && c.data.conf && c.data.conf.dailyNoteSavePath || "";
      } catch (e) {
      }
      boxes.push({ id: nb.id, name: nb.name, tpl, path: this.fillDiaryPath(tpl), hpath: this.diaryHPath(tpl) });
    }
    return boxes;
  }
  /* 由模板推出今天的 hpath（用于判断是否已存在） */
  diaryHPath(tpl) {
    if (!tpl) return "";
    const filled = this.fillDiaryPath(tpl).trim();
    if (!filled) return "";
    return filled.startsWith("/") ? filled : "/" + filled;
  }
  async openDiaryDialog() {
    if (this.diaryModal) return;
    let boxes;
    try {
      boxes = await this.readNotebooks();
    } catch (e) {
      showMessage("\u8BFB\u53D6\u7B14\u8BB0\u672C\u5931\u8D25\uFF1A" + (e && e.message || e), 5e3, "error");
      return;
    }
    if (!boxes.length) {
      showMessage("\u6CA1\u6709\u53EF\u7528\u7684\u7B14\u8BB0\u672C", 3e3, "error");
      return;
    }
    this.diaryBoxesAll = boxes;
    this.diaryTab = "create";
    const mask = document.createElement("div");
    mask.className = "df-modal";
    const box = document.createElement("div");
    box.className = "df-modal__box";
    mask.appendChild(box);
    mask.addEventListener("mousedown", (ev) => {
      if (ev.target === mask) this.closeDiaryDialog();
    });
    document.body.appendChild(mask);
    this.diaryModal = mask;
    this.diaryDone = false;
    this.diaryCreating = false;
    this.renderDiaryBody();
  }
  /* 弹窗主体：两个 tab ——「建日记」「收藏」 */
  renderDiaryBody() {
    if (!this.diaryModal) return;
    const box = this.diaryModal.querySelector(".df-modal__box");
    box.innerHTML = "";
    const head = document.createElement("div");
    head.className = "df-modal__head";
    const tabs = document.createElement("div");
    tabs.className = "df-tabs";
    [["create", "\u5EFA\u65E5\u8BB0"], ["fav", "\u6536\u85CF"]].forEach(([key, label]) => {
      const btn = document.createElement("button");
      btn.className = "df-tab" + (this.diaryTab === key ? " is-active" : "");
      btn.textContent = label;
      btn.addEventListener("click", () => {
        if (this.diaryTab === key) return;
        this.diaryTab = key;
        this.renderDiaryBody();
      });
      tabs.appendChild(btn);
    });
    const x = document.createElement("button");
    x.className = "df-modal__x";
    x.textContent = "\u2715";
    x.addEventListener("click", () => this.closeDiaryDialog());
    head.append(tabs, x);
    const desc = document.createElement("div");
    desc.className = "df-modal__desc";
    desc.textContent = this.diaryTab === "create" ? "\u70B9\u4E0B\u9762\u4EFB\u4E00\u7B14\u8BB0\u672C\uFF0C\u7ACB\u5373\u6309\u5B83\u81EA\u5DF1\u7684\u300C\u65B0\u5EFA\u65E5\u8BB0\u300D\u8DEF\u5F84\u5EFA\u4ECA\u5929\u7684\u6587\u6863\u5E76\u8DF3\u8F6C\u8FC7\u53BB\uFF1B\u5DF2\u5B58\u5728\u5219\u76F4\u63A5\u6253\u5F00\u3002" : "\u8FD9\u91CC\u662F\u6536\u85CF\u5939\u91CC\u7684\u5168\u90E8\u6587\u6863\uFF0C\u70B9\u4E00\u884C\u76F4\u63A5\u6253\u5F00\u3002";
    const list = document.createElement("div");
    list.className = "df-modal__list";
    if (this.diaryTab === "create") {
      this.renderDiaryCreateList(list);
    } else {
      this.renderDiaryFavList(list);
    }
    const foot = document.createElement("div");
    foot.className = "df-modal__foot";
    const tip = document.createElement("span");
    tip.className = "df-modal__tip";
    tip.textContent = "\u53CC\u51FB Ctrl \u547C\u51FA\uFF1BEsc \u6216\u70B9\u7A7A\u767D\u5904\u5173\u95ED";
    const btns = [];
    if (this.diaryTab === "create") {
      const edit = document.createElement("button");
      edit.className = "df-btn";
      edit.textContent = "\u7F16\u8F91";
      edit.addEventListener("click", () => this.renderDiaryEditor());
      btns.push(edit);
    }
    const close = document.createElement("button");
    close.className = "df-btn";
    close.textContent = "\u5173\u95ED";
    close.addEventListener("click", () => this.closeDiaryDialog());
    btns.push(close);
    foot.append(tip, ...btns);
    box.append(head, desc, list, foot);
    if (this.diaryTab === "fav") {
      this.refreshFavs(true).then(() => {
        if (this.diaryModal && this.diaryTab === "fav") {
          const cur = this.diaryModal.querySelector(".df-modal__list");
          if (cur) {
            cur.innerHTML = "";
            this.renderDiaryFavList(cur);
          }
        }
      });
    }
  }
  /* 建日记清单：优先用配置里的库；没配置过就列全部打开的笔记本，避免别的电脑上空白 */
  renderDiaryCreateList(list) {
    const ids = this.loadDiaryBoxes();
    const selected = ids === null ? this.diaryBoxesAll : this.diaryBoxesAll.filter((b) => ids.includes(b.id));
    if (!selected.length) {
      const empty = document.createElement("div");
      empty.className = "df-modal__desc";
      empty.style.whiteSpace = "pre-line";
      empty.textContent = ids !== null && ids.length ? "\u6E05\u5355\u91CC\u7684\u7B14\u8BB0\u672C\u5728\u8FD9\u53F0\u7535\u8111\u4E0A\u4E0D\u5B58\u5728\uFF08\u591A\u534A\u662F\u4ECE\u522B\u7684\u7535\u8111\u540C\u6B65\u8FC7\u6765\u7684\u914D\u7F6E\uFF09\u3002\n\u70B9\u53F3\u4E0B\u89D2\u300C\u7F16\u8F91\u300D\u91CD\u65B0\u9009\u62E9\u5373\u53EF\u3002" : "\u8FD9\u53F0\u601D\u6E90\u8FD8\u6CA1\u6709\u6253\u5F00\u7684\u7B14\u8BB0\u672C\u3002\n\u5148\u5728\u601D\u6E90\u91CC\u65B0\u5EFA\u4E00\u4E2A\u7B14\u8BB0\u672C\uFF0C\u518D\u56DE\u6765\u8BD5\u3002";
      list.appendChild(empty);
      return;
    }
    selected.forEach((b) => {
      const row = document.createElement("div");
      row.className = "df-nb df-nb--click";
      row.title = "\u70B9\u51FB\u521B\u5EFA\u5E76\u6253\u5F00 " + b.name + " \u7684\u4ECA\u65E5\u65E5\u8BB0";
      const name = document.createElement("span");
      name.className = "df-nb__name";
      name.textContent = b.name;
      const path = document.createElement("span");
      path.className = "df-nb__path";
      path.textContent = b.path;
      path.title = b.path;
      const status = document.createElement("span");
      status.className = "df-nb__status";
      row.append(name, path, status);
      row.addEventListener("click", () => this.createOneDiary(b, row, status));
      list.appendChild(row);
    });
  }
  /* 收藏清单：全部收藏文档，点一行=打开 */
  renderDiaryFavList(list) {
    const all = this.items();
    if (!all.length) {
      const empty = document.createElement("div");
      empty.className = "df-modal__desc";
      empty.style.whiteSpace = "pre-line";
      empty.textContent = this.loaded ? "\u6536\u85CF\u5939\u8FD8\u662F\u7A7A\u7684\u3002\n\u5728\u6587\u6863\u6811\u91CC\u53F3\u952E\u6587\u6863\uFF0C\u9009\u300C\u2606 \u6536\u85CF\u5230\u6536\u85CF\u5939\u300D\u5373\u53EF\u52A0\u5165\u3002" : "\u52A0\u8F7D\u6536\u85CF\u4E2D\u2026";
      list.appendChild(empty);
      return;
    }
    all.forEach((it) => {
      const row = document.createElement("div");
      row.className = "df-fav";
      row.title = (it.nbName ? it.nbName + " \xB7 " : "") + (it.hpath || "");
      const star = document.createElement("span");
      star.className = "df-fav__star";
      star.textContent = "\u2605";
      const title = document.createElement("span");
      title.className = "df-fav__title";
      title.textContent = it.title;
      const nb = document.createElement("span");
      nb.className = "df-fav__nb";
      nb.textContent = it.nbName || "";
      const del = document.createElement("button");
      del.className = "df-fav__del";
      del.textContent = "\u53D6\u6D88\u6536\u85CF";
      del.title = "\u4ECE\u6536\u85CF\u5939\u79FB\u9664\uFF08\u4E0D\u6539\u52A8\u6587\u6863\u672C\u8EAB\uFF09";
      del.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (del.disabled) return;
        del.disabled = true;
        del.textContent = "\u79FB\u9664\u4E2D\u2026";
        const redraw = () => {
          if (this.diaryModal && this.diaryTab === "fav") {
            const cur = this.diaryModal.querySelector(".df-modal__list");
            if (cur) {
              cur.innerHTML = "";
              this.renderDiaryFavList(cur);
            }
          }
        };
        this.favs.delete(it.id);
        redraw();
        await this.removeFav([it.id]);
        redraw();
        setTimeout(async () => {
          await this.refreshFavs(true);
          redraw();
        }, 1200);
      });
      row.append(star, title, nb, del);
      row.addEventListener("click", () => {
        this.closeDiaryDialog();
        this.openDoc(it.id);
      });
      list.appendChild(row);
    });
  }
  /* 点一行：建今天的日记（幂等）并立即跳过去 */
  async createOneDiary(b, row, status) {
    if (row.dataset.busy === "1") return;
    row.dataset.busy = "1";
    status.className = "df-nb__status";
    status.textContent = "\u521B\u5EFA\u4E2D\u2026";
    let existed = false;
    try {
      if (b.hpath) {
        const stmt = "SELECT id FROM blocks WHERE type = 'd' AND hpath = '" + String(b.hpath).replace(/'/g, "''") + "' LIMIT 1";
        const q = await fetchSyncPost("/api/query/sql", { stmt });
        existed = !!(q.data && q.data.length);
      }
    } catch (e) {
    }
    try {
      const r = await fetchSyncPost("/api/filetree/createDailyNote", { notebook: b.id });
      const id = r.data && r.data.id ? r.data.id : "";
      if (!id) throw new Error("\u5185\u6838\u672A\u8FD4\u56DE\u6587\u6863 ID");
      status.className = "df-nb__status df-nb__status--ok";
      status.textContent = existed ? "\u2713 \u5DF2\u5B58\u5728\uFF0C\u6B63\u5728\u6253\u5F00\u2026" : "\u2713 \u5DF2\u521B\u5EFA\uFF0C\u6B63\u5728\u6253\u5F00\u2026";
      setTimeout(() => {
        this.closeDiaryDialog();
        this.openDoc(id);
      }, 220);
    } catch (e) {
      row.dataset.busy = "0";
      status.className = "df-nb__status df-nb__status--err";
      status.textContent = "\u2717 \u5931\u8D25";
      status.title = String(e && e.message || e);
      showMessage("\u5EFA\u65E5\u8BB0\u5931\u8D25\uFF1A" + String(e && e.message || e), 5e3, "error");
    }
  }
  /* 编辑视图：选择哪些笔记本出现在主窗口 */
  renderDiaryEditor() {
    if (!this.diaryModal) return;
    const box = this.diaryModal.querySelector(".df-modal__box");
    box.innerHTML = "";
    const head = document.createElement("div");
    head.className = "df-modal__head";
    const title = document.createElement("div");
    title.className = "df-modal__title";
    title.textContent = "\u7F16\u8F91 \xB7 \u9009\u62E9\u8981\u663E\u793A\u7684\u7B14\u8BB0\u672C";
    const x = document.createElement("button");
    x.className = "df-modal__x";
    x.textContent = "\u2715";
    x.addEventListener("click", () => this.closeDiaryDialog());
    head.append(title, x);
    const desc = document.createElement("div");
    desc.className = "df-modal__desc";
    desc.textContent = "\u52FE\u9009\u7684\u7B14\u8BB0\u672C\u4F1A\u51FA\u73B0\u5728\u300C\u5FEB\u901F\u5EFA\u65E5\u8BB0\u300D\u7A97\u53E3\u91CC\uFF1B\u53EA\u7559\u5E38\u7528\u7684\uFF0C\u7A97\u53E3\u66F4\u6E05\u723D\u3002";
    const list = document.createElement("div");
    list.className = "df-modal__list";
    const raw = this.loadDiaryBoxes();
    const cur = raw === null ? this.diaryBoxesAll.map((b) => b.id) : raw;
    const cks = [];
    this.diaryBoxesAll.forEach((b) => {
      const row = document.createElement("label");
      row.className = "df-nb";
      const ck = document.createElement("input");
      ck.type = "checkbox";
      ck.className = "df-nb__ck";
      ck.value = b.id;
      ck.checked = cur.includes(b.id);
      const name = document.createElement("span");
      name.className = "df-nb__name";
      name.textContent = b.name;
      const path = document.createElement("span");
      path.className = "df-nb__path";
      path.textContent = b.path;
      path.title = b.path;
      row.append(ck, name, path);
      cks.push(ck);
      list.appendChild(row);
    });
    const foot = document.createElement("div");
    foot.className = "df-modal__foot";
    const tip = document.createElement("span");
    tip.className = "df-modal__tip";
    tip.textContent = "\u4FDD\u5B58\u540E\u56DE\u5230\u5EFA\u65E5\u8BB0\u7A97\u53E3";
    const back = document.createElement("button");
    back.className = "df-btn";
    back.textContent = "\u53D6\u6D88";
    back.addEventListener("click", () => this.renderDiaryBody());
    const save = document.createElement("button");
    save.className = "df-btn df-btn--primary";
    save.textContent = "\u4FDD\u5B58";
    save.addEventListener("click", () => {
      const ids = cks.filter((c) => c.checked).map((c) => c.value);
      this.saveDiaryBoxes(ids);
      this.renderDiaryBody();
    });
    foot.append(tip, back, save);
    box.append(head, desc, list, foot);
  }
};
