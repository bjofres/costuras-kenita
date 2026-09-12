/* Costuras Kenita — Fase 1 interacciones (Frontend Lead + A11y Expert) */
const SITE = {
  nombre: "Costuras Kenita",
  whatsapp: "56930906255", // WhatsApp real del taller
  mensajeBase: "Hola, quiero cotizar",
};

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Año + links de WhatsApp configurables
  $("#year").textContent = new Date().getFullYear();
  const waBase = `https://wa.me/${SITE.whatsapp}`;
  $("#waLink").href = waBase;
  $("#waLink").textContent = "+56 9 3090 6255";
  $("#waFloat").href = `${waBase}?text=${encodeURIComponent(SITE.mensajeBase)}`;
  $("#ctaHero").href = `${waBase}?text=${encodeURIComponent(SITE.mensajeBase + ": arreglo / traje / uniforme")}`;

  // Menú móvil
  const btn = $("#menuBtn"), nav = $("#mainNav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });

  // Reveal on scroll (Scroll Animations Expert, con fallback)
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else { items.forEach((el) => el.classList.add("is-visible")); }

  // Contadores del hero
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = target.toLocaleString("es-CL") + "+"; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("es-CL") + (p === 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
    }), { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else counters.forEach(animateCount);

  // Fecha: abrir el calendario tocando cualquier parte del campo
  const fechaInput = $("#f-fecha"), dateWrap = $("#dateWrap");
  const fechaPH = dateWrap.querySelector(".date-ph");
  const syncFecha = () => {
    const v = fechaInput.value;
    dateWrap.classList.toggle("filled", !!v);
    fechaPH.textContent = v ? v.split("-").reverse().join("/") : "fecha";
  };
  fechaInput.addEventListener("click", () => {
    if (typeof fechaInput.showPicker === "function") {
      try { fechaInput.showPicker(); } catch (_) { /* el selector ya está abierto */ }
    }
  });
  fechaInput.addEventListener("change", syncFecha);
  syncFecha();

  // Formulario → valida y abre WhatsApp (sin backend en Fase 1)
  const form = $("#quoteForm"), note = $("#formNote");
  const setErr = (input, msg) => {
    const field = input.closest(".field");
    field.classList.toggle("invalid", !!msg);
    field.querySelector("[data-err]").textContent = msg || "";
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("#f-nombre"), tipo = $("#f-tipo"), fecha = $("#f-fecha"), msg = $("#f-msg");
    let ok = true;
    if (nombre.value.trim().length < 2) { setErr(nombre, "Cuéntame tu nombre (2+ letras)."); ok = false; } else setErr(nombre, "");
    if (!tipo.value) { setErr(tipo, "Elige el tipo de trabajo."); ok = false; } else setErr(tipo, "");
    if (msg.value.trim().length < 10) { setErr(msg, "Describe un poquito más (10+ caracteres)."); ok = false; } else setErr(msg, "");
    if (!ok) { note.textContent = "Revisa los campos marcados, porfis."; note.style.color = "#7A2E3A"; return; }
    const texto = `Hola ${SITE.nombre}, soy ${nombre.value.trim()}. Necesito: ${tipo.value}. ${msg.value.trim()}${fecha.value ? ` Fecha needed: ${fecha.value}.` : ""}`;
    note.textContent = "Abriendo WhatsApp con tu mensaje… ¡gracias!";
    note.style.color = "#2F6B4F";
    window.open(`${waBase}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });
})();
