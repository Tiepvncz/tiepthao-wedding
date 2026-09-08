import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react'
import galleryPhotos from './galleryPhotos'

/* ============================================
   SCROLL REVEAL HOOK
   ============================================ */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  const delayClass = delay ? `reveal-delay-${delay}` : ''
  return (
    <div ref={ref} className={`reveal ${delayClass} ${className}`}>
      {children}
    </div>
  )
}

/* ============================================
   SHARED CONSTANTS
   ============================================ */
const GOOGLE_PHOTOS_URL = 'https://photos.app.goo.gl/YDqyMdkuqvfhKx4u8'
const FULL_GALLERY_URL = 'https://kovachstudio.gallery.photo/gallery/wedding-bszxc5/'

/* ---- Gallery image source ----
   Photos are hotlinked from the photographer's CDN by default. A full backup
   copy also lives in /public/gallery (thumb <i>_t.jpg, full <i>.jpg), so:
   - Each <img> auto-falls back to its stored copy if the hotlink fails.
   - Flip GALLERY_SOURCE to 'local' to force every photo to serve from Vercel
     (e.g. if the photographer's gallery ever goes offline for good). */
const GALLERY_SOURCE = 'hotlink' // 'hotlink' | 'local'
const pad = (i) => String(i).padStart(4, '0')
const localThumb = (i) => `/gallery/${pad(i)}_t.jpg`
const localFull = (i) => `/gallery/${pad(i)}.jpg`
const hotThumb = (url) => `${url}=w600`
const hotFull = (url) => `${url}=w1600`
const thumbSrc = (p) => (GALLERY_SOURCE === 'local' ? localThumb(p.i) : hotThumb(p.url))
const thumbAlt = (p) => (GALLERY_SOURCE === 'local' ? hotThumb(p.url) : localThumb(p.i))
const fullSrc = (p) => (GALLERY_SOURCE === 'local' ? localFull(p.i) : hotFull(p.url))
const fullAlt = (p) => (GALLERY_SOURCE === 'local' ? hotFull(p.url) : localFull(p.i))
// Swap an <img> to its backup source once, on load error (no infinite loop).
const onImgError = (fallback) => (e) => {
  const img = e.currentTarget
  if (img.dataset.fellBack || !fallback) return
  img.dataset.fellBack = '1'
  img.src = fallback
}

const NAV_ORDER = ['thankYou', 'photos', 'story']
const SECTION_IDS = {
  thankYou: 'thank-you',
  photos: 'photos',
  story: 'story',
}

/* ============================================
   TRANSLATIONS
   ============================================ */
const TRANSLATIONS = {
  en: {
    nav: {
      thankYou: 'Thank You',
      photos: 'Photos',
      story: 'Our Story',
    },
    hero: {
      eyebrow: "We're Married",
      date: 'August 1, 2026 · Bon Repos, Czech Republic',
      viewPhotos: 'View Photos',
    },
    thankYou: {
      label: 'With Love & Gratitude',
      title: 'Thank You',
      text: 'Thank you for spending this special weekend with us. Your presence, your love, and your laughter made our wedding day everything we dreamed of and more. We are endlessly grateful to have celebrated surrounded by the people we love.',
    },
    photos: {
      label: 'Share the Memories',
      title: 'Wedding Photos',
      text: "Relive the day through our photographer's eyes. Browse the full collection below - and add your own photos and videos to our shared album before we all slip back into everyday routine.",
      fullGallery: 'View Full Gallery',
      button: 'Add & View Your Photos',
      loadMore: 'Load More Photos',
    },
    story: {
      label: 'Our Story',
      title: 'How It All Began',
      paragraphs: [
        "It all started in 2020, just as Lenka was preparing to move to London for her master's degree. She knew she'd be leaving Prague soon, stepping into a new adventure, and distance was already part of the plan for her life.",
        'And then she met Tiep.',
        'Lenka liked him from the beginning. She just wasn\'t about to make it too easy. Tiep, calm and quietly confident, didn\'t rush anything. He showed up, made her laugh, called when he said he would, and somehow became part of her everyday life at the exact moment she was preparing to leave it. What began as easy conversations quickly turned into daily phone calls, and before long, what was supposed to be a short chapter quietly became something much bigger.',
        'Distance has been part of their story from the very beginning. COVID tested them almost immediately, and over the years, life kept adding miles. When Lenka took a chance on a dream role in Paris, they made it work. When she moved for work to Singapore, they made it work again. Three rounds of long distance, different time zones, countless video calls, and many long flights. And somehow, each time, they came out even closer than before. In between it all, Prague has always been home, the place they return to, where everyday life together feels just as special as their adventures abroad.',
        'In June 2025, during a trip to Madeira, Tiep had a plan: hike to Pico do Arieiro, the island\'s highest peak, and propose at sunrise. The hike was beautiful, the sunrise was perfect, and then… there were about thirty tourists at the viewpoint. He briefly tried to find a more private spot, walking them away from the crowd. But after a few minutes of wandering that probably looked slightly suspicious, he realized the peak was the spot. So back they went. He got down on one knee in front of everyone, and it turned out a crowd of cheering strangers was exactly the audience they didn\'t know they needed.',
        'Now, after six years, three countries, countless miles, and one very public mountain proposal, they\'re married. And this time, no distance required. Just their favorite people, all in one place.',
      ],
      closing: 'August 1, 2026 · Bon Repos, Czech Republic',
    },
    footer: {
      date: 'August 1, 2026',
    },
  },

  vi: {
    nav: {
      thankYou: 'Cảm Ơn',
      photos: 'Hình Ảnh',
      story: 'Chuyện Tình',
    },
    hero: {
      eyebrow: 'Chúng Tôi Đã Cưới',
      date: 'Ngày 1 tháng 8, 2026 · Bon Repos, Cộng hòa Séc',
      viewPhotos: 'Xem Hình Ảnh',
    },
    thankYou: {
      label: 'Với Tất Cả Yêu Thương',
      title: 'Cảm Ơn Quý Vị',
      text: 'Cảm ơn quý vị đã dành trọn cuối tuần đặc biệt này bên chúng tôi. Sự hiện diện, tình yêu thương và những tiếng cười của quý vị đã làm nên một ngày cưới trọn vẹn hơn cả những gì chúng tôi từng mơ ước. Chúng tôi vô cùng biết ơn khi được chung vui bên những người thân yêu nhất.',
    },
    photos: {
      label: 'Lưu Giữ Kỷ Niệm',
      title: 'Hình Ảnh Đám Cưới',
      text: 'Cùng sống lại ngày cưới qua ống kính của nhiếp ảnh gia. Xem trọn bộ ảnh bên dưới - và hãy thêm những bức ảnh, video của riêng bạn vào album chung trước khi tất cả chúng ta trở lại nhịp sống thường ngày.',
      fullGallery: 'Xem Toàn Bộ Album',
      button: 'Thêm & Xem Ảnh Của Bạn',
      loadMore: 'Xem Thêm Ảnh',
    },
    story: {
      label: 'Chuyện Tình Yêu',
      title: 'Câu Chuyện Bắt Đầu',
      paragraphs: [
        'Mọi chuyện bắt đầu vào năm 2020, đúng lúc Thảo đang chuẩn bị sang London để học thạc sĩ. Cô biết mình sắp rời Praha để bước vào một hành trình mới, và khoảng cách vốn đã là một phần trong kế hoạch cuộc đời cô.',
        'Và rồi cô gặp Tiệp.',
        'Thảo đã thích anh ngay từ đầu, chỉ là cô không muốn để mọi thứ trở nên quá dễ dàng. Tiệp điềm tĩnh và tự tin một cách lặng lẽ, anh không vội vàng điều gì. Anh xuất hiện, khiến cô bật cười, gọi điện đúng như đã hứa, và bằng cách nào đó trở thành một phần trong cuộc sống thường ngày của cô đúng vào lúc cô chuẩn bị rời đi. Những cuộc trò chuyện nhẹ nhàng nhanh chóng trở thành những cuộc gọi mỗi ngày, và chẳng bao lâu, điều tưởng chừng chỉ là một chương ngắn ngủi đã lặng lẽ trở thành một điều lớn lao hơn nhiều.',
        'Khoảng cách đã là một phần trong câu chuyện của họ ngay từ những ngày đầu. COVID thử thách họ gần như ngay lập tức, và qua từng năm tháng, cuộc sống cứ thêm vào những dặm đường xa. Khi Thảo nắm lấy cơ hội với công việc mơ ước ở Paris, họ đã cùng nhau vượt qua. Khi cô chuyển đến Singapore vì công việc, một lần nữa họ lại vượt qua. Ba lần yêu xa, những múi giờ khác nhau, vô số cuộc gọi video và biết bao chuyến bay dài. Và bằng cách nào đó, sau mỗi lần như vậy, họ lại trở nên gắn bó hơn trước. Giữa tất cả những điều đó, Praha luôn là nhà, là nơi họ trở về, nơi cuộc sống thường nhật bên nhau cũng đặc biệt như những chuyến phiêu lưu nơi xứ người.',
        'Vào tháng 6 năm 2025, trong một chuyến đi đến Madeira, Tiệp đã có một kế hoạch: leo lên Pico do Arieiro, đỉnh núi cao nhất đảo, và cầu hôn vào lúc bình minh. Cuộc leo núi thật đẹp, bình minh thật hoàn hảo, và rồi… có khoảng ba mươi du khách đang đứng ở điểm ngắm cảnh. Anh thoáng cố tìm một chỗ riêng tư hơn, dẫn cô ra xa đám đông. Nhưng sau vài phút loanh quanh trông có phần hơi khả nghi, anh nhận ra chính đỉnh núi mới là nơi dành cho khoảnh khắc ấy. Thế là họ quay lại. Anh quỳ một gối trước mặt mọi người, và hóa ra một đám đông người lạ đang reo hò chính là khán giả mà họ không ngờ mình lại cần đến.',
        'Giờ đây, sau sáu năm, ba quốc gia, vô số dặm đường và một lời cầu hôn rất "công khai" trên đỉnh núi, họ đã là vợ chồng. Và lần này, không còn khoảng cách nào nữa. Chỉ có những người thân yêu nhất của họ, cùng quây quần ở một nơi.',
      ],
      closing: 'Ngày 1 tháng 8, 2026 · Bon Repos, Cộng hòa Séc',
    },
    footer: {
      date: 'Ngày 1 tháng 8, 2026',
    },
  },
}

/* ============================================
   LANGUAGE CONTEXT
   ============================================ */
const LangContext = createContext(null)
function useLang() {
  return useContext(LangContext)
}

function LangToggle({ onSelect }) {
  const { lang, setLang } = useLang()
  const choose = (l) => {
    setLang(l)
    if (onSelect) onSelect()
  }
  return (
    <div className="lang-toggle">
      <button
        className={`lang-toggle__btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => choose('en')}
        aria-label="English"
      >
        EN
      </button>
      <span className="lang-toggle__sep">/</span>
      <button
        className={`lang-toggle__btn ${lang === 'vi' ? 'active' : ''}`}
        onClick={() => choose('vi')}
        aria-label="Tiếng Việt"
      >
        VI
      </button>
    </div>
  )
}

/* ============================================
   MAIN APP COMPONENT
   ============================================ */
export default function App() {
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lang, setLangState] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('lang')
      if (saved === 'vi' || saved === 'en') return saved
    }
    return 'en'
  })

  const setLang = useCallback((l) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const t = TRANSLATIONS[lang]

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {/* NAVIGATION */}
      <nav className={`nav ${navSolid ? 'nav--solid' : 'nav--transparent'}`}>
        <div className="nav__inner">
          <div className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            T & T
          </div>
          <ul className="nav__links">
            {NAV_ORDER.map((key) => (
              <li key={key}>
                <button className="nav__link" onClick={() => scrollTo(SECTION_IDS[key])}>
                  {t.nav[key]}
                </button>
              </li>
            ))}
          </ul>
          <div className="nav__actions">
            <LangToggle />
            <button
              className="nav__hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`nav__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="nav__close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
          ✕
        </button>
        {NAV_ORDER.map((key) => (
          <button key={key} className="nav__mobile-link" onClick={() => scrollTo(SECTION_IDS[key])}>
            {t.nav[key]}
          </button>
        ))}
        <LangToggle onSelect={() => setMobileMenuOpen(false)} />
      </div>

      {/* HERO */}
      <HeroSection />

      {/* THANK YOU */}
      <ThankYouSection />

      {/* PHOTOS */}
      <PhotosSection />

      {/* OUR STORY */}
      <StorySection />

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__names">Tiep & Thao</div>
          <div className="footer__date">{t.footer.date}</div>
        </div>
      </footer>
    </LangContext.Provider>
  )
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  const { t } = useLang()

  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__eyebrow">{t.hero.eyebrow}</div>
        <h1 className="hero__names">
          Tiep <span className="hero__ampersand">&</span> Thao
        </h1>
        <div className="hero__date">{t.hero.date}</div>
        <div className="hero__buttons">
          <a className="btn btn--light" href="#photos">
            {t.hero.viewPhotos}
          </a>
        </div>
      </div>
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}

/* ============================================
   THANK YOU
   ============================================ */
function ThankYouSection() {
  const { t } = useLang()
  return (
    <section id="thank-you" className="section rsvp">
      <div className="container">
        <Reveal>
          <div className="section-label text-center" style={{ color: 'var(--gold-light)' }}>{t.thankYou.label}</div>
          <h2 className="section-title text-center" style={{ color: 'var(--white)' }}>{t.thankYou.title}</h2>
          <p className="section-subtitle text-center mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {t.thankYou.text}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   PHOTO GALLERY + LIGHTBOX
   A randomized, lazy-loaded grid of the professional wedding
   photos (see src/galleryPhotos.js - a snapshot of the
   photographer's gallery). Thumbnails load only as they scroll
   into view; clicking one opens a full-screen lightbox with
   keyboard / swipe navigation through the whole shuffled set.
   ============================================ */

// Fisher-Yates shuffle (returns a new array).
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const GALLERY_BATCH = 200

function Lightbox({ photos, index, onClose, onNav }) {
  const n = photos.length

  // Keyboard navigation + body scroll lock while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onNav(1)
      else if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onNav])

  // Touch swipe.
  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) onNav(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); onNav(-1) }}
        aria-label="Previous photo"
      >‹</button>
      <div
        className="lightbox__stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={photos[index].i}
          className="lightbox__img"
          src={fullSrc(photos[index])}
          onError={onImgError(fullAlt(photos[index]))}
          alt=""
          draggable="false"
        />
      </div>
      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); onNav(1) }}
        aria-label="Next photo"
      >›</button>
      <div className="lightbox__counter">{index + 1} / {n}</div>
    </div>
  )
}

function PhotoGallery() {
  const { t } = useLang()
  // Shuffle once per visit so the order is random each time. Each entry keeps
  // its original index (i) so it can map to its stored backup file.
  const photos = useMemo(() => shuffle(galleryPhotos.map((url, i) => ({ url, i }))), [])
  const n = photos.length
  const [visible, setVisible] = useState(GALLERY_BATCH)
  const [lightbox, setLightbox] = useState(null) // active index or null

  const nav = useCallback((d) => {
    setLightbox((i) => (i == null ? i : (i + d + n) % n))
  }, [n])

  if (!n) return null

  return (
    <>
      <div className="gallery">
        {photos.slice(0, visible).map((p, i) => (
          <button
            key={p.i}
            className="gallery__item"
            onClick={() => setLightbox(i)}
            aria-label={`Open photo ${i + 1}`}
          >
            <img
              className="gallery__img"
              src={thumbSrc(p)}
              onError={onImgError(thumbAlt(p))}
              alt=""
              loading="lazy"
              draggable="false"
            />
          </button>
        ))}
      </div>
      {visible < n && (
        <div className="gallery__more text-center">
          <div className="gallery__count">{visible} / {n}</div>
          <button
            className="btn btn--large"
            onClick={() => setVisible((v) => Math.min(v + GALLERY_BATCH, n))}
          >
            {t.photos.loadMore}
          </button>
        </div>
      )}
      {lightbox != null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={nav}
        />
      )}
    </>
  )
}

/* ============================================
   PHOTOS SECTION
   ============================================ */
function PhotosSection() {
  const { t } = useLang()
  return (
    <section id="photos" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.photos.label}</div>
            <h2 className="section-title">{t.photos.title}</h2>
            <p className="section-subtitle text-center mx-auto">{t.photos.text}</p>
          </div>
        </Reveal>

        <PhotoGallery />

        <Reveal>
          <div className="photos__cta text-center">
            <a className="btn btn--large" href={FULL_GALLERY_URL} target="_blank" rel="noopener noreferrer">
              {t.photos.fullGallery}
            </a>
            <a className="btn btn--large btn--outline" href={GOOGLE_PHOTOS_URL} target="_blank" rel="noopener noreferrer">
              {t.photos.button}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   OUR STORY
   ============================================ */
function StorySection() {
  const { t } = useLang()
  return (
    <section id="story" className="section section--alt">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.story.label}</div>
            <h2 className="section-title">{t.story.title}</h2>
          </div>
        </Reveal>

        <div className="ornament">
          <div className="ornament__line" />
          <div className="ornament__diamond" />
          <div className="ornament__line" />
        </div>

        <Reveal>
          <div className="story__content">
            <div className="story__text">
              {t.story.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="story__closing">{t.story.closing}</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

