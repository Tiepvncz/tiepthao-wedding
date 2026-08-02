import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import albumPhotos from './albumPhotos'

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

const NAV_ORDER = ['thankYou', 'photos', 'story', 'gifts']
const SECTION_IDS = {
  thankYou: 'thank-you',
  photos: 'photos',
  story: 'story',
  gifts: 'gifts',
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
      gifts: 'Registry',
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
      text: "Relive the weekend through everyone's eyes - and add your own photos and videos before we all slip back into everyday routine. The album is open for all of us to enjoy and contribute to.",
      button: 'Add & View Photos',
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
    gifts: {
      label: 'With Thanks',
      title: 'Gift Registry',
      intro: 'Your presence was the greatest gift of all. If you would still like to honour us, we would be grateful for a contribution to our dream-home fund.',
      accounts: [
        {
          label: 'EUR Account',
          lines: ['Viet Tiep Nguyen', 'IBAN: LT03 3250 0323 9669 0806', 'BIC/SWIFT: REVOLT21', 'Revolut Bank UAB'],
        },
        {
          label: 'CZK Account',
          lines: ['Viet Tiep Nguyen', 'IBAN: CZ45 3030 0000 0015 7387 0067', 'BIC/SWIFT: AIRACZPP', 'Account: 1573870067/3030'],
        },
      ],
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
      gifts: 'Quà Tặng',
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
      text: 'Cùng sống lại những khoảnh khắc của ngày cưới qua góc nhìn của mọi người - và hãy thêm những bức ảnh, video của riêng bạn trước khi tất cả chúng ta trở lại nhịp sống thường ngày. Album được mở để mọi người cùng xem và đóng góp.',
      button: 'Thêm & Xem Ảnh',
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
    gifts: {
      label: 'Lời Cảm Ơn',
      title: 'Quà Mừng Cưới',
      intro: 'Sự hiện diện của quý vị là món quà quý giá nhất. Nếu quý vị vẫn muốn gửi tặng, chúng tôi xin trân trọng đón nhận đóng góp cho quỹ xây tổ ấm của chúng tôi.',
      accounts: [
        {
          label: 'Tài khoản EUR',
          lines: ['Người nhận: Viet Tiep Nguyen', 'IBAN: LT03 3250 0323 9669 0806', 'BIC/SWIFT: REVOLT21', 'Revolut Bank UAB'],
        },
        {
          label: 'Tài khoản CZK',
          lines: ['Người nhận: Viet Tiep Nguyen', 'IBAN: CZ45 3030 0000 0015 7387 0067', 'BIC/SWIFT: AIRACZPP', 'Số tài khoản: 1573870067/3030'],
        },
      ],
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

      {/* GIFT REGISTRY */}
      <GiftsSection />

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
   PHOTO SLIDESHOW
   Self-hosted crossfade slideshow of the wedding album.
   Photo URLs are a snapshot from the Google Photos album
   (see src/albumPhotos.js); regenerate when many new photos
   are added, since Google Photos has no live embed API.
   Only a small window around the active slide is loaded.
   ============================================ */
function PhotoSlideshow() {
  const photos = albumPhotos
  const n = photos.length
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || n <= 1) return
    const timer = setInterval(() => setIdx((i) => (i + 1) % n), 4500)
    return () => clearInterval(timer)
  }, [paused, n])

  const go = (d) => setIdx((i) => (i + d + n) % n)

  // Only assign src to the active slide and its immediate neighbours,
  // so the browser never fetches all photos at once.
  const nearActive = (i) => {
    const forward = (i - idx + n) % n
    const backward = (idx - i + n) % n
    return Math.min(forward, backward) <= 1
  }

  if (!n) return null

  return (
    <div
      className="slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slideshow__frame">
        {photos.map((url, i) => (
          <img
            key={i}
            className={`slideshow__img ${i === idx ? 'is-active' : ''}`}
            src={nearActive(i) ? `${url}=w1600` : undefined}
            alt=""
            draggable="false"
          />
        ))}
        <button className="slideshow__nav slideshow__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
        <button className="slideshow__nav slideshow__nav--next" onClick={() => go(1)} aria-label="Next photo">›</button>
        <div className="slideshow__counter">{idx + 1} / {n}</div>
      </div>
    </div>
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

        <Reveal>
          <PhotoSlideshow />
        </Reveal>

        <Reveal>
          <div className="photos__cta text-center">
            <a className="btn btn--large" href={GOOGLE_PHOTOS_URL} target="_blank" rel="noopener noreferrer">
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

/* ============================================
   GIFT REGISTRY
   ============================================ */
function GiftsSection() {
  const { t } = useLang()
  return (
    <section id="gifts" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.gifts.label}</div>
            <h2 className="section-title">{t.gifts.title}</h2>
            <p className="section-subtitle text-center mx-auto">{t.gifts.intro}</p>
          </div>
        </Reveal>

        <div className="details__grid-refined details__grid-refined--two">
          {t.gifts.accounts.map((acc, i) => (
            <Reveal delay={i + 1} key={i}>
              <div className="detail-card-refined">
                <div className="detail-card-refined__label">{acc.label}</div>
                <p className="detail-card-refined__text" style={{ whiteSpace: 'pre-line' }}>
                  {acc.lines.join('\n')}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
