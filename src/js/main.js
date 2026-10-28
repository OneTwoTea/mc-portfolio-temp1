/* ============================================================================
 *  MAIN.JS — tương tác phía trình duyệt (JavaScript thuần, không thư viện)
 *  1. Header & menu mobile   2. Hiện dần khi cuộn   3. Video tải khi bấm
 *  4. Gallery: lọc + lightbox (vuốt được)   5. Slider cảm nhận   6. Form liên hệ
 * ========================================================================== */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ảnh lỗi trước khi script này chạy (ảnh đầu trang) cũng được đánh dấu
  $$("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && !img.src.startsWith("data:")) img.classList.add("img-missing");
  });

  /** Khóa / mở cuộn trang (dùng chung cho menu và lightbox). */
  const lockScroll = (on) => root.classList.toggle("is-locked", on);

  /** Giữ focus bên trong `container` khi bấm Tab. */
  const trapFocus = (container, e) => {
    if (e.key !== "Tab") return;
    const items = $$("a[href], button:not([disabled])", container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /** Nhận diện vuốt ngang trên `el`, gọi onSwipe(-1 | 1). */
  const onSwipe = (el, handler) => {
    let x0 = null;
    let y0 = null;
    el.addEventListener("touchstart", (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) handler(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  };

  /* ---------- 1. Header & menu mobile ---------- */
  const header = $("#site-header");
  const toggle = $("#menu-toggle");
  const menu = $("#mobile-menu");

  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    $("[data-icon-open]", toggle).classList.toggle("hidden", open);
    $("[data-icon-close]", toggle).classList.toggle("hidden", !open);
    menu.classList.toggle("hidden", !open);
    menu.dataset.open = String(open);
    header.classList.toggle("menu-open", open);
    lockScroll(open);
    if (open) $("a", menu)?.focus();
  };

  toggle?.addEventListener("click", () => setMenu(menu.dataset.open !== "true"));
  // Chọn một mục → đóng menu
  $$("[data-menu-link], a", menu || document.createElement("div")).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  // Bấm ra ngoài vùng nội dung menu → đóng
  menu?.addEventListener("click", (e) => {
    if (!e.target.closest("a, button, li")) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (menu?.dataset.open === "true" && !header.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (menu?.dataset.open !== "true") return;
    if (e.key === "Escape") {
      setMenu(false);
      toggle.focus();
    } else trapFocus(header, e);
  });
  // Xoay ngang / mở rộng cửa sổ lên desktop thì tự đóng menu
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && setMenu(false));

  // Đánh dấu mục menu tương ứng khu vực đang xem
  const navLinks = $$("[data-nav-link]");
  if ("IntersectionObserver" in window && navLinks.length) {
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${entry.target.id}`)));
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((a) => {
      const section = document.getElementById(a.getAttribute("href").slice(1));
      if (section) spy.observe(section);
    });
  }

  /* ---------- 1b. Hero: banner trượt (mũi tên, chấm, vuốt, phím ←/→, tự chuyển) ---------- */
  const hero = $("#top");
  const heroSlides = hero ? $$("[data-hero-slide]", hero) : [];
  if (heroSlides.length > 1) {
    const dots = $$("[data-hero-dot]", hero);
    const pauseBtn = $("[data-hero-pause]", hero);
    const delay = Number(hero.dataset.autoplay) || 0;
    let current = 0;
    let timer = null;
    let paused = reduceMotion || !delay;

    const stop = () => clearInterval(timer);
    const start = () => {
      stop();
      if (!paused && !document.hidden && !hero.matches(":hover, :focus-within")) {
        timer = setInterval(() => go(current + 1, false), delay);
      }
    };
    const go = (i, user = true) => {
      current = (i + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((s, n) => {
        s.classList.toggle("is-active", n === current);
        if (n === current) s.removeAttribute("aria-hidden");
        else s.setAttribute("aria-hidden", "true");
      });
      dots.forEach((d, n) => d.setAttribute("aria-current", String(n === current)));
      if (user) start(); // người dùng tự chuyển → đếm lại thời gian
    };
    const setPaused = (value) => {
      paused = value;
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", String(paused));
        pauseBtn.setAttribute("aria-label", paused ? "Tiếp tục tự chuyển ảnh" : "Tạm dừng tự chuyển ảnh");
        $("[data-icon-pause]", pauseBtn).classList.toggle("hidden", paused);
        $("[data-icon-play]", pauseBtn).classList.toggle("hidden", !paused);
      }
      paused ? stop() : start();
    };

    $$("[data-hero-prev]", hero).forEach((b) => b.addEventListener("click", () => go(current - 1)));
    $$("[data-hero-next]", hero).forEach((b) => b.addEventListener("click", () => go(current + 1)));
    dots.forEach((d) => d.addEventListener("click", () => go(Number(d.dataset.heroDot))));
    pauseBtn?.addEventListener("click", () => setPaused(!paused));
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(current - 1);
      else if (e.key === "ArrowRight") go(current + 1);
    });
    onSwipe(hero, (dir) => go(current + dir));
    // Tạm ngưng khi rê chuột / focus vào banner hoặc khi tab bị ẩn
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", () => setTimeout(start)); // đợi focus rời hẳn banner
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    setPaused(paused);
  }

  /* ---------- 2. Hiện dần khi cuộn ---------- */
  const reveals = $$(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- 3. Video: chỉ tải khi người dùng bấm ---------- */
  $$("[data-video]").forEach((box) => {
    const button = $("button", box);
    button?.addEventListener("click", () => {
      const { youtube, src, title } = box.dataset;
      let player;
      if (youtube) {
        player = document.createElement("iframe");
        player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtube)}?autoplay=1&rel=0&playsinline=1`;
        player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        player.allowFullscreen = true;
        player.title = title || "Video";
      } else if (src) {
        player = document.createElement("video");
        player.src = src;
        player.controls = true;
        player.autoplay = true;
        player.playsInline = true;
        player.preload = "metadata";
        player.setAttribute("aria-label", title || "Video");
        player.addEventListener("error", () => {
          box.insertAdjacentHTML("beforeend", '<p class="absolute inset-x-0 bottom-0 bg-night/90 p-3 text-center text-sm text-snow">Video chưa sẵn sàng.</p>');
        });
      } else {
        return;
      }
      player.className = "absolute inset-0 size-full bg-black";
      box.replaceChildren(player);
      player.focus?.();
    });
  });

  /* ---------- 4. Gallery: lọc theo danh mục + lightbox ---------- */
  const grid = $("#gallery-grid");
  const filters = $$("[data-filter]");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filters.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      $$("li", grid).forEach((li) => {
        li.classList.toggle("is-hidden", cat !== "all" && li.dataset.category !== cat);
        li.classList.add("is-visible");
      });
    }),
  );

  const lightbox = $("#lightbox");
  if (lightbox && grid) {
    const lbImg = $("[data-lightbox-img]", lightbox);
    const lbCaption = $("[data-lightbox-caption]", lightbox);
    const lbCounter = $("[data-lightbox-counter]", lightbox);
    let items = [];
    let index = 0;
    let opener = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const btn = items[index];
      lbImg.classList.remove("img-missing");
      lbImg.src = btn.dataset.full;
      lbImg.alt = btn.dataset.caption || "";
      lbCaption.textContent = btn.dataset.caption || "";
      lbCounter.textContent = `${index + 1} / ${items.length}`;
    };
    const open = (btn) => {
      // Chỉ duyệt các ảnh đang hiển thị theo bộ lọc
      items = $$("li:not(.is-hidden) [data-lightbox-index]", grid);
      opener = btn;
      lightbox.classList.replace("hidden", "flex");
      lockScroll(true);
      show(items.indexOf(btn));
      $("[data-lightbox-close]", lightbox).focus();
    };
    const close = () => {
      lightbox.classList.replace("flex", "hidden");
      lockScroll(false);
      opener?.focus();
    };

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lightbox-index]");
      if (btn) open(btn);
    });
    $("[data-lightbox-close]", lightbox).addEventListener("click", close);
    $("[data-lightbox-prev]", lightbox).addEventListener("click", () => show(index - 1));
    $("[data-lightbox-next]", lightbox).addEventListener("click", () => show(index + 1));
    // Bấm vào nền tối (ngoài ảnh) → đóng
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.tagName === "FIGURE") close();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else trapFocus(lightbox, e);
    });
    onSwipe(lightbox, (dir) => show(index + dir));
  }

  /* ---------- 5. Slider cảm nhận (cuộn ngang + snap, vuốt tự nhiên trên mobile) ---------- */
  const track = $("#slider-track");
  if (track) {
    const slides = $$(":scope > li", track);
    const dots = $$("[data-slide-dot]");
    const prev = $("[data-slide-prev]");
    const next = $("[data-slide-next]");
    const current = () => Math.round(track.scrollLeft / (slides[0]?.offsetWidth || 1));
    const goTo = (i) => {
      const target = slides[Math.max(0, Math.min(i, slides.length - 1))];
      if (target) track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    };
    const update = () => {
      const i = current();
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      dots.forEach((d, n) => d.setAttribute("aria-current", String(n === i)));
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= maxScroll;
    };
    prev?.addEventListener("click", () => goTo(current() - 1));
    next?.addEventListener("click", () => goTo(current() + 1));
    dots.forEach((d) => d.addEventListener("click", () => goTo(Number(d.dataset.slideDot))));
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- 6. Form liên hệ ---------- */
  const form = $("#contact-form");
  if (form) {
    const status = $("[data-form-status]", form);
    const setStatus = (msg, ok = true) => {
      status.textContent = msg;
      status.className = `mt-4 ${ok ? "text-cream/85" : "text-red-700"}`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.elements.name;
      const phone = form.elements.phone;
      if (!name.value.trim()) {
        setStatus("Vui lòng nhập họ tên.", false);
        name.focus();
        return;
      }
      if (!/^[0-9 +.\-]{9,15}$/.test(phone.value.trim())) {
        setStatus("Vui lòng nhập số điện thoại hợp lệ.", false);
        phone.focus();
        return;
      }

      const data = new FormData(form);
      const { endpoint, email, success } = form.dataset;
      const submit = $("button[type=submit]", form);

      if (endpoint) {
        submit.disabled = true;
        setStatus("Đang gửi…");
        try {
          const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.statusText);
          form.reset();
          setStatus(success);
        } catch {
          setStatus("Gửi chưa được. Bạn vui lòng gọi điện hoặc nhắn Zalo giúp mình nhé.", false);
        } finally {
          submit.disabled = false;
        }
        return;
      }

      if (email) {
        const lines = [
          `Họ tên: ${data.get("name")}`,
          `Điện thoại: ${data.get("phone")}`,
          `Email: ${data.get("email") || "-"}`,
          `Ngày sự kiện: ${data.get("date") || "-"}`,
          `Loại sự kiện: ${data.get("type") || "-"}`,
          "",
          `${data.get("message") || ""}`,
        ];
        const subject = `Đặt lịch MC — ${data.get("name")}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
        setStatus("Đang mở ứng dụng email của bạn…");
        return;
      }

      setStatus("Form chưa được cấu hình nơi nhận. Bạn vui lòng gọi điện hoặc nhắn Zalo nhé.", false);
    });
  }
})();
