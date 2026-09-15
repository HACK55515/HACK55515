"use client"

import { useMemo, useState } from "react"
import { AudioLines, ChevronRight, Heart, Home, Library, ListMusic, Pause, Play, Plus, Search, SkipBack, SkipForward, Volume2 } from "lucide-react"

const tracks = [
  { title: "Afterglow Protocol", artist: "Z3R0", album: "Neon Expanse", color: "#6845c7", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80" },
  { title: "Static Hearts", artist: "Mira Vale", album: "Signal Bloom", color: "#e56389", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80" },
  { title: "Zero Gravity", artist: "Kairo", album: "Orbital", color: "#2c8c9b", image: "https://images.unsplash.com/photo-1534791547706-9c0cbd5f8f4e?auto=format&fit=crop&w=700&q=80" },
  { title: "Midnight Frequency", artist: "NOVA/9", album: "Dark Matter", color: "#bb4b35", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80" },
]

export default function HomePage() {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [query, setQuery] = useState("")
  const [liked, setLiked] = useState<number[]>([])
  const track = tracks[current]
  const filtered = useMemo(() => tracks.filter((item) => `${item.title} ${item.artist} ${item.album}`.toLowerCase().includes(query.toLowerCase())), [query])
  const next = () => setCurrent((value) => (value + 1) % tracks.length)
  const previous = () => setCurrent((value) => (value - 1 + tracks.length) % tracks.length)

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top"><img src="/z3ro-mark.svg" alt="Z3R0 Music" /></a>
      <nav className="nav-list" aria-label="Main navigation"><a className="active" href="#top"><Home size={18}/> Home</a><a href="#browse"><Search size={18}/> Browse</a><a href="#library"><Library size={18}/> Your Library</a></nav>
      <div className="side-section"><span className="eyebrow">Your collection</span><a href="#recent"><AudioLines size={17}/> Recently played</a><a href="#liked"><Heart size={17}/> Liked tracks</a><a href="#queue"><ListMusic size={17}/> Queue</a></div>
      <div className="side-bottom"><div className="live-dot"/> <span>Listening live</span><strong>12,406</strong></div>
    </aside>
    <section className="main-content" id="top">
      <header className="topbar"><button className="mobile-menu" aria-label="Open menu"><ListMusic size={20}/></button><div className="search"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artists, tracks, albums" aria-label="Search music"/></div><button className="profile">JD</button></header>
      <div className="content-wrap">
        <section className="hero"><div><p className="eyebrow cyan">Z3R0 / DISCOVER</p><h1>Sound beyond<br/><em>the signal.</em></h1><p className="hero-copy">Tune into a new dimension of music. Curated frequencies for wherever you are.</p><button className="primary" onClick={() => { setCurrent(0); setPlaying(true) }}><Play size={16} fill="currentColor"/> Start listening</button></div><div className="hero-orbit"><div className="orbit-ring one"/><div className="orbit-ring two"/><div className="planet">Z</div><span className="orbit-label">FREQ<br/><b>03.09</b></span></div></section>
        <section className="section" id="browse"><div className="section-heading"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Fresh frequencies</h2></div><a href="#browse">View all <ChevronRight size={16}/></a></div><div className="track-grid">{filtered.map((item, index) => { const realIndex = tracks.indexOf(item); return <article className={`track-card ${realIndex === current ? "selected" : ""}`} key={item.title} onClick={() => {setCurrent(realIndex); setPlaying(true)}}><div className="cover" style={{ background: `linear-gradient(135deg, ${item.color}, #10131d)` }}><img src={item.image} alt=""/><button className="card-play" aria-label={`Play ${item.title}`}><Play size={18} fill="currentColor"/></button><span className="cover-code">Z3R0 / {String(realIndex + 1).padStart(2, "0")}</span></div><div className="track-info"><div><h3>{item.title}</h3><p>{item.artist} · {item.album}</p></div><button className={`icon-button ${liked.includes(realIndex) ? "liked" : ""}`} onClick={(event) => { event.stopPropagation(); setLiked((value) => value.includes(realIndex) ? value.filter((x) => x !== realIndex) : [...value, realIndex]) }} aria-label="Like track"><Heart size={17} fill={liked.includes(realIndex) ? "currentColor" : "none"}/></button></div></article> })}</div></section>
        <section className="section split-section" id="library"><div><div className="section-heading"><div><p className="eyebrow">YOUR ROTATION</p><h2>Made for the night</h2></div></div><div className="playlist"><div className="playlist-art"><AudioLines size={32}/></div><div><h3>After hours / 001</h3><p>18 tracks · 1h 12m</p></div><button className="round-play" onClick={() => setPlaying(true)}><Play size={16} fill="currentColor"/></button></div></div><div className="quote"><span>“</span><p>Music is the space between the notes.</p><small>— Claude Debussy</small></div></section>
      </div>
    </section>
    <footer className="player"><div className="now-playing"><div className="mini-art" style={{background: track.color}}><img src={track.image} alt=""/></div><div><strong>{track.title}</strong><span>{track.artist}</span></div><button className="icon-button" onClick={() => setLiked((value) => value.includes(current) ? value.filter((x) => x !== current) : [...value, current])} aria-label="Like current track"><Heart size={17} fill={liked.includes(current) ? "currentColor" : "none"}/></button></div><div className="player-controls"><div className="controls"><button onClick={previous} aria-label="Previous track"><SkipBack size={17} fill="currentColor"/></button><button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={19} fill="currentColor"/> : <Play size={19} fill="currentColor"/>}</button><button onClick={next} aria-label="Next track"><SkipForward size={17} fill="currentColor"/></button></div><div className="progress"><span>01:24</span><input type="range" min="0" max="100" defaultValue="34" aria-label="Track progress"/><span>03:48</span></div></div><div className="volume"><Volume2 size={17}/><input type="range" min="0" max="100" defaultValue="75" aria-label="Volume"/></div></footer>
  </main>
}
