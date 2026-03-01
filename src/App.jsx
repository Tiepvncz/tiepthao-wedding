import React, { useState, useEffect, useRef, useCallback } from 'react'

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
   NAVIGATION LINKS
   ============================================ */
const NAV_ITEMS = [
  { label: 'Our Story', id: 'story' },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Details', id: 'details' },
  { label: 'RSVP', id: 'rsvp' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
]

/* ============================================
   FAQ DATA
   ============================================ */
const FAQ_DATA = [
  {
    q: 'What is the dress code?',
    a: 'Formal attire. Think tuxedos, suits, and elegant gowns or cocktail dresses. Ladies, the ceremony is on grass, so consider your footwear accordingly.',
  },
  {
    q: 'Are children welcome?',
    a: 'We love your little ones, but this will be an adults-only celebration. We hope you understand and enjoy a night off!',
  },
  {
    q: 'Is accommodation provided?',
    a: 'Yes! We have reserved rooms at the venue for our guests, and it is on us. Please indicate in your RSVP if you would like to stay overnight.',
  },
  {
    q: 'How do I get to Bon Repos?',
    a: 'The venue is about 1 hour from Prague by car. Detailed directions and transport options will be shared closer to the date. Parking is available on-site.',
  },
  {
    q: 'When is the RSVP deadline?',
    a: 'Please respond by March 31, 2026 so we can make everything perfect.',
  },
]

/* ============================================
   MAIN APP COMPONENT
   ============================================ */
export default function App() {
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    setMobileMenuOpen(false)
    if (id === 'rsvp') {
      window.open('https://tally.so/r/0QEor0', '_blank')
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      {/* NAVIGATION */}
      <nav className={`nav ${navSolid ? 'nav--solid' : 'nav--transparent'}`}>
        <div className="nav__inner">
          <div className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            T & T
          </div>
          <ul className="nav__links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button className="nav__link" onClick={() => scrollTo(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="nav__hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`nav__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="nav__close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
          ✕
        </button>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className="nav__mobile-link" onClick={() => scrollTo(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {/* HERO */}
      <HeroSection />

      {/* OUR STORY */}
      <StorySection />

      {/* SCHEDULE */}
      <ScheduleSection />

      {/* DETAILS */}
      <DetailsSection />

      {/* RSVP */}
      <RsvpSection />

      {/* FAQ */}
      <FaqSection />

      {/* CONTACT */}
      <ContactSection />

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__names">Tiep & Thao</div>
          <div className="footer__date">August 1, 2026</div>
        </div>
      </footer>
    </>
  )
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  const countdown = useCountdown('2026-08-01T14:00:00Z')

  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__eyebrow">Save the Date</div>
        <h1 className="hero__names">
          Tiep <span className="hero__ampersand">&</span> Thao
        </h1>
        <div className="hero__date">
          August 1, 2026 · Bon Repos, Czech Republic
        </div>
        <div className="hero__countdown">
          <div className="countdown__item">
            <div className="countdown__number">{countdown.days}</div>
            <div className="countdown__label">Days</div>
          </div>
          <div className="countdown__item">
            <div className="countdown__number">{countdown.hours}</div>
            <div className="countdown__label">Hours</div>
          </div>
          <div className="countdown__item">
            <div className="countdown__number">{countdown.minutes}</div>
            <div className="countdown__label">Minutes</div>
          </div>
          <div className="countdown__item">
            <div className="countdown__number">{countdown.seconds}</div>
            <div className="countdown__label">Seconds</div>
          </div>
        </div>
        <a
<div className="hero__buttons">
          
            className="btn btn--light"
            href="https://tally.so/r/0QEor0"
            target="_blank"
            rel="noopener noreferrer"
          >
            RSVP
          </a>
          
            className="btn btn--light"
            href="/wedding.ics"
            download="TiepThao-Wedding.ics"
          >
            Save the Date
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
  return (
    <section id="story" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">Our Story</div>
            <h2 className="section-title">How It All Began</h2>
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
              <p>
                It all started in 2020, just as Lenka was preparing to move to London for her master's degree. She knew she'd be leaving Prague soon, stepping into a new adventure, and distance was already part of the plan for her life.
              </p>
              <p>
                And then she met Tiep.
              </p>
              <p>
                Lenka liked him from the beginning. She just wasn't about to make it too easy. Tiep, calm and quietly confident, didn't rush anything. He showed up, made her laugh, called when he said he would, and somehow became part of her everyday life at the exact moment she was preparing to leave it. What began as easy conversations quickly turned into daily phone calls, and before long, what was supposed to be a short chapter quietly became something much bigger.
              </p>
              <p>
                Distance has been part of their story from the very beginning. COVID tested them almost immediately, and over the years, life kept adding miles. When Lenka took a chance on a dream role in Paris, they made it work. When she moved for work to Singapore, they made it work again. Three rounds of long distance, different time zones, countless video calls, and many long flights. And somehow, each time, they came out even closer than before. In between it all, Prague has always been home, the place they return to, where everyday life together feels just as special as their adventures abroad.
              </p>
              <p>
                In June 2025, during a trip to Madeira, Tiep had a plan: hike to Pico do Arieiro, the island's highest peak, and propose at sunrise. The hike was beautiful, the sunrise was perfect, and then… there were about thirty tourists at the viewpoint. He briefly tried to find a more private spot, walking them away from the crowd. But after a few minutes of wandering that probably looked slightly suspicious, he realized the peak was the spot. So back they went. He got down on one knee in front of everyone, and it turned out a crowd of cheering strangers was exactly the audience they didn't know they needed.
              </p>
              <p>
                Now, after six years, three countries, countless miles, and one very public mountain proposal, they're getting married. And this time, no distance required. Just their favorite people, all in one place.
              </p>
            </div>
            <div className="story__closing">
              August 1, 2026 · Bon Repos, Czech Republic
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   SCHEDULE (Coming Soon)
   ============================================ */
function ScheduleSection() {
  return (
    <section id="schedule" className="section section--alt">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">The Weekend</div>
            <h2 className="section-title">Schedule</h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="schedule__coming-soon">
            <div className="schedule__coming-soon-card">
              <h3 className="schedule__coming-soon-dates">August 1, 2026</h3>
              <div className="schedule__coming-soon-divider" />
              <p className="schedule__coming-soon-text">
                Join us for our wedding celebration on Saturday, August 1, 2026 at Zamek Bon Repos. Guests are welcome to stay overnight from Saturday to Sunday.
              </p>
              <p className="schedule__coming-soon-note">
                The detailed schedule will be shared closer to the date. Stay tuned!
              </p>
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
  return (
    <section id="details" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">Practical Info</div>
            <h2 className="section-title">Details</h2>
          </div>
        </Reveal>

        <div className="details__grid-refined">
          <Reveal delay={1}>
            <div className="detail-card-refined">
              <div className="detail-card-refined__label">Venue</div>
              <h3 className="detail-card-refined__title">Zamek Bon Repos</h3>
              <p className="detail-card-refined__text">
                A stunning castle estate nestled in the Czech countryside, approximately one hour from Prague.
              </p>
              <a
                className="detail-card__link"
                href="https://www.google.com/maps/search/Zamek+Bon+Repos"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Map
              </a>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="detail-card-refined">
              <div className="detail-card-refined__label">Dress Code</div>
              <h3 className="detail-card-refined__title">Formal Attire</h3>
              <p className="detail-card-refined__text">
                Gentlemen, think tuxedos or black suits. Ladies, elegant gowns or cocktail dresses. The ceremony takes place on grass, so please choose your footwear accordingly.
              </p>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <div className="detail-card-refined">
              <div className="detail-card-refined__label">Accommodation</div>
              <h3 className="detail-card-refined__title">On Us</h3>
              <p className="detail-card-refined__text">
                We have reserved rooms at the venue for our guests. Accommodation is our gift to you. Please let us know in your RSVP if you would like to stay overnight.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   RSVP (Button only)
   ============================================ */
function RsvpSection() {
  return (
    <section id="rsvp" className="section rsvp">
      <div className="container">
        <Reveal>
          <div className="section-label text-center" style={{ color: 'var(--gold-light)' }}>Respond</div>
          <h2 className="section-title text-center" style={{ color: 'var(--white)' }}>RSVP</h2>
          <p className="section-subtitle text-center mx-auto" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '3rem' }}>
            We would love to have you celebrate with us. Each guest should respond individually. Please let us know by March 31, 2026.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <div className="text-center">
            <a
              className="btn btn--light btn--large"
              href="https://tally.so/r/0QEor0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Respond Now
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================
   FAQ
   ============================================ */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="faq" className="section section--alt">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">Questions</div>
            <h2 className="section-title">Frequently Asked</h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="faq__list">
            {FAQ_DATA.map((item, i) => (
              <div className={`faq__item ${openIndex === i ? 'open' : ''}`} key={i}>
                <button className="faq__question" onClick={() => toggle(i)}>
                  <span>{item.q}</span>
                  <span className="faq__icon">+</span>
                </button>
                <div className="faq__answer">
                  <div className="faq__answer-text">{item.a}</div>
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
  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal>
          <div className="text-center">
            <div className="section-label">Get in Touch</div>
            <h2 className="section-title">Questions?</h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="contact__content">
            <p className="contact__text">
              If you have any questions about the wedding, travel, accommodation, or anything else, do not hesitate to reach out. We are happy to help!
            </p>
            <a
              className="contact__whatsapp"
              href="https://wa.me/420775510930"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>WhatsApp: +420 775 510 930</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
