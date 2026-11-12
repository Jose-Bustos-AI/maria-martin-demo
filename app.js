/* Animaciones de la web y arranque de los módulos.
   Cada bloque comprueba que su sección exista: borrar una sección del HTML no rompe nada. */
(() => {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove("js"); return; }
  window.__ok = true;
  gsap.registerPlugin(ScrollTrigger);

  // ?motion fuerza las animaciones (el navegador integrado tiene "reducir movimiento" activado)
  const FORCE = /[?&]motion/.test(location.search);
  if (FORCE) root.classList.add("fm");
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches && !FORCE;
  const DESK = matchMedia("(min-width: 900px)").matches;
  const S = window.SALON || {};
  const buzz = (p) => { try { if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) navigator.vibrate(p); } catch (e) {} };
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const ST = (trigger, extra = {}) => ({ trigger, start: "top bottom", end: "bottom top", scrub: true, ...extra });

  // enlaces de reserva y precios con oferta
  $$("[data-reservar]").forEach((a) => (a.href = S.reservar || "#"));
  $$("[data-precio]").forEach((e) => (e.innerHTML = window.Modulos ? Modulos.precio(e.dataset.precio) : e.dataset.precio));

  // ---------- scroll suave ----------
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const goTo = (target) => { const el = typeof target === "string" ? $(target) : target; if (!el) return; lenis ? lenis.scrollTo(el, { offset: -70, duration: 1.3 }) : el.scrollIntoView({ behavior: RM ? "auto" : "smooth" }); };

  // ---------- cabecera, menú y botón flotante ----------
  const nav = $("#nav"), fab = $("#fab"), centros = $("#centros");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("solid", y > 30);
    nav.classList.toggle("on-dark", y < innerHeight * 0.8 && !DESK && !nav.classList.contains("solid"));
    nav.classList.toggle("hide", y > 400 && y > lastY && !document.body.classList.contains("menu-open"));
    lastY = y;
    if (fab) fab.classList.toggle("show", y > innerHeight * 0.8 && (!centros || centros.getBoundingClientRect().top > innerHeight * 0.6));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = $("#burger");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open); $("#menu").setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener("click", () => { buzz(8); setMenu(!document.body.classList.contains("menu-open")); });
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    e.preventDefault(); setMenu(false); goTo(id);
  }));

  // ---------- partir textos en palabras (respeta <em>) ----------
  const splitWords = (el, cls) => {
    const walk = (node, inEm) => {
      const out = [];
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { out.push(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = cls === "wd" ? "wd" : "w";
            if (cls === "wd") w.textContent = t; else { const i = document.createElement("span"); i.className = "wi"; i.textContent = t; w.appendChild(i); }
            if (inEm) { const em = document.createElement("em"); em.appendChild(w); out.push(em); } else out.push(w);
          });
        } else if (n.nodeType === 1) out.push(...walk(n, inEm || n.tagName === "EM"));
      });
      return out;
    };
    const parts = walk(el, false); el.textContent = ""; parts.forEach((p) => el.appendChild(p));
  };
  $$(".split").forEach((el) => splitWords(el, "w"));
  if ($("#manifestoText")) splitWords($("#manifestoText"), "wd");

  // ---------- HERO ----------
  if ($(".hero")) {
    const intro = gsap.timeline({ delay: 0.15 });
    intro.to(".hero-title .li", { y: 0, duration: 1.2, ease: "expo.out", stagger: 0.12 }, DESK ? 0.35 : 0.2)
      .fromTo("#heroMedia", { clipPath: DESK ? "inset(0% 0% 0% 100%)" : "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: DESK ? 1.4 : 0.01, ease: "expo.inOut" }, 0)
      .fromTo("#heroVideo", { scale: 1.35 }, { scale: 1, duration: 2, ease: "expo.out" }, 0)
      .to(".hero .reveal-up", { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.5)
      .fromTo(".badge", { y: 30, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.8)", stagger: 0.15 }, 1);
    if ($("#heroSeal")) intro.fromTo("#heroSeal", { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 1.2, ease: "back.out(1.4)" }, 1.1);
    if (RM) intro.progress(1);
    gsap.to("#heroVideo", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    if ($("#heroRing")) gsap.to("#heroRing", { rotate: 240, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    $$(".badge").forEach((b) => gsap.to(b, { y: () => parseFloat(b.dataset.speed || 0) * innerHeight, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } }));
    gsap.to(".hero-txt", { y: -60, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "45% top", end: "bottom top", scrub: true } });
    if (!RM && $(".badge-a")) gsap.to(".badge-a", { y: "-=8", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.4 });
  }

  // ---------- titulares y textos ----------
  $$(".split").forEach((el) => gsap.to($$(".wi", el), { y: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 86%" } }));
  $$("section:not(.hero) .eyebrow, section:not(.hero) .lead").forEach((el) => gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } }));

  // ---------- MANIFIESTO ----------
  if ($("#manifestoText")) {
    gsap.to("#manifestoText .wd", { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: "#manifestoText", start: "top 78%", end: "bottom 45%", scrub: true } });
    if ($(".mf-1")) gsap.fromTo(".mf-1", { y: 120, rotate: 6 }, { y: -140, rotate: -4, ease: "none", scrollTrigger: ST(".manifiesto") });
    if ($(".mf-2")) gsap.fromTo(".mf-2", { y: 80, rotate: -8 }, { y: -100, rotate: 3, ease: "none", scrollTrigger: ST(".manifiesto") });
  }

  // ---------- MÉTODO (escena fijada) ----------
  if ($("#metodoStage")) {
    const imgs = $$(".m-img"), steps = $$(".m-step"), mNum = $("#mNum"), n = steps.length;
    const tl = gsap.timeline({ scrollTrigger: { trigger: "#metodoStage", start: "top top", end: "bottom bottom", scrub: 0.6,
      onUpdate: (s) => {
        const i = Math.min(n - 1, Math.floor(s.progress * n + 0.08));
        steps.forEach((st, k) => st.classList.toggle("is-on", k === i));
        const t = String(i + 1).padStart(2, "0"); if (mNum && mNum.textContent !== t) { mNum.textContent = t; buzz(6); }
      } } });
    tl.to("#mBar", { scaleX: 1, ease: "none", duration: n }, 0).to(imgs[0].querySelector("img"), { scale: 1, ease: "none", duration: 1 }, 0);
    imgs.slice(1).forEach((im, k) => tl.to(im, { clipPath: "inset(0% 0 0 0)", ease: "power2.inOut", duration: 0.7 }, k + 0.75).to(im.querySelector("img"), { scale: 1, ease: "none", duration: 1.2 }, k + 0.75));
  }

  // ---------- CÍRCULO de vídeo ----------
  if ($("#circulo")) {
    const cv = $("#cVideo");
    gsap.timeline({ scrollTrigger: { trigger: "#circulo", start: "top top", end: "bottom bottom", scrub: 0.6, onToggle: (s) => (s.isActive ? cv.play().catch(() => {}) : cv.pause()) } })
      .to("#cL", { xPercent: -110, opacity: 0, ease: "power2.in", duration: 0.75 }, 0.05)
      .to("#cR", { xPercent: 110, opacity: 0, ease: "power2.in", duration: 0.75 }, 0.05)
      .fromTo("#cMask", { clipPath: "circle(17vmin at 50% 50%)" }, { clipPath: "circle(125vmin at 50% 50%)", ease: "power2.in", duration: 1 }, 0)
      .fromTo("#cVideo", { scale: 1.5 }, { scale: 1, ease: "none", duration: 1 }, 0)
      .fromTo("#cCap", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, 0.85);
  }

  // ---------- DESTACADO: vídeo a través de las letras ----------
  if ($("#destacado")) {
    const v = $("#auVideo"), letra = $("#auO"), mask = $("#auMask");
    const origen = () => { const m = mask.getBoundingClientRect(), o = letra.getBoundingClientRect(); mask.style.transformOrigin = `${o.left - m.left + o.width * 0.16}px ${o.top - m.top + o.height * 0.5}px`; };
    origen(); addEventListener("resize", origen);
    gsap.timeline({ scrollTrigger: { trigger: "#destacado", start: "top top", end: "bottom bottom", scrub: 0.6, onToggle: (s) => (s.isActive ? v.play().catch(() => {}) : v.pause()), onRefresh: origen } })
      .to("#auLabels", { opacity: 0, y: -20, duration: 0.12 }, 0.02)
      .fromTo("#auMask", { scale: 1 }, { scale: 26, ease: "power3.in", duration: 0.45 }, 0.05)
      .to("#auMask", { opacity: 0, duration: 0.08 }, 0.42)
      .fromTo("#auVideo", { scale: 1.25 }, { scale: 1, ease: "none", duration: 0.6 }, 0.05)
      .to("#auShade", { opacity: 1, duration: 0.15 }, 0.5)
      .fromTo("#auContent", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }, 0.58)
      .fromTo("#auContent .au-points li", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.12, stagger: 0.04 }, 0.66)
      .to({}, { duration: 0.12 });
  }

  // ---------- MÓDULOS INTERACTIVOS ----------
  if (window.Modulos) Modulos.iniciar({ RM, buzz, goTo });
  $$("[data-modulo]").forEach((m) => gsap.from(m, { y: 70, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: m, start: "top 92%" } }));

  // ---------- CIFRAS ----------
  $$("[data-count]").forEach((b) => {
    const end = parseFloat(b.dataset.count), dec = +(b.dataset.dec || 0), o = { v: 0 }, fmt = (v) => v.toFixed(dec).replace(".", ",");
    if (RM) { b.textContent = fmt(end); return; }
    ScrollTrigger.create({ trigger: b, start: "top 90%", once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", onUpdate: () => (b.textContent = fmt(o.v)) }) });
  });
  if ($(".cf-img")) {
    gsap.fromTo(".cf-img", { rotate: -8, y: 60 }, { rotate: 3, y: -40, ease: "none", scrollTrigger: ST(".cifras") });
    gsap.fromTo(".cf-img img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: ST(".cifras") });
  }

  // ---------- CENTROS ----------
  if ($(".centros-grid")) gsap.from(".centro", { y: 80, opacity: 0, stagger: 0.15, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".centros-grid", start: "top 85%" } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
