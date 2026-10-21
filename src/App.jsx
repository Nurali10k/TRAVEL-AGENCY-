import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Compass, Globe2,
  Heart, Instagram, MapPin, Menu, MoveUpRight, ShieldCheck, X,
} from 'lucide-react'
import './App.css'

const photo = (id, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const regions = ['All places', 'Europe', 'Asia', 'Americas', 'Africa']

const destinations = [
  { name: 'The Aegean, Slowly', place: 'Cyclades, Greece', flag: '🇬🇷', region: 'Europe', price: '2,480', days: '8 DAYS · 7 NIGHTS', image: 'photo-1533105079780-92b9be482077', note: 'ISLAND HOPPING' },
  { name: 'Between Two Cities', place: 'Kyoto & Tokyo, Japan', flag: '🇯🇵', region: 'Asia', price: '3,650', days: '10 DAYS · 9 NIGHTS', image: 'photo-1493976040374-85c8e12f0c0e', note: 'CULTURE & CRAFT' },
  { name: 'Wild, Open Patagonia', place: 'Chile & Argentina', flag: '🇨🇱', region: 'Americas', price: '4,290', days: '12 DAYS · 11 NIGHTS', image: 'photo-1464822759023-fed622ff2c3b', note: 'WILDERNESS' },
  { name: 'A Softer Safari', place: 'Serengeti, Tanzania', flag: '🇹🇿', region: 'Africa', price: '5,180', days: '9 DAYS · 8 NIGHTS', image: 'photo-1516426122078-c23e76319801', note: 'WILDLIFE' },
  { name: 'The Long Weekend', place: 'Amalfi Coast, Italy', flag: '🇮🇹', region: 'Europe', price: '2,150', days: '6 DAYS · 5 NIGHTS', image: 'photo-1533587851505-d119e13fa0d7', note: 'COAST & TABLE' },
  { name: 'North of Ordinary', place: 'South Coast, Iceland', flag: '🇮🇸', region: 'Europe', price: '3,890', days: '7 DAYS · 6 NIGHTS', image: 'photo-1476610182048-b716b8518aae', note: 'ROAD JOURNEY' },
]

const stories = [
  { quote: 'It felt less like following an itinerary and more like being let in on a secret. Every day had room to surprise us.', name: 'MAYA & JONAH', home: 'BROOKLYN, NEW YORK', initials: 'MJ', trip: 'KYOTO, JAPAN' },
  { quote: 'We came home with a camera full of photographs and the feeling that we had actually been somewhere.', name: 'ELLA R.', home: 'LONDON, UK', initials: 'ER', trip: 'PATAGONIA, SOUTH AMERICA' },
  { quote: 'Thoughtful, personal, and wonderfully unhurried. It was exactly the kind of travel we had been missing.', name: 'PRIYA & ARUN', home: 'TORONTO, CANADA', initials: 'PA', trip: 'THE AEGEAN, GREECE' },
]

const mapPins = [
  { region: 'Europe', label: 'Mediterranean', x: 54, y: 42 },
  { region: 'Asia', label: 'East Asia', x: 76, y: 40 },
  { region: 'Americas', label: 'Patagonia', x: 28, y: 75 },
  { region: 'Africa', label: 'East Africa', x: 53, y: 63 },
]

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [heroOffset, setHeroOffset] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [region, setRegion] = useState('All places')
  const [storyIndex, setStoryIndex] = useState(0)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const tripTrigger = useRef(null)
  const modalClose = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onScroll = () => {
      setScrolled(window.scrollY > 28)
      if (!reduceMotion) setHeroOffset(Math.min(window.scrollY * 0.22, 150))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedTrip) {
      tripTrigger.current?.focus()
      return undefined
    }
    modalClose.current?.focus()
    document.body.classList.add('modal-open')
    const onKeyDown = (event) => { if (event.key === 'Escape') setSelectedTrip(null) }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [selectedTrip])

  const visibleTrips = region === 'All places' ? destinations : destinations.filter((trip) => trip.region === region)
  const updateStory = (direction) => setStoryIndex((index) => (index + direction + stories.length) % stories.length)
  const openTrip = (trip, event) => { tripTrigger.current = event.currentTarget; setSelectedTrip(trip) }
  const subscribe = (event) => { event.preventDefault(); setSubscribed(true); event.currentTarget.reset() }

  return <div className="travel-site">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`travel-header ${scrolled || menuOpen ? 'travel-header-solid' : ''}`}>
      <a className="brand" href="#home" aria-label="Elsewhere Travel home"><img src="/wayfinder-mark.svg" alt="" /><span>ELSEWHERE<small>TRAVEL, CONSIDERED</small></span></a>
      <nav className="travel-nav" aria-label="Main navigation"><a href="#destinations">Journeys</a><a href="#map">Where we go</a><a href="#about">Our approach</a><a href="#stories">Stories</a></nav>
      <a className="nav-cta" href="#newsletter">Plan my trip <ArrowUpRight size={15} /></a>
      <button className="travel-menu-button" onClick={() => setMenuOpen((open) => !open)} type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </header>
    {menuOpen && <nav className="travel-mobile-nav" aria-label="Mobile navigation"><a href="#destinations" onClick={() => setMenuOpen(false)}>Journeys <ArrowUpRight size={16} /></a><a href="#map" onClick={() => setMenuOpen(false)}>Where we go <ArrowUpRight size={16} /></a><a href="#about" onClick={() => setMenuOpen(false)}>Our approach <ArrowUpRight size={16} /></a><a href="#stories" onClick={() => setMenuOpen(false)}>Stories <ArrowUpRight size={16} /></a><a className="mobile-plan-link" href="#newsletter" onClick={() => setMenuOpen(false)}>Plan my trip <ArrowRight size={16} /></a></nav>}

    <main id="main">
      <section className="travel-hero" id="home">
        <img className="travel-hero-image" src={photo('photo-1530789253388-582c481c54b0', 2400)} alt="Sunrise over a lush tropical coastline and distant mountains" fetchPriority="high" style={{ transform: `translate3d(0, ${heroOffset}px, 0) scale(1.08)` }} />
        <div className="travel-hero-shade" />
        <div className="hero-coordinate"><span className="coordinate-dot" /> 36°32' N&nbsp; 25°09' E <i /> CYCLADES, GREECE</div>
        <div className="travel-hero-content"><p className="travel-eyebrow"><span /> FARTHER, FEELING CLOSER</p><h1>Discover<br /><em>the world.</em></h1><p className="travel-subtitle">Curated journeys for the curious soul.</p><a href="#destinations" className="hero-explore">EXPLORE DESTINATIONS <ArrowDown size={16} /></a></div>
        <div className="hero-side-note">NOT JUST SOMEWHERE ELSE. <em>SOMEWHERE THAT STAYS.</em></div>
        <div className="hero-progress"><span>01</span><i /><span>06</span></div>
      </section>

      <section className="intro-strip"><p>FOR THE ONES WHO WANT TO FEEL A PLACE,<br className="mobile-only" /> NOT JUST SEE IT.</p><span className="intro-ornament">✳</span><p>SMALL GROUPS · LOCAL HANDS · ROOM TO WANDER</p></section>

      <section id="destinations" className="destinations-section">
        <div className="travel-section-heading reveal"><div><p className="travel-label"><span /> A FEW PLACES TO BEGIN</p><h2>Go somewhere<br /><em>that gets under your skin.</em></h2></div><div className="dest-heading-aside"><p>Thoughtful routes, local voices, and just enough of a plan to leave space for the unexpected.</p><a href="#map" className="quiet-link">FIND YOUR REGION <ArrowRight size={15} /></a></div></div>
        <div className="destination-toolbar" aria-label="Filter destinations by region">{regions.map((item) => <button type="button" key={item} aria-pressed={region === item} className={region === item ? 'region-filter active' : 'region-filter'} onClick={() => setRegion(item)}>{item}</button>)}<span className="dest-count">0{visibleTrips.length} JOURNEYS</span></div>
        <div className="destination-grid" aria-live="polite">{visibleTrips.map((trip, index) => <article key={trip.name} className={`destination-card reveal destination-${index % 3}`} style={{ '--delay': `${(index % 3) * 80}ms` }}>
          <button className="destination-image" type="button" onClick={(event) => openTrip(trip, event)} aria-label={`View itinerary for ${trip.name}`}><img src={photo(trip.image)} alt={`${trip.name}, ${trip.place}, a curated ${trip.region} journey`} loading="lazy" /><span className="destination-scrim" /><span className="destination-note">{trip.note}</span><span className="destination-view">VIEW ITINERARY <MoveUpRight size={15} /></span></button>
          <div className="destination-meta"><div><span className="destination-region">{trip.region.toUpperCase()} <i /> {trip.days}</span><h3>{trip.name}</h3><p><span aria-hidden="true">{trip.flag}</span> {trip.place}</p></div><span className="destination-price">FROM <strong>${trip.price}</strong></span></div>
        </article>)}</div>
      </section>

      <section id="map" className="map-section">
        <div className="map-copy reveal"><p className="travel-label"><span /> A WORLD WITHIN REACH</p><h2>Where are<br />you <em>drawn to?</em></h2><p>Every place has a different way of changing you. Start with a feeling, we’ll help with the rest.</p><div className="map-regions" role="group" aria-label="Choose a travel region">{['Europe', 'Asia', 'Americas', 'Africa'].map((item, index) => <button type="button" onClick={() => { setRegion(item); document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' }) }} key={item}><span>0{index + 1}</span>{item}<ArrowUpRight size={14} /></button>)}</div><a className="quiet-link map-all-link" href="#destinations" onClick={() => setRegion('All places')}>ALL DESTINATIONS <ArrowRight size={14} /></a></div>
        <div className="map-visual reveal" aria-label="Illustrated map showing Elsewhere's travel regions"><svg className="world-map" viewBox="0 0 780 440" role="img" aria-label="Abstract world map"><path className="land" d="M82 91l30-20 25 8 12 17 31 2 14 19-10 19 9 20-12 20-27 5-11 24-24 5-12 26-21-6-8-23-20-8 3-27-17-14 11-22-8-19 18-12 1-20 16-9-3-15zm51 104l19 9 5 24 19 15-3 20-14 11-5 26-17 26-15-13 3-25-12-18 5-21-10-19 7-20 13-15zm135-105l29-13 28 7 10 22 29 3 22 16-7 20-23 4-10 18-22-2-15 19-31-2-7 20-16-6-9-23-22-9 7-24 22-8-2-18 16-7zm68 109l18-13 24 4 17 18-5 22-15 15-6 28-18 20-15-14 5-23-15-21 10-18zm100-141l36-10 36 14 25 24-4 21-20 4-15 18-16-6-15 13-20-11-19 7-13-15 4-20-15-8 11-17zm66 100l22-5 26 15 10 24-12 23-17 8-9 19-21-4-6-23-17-13 10-18-3-15zm100-12l22 6 16 18-6 15-17-2-12 12-12-11-17 3-4-17 14-10 1-14zm-47 91l28 4 15 18-9 15-29 3-18-14 2-17z" /></svg>
          <div className="map-graticule" />{mapPins.map((pin) => <button type="button" className={`map-pin ${region === pin.region ? 'pin-active' : ''}`} style={{ left: `${pin.x}%`, top: `${pin.y}%` }} key={pin.region} onClick={() => { setRegion(pin.region); document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' }) }} aria-label={`Explore ${pin.region}: ${pin.label}`}><span className="pin-pulse" /><MapPin size={18} fill="currentColor" /><span className="pin-label">{pin.label}</span></button>)}<div className="map-caption"><span>OUR WORLD, OPENED UP</span><span>4 REGIONS · 18 COUNTRIES</span></div>
        </div>
      </section>

      <section id="about" className="why-section"><div className="why-heading reveal"><p className="travel-label"><span /> THE ELSEWHERE DIFFERENCE</p><h2>Made personal.<br /><em>Made to matter.</em></h2><p>Good travel is not about doing more. It’s about noticing more.</p></div><div className="why-grid">
        <article className="why-card reveal"><span className="why-icon"><Compass size={22} strokeWidth={1.35} /></span><span className="why-num">01 / THE PEOPLE</span><h3>Expert guides</h3><p>Local hosts who open doors, share stories, and know when the best thing is to take the long way.</p><a href="#newsletter" aria-label="Learn about our local guides"><ArrowUpRight size={16} /></a></article>
        <article className="why-card reveal" style={{ '--delay': '100ms' }}><span className="why-icon"><ShieldCheck size={22} strokeWidth={1.35} /></span><span className="why-num">02 / THE DETAILS</span><h3>Safe travels</h3><p>Thoughtful planning and real people to call. We take care of the details, so you can be here for it.</p><a href="#newsletter" aria-label="Learn about our travel support"><ArrowUpRight size={16} /></a></article>
        <article className="why-card reveal" style={{ '--delay': '200ms' }}><span className="why-icon"><Heart size={22} strokeWidth={1.35} /></span><span className="why-num">03 / YOUR JOURNEY</span><h3>Personal touch</h3><p>No templates, no tourist traps. Every journey starts with what you love and grows from there.</p><a href="#newsletter" aria-label="Plan a personal journey"><ArrowUpRight size={16} /></a></article>
      </div></section>

      <section id="stories" className="stories-section"><div className="story-image reveal"><img src={photo('photo-1470252649378-9c29740c9fa8', 1400)} alt="Early morning light spilling across a quiet alpine valley" loading="lazy" /><div className="story-image-caption"><span>THE WORLD IS FULL OF</span><strong>small, unforgettable moments.</strong></div></div><div className="story-copy reveal"><p className="travel-label"><span /> NOTES FROM THE ROAD</p><div className="story-stars" aria-label="Five out of five stars">★★★★★ <span>TRAVELER STORIES</span></div><span className="story-quote-mark" aria-hidden="true">“</span><blockquote aria-live="polite" aria-atomic="true">{stories[storyIndex].quote}</blockquote><div className="story-author"><span className="story-avatar">{stories[storyIndex].initials}</span><span><strong>{stories[storyIndex].name}</strong><small>{stories[storyIndex].home} <i /> {stories[storyIndex].trip}</small></span></div><div className="story-controls"><span>0{storyIndex + 1} <i /> 0{stories.length}</span><div><button type="button" aria-label="Previous traveler story" onClick={() => updateStory(-1)}><ArrowLeft size={16} /></button><button type="button" aria-label="Next traveler story" onClick={() => updateStory(1)}><ArrowRight size={16} /></button></div></div></div></section>

      <footer id="newsletter" className="travel-footer"><div className="footer-top"><div className="footer-brand-block"><a className="brand footer-brand" href="#home"><img src="/wayfinder-mark.svg" alt="" /><span>ELSEWHERE<small>TRAVEL, CONSIDERED</small></span></a><p>For the ones who want to feel a place,<br />not just see it.</p><div className="footer-social"><a href="https://www.instagram.com/" aria-label="Elsewhere on Instagram"><Instagram size={15} /></a><a href="https://www.pinterest.com/" aria-label="Elsewhere on Pinterest"><Globe2 size={15} /></a></div></div><div className="footer-newsletter"><p className="travel-label"><span /> A LETTER FROM SOMEWHERE</p><h2>A little more<br /><em>world in your inbox.</em></h2><p>Notes from the road, new journeys, and places worth lingering in. Never noise.</p><form className="newsletter-form" onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" name="email" placeholder="Your email address" autoComplete="email" required /><button type="submit" aria-label="Subscribe to the newsletter">{subscribed ? <Check size={18} /> : <ArrowRight size={18} />}</button></form><span className="newsletter-message" aria-live="polite">{subscribed ? 'You’re on the list. Look out for a note from us.' : 'A good read, now and then. Unsubscribe whenever.'}</span></div><div className="footer-contact"><span>LET’S PLAN SOMETHING</span><a href="mailto:hello@elsewhere.example">HELLO@ELSEWHERE.TRAVEL <ArrowUpRight size={13} /></a><a href="#destinations">FIND A JOURNEY</a></div></div><div className="footer-bottom"><span>© 2026 ELSEWHERE TRAVEL CO.</span><span>TRAVEL LIGHTLY. COME BACK FULL.</span><a href="#home">BACK TO THE TOP ↑</a></div></footer>
    </main>

    {selectedTrip && <div className="trip-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedTrip(null) }}><div className="trip-modal-card" role="dialog" aria-modal="true" aria-labelledby="trip-title" onKeyDown={(event) => { if (event.key === 'Tab') { const controls = [...event.currentTarget.querySelectorAll('button, a[href]')]; const first = controls[0]; const last = controls[controls.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() } } }}><button ref={modalClose} className="trip-modal-close" type="button" onClick={() => setSelectedTrip(null)} aria-label="Close itinerary"><X size={19} /></button><img src={photo(selectedTrip.image, 1500)} alt={`${selectedTrip.name} landscape`} /><div className="trip-modal-copy"><span className="travel-label"><span /> {selectedTrip.region.toUpperCase()} · {selectedTrip.days}</span><h2 id="trip-title">{selectedTrip.name}</h2><p>{selectedTrip.flag} &nbsp; {selectedTrip.place}</p><p className="modal-description">A thoughtfully paced journey with local guides, singular stays, and time to follow your curiosity.</p><div className="modal-price">JOURNEYS FROM <strong>${selectedTrip.price}</strong> <small>PER PERSON</small></div><a href="#newsletter" onClick={() => setSelectedTrip(null)} className="modal-plan-button">PLAN THIS JOURNEY <ArrowRight size={16} /></a></div></div></div>}
  </div>
}

export default App
