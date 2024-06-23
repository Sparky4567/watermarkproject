if (!self.define) {
  let e,
    i = {};
  const o = (o, r) => (
    (o = new URL(o + ".js", r).href),
    i[o] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = o), (e.onload = i), document.head.appendChild(e);
        } else (e = o), importScripts(o), i();
      }).then(() => {
        let e = i[o];
        if (!e) throw new Error(`Module ${o} didn’t register its module`);
        return e;
      })
  );
  self.define = (r, c) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[n]) return;
    let t = {};
    const s = (e) => o(e, n),
      d = { module: { uri: n }, exports: t, require: s };
    i[n] = Promise.all(r.map((e) => d[e] || s(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-7839e0cf"], function (e) {
  "use strict";
  self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        { url: "favicon.ico", revision: "c92b85a5b907c70211f4ec25e29a8c4a" },
        { url: "index.html", revision: "705bcbc29d7265382cc445eeb6b6dc37" },
        { url: "logo192.png", revision: "33dbdd0177549353eeeb785d02c294af" },
        { url: "logo512.png", revision: "917515db74ea8d1aee6a246cfbcc0b45" },
        { url: "manifest.json", revision: "20d7424f9b105f861212c30bdc312ed8" },
        { url: "robots.txt", revision: "fa1ded1ed7c11438a9b0385b1e112850" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    );
});
//# sourceMappingURL=sw.js.map
