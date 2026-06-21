import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

/* ============================================
   COUNTDOWN HOOK
   ============================================ */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])
  return timeLeft
}

function getTimeLeft(target) {
  const diff = new Date(target) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

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
const PINTEREST_URL = 'https://pin.it/680dr7NM2'
const PINTEREST_BOARD_URL = 'https://www.pinterest.com/phanthuthaothi/lenka-tiep-aug-1-wedding/'
const WHATSAPP_URL = 'https://wa.me/420775510930'
const MAP_URL = 'https://www.google.com/maps/search/Zamek+Bon+Repos'

const NAV_ORDER = ['story', 'schedule', 'dressCode', 'details', 'rsvp', 'faq', 'contact']
const SECTION_IDS = {
  story: 'story',
  schedule: 'schedule',
  dressCode: 'dress-code',
  details: 'details',
  rsvp: 'rsvp',
  faq: 'faq',
  contact: 'contact',
}

/* ============================================
   TRANSLATIONS
   ============================================ */
const TRANSLATIONS = {
  en: {
    nav: {
      story: 'Our Story',
      schedule: 'Harmonogram',
      dressCode: 'Dress Code',
      details: 'Details',
      rsvp: 'Thank You',
      faq: 'FAQ',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Save the Date',
      date: 'August 1, 2026 · Bon Repos, Czech Republic',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      schedule: 'View Schedule',
      saveDate: 'Save the Date',
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
        'Now, after six years, three countries, countless miles, and one very public mountain proposal, they\'re getting married. And this time, no distance required. Just their favorite people, all in one place.',
      ],
      closing: 'August 1, 2026 · Bon Repos, Czech Republic',
    },
    schedule: {
      label: 'The Celebration',
      title: 'Harmonogram',
      date: 'August 1, 2026',
      phases: [
        {
          label: 'Phase One',
          title: 'Arrival & Ceremony',
          items: [
            { time: '15:00', event: 'Arrival, photo & video' },
            { time: '15:00', event: 'Welcome drink' },
            { time: '16:00', event: 'Wedding ceremony' },
          ],
        },
        {
          label: 'Phase Two',
          title: 'Cocktail & Reception',
          items: [
            { time: '16:30', event: 'Receiving line & photos' },
            { time: '16:30-18:00', event: 'Cocktail hour' },
            { time: '17:00-17:45', event: "Newlyweds' portraits" },
            { time: '18:00', event: 'Seating for the reception' },
            { time: '18:30-20:30', event: 'Reception dinner' },
          ],
        },
        {
          label: 'Phase Three',
          title: 'Dancing & Late Night',
          items: [
            { time: '20:30', event: 'Cake cutting' },
            { time: '21:00', event: 'Group dance' },
            { time: '21:00-24:00', event: 'Live saxophonist' },
            { time: '23:00', event: 'Vietnamese street food' },
            { time: '22:00-03:00', event: 'Party until late' },
          ],
        },
      ],
    },
    dressCode: {
      label: 'What to Wear',
      title: 'Dress Code',
      blackTie: 'Black Tie',
      gentlemen: 'Gentlemen',
      gentlemenText: 'Tuxedos or black suits, finished with a black bow tie. Please skip regular neckties.',
      ladies: 'Ladies',
      ladiesText: 'Elegant gowns or cocktail dresses. Kindly leave white for the bride.',
      note: 'The ceremony takes place on grass - please choose footwear accordingly.',
      inspiration: 'Inspiration Board',
      openBoard: 'Open the full board on Pinterest',
    },
    details: {
      label: 'Practical Info',
      title: 'Details',
      venueLabel: 'Venue',
      venueTitle: 'Zamek Bon Repos',
      venueText: 'A stunning castle estate nestled in the Czech countryside, approximately one hour from Prague.',
      viewMap: 'View on Map',
      accomLabel: 'Accommodation',
      accomTitle: 'On Us',
      accomText: 'We have reserved rooms at the venue for our guests, and accommodation is our gift to you. Everything is already arranged for those staying overnight.',
    },
    rsvp: {
      label: 'With Gratitude',
      title: 'Thank You',
      text: "All RSVPs are in - thank you to everyone who let us know they'll be joining. We can't wait to celebrate with you on August 1, 2026.",
    },
    faq: {
      label: 'Questions',
      title: 'Frequently Asked',
      items: [
        {
          q: 'What is the dress code?',
          a: 'Black tie. Gentlemen, tuxedos or black suits with a black bow tie (please skip regular neckties). Ladies, elegant gowns or cocktail dresses, and kindly leave white for the bride. The ceremony is on grass, so consider your footwear accordingly. See the Dress Code section for our Pinterest inspiration board.',
        },
        {
          q: 'Are children welcome?',
          a: 'We love your little ones, but this will be an adults-only celebration. We hope you understand and enjoy a night off!',
        },
        {
          q: 'Is accommodation provided?',
          a: 'Yes! We have reserved rooms at the venue for our guests, and it is all on us.',
        },
        {
          q: 'How do I get to Bon Repos?',
          a: 'The venue is about 1 hour from Prague by car. Detailed directions and transport options will be shared closer to the date. Parking is available on-site.',
        },
        {
          q: 'Do you have a gift registry?',
          a: 'Your presence is the greatest gift. If you wish to honour us with a gift, we would appreciate contributions to our dream home fund via bank transfer.\n\nEUR Account:\nBeneficiary: Viet Tiep Nguyen\nIBAN: LT03 3250 0323 9669 0806\nBIC/SWIFT: REVOLT21\nBank: Revolut Bank UAB\n\nCZK Account:\nBeneficiary: Viet Tiep Nguyen\nIBAN: CZ45 3030 0000 0015 7387 0067\nBIC/SWIFT: AIRACZPP\nAccount: 1573870067/3030',
        },
        {
          q: 'Can I still RSVP?',
          a: 'All RSVPs have now been collected - thank you to everyone who responded! If your plans have changed, please let us know directly via WhatsApp as soon as you can.',
        },
      ],
    },
    contact: {
      label: 'Get in Touch',
      title: 'Questions?',
      text: 'If you have any questions about the wedding, travel, accommodation, or anything else, do not hesitate to reach out. We are happy to help!',
      whatsapp: 'WhatsApp: +420 775 510 930',
    },
    footer: {
      date: 'August 1, 2026',
    },
  },

  vi: {
    nav: {
      story: 'Chuyện Tình',
      schedule: 'Lịch Trình',
      dressCode: 'Trang Phục',
      details: 'Thông Tin',
      rsvp: 'Cảm Ơn',
      faq: 'Hỏi Đáp',
      contact: 'Liên Hệ',
    },
    hero: {
      eyebrow: 'Lưu Ngày Cưới',
      date: 'Ngày 1 tháng 8, 2026 · Bon Repos, Cộng hòa Séc',
      days: 'Ngày',
      hours: 'Giờ',
      minutes: 'Phút',
      seconds: 'Giây',
      schedule: 'Xem Lịch Trình',
      saveDate: 'Lưu Ngày Cưới',
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
        'Giờ đây, sau sáu năm, ba quốc gia, vô số dặm đường và một lời cầu hôn rất "công khai" trên đỉnh núi, họ sắp kết hôn. Và lần này, không còn khoảng cách nào nữa. Chỉ có những người thân yêu nhất của họ, cùng quây quần ở một nơi.',
      ],
      closing: 'Ngày 1 tháng 8, 2026 · Bon Repos, Cộng hòa Séc',
    },
    schedule: {
      label: 'Ngày Trọng Đại',
      title: 'Lịch Trình',
      date: 'Ngày 1 tháng 8, 2026',
      phases: [
        {
          label: 'Phần Một',
          title: 'Đón Khách & Lễ Cưới',
          items: [
            { time: '15:00', event: 'Đón khách, chụp ảnh & quay phim' },
            { time: '15:00', event: 'Đồ uống chào mừng' },
            { time: '16:00', event: 'Nghi lễ thành hôn' },
          ],
        },
        {
          label: 'Phần Hai',
          title: 'Tiệc Cocktail & Tiếp Khách',
          items: [
            { time: '16:30', event: 'Chào đón khách & chụp ảnh' },
            { time: '16:30-18:00', event: 'Giờ tiệc cocktail' },
            { time: '17:00-17:45', event: 'Chụp ảnh cô dâu chú rể' },
            { time: '18:00', event: 'Ổn định chỗ ngồi' },
            { time: '18:30-20:30', event: 'Tiệc tối' },
          ],
        },
        {
          label: 'Phần Ba',
          title: 'Khiêu Vũ & Tiệc Khuya',
          items: [
            { time: '20:30', event: 'Cắt bánh cưới' },
            { time: '21:00', event: 'Khiêu vũ tập thể' },
            { time: '21:00-24:00', event: 'Nhạc saxophone trực tiếp' },
            { time: '23:00', event: 'Ẩm thực đường phố Việt Nam' },
            { time: '22:00-03:00', event: 'Tiệc tùng đến khuya' },
          ],
        },
      ],
    },
    dressCode: {
      label: 'Trang Phục',
      title: 'Quy Định Trang Phục',
      blackTie: 'Black Tie (Trang phục dạ hội)',
      gentlemen: 'Quý Ông',
      gentlemenText: 'Áo tuxedo hoặc vest đen, kèm nơ cổ (bow tie) màu đen. Vui lòng không dùng cà vạt thường.',
      ladies: 'Quý Cô',
      ladiesText: 'Đầm dạ hội thanh lịch hoặc váy cocktail. Xin nhường sắc trắng cho cô dâu.',
      note: 'Nghi lễ diễn ra trên bãi cỏ - xin quý khách lưu ý khi chọn giày dép.',
      inspiration: 'Bảng Cảm Hứng',
      openBoard: 'Xem toàn bộ bảng trên Pinterest',
    },
    details: {
      label: 'Thông Tin Hữu Ích',
      title: 'Thông Tin Chi Tiết',
      venueLabel: 'Địa Điểm',
      venueTitle: 'Zamek Bon Repos',
      venueText: 'Một lâu đài tuyệt đẹp nằm giữa vùng quê nước Séc, cách Praha khoảng một giờ đi xe.',
      viewMap: 'Xem Bản Đồ',
      accomLabel: 'Lưu Trú',
      accomTitle: 'Chúng Tôi Mời',
      accomText: 'Chúng tôi đã đặt phòng tại địa điểm tổ chức cho khách mời, và chi phí lưu trú là món quà từ chúng tôi. Mọi thứ đã được sắp xếp sẵn cho những ai ở lại qua đêm.',
    },
    rsvp: {
      label: 'Lời Cảm Ơn',
      title: 'Cảm Ơn Quý Vị',
      text: 'Chúng tôi đã nhận được tất cả phản hồi - cảm ơn mọi người đã xác nhận tham dự. Chúng tôi rất mong được chung vui cùng quý vị vào ngày 1 tháng 8, 2026.',
    },
    faq: {
      label: 'Câu Hỏi',
      title: 'Thường Gặp',
      items: [
        {
          q: 'Quy định trang phục là gì?',
          a: 'Black tie (trang phục dạ hội). Quý ông mặc áo tuxedo hoặc vest đen kèm nơ cổ đen (vui lòng không dùng cà vạt thường). Quý cô mặc đầm dạ hội thanh lịch hoặc váy cocktail, và xin nhường sắc trắng cho cô dâu. Nghi lễ diễn ra trên bãi cỏ, xin lưu ý khi chọn giày dép. Mời quý vị xem mục Trang Phục để tham khảo bảng cảm hứng Pinterest của chúng tôi.',
        },
        {
          q: 'Trẻ em có được tham dự không?',
          a: 'Chúng tôi rất yêu các bé, nhưng đây sẽ là buổi tiệc dành riêng cho người lớn. Mong quý vị thông cảm và tận hưởng một buổi tối thư giãn!',
        },
        {
          q: 'Có chỗ lưu trú không?',
          a: 'Có! Chúng tôi đã đặt phòng tại địa điểm tổ chức cho khách mời, và toàn bộ chi phí đều do chúng tôi lo.',
        },
        {
          q: 'Làm sao để đến Bon Repos?',
          a: 'Địa điểm cách Praha khoảng 1 giờ đi xe. Chỉ dẫn chi tiết và các phương án di chuyển sẽ được gửi đến gần ngày cưới. Có chỗ đỗ xe ngay tại địa điểm tổ chức.',
        },
        {
          q: 'Anh chị có danh sách quà tặng không?',
          a: 'Sự hiện diện của quý vị là món quà quý giá nhất. Nếu quý vị muốn gửi tặng chúng tôi một món quà, chúng tôi xin trân trọng đón nhận đóng góp cho quỹ xây tổ ấm qua chuyển khoản ngân hàng.\n\nTài khoản EUR:\nNgười nhận: Viet Tiep Nguyen\nIBAN: LT03 3250 0323 9669 0806\nBIC/SWIFT: REVOLT21\nNgân hàng: Revolut Bank UAB\n\nTài khoản CZK:\nNgười nhận: Viet Tiep Nguyen\nIBAN: CZ45 3030 0000 0015 7387 0067\nBIC/SWIFT: AIRACZPP\nSố tài khoản: 1573870067/3030',
        },
        {
          q: 'Tôi có thể xác nhận tham dự nữa không?',
          a: 'Chúng tôi đã thu thập xong tất cả phản hồi - cảm ơn mọi người đã xác nhận! Nếu kế hoạch của quý vị có thay đổi, xin báo cho chúng tôi qua WhatsApp sớm nhất có thể.',
        },
      ],
    },
    contact: {
      label: 'Liên Hệ',
      title: 'Có Thắc Mắc?',
      text: 'Nếu quý vị có bất kỳ câu hỏi nào về đám cưới, việc đi lại, chỗ ở hay bất cứ điều gì khác, xin đừng ngần ngại liên hệ với chúng tôi. Chúng tôi luôn sẵn lòng hỗ trợ!',
      whatsapp: 'WhatsApp: +420 775 510 930',
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

      {/* OUR STORY */}
      <StorySection />

      {/* HARMONOGRAM */}
      <ScheduleSection />

      {/* DRESS CODE */}
      <DressCodeSection />

      {/* DETAILS */}
      <DetailsSection />

      {/* RSVP / THANK YOU */}
      <RsvpSection />

      {/* FAQ */}
      <FaqSection />

      {/* CONTACT */}
      <ContactSection />

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
  const countdown = useCountdown('2026-08-01T14:00:00Z')

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
        <div className="hero__countdown">
          <div className="countdown__item">
            <div className="countdown__number">{countdown.days}</div>
            <div className="countdown__label">{t.hero.days}</div>
          </div>
          <div className="countdown__item">
            <div className="countdown__number">{countdown.hours}</div>
            <div className="countdown__label">{t.hero.hours}</div>
          </div>
          <div className="countdown__item">
            <div className="countdown__number">{countdown.minutes}</div>
            <div className="countdown__label">{t.hero.minutes}</div>
          </div>
          <div className="countdown__item">
            <div className="countdown__number">{countdown.seconds}</div>
            <div className="countdown__label">{t.hero.seconds}</div>
          </div>
        </div>
        <div className="hero__buttons">
          <a className="btn btn--light" href="#schedule">
            {t.hero.schedule}
          </a>
          <a className="btn btn--light" href="/wedding.ics" download="TiepThao-Wedding.ics">
            {t.hero.saveDate}
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
   OUR STORY
   ============================================ */
function StorySection() {
  const { t } = useLang()
  return (
    <section id="story" className="section">
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
   HARMONOGRAM (Timeline)
   ============================================ */
function ScheduleSection() {
  const { t } = useLang()
  return (
    <section id="schedule" className="section section--alt">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.schedule.label}</div>
            <h2 className="section-title">{t.schedule.title}</h2>
          </div>
        </Reveal>

        <div className="schedule__days schedule__days--three">
          {t.schedule.phases.map((phase, i) => (
            <Reveal delay={i + 1} key={i}>
              <div className="schedule__day">
                <div className="schedule__day-label">{phase.label}</div>
                <h3 className="schedule__day-title">{phase.title}</h3>
                <div className="schedule__day-subtitle">{t.schedule.date}</div>
                <div className="timeline">
                  {phase.items.map((item, j) => (
                    <div className="timeline__item" key={j}>
                      <div className="timeline__time">{item.time}</div>
                      <div className="timeline__event">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================
   PINTEREST BOARD EMBED
   Renders Pinterest's official board widget via pinit.js.
   The anchor is created imperatively so React never clobbers
   the iframe that pinit.js injects in its place.
   ============================================ */
function PinterestBoard() {
  const ref = useRef(null)

  useEffect(() => {
    const SRC = 'https://assets.pinterest.com/js/pinit.js'
    const container = ref.current
    if (!container) return

    if (!container.querySelector('[data-pin-do]')) {
      const a = document.createElement('a')
      a.setAttribute('data-pin-do', 'embedBoard')
      a.setAttribute('data-pin-board-width', '736')
      a.setAttribute('data-pin-scale-height', '360')
      a.setAttribute('data-pin-scale-width', '115')
      a.href = PINTEREST_BOARD_URL
      container.appendChild(a)
    }

    const build = () => window.PinUtils && window.PinUtils.build()
    if (window.PinUtils) {
      build()
      return
    }

    let script = document.querySelector(`script[src="${SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SRC
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener('load', build)
    return () => script.removeEventListener('load', build)
  }, [])

  return <div className="dress-code__pinterest" ref={ref} />
}

/* ============================================
   DRESS CODE
   ============================================ */
function DressCodeSection() {
  const { t } = useLang()
  return (
    <section id="dress-code" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.dressCode.label}</div>
            <h2 className="section-title">{t.dressCode.title}</h2>
            <p className="section-subtitle text-center mx-auto">{t.dressCode.blackTie}</p>
          </div>
        </Reveal>

        <div className="ornament">
          <div className="ornament__line" />
          <div className="ornament__diamond" />
          <div className="ornament__line" />
        </div>

        <div className="dress-code__grid">
          <Reveal delay={1}>
            <div className="dress-code__card">
              <div className="dress-code__label">{t.dressCode.gentlemen}</div>
              <p className="dress-code__text">{t.dressCode.gentlemenText}</p>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="dress-code__card">
              <div className="dress-code__label">{t.dressCode.ladies}</div>
              <p className="dress-code__text">{t.dressCode.ladiesText}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={3}>
          <div className="dress-code__footer">
            <p className="dress-code__note">{t.dressCode.note}</p>
          </div>
        </Reveal>

        <Reveal delay={3}>
          <div className="dress-code__inspiration">
            <div className="section-label text-center">{t.dressCode.inspiration}</div>
            <PinterestBoard />
            <div className="text-center">
              <a
                className="detail-card__link dress-code__pinterest-link"
                href={PINTEREST_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.dressCode.openBoard}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   DETAILS
   ============================================ */
function DetailsSection() {
  const { t } = useLang()
  return (
    <section id="details" className="section section--alt">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.details.label}</div>
            <h2 className="section-title">{t.details.title}</h2>
          </div>
        </Reveal>

        <div className="details__grid-refined details__grid-refined--two">
          <Reveal delay={1}>
            <div className="detail-card-refined">
              <div className="detail-card-refined__label">{t.details.venueLabel}</div>
              <h3 className="detail-card-refined__title">{t.details.venueTitle}</h3>
              <p className="detail-card-refined__text">{t.details.venueText}</p>
              <a
                className="detail-card__link"
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.details.viewMap}
              </a>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="detail-card-refined">
              <div className="detail-card-refined__label">{t.details.accomLabel}</div>
              <h3 className="detail-card-refined__title">{t.details.accomTitle}</h3>
              <p className="detail-card-refined__text">{t.details.accomText}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   RSVP / THANK YOU
   ============================================ */
function RsvpSection() {
  const { t } = useLang()
  return (
    <section id="rsvp" className="section rsvp">
      <div className="container">
        <Reveal>
          <div className="section-label text-center" style={{ color: 'var(--gold-light)' }}>{t.rsvp.label}</div>
          <h2 className="section-title text-center" style={{ color: 'var(--white)' }}>{t.rsvp.title}</h2>
          <p className="section-subtitle text-center mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {t.rsvp.text}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   FAQ
   ============================================ */
function FaqSection() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="faq" className="section section--alt">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.faq.label}</div>
            <h2 className="section-title">{t.faq.title}</h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="faq__list">
            {t.faq.items.map((item, i) => (
              <div className={`faq__item ${openIndex === i ? 'open' : ''}`} key={i}>
                <button className="faq__question" onClick={() => toggle(i)}>
                  <span>{item.q}</span>
                  <span className="faq__icon">+</span>
                </button>
                <div className="faq__answer">
                  <div className="faq__answer-text" style={{ whiteSpace: 'pre-line' }}>{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   CONTACT (WhatsApp only)
   ============================================ */
function ContactSection() {
  const { t } = useLang()
  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">{t.contact.label}</div>
            <h2 className="section-title">{t.contact.title}</h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="contact__content">
            <p className="contact__text">{t.contact.text}</p>
            <a
              className="contact__whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>{t.contact.whatsapp}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
