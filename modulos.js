/* =====================================================================
   MÓDULOS INTERACTIVOS — motores genéricos que leen window.SALON.
   Uso en el HTML:  <div data-modulo="recomendador"></div>
   Módulos: recomendador · antes-despues · carta · resenas ·
            manicura · laser · ritual · bonos · novias · mirada
   Se montan con Modulos.iniciar({ RM, buzz, goTo }) desde app.js.
   ===================================================================== */
(() => {
  const S = window.SALON || {};
  const G = () => window.gsap;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const eur = (n) => { const v = Math.round(n * 100) / 100; const [e, d] = v.toFixed(2).split("."); return e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d === "00" ? "" : "," + d); };
  const num = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", "."));
  // "90 €" → "<s>90 €</s> <b class=of>76,50 €</b>" si hay oferta
  const precio = (str) => {
    const t = esc(str);
    if (!S.oferta) return t;
    return t.replace(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?) €/g, (m, n) => `<s>${n} €</s> <b class="of">${eur(num(n) * S.oferta.factor)} €</b>`);
  };
  const precioNum = (n) => precio(eur(n) + " €");
  const btnReservar = (cls = "btn btn-coral") => `<a class="${cls}" href="${esc(S.reservar)}" target="_blank" rel="noopener">Reservar</a>`;
  let CTX = { RM: false, buzz: () => {}, goTo: (el) => el.scrollIntoView({ behavior: "smooth" }) };
  const refresh = () => window.ScrollTrigger && requestAnimationFrame(() => ScrollTrigger.refresh());
  const entra = (els, dir = 1) => { if (!CTX.RM && G() && els.length) G().fromTo(els, { x: 30 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "expo.out", stagger: 0.04 }); };

  const M = {};

  /* ============================== RECOMENDADOR ============================== */
  M.recomendador = (el) => {
    const D = S.recomendador; if (!D) return;
    const P = D.preguntas, R = {}; let step = 0;
    el.classList.add("quiz");
    el.innerHTML = `<div class="quiz-top"><span data-num></span><span data-tag></span></div><div class="quiz-body" data-body aria-live="polite"></div>`;
    const body = $("[data-body]", el), nEl = $("[data-num]", el), tEl = $("[data-tag]", el);
    const prog = (p) => el.style.setProperty("--prog", p * 100 + "%");
    const opcionesDe = (q) => q.segun ? q.porRespuesta[R[q.segun]] : q;
    const swap = (html, dir) => {
      const show = () => { body.innerHTML = html; entra($$(":scope > *, .q-opt", body), dir); refresh(); };
      if (CTX.RM || !G() || !body.children.length) return show();
      G().to(body.children, { x: -30 * dir, opacity: 0, duration: 0.18, ease: "power2.in", onComplete: show });
    };
    const pregunta = (dir = 1) => {
      const q = P[step], o = opcionesDe(q);
      nEl.textContent = `Pregunta ${step + 1} de ${P.length}`; tEl.textContent = q.tag || ""; prog(step / P.length);
      swap(`<h3 class="q-title">${esc(o.titulo)}</h3><div class="q-opts">${o.opciones.map(([k, t, s]) =>
        `<button class="q-opt${R[q.id] === k ? " sel" : ""}" data-k="${esc(k)}"><span class="dot"></span><span>${esc(t)}${s ? `<small>${esc(s)}</small>` : ""}</span></button>`).join("")}</div>${step ? '<button class="q-back" data-back>← Volver</button>' : ""}`, dir);
    };
    const consejos = () => {
      // en orden; de cada `grupo` solo entra el primero que cumpla
      const usados = new Set(), ok = [];
      (D.consejos || []).forEach((c) => {
        if (c.grupo && usados.has(c.grupo)) return;
        if (Object.entries(c.si).every(([k, v]) => R[k] === v)) { ok.push(c.texto); if (c.grupo) usados.add(c.grupo); }
      });
      return (ok.length ? ok.slice(0, D.maxConsejos || 2) : [D.consejoDefecto]).filter(Boolean).join(" ");
    };
    const resultado = () => {
      const clave = P.find((q) => q.clave) || P[0], r = D.resultados[R[clave.id]];
      nEl.textContent = "Tu resultado"; tEl.textContent = "Listo"; prog(1); CTX.buzz([12, 40, 12]);
      const tip = consejos();
      swap(`<p class="r-kick">Tu punto de partida</p>
        <h3 class="r-title">${esc(r.nombre)} ${r.extra ? `<em>${esc(r.extra)}</em>` : ""}</h3>
        <p class="r-desc">${esc(r.desc)}</p>
        <div class="r-meta">${(r.meta || []).map((x) => `<span>${precio(x)}</span>`).join("")}</div>
        ${(r.primerPaso || D.primerPaso) ? `<div class="r-box"><b>Primer paso</b>${precio(r.primerPaso || D.primerPaso)}</div>` : ""}
        ${r.alternativa ? `<div class="r-box"><b>También te puede interesar</b>${precio(r.alternativa)}</div>` : ""}
        ${tip ? `<div class="r-box tip"><b>Consejo</b>${esc(tip)}</div>` : ""}
        <div class="r-btns">${btnReservar()}<button class="btn btn-line" data-again>Repetir</button></div>
        ${D.nota ? `<p class="r-note">${esc(D.nota)}</p>` : ""}`, 1);
      const top = el.getBoundingClientRect().top; if (top < 0 || top > innerHeight * 0.5) CTX.goTo(el);
    };
    body.addEventListener("click", (e) => {
      const o = e.target.closest(".q-opt");
      if (o) {
        CTX.buzz(8); $$(".q-opt", body).forEach((b) => b.classList.toggle("sel", b === o));
        R[P[step].id] = o.dataset.k; P.slice(step + 1).forEach((q) => delete R[q.id]);
        setTimeout(() => { step++; step < P.length ? pregunta(1) : resultado(); }, 260);
      } else if (e.target.closest("[data-back]")) { step--; pregunta(-1); }
      else if (e.target.closest("[data-again]")) { Object.keys(R).forEach((k) => delete R[k]); step = 0; pregunta(-1); CTX.goTo(el); }
    });
    pregunta();
  };

  /* ============================== ANTES / DESPUÉS ============================== */
  M["antes-despues"] = (el) => {
    const D = S.antesDespues; if (!D || !D.casos?.length) return;
    const filtros = [...new Set(D.casos.map((c) => c.filtro).filter(Boolean))];
    const src = (c, t) => `${D.ruta}${c.n}${t}.jpg`;
    el.classList.add("ad");
    el.innerHTML = `
      <div class="ba" role="slider" tabindex="0" aria-label="Comparador antes y después" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="aspect-ratio:${D.proporcion || "600 / 1079"}">
        <img class="ba-aft" alt="Después" /><img class="ba-bef" alt="Antes" />
        <span class="ba-lab ba-l">Antes</span><span class="ba-lab ba-r"></span>
        <div class="ba-line"><span class="ba-knob">‹ ›</span></div>
      </div>
      <div class="ad-side">
        ${filtros.length > 1 ? `<div class="ad-filtros">${["Todos", ...filtros].map((f, i) => `<button class="chip-f${i ? "" : " is-on"}" data-f="${esc(f)}">${esc(f)}</button>`).join("")}</div>` : ""}
        <div class="cases"></div>
        ${D.nota ? `<p class="note">${esc(D.nota)}</p>` : ""}
      </div>`;
    const ba = $(".ba", el), aft = $(".ba-aft", el), bef = $(".ba-bef", el), lab = $(".ba-r", el), cases = $(".cases", el);
    const setP = (p) => { p = Math.max(0, Math.min(100, p)); ba.style.setProperty("--p", p + "%"); ba.setAttribute("aria-valuenow", Math.round(p)); };
    const hint = { p: 50 };
    const sweep = () => { if (CTX.RM || !G()) return; hint.p = 50; G().timeline().to(hint, { p: 16, duration: 0.9, ease: "power2.inOut", onUpdate: () => setP(hint.p) }).to(hint, { p: 84, duration: 1.2, ease: "power2.inOut", onUpdate: () => setP(hint.p) }).to(hint, { p: 50, duration: 0.8, ease: "power2.inOut", onUpdate: () => setP(hint.p) }); };
    const mostrar = (c, animar) => {
      const poner = () => { aft.src = src(c, "d"); bef.src = src(c, "a"); lab.textContent = c.etiqueta ? `${c.etiqueta} después` : "Después"; setP(50); };
      if (!animar || CTX.RM || !G()) return poner();
      G().to([aft, bef], { opacity: 0, duration: 0.2, onComplete: () => { poner(); G().to([aft, bef], { opacity: 1, duration: 0.35 }); sweep(); } });
    };
    const pintar = (f) => {
      const lista = D.casos.filter((c) => f === "Todos" || c.filtro === f);
      cases.innerHTML = lista.map((c, i) => `<button class="case${i ? "" : " is-on"}" data-n="${c.n}"><img src="${src(c, "d")}" alt="" loading="lazy" /><span>${esc(c.filtro || "")}<br />${esc(c.etiqueta || "")}</span></button>`).join("");
      mostrar(lista[0], true);
      entra($$(".case", cases));
    };
    // arrastrar: en táctil solo si el gesto es horizontal (deja hacer scroll vertical)
    const pos = (e) => { const r = ba.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };
    const cap = (e) => { try { ba.setPointerCapture(e.pointerId); } catch (_) {} };
    let drag = false, decided = false, horiz = false, sx = 0, sy = 0, edge = 0;
    ba.addEventListener("pointerdown", (e) => { drag = true; decided = false; horiz = e.pointerType === "mouse"; sx = e.clientX; sy = e.clientY; G() && G().killTweensOf(hint); if (horiz) { setP(pos(e)); cap(e); } });
    ba.addEventListener("pointermove", (e) => {
      if (!drag) return;
      if (!decided) { const dx = Math.abs(e.clientX - sx), dy = Math.abs(e.clientY - sy); if (dx + dy < 6) return; decided = true; horiz = horiz || dx > dy; if (!horiz) { drag = false; return; } cap(e); }
      const p = pos(e); setP(p); const ed = p < 6 ? -1 : p > 94 ? 1 : 0; if (ed && ed !== edge) CTX.buzz(6); edge = ed;
    });
    ["pointerup", "pointercancel"].forEach((t) => ba.addEventListener(t, () => (drag = false)));
    ba.addEventListener("keydown", (e) => { const p = parseFloat(ba.style.getPropertyValue("--p")) || 50; if (e.key === "ArrowLeft") setP(p - 5); if (e.key === "ArrowRight") setP(p + 5); });
    cases.addEventListener("click", (e) => {
      const b = e.target.closest(".case"); if (!b || b.classList.contains("is-on")) return;
      CTX.buzz(8); $$(".case", cases).forEach((x) => x.classList.toggle("is-on", x === b));
      mostrar(D.casos.find((c) => String(c.n) === b.dataset.n), true);
    });
    el.addEventListener("click", (e) => {
      const f = e.target.closest(".chip-f"); if (!f) return;
      CTX.buzz(6); $$(".chip-f", el).forEach((x) => x.classList.toggle("is-on", x === f)); pintar(f.dataset.f);
    });
    pintar("Todos");
    if (window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: ba, start: "top 70%", once: true, onEnter: sweep });
      if (!CTX.RM) G().fromTo(ba, { clipPath: "inset(10% 10% 10% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: ba, start: "top 95%", end: "top 40%", scrub: true } });
    }
  };

  /* ============================== CARTA ============================== */
  M.carta = (el) => {
    const D = S.carta; if (!D?.length) return;
    el.classList.add("acc");
    el.innerHTML = D.map((c, i) => `
      <div class="acc-item">
        <button class="acc-btn" aria-expanded="false"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(c.titulo)}</h3><span class="pm"></span></button>
        <div class="acc-panel"><div class="acc-in">
          ${c.img ? `<figure class="acc-img"><img src="${esc(c.img)}" alt="" loading="lazy" /></figure>` : ""}
          <div>
            ${c.desc ? `<p class="acc-desc">${esc(c.desc)}</p>` : ""}
            <ul class="svc">${c.servicios.map(([n, p, t]) => `<li><b>${esc(n)}</b><span class="p">${precio(p)}</span>${t ? `<span class="t">${esc(t)}</span>` : ""}</li>`).join("")}</ul>
            <p style="margin-top:18px">${btnReservar("btn btn-dark")}</p>
          </div>
        </div></div>
      </div>`).join("");
    const items = $$(".acc-item", el);
    const toggle = (it, open) => {
      const panel = $(".acc-panel", it);
      it.classList.toggle("open", open); $(".acc-btn", it).setAttribute("aria-expanded", open);
      if (!G()) { panel.style.height = open ? "auto" : "0"; return; }
      G().to(panel, { height: open ? "auto" : 0, duration: CTX.RM ? 0 : 0.7, ease: "expo.inOut", onComplete: refresh });
      if (open && !CTX.RM) {
        const img = $(".acc-img", it);
        if (img) { G().fromTo(img, { clipPath: "inset(0 100% 0 0 round 22px)" }, { clipPath: "inset(0 0% 0 0 round 22px)", duration: 0.9, ease: "expo.inOut" }); G().fromTo($("img", img), { scale: 1.3 }, { scale: 1, duration: 1.2, ease: "expo.out" }); }
        G().fromTo($$(".svc li", it), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, delay: 0.25, ease: "power3.out" });
      }
    };
    items.forEach((it) => $(".acc-btn", it).addEventListener("click", () => {
      const open = !it.classList.contains("open"); CTX.buzz(6);
      items.forEach((o) => o !== it && o.classList.contains("open") && toggle(o, false));
      toggle(it, open);
      if (open) setTimeout(() => { const t = it.getBoundingClientRect().top; if (t < 60 || t > innerHeight * 0.6) CTX.goTo(it); }, 720);
    }));
  };

  /* ============================== RESEÑAS ============================== */
  M.resenas = (el) => {
    const D = S.resenas; if (!D?.lista?.length) return;
    const ini = D.lista.slice(0, 4).map((r) => esc(r.nombre.trim()[0] || "★"));
    el.classList.add("rev");
    el.innerHTML = `
      <div class="rev-bar">
        <button class="rev-toggle" aria-expanded="false">
          <span class="rev-faces" aria-hidden="true">${ini.map((c) => `<i>${c}</i>`).join("")}</span>
          <span class="rev-label"><b>Leer reseñas reales</b></span>
          <span class="rev-chev" aria-hidden="true"></span>
        </button>
        ${D.google?.length ? `<div class="leave">
          <button class="btn btn-line" data-leave aria-expanded="false">Deja tu reseña</button>
          <div class="leave-menu" hidden>
            <p>${D.google.length > 1 ? "¿En qué centro te atendimos?" : "Tu opinión nos ayuda"}</p>
            ${D.google.map((g) => `<a href="https://search.google.com/local/writereview?placeid=${esc(g.placeId)}" target="_blank" rel="noopener"><b>${esc(g.centro)}</b><span>Reseña en Google →</span></a>`).join("")}
            <small>Si reservaste por Booksy, también puedes valorarnos desde la app después de tu cita.</small>
          </div>
        </div>` : ""}
      </div>
      <div class="rev-panel"><div class="rev-grid">
        ${D.lista.map((r) => `<article class="rv"><div class="rv-head"><span class="rv-stars" aria-label="5 estrellas">★★★★★</span><span class="rv-src rv-${esc(r.fuente)}">${r.fuente === "google" ? "Google" : esc(r.fuente[0].toUpperCase() + r.fuente.slice(1))}</span></div><p>“${esc(r.texto)}”</p><footer><b>${esc(r.nombre)}</b><span>${esc(r.servicio || "")}</span></footer></article>`).join("")}
      </div>
      <p class="rev-swipe">Desliza para ver más reseñas →</p>
      ${D.nota ? `<p class="note rev-note">${esc(D.nota)}</p>` : ""}</div>`;
    const panel = $(".rev-panel", el), btn = $(".rev-toggle", el);
    btn.addEventListener("click", () => {
      const open = !el.classList.contains("open"); CTX.buzz(8);
      el.classList.toggle("open", open); btn.setAttribute("aria-expanded", open);
      if (!G()) { panel.style.height = open ? "auto" : "0"; return; }
      G().to(panel, { height: open ? "auto" : 0, duration: CTX.RM ? 0 : 0.9, ease: "expo.inOut", onComplete: refresh });
      if (open && !CTX.RM) G().fromTo($$(".rv", panel), { y: 40, opacity: 0, rotate: () => G().utils.random(-3, 3) }, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, delay: 0.15 });
    });
    const lb = $("[data-leave]", el), lm = $(".leave-menu", el);
    if (lb) {
      const set = (o) => { lm.hidden = !o; lb.setAttribute("aria-expanded", o); if (o && !CTX.RM && G()) G().fromTo(lm, { y: 12, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }); };
      lb.addEventListener("click", (e) => { e.stopPropagation(); CTX.buzz(6); set(lm.hidden); });
      document.addEventListener("click", (e) => { if (!lm.hidden && !e.target.closest(".leave")) set(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lm.hidden) { set(false); lb.focus(); } });
    }
  };

  /* ============================== MANICURA (uñas) ============================== */
  M.manicura = (el) => {
    const D = S.manicura; if (!D) return;
    const st = { forma: D.formas[2]?.[0] || D.formas[0][0], largo: D.largos[1]?.id || D.largos[0].id, acabado: D.acabados[0].id };
    const LARGO = { corta: 18, media: 34, larga: 56 };
    // dedos: x, ancho de uña, base (cutícula) y largo del dedo
    const DEDOS = [{ x: 62, w: 30, y: 128, h: 92 }, { x: 108, w: 34, y: 92, h: 128 }, { x: 156, w: 35, y: 78, h: 142 }, { x: 204, w: 33, y: 92, h: 128 }, { x: 247, w: 27, y: 124, h: 96 }];
    const una = (x, y, w, L, f) => {
      const x0 = x - w / 2, x1 = x + w / 2, top = y - L, cut = `Q ${x} ${y + w * 0.32} ${x0} ${y}`;
      switch (f) {
        case "cuadrada": return `M ${x0} ${y} L ${x0} ${top + 5} Q ${x0} ${top} ${x0 + 5} ${top} L ${x1 - 5} ${top} Q ${x1} ${top} ${x1} ${top + 5} L ${x1} ${y} ${cut} Z`;
        case "redonda": return `M ${x0} ${y} L ${x0} ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x1} ${top + w / 2} L ${x1} ${y} ${cut} Z`;
        case "bailarina": return `M ${x0} ${y} L ${x0} ${y - L * 0.5} L ${x - w * 0.3} ${top} L ${x + w * 0.3} ${top} L ${x1} ${y - L * 0.5} L ${x1} ${y} ${cut} Z`;
        case "stiletto": return `M ${x0} ${y} L ${x0} ${y - L * 0.45} C ${x0} ${y - L * 0.8} ${x - w * 0.06} ${top} ${x} ${top - 4} C ${x + w * 0.06} ${top} ${x1} ${y - L * 0.8} ${x1} ${y - L * 0.45} L ${x1} ${y} ${cut} Z`;
        default: return `M ${x0} ${y} L ${x0} ${y - L * 0.5} C ${x0} ${top + L * 0.12} ${x - w * 0.2} ${top} ${x} ${top} C ${x + w * 0.2} ${top} ${x1} ${top + L * 0.12} ${x1} ${y - L * 0.5} L ${x1} ${y} ${cut} Z`; // almendra
      }
    };
    el.classList.add("mani");
    el.innerHTML = `
      <div class="mani-stage">
        <svg viewBox="0 0 310 300" class="mani-svg" aria-label="Vista previa de tu manicura">
          <defs>
            <linearGradient id="mPiel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d3bf"/><stop offset="1" stop-color="#d9a98c"/></linearGradient>
            <linearGradient id="mCromo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f7fb"/><stop offset=".45" stop-color="#9a9aaa"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#8f8fa0"/></linearGradient>
            <pattern id="mArt" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#f1c6d3"/><circle cx="6" cy="6" r="2.2" fill="#c79a5a"/></pattern>
            ${DEDOS.map((d, i) => `<clipPath id="mClip${i}"><path/></clipPath>`).join("")}
          </defs>
          <path d="M 40 300 L 40 200 Q 40 168 70 168 L 250 168 Q 282 168 282 200 L 282 300 Z" fill="url(#mPiel)"/>
          ${DEDOS.map((d) => `<rect x="${d.x - d.w / 2 - 6}" y="${d.y - 10}" width="${d.w + 12}" height="${d.h + 40}" rx="${(d.w + 12) / 2}" fill="url(#mPiel)"/>`).join("")}
          <g class="mani-nails">${DEDOS.map((d, i) => `<path data-i="${i}"/>`).join("")}</g>
          <g class="mani-tips">${DEDOS.map((d, i) => `<rect data-i="${i}" x="0" y="0" width="310" height="0" clip-path="url(#mClip${i})"/>`).join("")}</g>
          <g class="mani-shine">${DEDOS.map((d, i) => `<path data-i="${i}"/>`).join("")}</g>
        </svg>
      </div>
      <div class="mani-ui">
        <div class="mani-grupo"><p>Forma</p><div class="mani-opts" data-g="forma">${D.formas.map(([id, n]) => `<button data-v="${esc(id)}">${esc(n)}</button>`).join("")}</div></div>
        <div class="mani-grupo"><p>Largo</p><div class="mani-opts" data-g="largo">${D.largos.map((l) => `<button data-v="${esc(l.id)}">${esc(l.nombre)}</button>`).join("")}</div></div>
        <div class="mani-grupo"><p>Acabado</p><div class="mani-opts mani-color" data-g="acabado">${D.acabados.map((a) => `<button data-v="${esc(a.id)}"><i style="background:${a.tipo === "francesa" ? `linear-gradient(180deg,${a.colores[1]} 40%,${a.colores[0]} 40%)` : a.tipo === "cromado" ? `linear-gradient(135deg,${a.colores.join(",")})` : a.tipo === "art" ? `radial-gradient(circle,${a.colores[1]} 25%,${a.colores[0]} 26%)` : a.colores[0]}"></i>${esc(a.nombre)}</button>`).join("")}</div></div>
        <div class="mani-res" aria-live="polite"></div>
      </div>`;
    const nails = $$(".mani-nails path", el), tips = $$(".mani-tips rect", el), clips = $$("clipPath path", el), shine = $$(".mani-shine path", el), res = $(".mani-res", el);
    const pintar = (pop) => {
      const L = LARGO[st.largo] || 34, a = D.acabados.find((x) => x.id === st.acabado);
      DEDOS.forEach((d, i) => {
        const Li = L * (d.w / 34), p = una(d.x, d.y, d.w - 4, Li, st.forma);
        nails[i].setAttribute("d", p);
        nails[i].setAttribute("fill", a.tipo === "cromado" ? "url(#mCromo)" : a.tipo === "art" ? "url(#mArt)" : a.colores[0]);
        // francesa: punta blanca = rectángulo superior recortado con la forma de la uña
        clips[i].setAttribute("d", p);
        tips[i].setAttribute("height", a.tipo === "francesa" ? Math.max(0, d.y - Li * 0.62) : 0);
        tips[i].setAttribute("fill", a.colores[1] || "#fff");
        shine[i].setAttribute("d", `M ${d.x - d.w * 0.18} ${d.y - 6} Q ${d.x - d.w * 0.22} ${d.y - Li * 0.6} ${d.x - d.w * 0.05} ${d.y - Li * 0.85}`);
      });
      if (pop && !CTX.RM && G()) G().fromTo(nails, { scale: 0.9, transformOrigin: "50% 100%" }, { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.03 });
      $$(".mani-opts", el).forEach((g) => $$("button", g).forEach((b) => b.classList.toggle("is-on", b.dataset.v === st[g.dataset.g])));
      const base = D.servicios[D.largos.find((l) => l.id === st.largo).servicio], extra = a.extra && D.servicios[a.extra];
      const fila = (s) => `<li><b>${esc(s.nombre)}</b><span>${precio(s.precio)}</span><small>${esc(s.duracion || "")}</small></li>`;
      res.innerHTML = `<p class="mani-k">Tu manicura</p><ul>${fila(base)}${extra ? fila(extra) : ""}</ul>${btnReservar()}`;
    };
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".mani-opts button"); if (!b) return;
      st[b.parentElement.dataset.g] = b.dataset.v; CTX.buzz(6); pintar(true);
    });
    pintar(false);
  };

  /* ============================== LÁSER (zonas) ============================== */
  M.laser = (el) => {
    const D = S.laser; if (!D) return;
    let sexo = "mujer"; const sel = new Set();
    // silueta estilizada: cada zona es una forma clicable
    const FORMAS = {
      rostro: '<ellipse cx="150" cy="44" rx="24" ry="30"/>',
      axilas: '<circle cx="112" cy="104" r="9"/><circle cx="188" cy="104" r="9"/>',
      brazos: '<rect x="86" y="96" width="20" height="120" rx="10" transform="rotate(8 96 96)"/><rect x="194" y="96" width="20" height="120" rx="10" transform="rotate(-8 204 96)"/>',
      pecho: '<rect x="118" y="88" width="64" height="48" rx="16"/>',
      abdomen: '<rect x="120" y="140" width="60" height="56" rx="14"/>',
      ingles: '<path d="M 122 202 L 178 202 L 150 236 Z"/>',
      piernas: '<rect x="120" y="240" width="27" height="78" rx="12"/><rect x="153" y="240" width="27" height="78" rx="12"/>',
      mediasPiernas: '<rect x="121" y="322" width="25" height="82" rx="11"/><rect x="154" y="322" width="25" height="82" rx="11"/>'
    };
    el.classList.add("laser");
    el.innerHTML = `
      <div class="laser-top"><div class="seg" role="tablist"><button data-s="mujer" class="is-on">Mujer</button><button data-s="hombre">Hombre</button></div><p class="laser-hint">Toca las zonas</p></div>
      <div class="laser-grid">
        <div class="laser-stage"><svg viewBox="40 0 220 420" class="laser-svg" aria-label="Silueta para elegir zonas">
          <g class="laser-base"><ellipse cx="150" cy="44" rx="26" ry="32"/><rect x="138" y="70" width="24" height="16" rx="6"/><rect x="112" y="84" width="76" height="152" rx="28"/>
            <rect x="84" y="94" width="24" height="128" rx="12" transform="rotate(8 96 94)"/><rect x="192" y="94" width="24" height="128" rx="12" transform="rotate(-8 204 94)"/>
            <rect x="118" y="230" width="31" height="180" rx="15"/><rect x="151" y="230" width="31" height="180" rx="15"/></g>
          ${Object.entries(FORMAS).map(([id, f]) => `<g class="zona" data-f="${id}" tabindex="0" role="button">${f}</g>`).join("")}
        </svg></div>
        <div class="laser-side">
          <div class="laser-chips"></div>
          <div class="laser-res" aria-live="polite"></div>
        </div>
      </div>`;
    // cada zona se dibuja con una o varias formas de la silueta (`forma`); sin forma = solo chip
    const formasDe = (z) => [].concat(z.forma ?? z.id);
    const zonaDeForma = (f) => D.zonas.find((z) => z[sexo] != null && formasDe(z).includes(f));
    const zonas = () => D.zonas.filter((z) => z[sexo] != null);
    const pintar = () => {
      $$(".zona", el).forEach((g) => {
        const f = g.dataset.f;
        g.classList.toggle("off", !zonaDeForma(f));
        g.classList.toggle("on", D.zonas.some((z) => sel.has(z.id) && z[sexo] != null && formasDe(z).includes(f)));
      });
      $(".laser-chips", el).innerHTML = zonas().map((z) => `<button class="chip-z${sel.has(z.id) ? " on" : ""}" data-z="${z.id}">${esc(z.nombre)}</button>`).join("");
      const lista = zonas().filter((z) => sel.has(z.id)), total = lista.reduce((a, z) => a + z[sexo], 0);
      const completo = D.cuerpoCompleto?.[sexo];
      const mejor = completo && total > completo;
      // packs reales del salón: el que más ahorra entre los que encajan con la selección
      let pack = null;
      (D.packs || []).forEach((p) => {
        if (p.sexo && p.sexo !== sexo) return;
        const zs = p.incluye.map((id) => D.zonas.find((z) => z.id === id));
        if (zs.some((z) => !z || z[sexo] == null || !sel.has(z.id))) return;
        const ahorro = zs.reduce((a, z) => a + z[sexo], 0) - p.precio;
        if (ahorro > 0 && (!pack || ahorro > pack.ahorro)) pack = { ...p, ahorro };
      });
      $(".laser-res", el).innerHTML = lista.length ? `
        <ul>${lista.map((z) => `<li><span>${esc(z.nombre)}</span><b>${precioNum(z[sexo])}</b></li>`).join("")}</ul>
        <div class="laser-total"><span>Total por sesión</span><b>${precioNum(total)}</b></div>
        ${mejor ? `<p class="laser-tip">💡 Te sale mejor <b>Cuerpo completo</b>: ${precioNum(completo)} por sesión.</p>` : pack ? `<p class="laser-tip">💡 Con el pack <b>${esc(pack.nombre)}</b> pagas ${precioNum(pack.precio)} y ahorras ${esc(pack.ahorro)} €.</p>` : ""}
        ${btnReservar()}${D.nota ? `<p class="note">${esc(D.nota)}</p>` : ""}` : `<p class="laser-empty">Elige una o varias zonas y te decimos el precio por sesión.</p>`;
    };
    const toggle = (id) => {
      const z = D.zonas.find((x) => x.id === id) || zonaDeForma(id); if (!z || z[sexo] == null) return; id = z.id;
      if (sel.has(id)) sel.delete(id); else { sel.add(id); (D.excluyentes || []).forEach((g) => g.includes(id) && g.forEach((o) => o !== id && sel.delete(o))); }
      CTX.buzz(8); pintar();
      if (!CTX.RM && G()) formasDe(z).forEach((f) => { const g = $(`.zona[data-f="${f}"]`, el); if (g) G().fromTo(g, { scale: 0.85, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(3)" }); });
    };
    el.addEventListener("click", (e) => {
      const s = e.target.closest("[data-s]");
      if (s) { sexo = s.dataset.s; $$("[data-s]", el).forEach((b) => b.classList.toggle("is-on", b === s)); [...sel].forEach((id) => { const z = D.zonas.find((x) => x.id === id); if (z[sexo] == null) sel.delete(id); }); CTX.buzz(6); pintar(); return; }
      const f = e.target.closest("[data-f]"); if (f) { toggle(f.dataset.f); return; }
      const z = e.target.closest("[data-z]"); if (z) toggle(z.dataset.z);
    });
    el.addEventListener("keydown", (e) => { const z = e.target.closest(".zona"); if (z && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(z.dataset.f); } });
    pintar();
  };

  /* ============================== RITUAL (carrito) ============================== */
  M.ritual = (el) => {
    const D = S.ritual; if (!D?.servicios?.length) return;
    const sel = []; const cats = [...new Set(D.servicios.map((s) => s.cat))];
    const hm = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + (m % 60) + " min" : ""}` : `${m} min`);
    el.classList.add("ritual");
    el.innerHTML = `
      <div class="rit-list">${cats.map((c) => `<p class="rit-cat">${esc(c)}</p><div class="rit-cards">${D.servicios.filter((s) => s.cat === c).map((s) => `<button class="rit-card" data-id="${esc(s.id)}"><b>${esc(s.nombre)}</b><span>${hm(s.min)} · ${precioNum(s.precio)}</span><i aria-hidden="true">+</i></button>`).join("")}</div>`).join("")}</div>
      <div class="rit-tray" aria-live="polite">
        <p class="rit-k">Tu ritual</p>
        <div class="rit-bar"></div>
        <div class="rit-sum"></div>
      </div>`;
    const pintar = () => {
      const lista = sel.map((id) => D.servicios.find((s) => s.id === id));
      const min = lista.reduce((a, s) => a + s.min, 0), eurT = lista.reduce((a, s) => a + s.precio, 0), max = Math.max(D.maxMin || 180, min);
      $$(".rit-card", el).forEach((b) => b.classList.toggle("on", sel.includes(b.dataset.id)));
      $(".rit-bar", el).innerHTML = lista.map((s, i) => `<span style="width:${(s.min / max) * 100}%" class="c${i % 4}" title="${esc(s.nombre)}"></span>`).join("");
      $(".rit-sum", el).innerHTML = lista.length ? `<div><b>${hm(min)}</b><small>de relax</small></div><div><b>${precioNum(eurT)}</b><small>en total</small></div>${btnReservar()}` : `<p class="rit-empty">Añade servicios y mira cuánto dura y cuesta tu momento.</p>`;
      if (!CTX.RM && G()) G().from($$(".rit-bar span", el).slice(-1), { scaleX: 0, transformOrigin: "0 50%", duration: 0.6, ease: "expo.out" });
    };
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".rit-card"); if (!b) return;
      const i = sel.indexOf(b.dataset.id); i >= 0 ? sel.splice(i, 1) : sel.push(b.dataset.id); CTX.buzz(8); pintar();
    });
    pintar();
  };

  /* ============================== BONOS (ahorro) ============================== */
  M.bonos = (el) => {
    const D = S.bonos; if (!D?.length) return;
    let i = 0;
    el.classList.add("bonos");
    el.innerHTML = `<div class="bon-tabs">${D.map((b, k) => `<button data-k="${k}"${k ? "" : ' class="is-on"'}>${esc(b.nombre)}</button>`).join("")}</div><div class="bon-body" aria-live="polite"></div>`;
    const pintar = () => {
      const b = D[i], sueltas = b.sesiones * b.suelta, ahorro = (sueltas - b.bono) * (S.oferta ? S.oferta.factor : 1), pct = Math.round(((sueltas - b.bono) / sueltas) * 100);
      $(".bon-body", el).innerHTML = `
        <p class="bon-k">${b.sesiones} sesiones de ${esc(b.nombre)}</p>
        <div class="bon-row"><span>Sesiones sueltas</span><div class="bon-bar"><i style="width:100%"></i></div><b>${precioNum(sueltas)}</b></div>
        <div class="bon-row is-bono"><span>Con bono</span><div class="bon-bar"><i style="width:${(b.bono / sueltas) * 100}%"></i></div><b>${precioNum(b.bono)}</b></div>
        <p class="bon-save">Ahorras <b>${eur(ahorro)} €</b> <span>(${pct} %)</span></p>
        ${btnReservar()}`;
      if (!CTX.RM && G()) { G().from($$(".bon-bar i", el), { scaleX: 0, transformOrigin: "0 50%", duration: 1, ease: "expo.out", stagger: 0.15 }); G().from($(".bon-save", el), { y: 14, opacity: 0, duration: 0.6, delay: 0.5, ease: "back.out(2)" }); }
    };
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (!b) return; i = +b.dataset.k; $$("[data-k]", el).forEach((x) => x.classList.toggle("is-on", x === b)); CTX.buzz(6); pintar(); });
    pintar();
  };

  /* ============================== NOVIAS (cuenta atrás) ============================== */
  M.novias = (el) => {
    const D = S.novias; if (!D?.pasos?.length) return;
    el.classList.add("novias");
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const def = new Date(hoy.getTime() + 120 * 864e5).toISOString().slice(0, 10);
    el.innerHTML = `<label class="nov-in"><span>¿Cuándo es tu boda?</span><input type="date" value="${def}" min="${hoy.toISOString().slice(0, 10)}" /></label><div class="nov-out" aria-live="polite"></div>`;
    const fmt = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
    const pintar = () => {
      const boda = new Date($("input", el).value + "T00:00:00"); if (isNaN(boda)) return;
      const dias = Math.round((boda - hoy) / 864e5);
      $(".nov-out", el).innerHTML = `<p class="nov-count"><b>${dias}</b> días para tu boda</p><ol class="nov-plan">${D.pasos.map((p) => {
        const f = new Date(boda.getTime() - p.semanas * 7 * 864e5), pasado = f < hoy;
        return `<li class="${pasado ? "past" : ""}"><time>${p.semanas ? fmt(f) : "El día B"}</time><b>${esc(p.titulo)}</b><span>${esc(p.detalle || "")}</span><small>${precio(p.servicio || "")}</small></li>`;
      }).join("")}</ol><p class="note">Plan orientativo: lo ajustamos contigo en la primera cita.</p>${btnReservar()}`;
      if (!CTX.RM && G()) G().from($$(".nov-plan li", el), { x: -20, opacity: 0, stagger: 0.07, duration: 0.6, ease: "expo.out" });
    };
    $("input", el).addEventListener("change", () => { CTX.buzz(6); pintar(); });
    pintar();
  };

  /* ============================== MIRADA (cejas y pestañas) ============================== */
  M.mirada = (el) => {
    const D = S.mirada; if (!D?.opciones?.length) return;
    let zona = D.zonas?.[0]?.[0] || "cejas";
    let actual = D.opciones.find((o) => o.zona === zona) || D.opciones[0];
    // --- geometría de la ilustración (viewBox 0 0 320 200) ---
    const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]; };
    const ESP = [[84, 82], [128, 54], [206, 34], [262, 64]];                 // columna de la ceja
    const GROSOR = { natural: [9, 4], laminado: [16, 6], henna: [14, 5], shading: [15, 5] };
    const ceja = (tipo) => {
      const [g0, g1] = GROSOR[tipo] || GROSOR.natural, arriba = [], abajo = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, p = bez(...ESP, t), q = bez(...ESP, Math.min(1, t + 0.01)), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
        const nx = dy / L, ny = -dx / L, g = (g0 + (g1 - g0) * t) * (t < 0.08 ? 0.6 + t * 5 : 1) / 2;
        arriba.push([p[0] + nx * g, p[1] + ny * g]); abajo.push([p[0] - nx * g, p[1] - ny * g]);
      }
      const pts = arriba.concat(abajo.reverse());
      return "M " + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L ") + " Z";
    };
    const pelos = () => { // trazos del laminado: pelos peinados hacia arriba
      let d = "";
      for (let i = 0; i <= 34; i++) { const t = i / 34, p = bez(...ESP, t), h = 15 - t * 9; d += `M ${(p[0] - 3).toFixed(1)} ${(p[1] + h / 2).toFixed(1)} Q ${(p[0] - 1).toFixed(1)} ${p[1].toFixed(1)} ${(p[0] + 4 + t * 4).toFixed(1)} ${(p[1] - h / 2 - 2).toFixed(1)} `; }
      return d;
    };
    const P0 = [78, 128], PC = [160, 72], P2 = [242, 128];                      // párpado superior
    const lid = (t) => { const u = 1 - t; return [u*u*P0[0] + 2*u*t*PC[0] + t*t*P2[0], u*u*P0[1] + 2*u*t*PC[1] + t*t*P2[1]]; };
    const pestanas = (tipo) => {
      let d = ""; const largo = tipo === "lifting" ? 22 : tipo === "extensiones" ? 28 : 11;
      for (let i = 1; i < 20; i++) {
        const t = 0.06 + (i / 20) * 0.9, p = lid(t), q = lid(t + 0.01), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
        const nx = dy / L, ny = -dx / L, k = largo * (0.6 + Math.sin(t * Math.PI) * 0.5), lado = (t - 0.5) * 1.2;
        const cx = p[0] + nx * k * 0.6 + lado * 6, cy = p[1] + ny * k * 0.6, ex = p[0] + nx * k + lado * (tipo === "lifting" ? 10 : 4), ey = p[1] + ny * k - (tipo === "lifting" ? 6 : -2);
        d += `M ${p[0].toFixed(1)} ${p[1].toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} `;
      }
      return d;
    };
    el.classList.add("mirada");
    el.innerHTML = `
      <div class="mir-stage">
        <svg viewBox="0 0 320 200" class="mir-svg" aria-label="Vista de cómo quedaría tu mirada">
          <defs>
            <linearGradient id="mirSh" x1="0" x2="1"><stop offset="0" stop-color="#3d2b20" stop-opacity=".25"/><stop offset=".45" stop-color="#3d2b20" stop-opacity=".85"/><stop offset="1" stop-color="#3d2b20" stop-opacity="1"/></linearGradient>
            <clipPath id="mirOjo"><path d="M 78 128 Q 160 72 242 128 Q 160 168 78 128 Z"/></clipPath>
            <radialGradient id="mirIris" cx=".45" cy=".4"><stop offset="0" stop-color="#9c7a52"/><stop offset=".7" stop-color="#5a3f27"/><stop offset="1" stop-color="#2d1d12"/></radialGradient>
          </defs>
          <path class="mir-ceja-forma" d=""/>
          <path class="mir-ceja-pelos" d=""/>
          <path d="M 78 128 Q 160 72 242 128 Q 160 168 78 128 Z" fill="#fff" stroke="#c9b3a3" stroke-width="1.5"/>
          <g clip-path="url(#mirOjo)"><circle cx="160" cy="122" r="27" fill="url(#mirIris)"/><circle cx="160" cy="122" r="11" fill="#1a110b"/><circle cx="168" cy="114" r="5" fill="#fff" opacity=".85"/></g>
          <path d="M 78 128 Q 160 72 242 128" fill="none" stroke="#3a2a20" stroke-width="3.5" stroke-linecap="round"/>
          <path class="mir-pest" d="" fill="none" stroke="#1d140e" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="mir-ui">
        ${D.zonas?.length > 1 ? `<div class="seg mir-zonas">${D.zonas.map(([id, n]) => `<button data-z="${esc(id)}"${id === zona ? ' class="is-on"' : ""}>${esc(n)}</button>`).join("")}</div>` : ""}
        <div class="mir-opts"></div>
        <div class="mir-res" aria-live="polite"></div>
      </div>`;
    const forma = $(".mir-ceja-forma", el), trazos = $(".mir-ceja-pelos", el), pest = $(".mir-pest", el);
    const dibujar = (o, animar) => {
      const c = o.dibujo?.ceja || "natural", pe = o.dibujo?.pestanas || "normal";
      forma.setAttribute("d", ceja(c));
      forma.setAttribute("fill", c === "shading" ? "url(#mirSh)" : c === "henna" ? "#4a3427" : c === "laminado" ? "rgba(74,52,39,.35)" : "#6a5240");
      forma.setAttribute("opacity", c === "natural" ? ".75" : "1");
      trazos.setAttribute("d", c === "laminado" ? pelos() : "");
      pest.setAttribute("d", pestanas(pe));
      if (animar && !CTX.RM && G()) {
        G().fromTo(forma, { opacity: 0, scale: 0.96, transformOrigin: "50% 50%" }, { opacity: c === "natural" ? 0.75 : 1, scale: 1, duration: 0.6, ease: "power3.out" });
        [trazos, pest].forEach((p) => { if (!p.getAttribute("d")) return; const L = p.getTotalLength(); G().fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" }); });
      }
    };
    const pintar = (animar) => {
      const lista = D.opciones.filter((o) => o.zona === zona);
      if (!lista.includes(actual)) actual = lista[0];
      $(".mir-opts", el).innerHTML = lista.map((o) => `<button class="mir-opt${o === actual ? " is-on" : ""}" data-id="${esc(o.id)}"><b>${esc(o.titulo)}</b>${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</button>`).join("");
      $(".mir-res", el).innerHTML = `
        ${actual.foto ? `<figure class="mir-foto"><img src="${esc(actual.foto)}" alt="Resultado real: ${esc(actual.titulo)}" loading="lazy" /><figcaption>${esc(actual.fotoTexto || "Trabajo real del centro")}</figcaption></figure>` : ""}
        <div class="mir-txt">
          <p class="mir-k">Tu tratamiento</p>
          <ul>${actual.servicios.map((s) => `<li><b>${esc(s.nombre)}</b><span>${precio(s.precio)}</span>${s.duracion ? `<small>${esc(s.duracion)}</small>` : ""}</li>`).join("")}</ul>
          ${actual.nota ? `<p class="mir-nota">${esc(actual.nota)}</p>` : ""}
          ${btnReservar()}
        </div>`;
      dibujar(actual, animar);
      if (animar && !CTX.RM && G()) G().fromTo($$(".mir-res > *", el), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "expo.out" });
    };
    el.addEventListener("click", (e) => {
      const z = e.target.closest("[data-z]");
      if (z) { zona = z.dataset.z; $$(".mir-zonas button", el).forEach((b) => b.classList.toggle("is-on", b === z)); CTX.buzz(6); pintar(true); return; }
      const o = e.target.closest(".mir-opt"); if (!o) return;
      actual = D.opciones.find((x) => x.id === o.dataset.id); CTX.buzz(8); pintar(true);
    });
    pintar(false);
  };

  window.Modulos = {
    precio, esc,
    iniciar(ctx = {}) {
      CTX = { ...CTX, ...ctx };
      $$("[data-modulo]").forEach((el) => { const f = M[el.dataset.modulo]; if (f) { try { f(el); } catch (err) { console.error("Módulo", el.dataset.modulo, err); } } });
      refresh();
    }
  };
})();
