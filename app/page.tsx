"use client"

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react"
import { AudioLines, ChevronRight, FileAudio, Heart, Home, Library, ListMusic, Pause, Play, Plus, Search, SkipBack, SkipForward, Upload, Volume2, X } from "lucide-react"

type Track = { title: string; artist: string; album: string; color: string; image: string; url?: string; duration?: number }

const starterTracks: Track[] = [
  { title: "Afterglow Protocol", artist: "Z3R0", album: "Neon Expanse", color: "#6845c7", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80", duration: 228 },
  { title: "Static Hearts", artist: "Mira Vale", album: "Signal Bloom", color: "#e56389", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80", duration: 202 },
  { title: "Zero Gravity", artist: "Kairo", album: "Orbital", color: "#2c8c9b", image: "https://images.unsplash.com/photo-1534791547706-9c0cbd5f8f4e?auto=format&fit=crop&w=700&q=80", duration: 241 },
  { title: "Midnight Frequency", artist: "NOVA/9", album: "Dark Matter", color: "#bb4b35", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80", duration: 198 },
]

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`

export default function HomePage() {
  const [tracks, setTracks] = useState(starterTracks)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [query, setQuery] = useState("")
  const [liked, setLiked] = useState<number[]>([])
  const [progress, setProgress] = useState(34)
  const [volume, setVolume] = useState(75)
  const [uploadOpen, setUploadOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const track = tracks[current] ?? starterTracks[0]
  const filtered = useMemo(() => tracks.filter((item) => `${item.title} ${item.artist} ${item.album}`.toLowerCase().includes(query.toLowerCase())), [tracks, query])
  const toggleLike = (index: number) => setLiked((value) => value.includes(index) ? value.filter((item) => item !== index) : [...value, index])
  const playTrack = (index: number) => { setCurrent(index); setPlaying(true); if (tracks[index].url) setTimeout(() => void audioRef.current?.play(), 0) }
  const next = () => playTrack((current + 1) % tracks.length)
  const previous = () => playTrack((current - 1 + tracks.length) % tracks.length)
  const addFiles = async (files: File[]) => {
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"))
    const imported = audioFiles.map((file, index) => ({ title: file.name.replace(/\.[^/.]+$/, ""), artist: "Local upload", album: "Your library", color: ["#6845c7", "#e56389", "#2c8c9b"][index % 3], image: starterTracks[index % starterTracks.length].image, url: URL.createObjectURL(file), duration: 0 }))
    if (imported.length) { setTracks((value) => [...value, ...imported]); setUploadOpen(false) }
  }

  return <main className="app-shell">
    <audio ref={audioRef} src={track.url} onTimeUpdate={(event) => { const audio = event.currentTarget; if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100) }} onEnded={next} />
    <aside className="sidebar"><a className="brand" href="#top"><img src="/z3ro-mark.svg" alt="Z3R0 Music" /></a><nav className="nav-list" aria-label="Main navigation"><a className="active" href="#top"><Home size={18}/> Home</a><a href="#browse"><Search size={18}/> Browse</a><a href="#library"><Library size={18}/> Your Library</a></nav><div className="side-section"><span className="eyebrow">Your collection</span><a href="#recent"><AudioLines size={17}/> Recently played</a><a href="#liked"><Heart size={17}/> Liked tracks</a><a href="#queue"><ListMusic size={17}/> Queue</a></div><div className="side-bottom"><div className="live-dot"/> <span>Listening live</span><strong>12,406</strong></div></aside>
    <section className="main-content" id="top"><header className="topbar"><div className="search"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artists, tracks, albums" aria-label="Search music"/></div><button className="upload-button" onClick={() => setUploadOpen(true)}><Upload size={16}/> Upload</button><button className="profile" aria-label="Profile">Z3</button></header>
      <div className="content-wrap"><section className="hero"><div><p className="eyebrow cyan">Z3R0 / DISCOVER</p><h1>Sound beyond<br/><em>the signal.</em></h1><p className="hero-copy">Tune into a new dimension of music. Curated frequencies for wherever you are.</p><button className="primary" onClick={() => playTrack(0)}><Play size={16} fill="currentColor"/> Start listening</button></div><div className="hero-orbit"><div className="orbit-ring one"/><div className="orbit-ring two"/><div className="planet">Z</div><span className="orbit-label">FREQ<br/><b>03.09</b></span></div></section>
      <section className="section" id="browse"><div className="section-heading"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Fresh frequencies</h2></div><a href="#browse">View all <ChevronRight size={16}/></a></div><div className="track-grid">{filtered.map((item) => { const realIndex = tracks.indexOf(item); return <article className={`track-card ${realIndex === current ? "selected" : ""}`} key={`${item.title}-${realIndex}`} onClick={() => playTrack(realIndex)}><div className="cover" style={{ background: `linear-gradient(135deg, ${item.color}, #10131d)` }}><img src={item.image} alt=""/><button className="card-play" aria-label={`Play ${item.title}`}><Play size={18} fill="currentColor"/></button><span className="cover-code">Z3R0 / {String(realIndex + 1).padStart(2, "0")}</span></div><div className="track-info"><div><h3>{item.title}</h3><p>{item.artist} · {item.album}</p></div><button className={`icon-button ${liked.includes(realIndex) ? "liked" : ""}`} onClick={(event) => { event.stopPropagation(); toggleLike(realIndex) }} aria-label={`Like ${item.title}`}><Heart size={17} fill={liked.includes(realIndex) ? "currentColor" : "none"}/></button></div></article> })}</div></section>
      <section className="section split-section" id="library"><div><div className="section-heading"><div><p className="eyebrow">YOUR ROTATION</p><h2>Made for the night</h2></div></div><div className="playlist"><div className="playlist-art"><AudioLines size={32}/></div><div><h3>After hours / 001</h3><p>{tracks.length + 14} tracks · 1h 12m</p></div><button className="round-play" onClick={() => playTrack(0)}><Play size={16} fill="currentColor"/></button></div></div><div className="quote"><span>“</span><p>Music is the space between the notes.</p><small>— Claude Debussy</small></div></section></div></section>
    <footer className="player"><div className="now-playing"><div className="mini-art" style={{background: track.color}}><img src={track.image} alt=""/></div><div><strong>{track.title}</strong><span>{track.artist} · {track.album}</span></div><button className={`icon-button ${liked.includes(current) ? "liked" : ""}`} onClick={() => toggleLike(current)} aria-label="Like current track"><Heart size={17} fill={liked.includes(current) ? "currentColor" : "none"}/></button></div><div className="player-controls"><div className="controls"><button onClick={previous} aria-label="Previous track"><SkipBack size={17} fill="currentColor"/></button><button className="play-button" onClick={() => { setPlaying(!playing); if (track.url) void (playing ? audioRef.current?.pause() : audioRef.current?.play()) }} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={19} fill="currentColor"/> : <Play size={19} fill="currentColor"/>}</button><button onClick={next} aria-label="Next track"><SkipForward size={17} fill="currentColor"/></button></div><div className="progress"><span>{formatTime((progress / 100) * (track.duration || 228))}</span><input type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} aria-label="Track progress"/><span>{formatTime(track.duration || 228)}</span></div></div><div className="volume"><Volume2 size={17}/><input type="range" min="0" max="100" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); if (audioRef.current) audioRef.current.volume = value / 100 }} aria-label="Volume"/></div></footer>
    {uploadOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="upload-title"><div className="upload-modal"><button className="modal-close" onClick={() => setUploadOpen(false)} aria-label="Close upload dialog"><X size={18}/></button><div className="upload-icon"><FileAudio size={28}/></div><p className="eyebrow cyan">LOCAL LIBRARY</p><h2 id="upload-title">Add your frequency</h2><p>Drop audio files here or choose files from your device.</p><label className="dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); void addFiles(Array.from(event.dataTransfer.files)) }}><Plus size={22}/><span>Choose audio files</span><small>MP3, WAV, FLAC, M4A, OGG</small><input type="file" accept="audio/*" multiple onChange={(event: ChangeEvent<HTMLInputElement>) => void addFiles(Array.from(event.target.files ?? []))}/></label></div></div>}
  </main>
}
