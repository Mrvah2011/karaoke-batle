import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Благотворительный Караоке Батл — Казань, 21 мая 2026
 * Drop-in React component. Requires Tailwind CSS in the host project.
 * Fonts used: 'Playfair Display', 'Manrope'.
 *
 * Все часто меняющиеся настройки — в объекте CONTACTS ниже.
 * Фотогалереи сами подтягивают файлы из папок assets/photos и assets/venue
 * (нужно соблюдать именование 01.jpg, 02.jpg и т.д.).
 */
/* ---------- НАСТРОЙКИ, которые часто меняют ---------- */
    const CONTACTS = {
      phone:      "+7 (927) 440-78-74",
      phoneTel:   "+79274407874",
      whatsapp:   "https://wa.me/79274407874",
      telegram:   "https://t.me/prostoeliza",
      max:        "https://max.ru/u/f9LHodD0cOL04E3ROmuHORtA5nSx2ABs4Ls4i6apC7LhJEUaFyx6i-9mDkM",
      formEmail:  "89274407874@mail.ru",   // куда приходят заявки
      /* опционально: чтобы заявки падали в Telegram в личку, заведите бота у @BotFather
         и вставьте его токен и свой chat_id (получите у @userinfobot). */
      tgBotToken: "",
      tgChatId:   "",
    };
    /* Фотогалереи сами находят файлы в папках (01.jpg, 02.jpg, …). Чтобы
       обновить галерею — положите новые JPG с таким же именованием в
       assets/photos (прошлый батл) или assets/venue (ресторан Zoloto). */
    const PHOTOS_FOLDER = "assets/photos";
    const VENUE_FOLDER  = "assets/venue";
    const VIDEO_SRC    = "assets/video/karaoke-2024.mp4";
    const VIDEO_POSTER = "assets/video/poster.jpg";

    const brand = {
      serif: "'Playfair Display', ui-serif, Georgia, serif",
      sans:  "'Manrope', ui-sans-serif, system-ui, -apple-system, sans-serif",
    };

    /* ---------- Иконки ---------- */
    const IconPhone = (p) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.75 12.75 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.75 12.75 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    const IconWhatsApp = (p) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.85 11.85 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44Zm-8.48 18.24h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.8 1 1.01-3.7-.23-.38a9.86 9.86 0 0 1-1.52-5.25c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.46-4.43 9.9-9.86 9.9Zm5.44-7.42c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17c-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.75-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.34Z"/>
      </svg>
    );
    const IconTelegram = (p) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M21.94 4.08 2.8 11.5c-1.04.4-1.03 1 .22 1.4l4.9 1.53 1.9 5.84c.22.64.11.9.79.9.52 0 .75-.25 1.04-.54.19-.18 1.3-1.27 2.54-2.48l5.09 3.77c.94.52 1.61.25 1.84-.87l3.33-15.7c.34-1.55-.41-2.12-1.51-1.27Zm-4.5 3.5-9.83 8.82-.39 4.13 2.05-6.24 8.5-7.54c.39-.33.44-.2.22.11Z"/>
      </svg>
    );
    /* Логотип MAX-мессенджера — реальный лого из файла */
    const IconMax = ({ className = "", width, height, ...p }) => (
      <img
        src="assets/logo_max.jpg"
        alt="MAX"
        width={width} height={height}
        className={`object-contain ${className}`}
        {...p}
      />
    );
    const IconArrow = (p) => (
      <svg viewBox="0 0 24 24" fill="none" {...p}>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

    /* ---------- Общие ---------- */
    const GradientText = ({ children, className = "" }) => (
      <span className={`bg-clip-text text-transparent bg-gradient-to-r from-[#FF3B5C] via-[#E11D48] to-[#F4D47A] ${className}`}>{children}</span>
    );

    const SectionTitle = ({ kicker, title, lead, align = "center" }) => (
      <div className={`max-w-3xl mb-10 md:mb-14 ${align === "center" ? "mx-auto text-center" : ""}`}>
        {kicker && (
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#F4D47A]/80 mb-4">
            <span className="h-px w-6 bg-[#F4D47A]/50" />{kicker}<span className="h-px w-6 bg-[#F4D47A]/50" />
          </div>
        )}
        <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] text-white" style={{ fontFamily: brand.serif }}>{title}</h2>
        {lead && <p className="mt-4 text-base md:text-lg text-white/60 max-w-2xl mx-auto">{lead}</p>}
      </div>
    );

    const CtaButton = ({ children, href = "#booking", variant = "primary", onClick, target, rel }) => {
      const base = "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm md:text-base font-semibold tracking-wide transition-all duration-300 will-change-transform";
      const styles = variant === "primary"
        ? "text-white bg-gradient-to-r from-[#E11D48] via-[#FF3B5C] to-[#9C1B3B] shadow-[0_10px_40px_-10px_rgba(225,29,72,0.7)] hover:shadow-[0_20px_60px_-10px_rgba(255,59,92,0.9)] hover:-translate-y-0.5"
        : "text-white/90 border border-white/15 bg-white/[0.03] backdrop-blur hover:bg-white/[0.08] hover:border-white/30";
      return (
        <a href={href} onClick={onClick} target={target} rel={rel} className={`${base} ${styles}`}>
          {children}
          <IconArrow width="16" height="16" className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      );
    };

    const useReveal = () => {
      const ref = useRef(null);
      const [shown, setShown] = useState(false);
      useEffect(() => {
        if (!ref.current || shown) return;
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
        }, { threshold: 0.15 });
        io.observe(ref.current);
        return () => io.disconnect();
      }, [shown]);
      return { ref, shown };
    };

    const Reveal = ({ children, delay = 0, className = "" }) => {
      const { ref, shown } = useReveal();
      return (
        <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
             className={`transition-all duration-[900ms] ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
          {children}
        </div>
      );
    };

    const Counter = ({ to = 0, suffix = "", prefix = "", duration = 1600 }) => {
      const { ref, shown } = useReveal();
      const [val, setVal] = useState(0);
      useEffect(() => {
        if (!shown) return;
        const start = performance.now();
        let raf = 0;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      }, [shown, to, duration]);
      return <span ref={ref}>{prefix}{val.toLocaleString("ru-RU")}{suffix}</span>;
    };

    /* Автоматически собирает список фото из папки.
       Достаточно класть файлы с именами 01.jpg, 02.jpg, 03.jpg и т.д.
       Если какой-то номер пропущен — сканер остановится после 3 промахов подряд. */
    const useAutoPhotos = (folder, hardMax = 99) => {
      const [photos, setPhotos] = useState([]);
      useEffect(() => {
        let alive = true;
        (async () => {
          const found = [];
          let misses = 0;
          for (let i = 1; i <= hardMax; i++) {
            const src = `${folder}/${String(i).padStart(2, "0")}.jpg`;
            const ok = await new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              img.src = src;
            });
            if (!alive) return;
            if (ok) {
              found.push(src);
              misses = 0;
              setPhotos(found.slice());
            } else {
              misses++;
              if (misses >= 3) break;
            }
          }
        })();
        return () => { alive = false; };
      }, [folder, hardMax]);
      return photos;
    };

    /* Универсальный лайтбокс: показывает либо массив фото (с навигацией), либо видео. */
    const Lightbox = ({ open, onClose, items, index, onIndex, videoSrc }) => {
      useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
          if (e.key === "Escape") onClose();
          if (items && items.length) {
            if (e.key === "ArrowLeft")  onIndex((index - 1 + items.length) % items.length);
            if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
          }
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.removeEventListener("keydown", onKey);
          document.body.style.overflow = prevOverflow;
        };
      }, [open, items, index, onIndex, onClose]);
      if (!open) return null;
      const hasNav = items && items.length > 1;
      return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm grid place-items-center p-3 md:p-8" onClick={onClose}>
          <button onClick={onClose} aria-label="Закрыть"
                  className="absolute top-3 right-3 md:top-5 md:right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div className="relative max-w-[96vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {videoSrc ? (
              <video src={videoSrc} controls autoPlay playsInline preload="metadata"
                     className="max-w-[96vw] max-h-[90vh] rounded-2xl bg-black" />
            ) : (
              <img src={items[index]} alt="" className="max-w-[96vw] max-h-[90vh] rounded-2xl object-contain select-none" />
            )}
          </div>
          {hasNav && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}
                      aria-label="Предыдущее"
                      className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}
                      aria-label="Следующее"
                      className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.25em] uppercase text-white/60">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </div>
            </>
          )}
        </div>
      );
    };

    /* ---------- NAV ---------- */
    const Nav = () => {
      const [open, setOpen] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      useEffect(() => {
        const on = () => setScrolled(window.scrollY > 12);
        on();
        window.addEventListener("scroll", on, { passive: true });
        return () => window.removeEventListener("scroll", on);
      }, []);
      const links = [
        { href: "#tariffs",   label: "Тарифы" },
        { href: "#programme", label: "Программа" },
        { href: "#gallery",   label: "Как было" },
        { href: "#venue",     label: "Место" },
        { href: "#team",      label: "Команда" },
        { href: "#faq",       label: "FAQ" },
        { href: "#booking",   label: "Бронь" },
      ];
      return (
        <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "backdrop-blur-md bg-[#0A0A0B]/80 border-b border-white/5" : "bg-transparent"}`}>
          <nav className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
            <a href="#top" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9C1B3B] grid place-items-center shadow-[0_0_30px_-5px_rgba(225,29,72,0.6)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 14a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v4a4 4 0 0 0 4 4Zm7-4a7 7 0 0 1-14 0M12 21v-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-white text-sm tracking-[0.25em]" style={{ fontFamily: brand.serif }}>KARAOKE</div>
                <div className="text-[10px] tracking-[0.35em] text-[#F4D47A]/80 uppercase">Благотворительный Батл</div>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-7">
              {links.map(l => <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</a>)}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer noopener" aria-label="WhatsApp" title="WhatsApp"
                 className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"><IconWhatsApp width="16" height="16" /></a>
              <a href={CONTACTS.telegram} target="_blank" rel="noreferrer noopener" aria-label="Telegram" title="Telegram"
                 className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"><IconTelegram width="16" height="16" /></a>
              <a href={CONTACTS.max} target="_blank" rel="noreferrer noopener" aria-label="MAX" title="MAX"
                 className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"><IconMax width="16" height="16" /></a>
              <a href={`tel:${CONTACTS.phoneTel}`} className="text-sm text-white/80 hover:text-white hidden xl:inline">{CONTACTS.phone}</a>
              <CtaButton href="#booking">Участвовать</CtaButton>
            </div>
            <button className="lg:hidden p-2 text-white" aria-label="Меню" onClick={() => setOpen(!open)}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                {open ? <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            </button>
          </nav>
          <div className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"} bg-[#0A0A0B]/95 border-t border-white/5`}>
            <div className="px-5 py-5 flex flex-col gap-4">
              {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/80 hover:text-white py-1">{l.label}</a>)}
              <div className="flex gap-3 pt-2">
                <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer noopener" className="w-10 h-10 grid place-items-center rounded-full border border-white/10 text-white/80"><IconWhatsApp width="18" height="18" /></a>
                <a href={CONTACTS.telegram} target="_blank" rel="noreferrer noopener" className="w-10 h-10 grid place-items-center rounded-full border border-white/10 text-white/80"><IconTelegram width="18" height="18" /></a>
                <a href={CONTACTS.max}      target="_blank" rel="noreferrer noopener" className="w-10 h-10 grid place-items-center rounded-full border border-white/10 text-white/80"><IconMax      width="18" height="18" /></a>
              </div>
              <CtaButton href="#booking" onClick={() => setOpen(false)}>Участвовать</CtaButton>
            </div>
          </div>
        </header>
      );
    };

    /* ---------- HERO ---------- */
    const Hero = () => (
      <section id="top" className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(156,27,59,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(244,212,122,0.08),transparent_55%)]" />
          <div className="absolute -right-20 top-20 text-[22rem] leading-none select-none text-white/[0.02]" style={{ fontFamily: brand.serif }} aria-hidden>桜</div>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] tracking-[0.2em] uppercase text-[#F4D47A] border border-[#F4D47A]/25 bg-[#F4D47A]/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F4D47A] animate-pulse" />
                21 мая 2026 · Казань · Zoloto
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-white" style={{ fontFamily: brand.serif }}>
                Караоке,<br />
                где ваш голос<br />
                <GradientText>спасает жизни детей.</GradientText>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 md:mt-8 text-lg text-white/70 max-w-xl leading-relaxed">
                Второй благотворительный караоке-батл в Казани. Один <em className="not-italic text-white">не скучный</em> вечер. Один микрофон.
                <span className="text-white"> 100% сборов</span> направляется в фонд{" "}
                <a href="https://sgdeti.ru/" target="_blank" rel="noreferrer noopener" className="underline decoration-[#F4D47A]/50 hover:decoration-white">«Солнечный город»</a>{" "}
                на программу профилактики сиротства.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <CtaButton href="#booking">Участвовать</CtaButton>
                <CtaButton href="#tariffs" variant="ghost">Выбрать билет</CtaButton>
              </div>
            </Reveal>
            <Reveal delay={480}>
              <div className="mt-10 flex items-center gap-6 text-sm text-white/50">
                <div className="flex -space-x-2">
                  {["from-[#E11D48] to-[#9C1B3B]","from-[#F4D47A] to-[#A37D1B]","from-white/80 to-white/30"].map((g,i)=>(
                    <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-[#0A0A0B]`} />
                  ))}
                </div>
                <span><span className="text-white font-semibold">150</span> мест · Осталось <span className="text-[#FF3B5C] font-semibold">42</span></span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-[#141416] to-[#0A0A0B]">
              <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
                <defs>
                  <radialGradient id="smokeA" cx="50%" cy="60%" r="60%">
                    <stop offset="0%" stopColor="#FF3B5C" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="#9C1B3B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0A0A0B" stopOpacity="0" />
                  </radialGradient>
                  <filter id="blur1"><feGaussianBlur stdDeviation="18" /></filter>
                </defs>
                <ellipse cx="200" cy="280" rx="190" ry="260" fill="url(#smokeA)" filter="url(#blur1)" />
                <g opacity="0.7" filter="url(#blur1)">
                  <path d="M100 400 C 140 320, 180 360, 200 260 S 260 200, 300 280 S 350 360, 300 420" stroke="#FF3B5C" strokeWidth="38" fill="none" strokeLinecap="round" />
                </g>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <svg width="44%" viewBox="0 0 200 320" className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" aria-hidden>
                  <defs>
                    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F4D47A" />
                      <stop offset="50%" stopColor="#B98B2E" />
                      <stop offset="100%" stopColor="#5A3F10" />
                    </linearGradient>
                    <linearGradient id="mh" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2a2a2a" />
                      <stop offset="100%" stopColor="#0d0d0d" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="100" cy="90" rx="62" ry="70" fill="url(#mh)" stroke="#F4D47A" strokeOpacity="0.4" />
                  {Array.from({length:9}).map((_,i)=>(
                    <line key={i} x1={45+i*14} y1="30" x2={45+i*14} y2="150" stroke="#F4D47A" strokeOpacity="0.35" strokeWidth="1.3" />
                  ))}
                  {[45,70,95,120].map((y,i)=>(
                    <ellipse key={i} cx="100" cy={y} rx={60-i*2} ry="6" fill="none" stroke="#F4D47A" strokeOpacity="0.25" />
                  ))}
                  <rect x="90" y="155" width="20" height="20" fill="url(#mg)" />
                  <rect x="82" y="175" width="36" height="130" rx="14" fill="url(#mg)" />
                  <rect x="82" y="260" width="36" height="10" fill="#0d0d0d" opacity="0.5" />
                </svg>
              </div>
              <div className="absolute left-5 bottom-5 right-5 md:left-6 md:bottom-6 md:right-auto md:max-w-[70%] rounded-2xl bg-black/50 backdrop-blur border border-white/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#F4D47A]/80">Цель вечера</div>
                <div className="mt-1 text-2xl md:text-3xl text-white" style={{ fontFamily: brand.serif }}>500 000 ₽ = 10 детей в семье</div>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#E11D48] to-[#F4D47A]" style={{ width: "41%" }} />
                </div>
                <div className="mt-2 text-xs text-white/60">Уже собрано: 204 000 ₽ на прошлом батле</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );

    /* ---------- TRUST ---------- */
    const TrustStrip = () => {
      const items = [
        { v: 204000, suffix: " ₽", label: "собрано за 3 часа в 2024 году" },
        { v: 510, suffix: " ч.", label: "работы психологов с приёмными семьями" },
        { v: 0, suffix: " %", label: "комиссии — каждый рубль уходит в фонд" },
      ];
      return (
        <section className="relative py-16 md:py-20 border-y border-white/5 bg-white/[0.015]">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid sm:grid-cols-3 gap-10 md:gap-6">
            {items.map((it, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl text-white" style={{ fontFamily: brand.serif }}>
                    <GradientText><Counter to={it.v} suffix={it.suffix} /></GradientText>
                  </div>
                  <div className="mt-3 text-white/60 text-sm md:text-base max-w-xs mx-auto">{it.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      );
    };

    /* ---------- PARTNERS (лого фонда) ---------- */
    const Partners = () => (
      <section className="relative py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <Reveal>
            <div className="text-center text-[11px] tracking-[0.3em] uppercase text-[#F4D47A]/80 mb-6">
              Партнёр вечера · Все сборы уходят в
            </div>
          </Reveal>
          <Reveal delay={120}>
            <a href="https://sgdeti.ru/" target="_blank" rel="noreferrer noopener"
               className="group mx-auto max-w-xl flex items-center justify-center gap-5 md:gap-7 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all p-5 md:p-6">
              <img src="assets/logo_sg.svg" alt="Фонд «Солнечный город»"
                   className="h-14 md:h-16 w-auto" loading="lazy" />
              <div className="text-left">
                <div className="text-white text-lg md:text-xl" style={{ fontFamily: brand.serif }}>Фонд «Солнечный город»</div>
                <div className="text-white/60 text-sm mt-0.5">sgdeti.ru — чтобы детских домов в России не существовало</div>
              </div>
              <IconArrow width="18" height="18" className="text-white/50 group-hover:text-white transition" />
            </a>
          </Reveal>
        </div>
      </section>
    );

    /* ---------- ТАРИФЫ ---------- */
    const Services = () => {
      const plans = [
        { name: "Зритель", price: "2 000",
          pain: "«Боюсь провести вечер скучно или в сомнительной компании»",
          result: "Место в премиальном зале Zoloto, фуршет от шеф-повара и нетворкинг со 150 лидерами мнений города.",
          perks: ["Место за столом","Фуршет, красная дорожка","Участие в голосовании и аукционе","Фотозона и чат с участниками"],
          highlight: false },
        { name: "Участник", price: "3 500",
          pain: "«Боюсь забыть слова или не попасть в ноты перед аудиторией»",
          result: "Профессиональный бэк-вокал вытянет любую ноту. Статус номинанта премии фонда и контент от профессиональных фотографов.",
          perks: ["Выход на сцену с бэк-вокалом","Личный менеджер за кулисами","Статус номинанта + диплом фонда","Призы от спонсоров в конкурсах"],
          highlight: true },
        { name: "Меценат", price: "10 000",
          pain: "«Мой вклад останется незамеченным»",
          result: "VIP-ложа на 6 персон, официальный статус партнёра и благодарность фонда в федеральных отчётах.",
          perks: ["VIP-ложа на 6 персон","Упоминание в итоговом ролике","Сертификат почётного благотворителя","Личная встреча с фондом"],
          highlight: false },
      ];
      return (
        <section id="tariffs" className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Три способа участвовать"
              title={<>Инвестиции в эмоции <GradientText>и будущее</GradientText></>}
              lead="Выберите формат, который ближе. Каждый тариф закрывает конкретную боль и превращает ваш вечер в измеримую помощь детям." />
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <Reveal key={p.name} delay={i * 120}>
                  <div className={`relative h-full rounded-3xl p-7 md:p-8 border transition-all duration-500 hover:-translate-y-1 ${
                    p.highlight
                      ? "bg-gradient-to-br from-[#1A0A10] to-[#0A0A0B] border-[#E11D48]/40 shadow-[0_30px_80px_-30px_rgba(225,29,72,0.6)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}>
                    {p.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase bg-gradient-to-r from-[#E11D48] to-[#9C1B3B] text-white">Лучший выбор</div>
                    )}
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl md:text-3xl text-white" style={{ fontFamily: brand.serif }}>{p.name}</h3>
                      <div className="text-right">
                        <div className="text-3xl md:text-4xl text-white" style={{ fontFamily: brand.serif }}>{p.price} ₽</div>
                        <div className="text-xs text-white/40 mt-1">за билет</div>
                      </div>
                    </div>
                    <div className="mt-5 text-sm text-white/50 italic border-l-2 border-[#E11D48]/60 pl-3">{p.pain}</div>
                    <div className="mt-4 text-[15px] text-white/80 leading-relaxed">{p.result}</div>
                    <ul className="mt-6 space-y-2.5">
                      {p.perks.map(perk => (
                        <li key={perk} className="flex items-start gap-3 text-sm text-white/70">
                          <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0 mt-0.5 text-[#F4D47A]" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>{perk}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7">
                      <a href="#booking" className={`block text-center rounded-full py-3 text-sm font-semibold transition-all ${
                        p.highlight
                          ? "bg-gradient-to-r from-[#E11D48] via-[#FF3B5C] to-[#9C1B3B] text-white hover:shadow-[0_15px_40px_-10px_rgba(255,59,92,0.8)]"
                          : "border border-white/15 text-white hover:bg-white/[0.06]"
                      }`}>Занять место</a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-10 max-w-3xl mx-auto text-center text-sm text-white/50">
                Все деньги с билетов и аукциона поступают в благотворительный фонд{" "}
                <a href="https://sgdeti.ru/" target="_blank" rel="noreferrer noopener" className="underline decoration-[#F4D47A]/50 hover:text-white">«Солнечный город»</a>{" "}
                на программу профилактики сиротства.
              </div>
            </Reveal>
          </div>
        </section>
      );
    };

    /* ---------- ПРОГРАММА ВЕЧЕРА ---------- */
    const Programme = () => {
      const items = [
        { time: "19:00", title: "Открытие",        desc: "Красная дорожка, фуршет, фотозона, знакомство гостей." },
        { time: "19:30", title: "Первый батл",     desc: "Выход участников на сцену. Живой бэк-вокал, судейство зала." },
        { time: "21:00", title: "Аукцион",         desc: "Лоты от спонсоров и AI-картины. Все средства уходят в фонд." },
        { time: "22:30", title: "Финал и итоги",   desc: "Объявление собранной суммы, награждение, afterparty." },
      ];
      return (
        <section id="programme" className="relative py-20 md:py-28 bg-white/[0.015]">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Сценарий вечера"
              title={<>Программа <GradientText>вечера</GradientText></>}
              lead="Тайминг продуман так, чтобы вы успели и спеть, и поторговаться на аукционе, и вернуться домой не слишком поздно." />
            <ol className="relative border-l border-white/10 pl-6 md:pl-10 space-y-8">
              {items.map((it, i) => (
                <Reveal key={it.time} delay={i * 120}>
                  <li className="relative">
                    <span className="absolute -left-[30px] md:-left-[46px] top-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9C1B3B] ring-4 ring-[#0A0A0B]" />
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
                      <div className="shrink-0 text-[#F4D47A] text-2xl md:text-3xl tracking-wider" style={{ fontFamily: brand.serif }}>{it.time}</div>
                      <div>
                        <div className="text-white text-xl md:text-2xl" style={{ fontFamily: brand.serif }}>{it.title}</div>
                        <div className="mt-1 text-white/65 text-[15px] leading-relaxed max-w-xl">{it.desc}</div>
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      );
    };

    /* Переиспользуемая горизонтальная фотокарусель с лайтбоксом. */
    const PhotoStrip = ({ photos, aspect = "aspect-[3/2]", width = "landscape", caption }) => {
      const scrollerRef = useRef(null);
      const [lbIdx, setLbIdx] = useState(-1);
      const scrollBy = (dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: Math.round(el.clientWidth * 0.85) * dir, behavior: "smooth" });
      };
      const widthCls =
        width === "portrait"
          ? "w-[70%] sm:w-[44%] md:w-[30%] lg:w-[23%]"
          : "w-[86%] sm:w-[60%] md:w-[45%] lg:w-[36%]";

      if (!photos.length) {
        return <div className="py-10 text-center text-white/40 text-sm">Загружаем фотохронику…</div>;
      }
      return (
        <div className="relative">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#F4D47A]/80">Фотохроника</div>
              <div className="mt-1 text-2xl md:text-3xl text-white" style={{ fontFamily: brand.serif }}>{caption}</div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scrollBy(-1)} aria-label="Предыдущие"
                      className="w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/35 transition grid place-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => scrollBy(1)} aria-label="Следующие"
                      className="w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/35 transition grid place-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

          <div ref={scrollerRef}
               className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-5 px-5 md:-mx-0 md:px-0">
            {photos.map((src, i) => (
              <figure key={src}
                      onClick={() => setLbIdx(i)}
                      className={`group shrink-0 snap-start relative overflow-hidden rounded-3xl border border-white/10 bg-[#141416] cursor-zoom-in ${widthCls} ${aspect}`}>
                <img src={src} alt={`Кадр ${i + 1}`} loading="lazy" decoding="async"
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM8 10.5h5M10.5 8v5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </span>
                <figcaption className="absolute left-4 bottom-3 text-[11px] tracking-[0.25em] uppercase text-white/70">
                  #{String(i + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="flex md:hidden items-center justify-center gap-3 mt-3">
            <button onClick={() => scrollBy(-1)} aria-label="Назад"
                    className="w-10 h-10 rounded-full border border-white/15 text-white/80 grid place-items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Вперёд"
                    className="w-10 h-10 rounded-full border border-white/15 text-white/80 grid place-items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          <Lightbox open={lbIdx >= 0} items={photos} index={Math.max(0, lbIdx)}
                    onIndex={setLbIdx} onClose={() => setLbIdx(-1)} />
        </div>
      );
    };

    /* ---------- ГАЛЕРЕЯ (видео + фото прошлого батла) ---------- */
    const Gallery = () => {
      const photos = useAutoPhotos(PHOTOS_FOLDER);
      const [videoOpen, setVideoOpen] = useState(false);

      return (
        <section id="gallery" className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Как это было"
              title={<>Караоке Батл <GradientText>в прошлый раз</GradientText></>}
              lead="Один вечер, 204 000 ₽ в фонд, сотни улыбок и ни одной фальшивой ноты (точнее, ни одной запомнившейся)." />

            {/* видео — горизонтальная заставка, а по клику открывается в нативном вертикальном формате */}
            <Reveal>
              <button
                onClick={() => setVideoOpen(true)}
                aria-label="Смотреть видео"
                className="relative block w-full mx-auto max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] group">
                {/* превью-кадр по центру в вертикальной ориентации, чтобы передавать формат видео */}
                <div className="absolute inset-0 bg-[#0A0A0B]">
                  <img src={VIDEO_POSTER} alt="Караоке Батл 2024 — постер"
                       className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xl scale-110" />
                  <div className="absolute inset-0 grid place-items-center">
                    <img src={VIDEO_POSTER} alt=""
                         className="h-full aspect-[9/16] max-h-full object-cover rounded-2xl border border-white/10 shadow-2xl" />
                  </div>
                </div>
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center group-hover:scale-105 transition-transform">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9C1B3B] opacity-70 blur-lg" />
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="white" className="relative translate-x-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                <span className="absolute bottom-5 left-5 right-5 md:left-6 md:bottom-6 text-left">
                  <span className="block text-[11px] tracking-[0.3em] uppercase text-[#F4D47A]/80">Караоке Батл · 2024</span>
                  <span className="block text-white text-xl md:text-2xl mt-1" style={{ fontFamily: brand.serif }}>Тот самый вечер за 90 секунд</span>
                </span>
              </button>
            </Reveal>

            {/* фото — горизонтальные, с возможностью открыть крупнее */}
            <div className="mt-12 md:mt-16">
              <PhotoStrip photos={photos} aspect="aspect-[3/2]" width="landscape" caption="Листайте и нажимайте для увеличения" />
            </div>
          </div>

          <Lightbox open={videoOpen} videoSrc={VIDEO_SRC} onClose={() => setVideoOpen(false)} />
        </section>
      );
    };

    /* ---------- ГДЕ БУДЕТ ПРОХОДИТЬ (Ресторан Zoloto) ---------- */
    const Venue = () => {
      const photos = useAutoPhotos(VENUE_FOLDER);
      return (
        <section id="venue" className="relative py-20 md:py-28 bg-white/[0.015]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Где будет проходить мероприятие"
              title={<>Ресторан <GradientText>Zoloto</GradientText></>} />

            <Reveal>
              <div className="mx-auto max-w-4xl grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center mb-12 md:mb-16">
                <a href="https://2gis.ru/kazan/firm/70000001097248325" target="_blank" rel="noreferrer noopener"
                   className="shrink-0 inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition p-6 md:p-7">
                  <img src="assets/logo_zoloto.svg" alt="Ресторан Zoloto" className="h-14 md:h-16 w-auto" />
                </a>
                <p className="text-white/75 leading-relaxed text-[15px] md:text-base">
                  Zoloto — премиум-ресторан в Казани. Пространство в стиле фьюжн: величественые колонны,
                  объёмные люстры, мягкие пастельные тона в сочетании с элементами золотого цвета, дизайнерская
                  мебель и посуда. Фьюжн-меню из блюд разных кухонь мира. Каждый найдет то, что ему по душе.
                </p>
              </div>
            </Reveal>

            <PhotoStrip photos={photos} aspect="aspect-[3/4]" width="portrait" caption="Интерьер и атмосфера" />
          </div>
        </section>
      );
    };

    /* ---------- КОМАНДА ---------- */
    const Team = () => {
      const team = [
        { name: "Елизавета Пронских", role: "Организатор вечера", grad: "from-[#E11D48] to-[#9C1B3B]", initials: "ЕП",
          bio: "В 2024 году собрала 204 000 ₽ за один вечер на первом Караоке Батле. Знает, как превратить сбор средств в закрытую тусовку, куда хочется вернуться.",
          tag: "Автор формата" },
        { name: "Анна Соколова", role: "Куратор фонда «Солнечный город»", grad: "from-[#F4D47A] to-[#A37D1B]", initials: "АС",
          bio: "15 лет в социальных программах. Под её кураторством 80% подопечных семей сохранили детей и не попали в систему госучреждений.",
          tag: "Ваша гарантия прозрачности" },
        { name: "Максим Вагнер", role: "Звукорежиссёр и педагог по вокалу", grad: "from-[#1F5FD0] to-[#11264F]", initials: "МВ",
          bio: "Настроил звук на 500+ концертах звёзд первой величины. За 48 часов готовит новичков к выходу на сцену — без зажимов и страха перед микрофоном.",
          tag: "Закрывает страх сцены" },
      ];
      return (
        <section id="team" className="relative py-20 md:py-28 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Команда"
              title={<>Мастера, которые делают <GradientText>ваш вечер</GradientText></>}
              lead="Три человека отвечают за то, чтобы вы чувствовали себя уверенно на сцене, а ваши деньги — реально дошли до детей." />
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 120}>
                  <article className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/25 transition-all duration-500 h-full">
                    <div className={`relative h-64 bg-gradient-to-br ${m.grad}`}>
                      <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 40%)" }} />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-white/90 text-6xl md:text-7xl" style={{ fontFamily: brand.serif }}>{m.initials}</div>
                      </div>
                      <div className="absolute left-5 top-5 text-[10px] tracking-[0.3em] uppercase text-white/80 bg-black/30 backdrop-blur px-3 py-1 rounded-full border border-white/15">{m.tag}</div>
                    </div>
                    <div className="p-6 md:p-7">
                      <h3 className="text-2xl text-white" style={{ fontFamily: brand.serif }}>{m.name}</h3>
                      <div className="mt-1 text-[#F4D47A]/90 text-sm">{m.role}</div>
                      <p className="mt-4 text-white/70 text-[15px] leading-relaxed">{m.bio}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );
    };

    /* ---------- ОТЗЫВЫ ---------- */
    const Testimonials = () => {
      const reviews = [
        { name: "Марат И.", tag: "Меценат, 2024",
          text: "Редкий случай, когда «благотворительность» — это не унылые речи, а реально крутая тусовка. Звук в Zoloto топовый. Приятно знать, что твой отдых закрыл счёт на лечение ребёнка. Советую брать билеты заранее — в прошлый раз мест не хватило." },
        { name: "Елена В.", tag: "Участник",
          text: "Очень переживала, что не умею петь, но формат максимально дружелюбный. Подпевали всем залом. Всё прозрачно: в конце вечера озвучили финальную сумму. Организация на уровне лучших закрытых клубов Москвы." },
        { name: "Артур М.", tag: "Зритель → Участник",
          text: "Чёткий тайминг, понятный дресс-код, никакой «воды». Пришёл ради нетворкинга — в итоге купил на аукционе картину ИИ и помог фонду. Для Казани это новый уровень ивентов." },
      ];
      return (
        <section id="reviews" className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Отзывы" title={<>Слова тех, кто уже <GradientText>пел с нами</GradientText></>} lead="Выжимки из отзывов после первого Караоке Батла в 2024 году." />
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 120}>
                  <figure className="relative h-full rounded-3xl p-7 md:p-8 border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#E11D48]/70" aria-hidden fill="currentColor">
                      <path d="M14 8c-5 0-9 4-9 9v15h12V19H9c0-4 2-6 5-6V8Zm20 0c-5 0-9 4-9 9v15h12V19h-8c0-4 2-6 5-6V8Z" />
                    </svg>
                    <div className="mt-4 flex gap-1 text-[#F4D47A]">
                      {Array.from({length:5}).map((_,j)=>(
                        <svg key={j} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l2.95 6.97L22 10l-5.5 4.73L18 22l-6-3.78L6 22l1.5-7.27L2 10l7.05-1.03L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="mt-4 text-white/85 leading-relaxed text-[15.5px]">{r.text}</blockquote>
                    <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                      <div className="text-white" style={{ fontFamily: brand.serif, fontSize: "1.1rem" }}>{r.name}</div>
                      <div className="text-xs tracking-[0.2em] uppercase text-[#F4D47A]/80">{r.tag}</div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );
    };

    /* ---------- FAQ ---------- */
    const FAQ = () => {
      const qs = [
        { q: "Что будет на фуршете? Есть ли позиции для вегетарианцев?",
          a: "Специальное меню от шеф-повара Zoloto: мясные, рыбные и веган-позиции, десерты и безалкогольные коктейли. Мы заранее уточним аллергии в WhatsApp после бронирования." },
        { q: "А если я плохо пою?",
          a: "Профессиональный бэк-вокал вытянет любую ноту, а ведущий направит энергию зала на поддержку. Здесь не оценивают вокал — здесь ценят смелость помогать. Репетиция с педагогом доступна за 48 часов до события." },
        { q: "Как я узнаю, что деньги дошли до детей?",
          a: "В конце вечера мы объявим финальную сумму со сцены. В течение 14 дней вы получите именной сертификат и отчёт фонда «Солнечный город» с подтверждающими документами." },
        { q: "Где парковка и что с дресс-кодом?",
          a: "Парковка ТЦ Coliseum на 150 мест (бесплатно для гостей). Дресс-код: чёрный, белый, красный — Black Tie / Creative Black. Гайд пришлём в WhatsApp после оплаты." },
      ];
      const [open, setOpen] = useState(0);
      return (
        <section id="faq" className="relative py-20 md:py-28 bg-white/[0.015]">
          <div className="max-w-4xl mx-auto px-5 md:px-8">
            <SectionTitle kicker="Без сюрпризов" title={<>Часто задаваемые <GradientText>вопросы</GradientText></>} />
            <div className="space-y-3">
              {qs.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} className={`rounded-2xl border transition-all ${isOpen ? "border-[#E11D48]/40 bg-white/[0.03]" : "border-white/10 bg-white/[0.02]"}`}>
                    <button className="w-full px-5 md:px-6 py-5 flex items-center justify-between gap-4 text-left" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                      <span className="text-white text-[15.5px] md:text-lg">{item.q}</span>
                      <span className={`shrink-0 w-8 h-8 rounded-full border border-white/15 grid place-items-center transition-transform ${isOpen ? "rotate-45 bg-[#E11D48] border-[#E11D48] text-white" : "text-white/70"}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                    <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="min-h-0">
                        <div className="px-5 md:px-6 pb-5 text-white/70 leading-relaxed">{item.a}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    };

    /* ---------- БРОНЬ / ФОРМА ---------- */
    const Booking = () => {
      const [form, setForm] = useState({ name: "", phone: "", tariff: "Участник", guests: 1, message: "", agree: true });
      const [sent, setSent]       = useState(false);
      const [sending, setSending] = useState(false);
      const [errMsg, setErrMsg]   = useState("");
      const [err, setErr]         = useState({});

      /* ВАЖНО: используем стабильный setter и НЕ объявляем вложенный компонент <Field>,
         иначе React пересоздаёт input на каждом нажатии — курсор «теряется». */
      const set = useCallback((k) => (e) => {
        const v = k === "guests" ? (Number(e.target.value) || 1) :
                  k === "agree"  ? e.target.checked :
                  e.target.value;
        setForm((f) => ({ ...f, [k]: v }));
      }, []);

      const validate = () => {
        const e = {};
        if (!form.name.trim() || form.name.trim().length < 2) e.name = "Укажите имя";
        if (!/^[+0-9 ()\-]{10,}$/.test(form.phone))           e.phone = "Неверный телефон";
        if (!form.agree)                                      e.agree = "Подтвердите согласие";
        return e;
      };

      const total = (form.tariff === "Зритель" ? 2000 : form.tariff === "Участник" ? 3500 : 10000) * form.guests;

      const onSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErr(e);
        if (Object.keys(e).length) return;
        setSending(true);
        setErrMsg("");

        const payload = {
          _subject: `Заявка с сайта Караоке Батл · ${form.tariff}`,
          Имя:     form.name,
          Телефон: form.phone,
          Тариф:   form.tariff,
          Гостей:  form.guests,
          Итого:   `${total} ₽`,
          Сообщение: form.message || "—",
        };

        try {
          // 1) e-mail через FormSubmit.co (без бэкенда)
          const res = await fetch(`https://formsubmit.co/ajax/${CONTACTS.formEmail}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body:    JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Mail ${res.status}`);

          // 2) опционально — дубль в Telegram в личку @prostoeliza (нужны bot token и chat_id)
          if (CONTACTS.tgBotToken && CONTACTS.tgChatId) {
            const text =
              `🎤 Новая заявка на Караоке Батл\n` +
              `👤 ${form.name}\n📞 ${form.phone}\n🎟 ${form.tariff} · ${form.guests} гост.\n💰 ${total} ₽\n` +
              (form.message ? `💬 ${form.message}` : "");
            fetch(`https://api.telegram.org/bot${CONTACTS.tgBotToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: CONTACTS.tgChatId, text }),
            }).catch(() => {});
          }

          setSent(true);
        } catch (ex) {
          setErrMsg("Не удалось отправить форму. Напишите в WhatsApp — ответим сразу.");
        } finally {
          setSending(false);
        }
      };

      const inputClass = (k) =>
        `mt-2 w-full bg-transparent border-b py-3 text-white placeholder-white/30 outline-none transition-colors ${
          err[k] ? "border-[#FF3B5C]" : "border-white/15 focus:border-[#F4D47A]"
        }`;

      return (
        <section id="booking" className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 md:gap-16">
            <div>
              <SectionTitle align="left" kicker="Бронь"
                title={<>Всего 150 мест. <br /><GradientText>Осталось 42.</GradientText></>}
                lead="Оставьте контакты — мы пришлём билет и гайд по дресс-коду в WhatsApp в течение 2 минут." />
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.02]">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-[#F4D47A]/80">Когда</div>
                  <div className="mt-1 text-xl text-white" style={{ fontFamily: brand.serif }}>21 мая 2026 · 18:00</div>
                  <div className="mt-1 text-white/60 text-sm">Финал в 22:30 — уважаем ваш график.</div>
                </div>
                <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.02]">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-[#F4D47A]/80">Где</div>
                  <div className="mt-1 text-xl text-white" style={{ fontFamily: brand.serif }}>Ресторан Zoloto, Казань</div>
                  <div className="mt-1 text-white/60 text-sm">ТЦ Coliseum, улица Пушкина 29а, цокольный этаж</div>
                  <a href="https://2gis.ru/kazan/firm/70000001097248325" target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex items-center gap-2 text-sm text-[#FF3B5C] hover:text-white">
                    Открыть на 2ГИС
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.02]">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-[#F4D47A]/80 mb-3">Контакты</div>
                  <div className="space-y-3">
                    <a href={`tel:${CONTACTS.phoneTel}`} className="flex items-center gap-3 text-white/85 hover:text-white">
                      <span className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-[#F4D47A]"><IconPhone width="16" height="16" /></span>
                      {CONTACTS.phone}
                    </a>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer noopener"
                         className="inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-full border border-white/10 text-white/85 hover:text-white hover:border-white/30 transition">
                        <IconWhatsApp width="16" height="16" /> WhatsApp
                      </a>
                      <a href={CONTACTS.telegram} target="_blank" rel="noreferrer noopener"
                         className="inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-full border border-white/10 text-white/85 hover:text-white hover:border-white/30 transition">
                        <IconTelegram width="16" height="16" /> Telegram
                      </a>
                      <a href={CONTACTS.max} target="_blank" rel="noreferrer noopener"
                         className="inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-full border border-white/10 text-white/85 hover:text-white hover:border-white/30 transition">
                        <IconMax width="16" height="16" /> MAX
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#141416] to-[#0A0A0B] p-7 md:p-10">
                {!sent ? (
                  <form onSubmit={onSubmit} className="space-y-6" noValidate>
                    <div className="text-xl text-white" style={{ fontFamily: brand.serif }}>Получите приглашение</div>

                    <label className="block">
                      <span className="text-xs tracking-[0.2em] uppercase text-white/50">Имя</span>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Как к вам обращаться"
                        value={form.name}
                        onChange={set("name")}
                        className={inputClass("name")}
                      />
                      {err.name && <span className="text-xs text-[#FF3B5C] mt-1 inline-block">{err.name}</span>}
                    </label>

                    <label className="block">
                      <span className="text-xs tracking-[0.2em] uppercase text-white/50">Телефон</span>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+7 ___ ___-__-__"
                        value={form.phone}
                        onChange={set("phone")}
                        className={inputClass("phone")}
                      />
                      {err.phone && <span className="text-xs text-[#FF3B5C] mt-1 inline-block">{err.phone}</span>}
                    </label>

                    <div>
                      <span className="text-xs tracking-[0.2em] uppercase text-white/50">Тариф</span>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {["Зритель","Участник","Меценат"].map(t => {
                          const active = form.tariff === t;
                          return (
                            <button key={t} type="button" onClick={() => setForm(f => ({ ...f, tariff: t }))}
                              className={`py-3 rounded-xl text-sm transition-all border ${active
                                ? "bg-gradient-to-r from-[#E11D48] to-[#9C1B3B] text-white border-transparent"
                                : "border-white/10 text-white/70 hover:border-white/25"}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <label className="block">
                        <span className="text-xs tracking-[0.2em] uppercase text-white/50">Гостей</span>
                        <input
                          type="number"
                          min={1} max={20}
                          value={form.guests}
                          onChange={set("guests")}
                          className="mt-2 w-full bg-transparent border-b border-white/15 focus:border-[#F4D47A] py-3 text-white outline-none"
                        />
                      </label>
                      <div className="flex items-end">
                        <div className="text-white/60 text-sm">Итого:&nbsp;
                          <span className="text-white font-semibold">{total.toLocaleString("ru-RU")}&nbsp;₽</span>
                        </div>
                      </div>
                    </div>

                    <label className="block">
                      <span className="text-xs tracking-[0.2em] uppercase text-white/50">Комментарий (желаемая песня, аллергии, компания)</span>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={set("message")}
                        className="mt-2 w-full bg-transparent border-b border-white/15 focus:border-[#F4D47A] py-3 text-white outline-none resize-none"
                      />
                    </label>

                    <label className="flex items-start gap-3 text-sm text-white/60 cursor-pointer select-none">
                      <input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-1 accent-[#E11D48]" />
                      <span>Я согласен с обработкой персональных данных и хочу получить приглашение в WhatsApp.</span>
                    </label>
                    {err.agree && <div className="text-xs text-[#FF3B5C] -mt-4">{err.agree}</div>}
                    {errMsg && <div className="text-sm text-[#FF3B5C]">{errMsg}</div>}

                    <button type="submit" disabled={sending}
                      className="w-full rounded-full py-4 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-[#E11D48] via-[#FF3B5C] to-[#9C1B3B] shadow-[0_15px_40px_-10px_rgba(225,29,72,0.8)] hover:shadow-[0_25px_60px_-10px_rgba(255,59,92,0.9)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0">
                      {sending ? "Отправляем…" : "Забронировать место"}
                    </button>
                    <div className="text-center text-xs text-white/40">
                      Нажимая кнопку, вы соглашаетесь с <a href="#" className="underline hover:text-white/70">условиями оферты</a>. Заявка придёт на почту организатору и продублируется в Telegram.
                    </div>
                  </form>
                ) : (
                  <div className="py-10 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#E11D48] to-[#9C1B3B] grid place-items-center shadow-[0_15px_40px_-10px_rgba(225,29,72,0.6)]">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="mt-6 text-2xl text-white" style={{ fontFamily: brand.serif }}>Готово! Мы с вами свяжемся</div>
                    <div className="mt-2 text-white/60">Приглашение и гайд по дресс-коду придут в WhatsApp в течение 2 минут.</div>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                      <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer noopener"
                         className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/15 text-white/85 hover:text-white hover:border-white/30 transition">
                        <IconWhatsApp width="16" height="16" /> Написать в WhatsApp
                      </a>
                      <a href={CONTACTS.telegram} target="_blank" rel="noreferrer noopener"
                         className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/15 text-white/85 hover:text-white hover:border-white/30 transition">
                        <IconTelegram width="16" height="16" /> Telegram
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    };

    /* ---------- FOOTER ---------- */
    const Footer = () => (
      <footer className="relative border-t border-white/5 py-12 bg-[#07070A]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-white text-lg" style={{ fontFamily: brand.serif }}>Благотворительный Караоке Батл</div>
            <p className="mt-3 text-white/55 text-sm max-w-sm">
              Казань, 21 мая 2026. Сбор средств в фонд{" "}
              <a href="https://sgdeti.ru/" target="_blank" rel="noreferrer noopener" className="underline decoration-[#F4D47A]/50 hover:text-white">«Солнечный город»</a>{" "}
              — чтобы детских домов в России не существовало.
            </p>
          </div>
          <div className="text-sm text-white/60">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#F4D47A]/80 mb-3">Навигация</div>
            <div className="grid grid-cols-2 gap-2">
              <a href="#tariffs"   className="hover:text-white">Тарифы</a>
              <a href="#programme" className="hover:text-white">Программа</a>
              <a href="#gallery"   className="hover:text-white">Как было</a>
              <a href="#venue"     className="hover:text-white">Место</a>
              <a href="#team"      className="hover:text-white">Команда</a>
              <a href="#faq"       className="hover:text-white">FAQ</a>
              <a href="#booking"   className="hover:text-white">Бронь</a>
            </div>
          </div>
          <div className="text-sm text-white/60">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#F4D47A]/80 mb-3">Контакты</div>
            <div className="space-y-2">
              <a href={`tel:${CONTACTS.phoneTel}`} className="flex items-center gap-2 hover:text-white"><IconPhone width="14" height="14" /> {CONTACTS.phone}</a>
              <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 hover:text-white"><IconWhatsApp width="14" height="14" /> WhatsApp</a>
              <a href={CONTACTS.telegram} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 hover:text-white"><IconTelegram width="14" height="14" /> Telegram</a>
              <a href={CONTACTS.max}      target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 hover:text-white"><IconMax width="14" height="14" /> MAX</a>
              <div className="pt-1 text-white/50">Казань, ТЦ Coliseum, ул. Пушкина 29а</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/40">
          <div>© 2026 Благотворительный Караоке Батл · Казань</div>
          <div>Организатор: Елизавета Пронских · Партнёр: <a href="https://sgdeti.ru/" target="_blank" rel="noreferrer noopener" className="underline decoration-[#F4D47A]/40 hover:text-white">фонд «Солнечный город»</a></div>
        </div>
      </footer>
    );

    /* ---------- APP ---------- */
    function App() {
      return (
        <div className="min-h-screen bg-[#0A0A0B] text-white antialiased selection:bg-[#E11D48] selection:text-white" style={{ fontFamily: brand.sans }}>
          <Nav />
          <main>
            <Hero />
            <TrustStrip />
            <Partners />
            <Services />
            <Programme />
            <Gallery />
            <Venue />
            <Team />
            <Testimonials />
            <FAQ />
            <Booking />
          </main>
          <Footer />
        </div>
      );
    }
export default App;
