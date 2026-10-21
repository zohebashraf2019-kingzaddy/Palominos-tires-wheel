/* Palomino's Oversized Wheels & Tires — site scripts */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Gallery content ----------
     To add a photo: drop it in assets/img/ and add a line below.
     cat: trucks | cars | classics | wheels | shop                       */
  const GALLERY = [
    { src: "assets/img/f150-lifted-toyo.jpg", cap: "Lifted F-150 on 35-inch all-terrains", cat: "trucks" },
    { src: "assets/img/wrx-flush-stance.jpg", cap: "Subaru WRX — flush stance on gunmetal wheels", cat: "cars" },
    { video: "assets/video/hummer-chrome.mp4", src: "assets/video/hummer-chrome.jpg", cap: "Hummer H2 — big chrome install", cat: "trucks" },
    { src: "assets/img/cayenne-turbo-service.jpg", cap: "Porsche Cayenne on the rack", cat: "cars" },
    { src: "assets/img/c10-blue-lowered.jpg", cap: "Lowered Chevy C10", cat: "classics" },
    { src: "assets/img/f150-moto-metal-wheel.jpg", cap: "Black & machined off-road wheel, 35x12.50R20", cat: "wheels" },
    { src: "assets/img/charger-hellcat.jpg", cap: "Charger Hellcat out front of the alignment bay", cat: "cars" },
    { src: "assets/img/cutlass-gold.jpg", cap: "Gold Cutlass on custom wheels", cat: "classics" },
    { src: "assets/img/mercedes-rv-tires.jpg", cap: "Mercedes Sprinter RV — new tires", cat: "trucks" },
    { video: "assets/video/cadillac-gold.mp4", src: "assets/video/cadillac-gold.jpg", cap: "Classic Cadillac on gold wires", cat: "classics" },
    { src: "assets/img/porsche-continental-tires.jpg", cap: "Fresh performance rubber for Porsche wheels", cat: "wheels" },
    { src: "assets/img/silverado-lifted.jpg", cap: "Lifted Silverado", cat: "trucks" },
    { src: "assets/img/lincoln-whitewall.jpg", cap: "Lincoln Town Car on wire wheels & whitewalls", cat: "classics" },
    { src: "assets/img/cayenne-white.jpg", cap: "Cayenne Coupe — yellow calipers, ready to roll", cat: "cars" },
    { src: "assets/img/vogue-whitewall-tires.jpg", cap: "Whitewall tires stacked and ready", cat: "wheels" },
    { src: "assets/img/f350-dually.jpg", cap: "F-350 dually", cat: "trucks" },
    { video: "assets/video/jeep-rubicon.mp4", src: "assets/video/jeep-rubicon.jpg", cap: "Jeep Rubicon — black & machined wheels", cat: "trucks" },
    { src: "assets/img/subaru-wrx-blue.jpg", cap: "WRX on red-lip wheels", cat: "cars" },
    { src: "assets/img/chevy-c10-hood.jpg", cap: "Chevy C10 in for service", cat: "classics" },
    { src: "assets/img/canam-utv.jpg", cap: "Can-Am side-by-side", cat: "trucks" },
    { src: "assets/img/charger-red-wheels.jpg", cap: "Charger on red wheels", cat: "cars" },
    { src: "assets/img/square-body-red.jpg", cap: "Square-body Chevy", cat: "classics" },
    { src: "assets/img/cadillac-dts.jpg", cap: "Cadillac DTS on chrome", cat: "cars" },
    { src: "assets/img/shop-wheel-display.jpg", cap: "Wheel display at the shop", cat: "shop" },
    { src: "assets/img/storefront.jpg", cap: "The rebuilt shop — 96 S Wells Ave", cat: "shop" }
  ];
  const CATS = [["all", "All"], ["trucks", "Trucks & Off-Road"], ["cars", "Cars & Exotics"], ["classics", "Classics"], ["wheels", "Wheels & Tires"], ["shop", "The Shop"]];

  const grid = $("#gallery-grid"), filters = $("#filters");
  let current = "all", visible = GALLERY;

  filters.innerHTML = CATS.map(([k, l]) => {
    const n = k === "all" ? GALLERY.length : GALLERY.filter(g => g.cat === k).length;
    return `<button class="filter${k === current ? " on" : ""}" data-cat="${k}" role="tab">${l}<small>${n}</small></button>`;
  }).join("");

  function drawGallery() {
    visible = current === "all" ? GALLERY : GALLERY.filter(g => g.cat === current);
    grid.innerHTML = visible.map((g, i) =>
      `<figure class="g-item${g.video ? " is-video" : ""}" tabindex="0" data-i="${i}" style="animation-delay:${Math.min(i, 12) * 40}ms">
        <img src="${g.src}" alt="${g.cap}" loading="lazy"><figcaption>${g.cap}</figcaption></figure>`).join("");
  }
  filters.addEventListener("click", e => {
    const b = e.target.closest(".filter"); if (!b) return;
    current = b.dataset.cat; $$(".filter").forEach(f => f.classList.toggle("on", f === b)); drawGallery();
  });
  drawGallery();

  /* ---------- Lightbox (photos + videos) ---------- */
  const lb = $("#lightbox"), lbImg = $("img", lb), lbVid = $("video", lb), lbCap = $("figcaption", lb);
  let items = [], idx = 0;
  function show() {
    const it = items[idx];
    lb.classList.toggle("vid", !!it.video);
    if (it.video) { lbVid.src = it.video; lbVid.play().catch(() => {}); lbImg.removeAttribute("src"); }
    else { lbVid.pause(); lbVid.removeAttribute("src"); lbImg.src = it.src; lbImg.alt = it.cap; }
    lbCap.textContent = it.cap + (items.length > 1 ? `  ·  ${idx + 1} / ${items.length}` : "");
  }
  function open(list, i) { items = list; idx = i; show(); lb.classList.add("show"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("show"); lb.setAttribute("aria-hidden", "true"); lbVid.pause(); document.body.style.overflow = ""; }
  const step = n => { idx = (idx + n + items.length) % items.length; show(); };
  grid.addEventListener("click", e => { const f = e.target.closest(".g-item"); if (f) open(visible, +f.dataset.i); });
  grid.addEventListener("keydown", e => { const f = e.target.closest(".g-item"); if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(visible, +f.dataset.i); } });
  $(".lb-close").onclick = close; $(".lb-prev").onclick = () => step(-1); $(".lb-next").onclick = () => step(1);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("show")) return;
    if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
  });
  let sx = null;
  lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); sx = null; });

  /* reels open full screen */
  const reelItems = $$(".reel").map(r => ({ video: $("video", r).getAttribute("src"), src: $("video", r).getAttribute("poster"), cap: $("figcaption b", r).textContent }));
  $$(".reel").forEach((r, i) => r.addEventListener("click", () => open(reelItems, i)));

  /* ---------- Play looping videos only while on screen ---------- */
  const vids = $$("video[data-lazy], .hero-phone video");
  if ("IntersectionObserver" in window) {
    const vo = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    }), { threshold: .25 });
    vids.forEach(v => vo.observe(v));
  } else vids.forEach(v => v.play().catch(() => {}));

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }), { threshold: .12 });
    $$(".reveal").forEach(el => ro.observe(el));
  } else $$(".reveal").forEach(el => el.classList.add("in"));

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger"), menu = $("#menu");
  burger.addEventListener("click", () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  $$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

  /* ---------- Quote form (opens email app) ---------- */
  $("#quote-form").addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const body = `Name: ${d.get("name")}\nPhone: ${d.get("phone")}\nEmail: ${d.get("email")}\nVehicle: ${d.get("vehicle")}\nService: ${d.get("service")}\n\nRequest:\n${d.get("message")}`;
    location.href = `mailto:?subject=${encodeURIComponent("Palomino's Free Quote Request")}&body=${encodeURIComponent(body)}`;
  });

  $("#year").textContent = new Date().getFullYear();
})();
