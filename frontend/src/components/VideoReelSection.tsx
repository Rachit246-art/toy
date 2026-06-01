import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';

/* Inline Instagram SVG — lucide-react doesn't include it */
const InstagramIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
import axios from 'axios';
import './VideoReelSection.css';

interface Reel {
  _id: string;
  title: string;
  youtubeUrl: string;
  likes: number;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
    /youtube\.com\/shorts\/([^&?/\s]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function getEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : '';
}

/* Compute inline transform for each card based on offset from active */
function cardStyle(offset: number): React.CSSProperties {
  const absOffset = Math.abs(offset);
  const translateX = offset * 90;          // px fan spread
  const scale      = 1 - absOffset * 0.12; // shrink side cards
  const rotate     = offset * 6;           // deg tilt
  const opacity    = 1 - absOffset * 0.35; // fade side cards
  const zIndex     = 10 - absOffset;

  return {
    transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
    opacity,
    zIndex,
  };
}

const HANDLE = '@pigglitz';

const VideoReelSection: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reels')
      .then(res => setReels(res.data))
      .catch(() => {});
  }, []);

  const startTimer = useCallback((len: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (len < 2) return;
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % len);
    }, 3500);
  }, []);

  useEffect(() => {
    if (!playing && reels.length > 0) startTimer(reels.length);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, reels.length, startTimer]);

  const goTo = (i: number) => {
    setActive(i);
    setPlaying(false);
    startTimer(reels.length);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearInterval(timerRef.current);
    setPlaying(true);
  };

  if (reels.length === 0) return null;

  /* Offset of card i relative to active, wrapped around */
  const getOffset = (i: number) => {
    let d = i - active;
    if (d > reels.length / 2)  d -= reels.length;
    if (d < -reels.length / 2) d += reels.length;
    return d;
  };

  return (
    <section className="reel-section">
      {/* Heading */}
      <div className="reel-heading">
        <span className="reel-pill">🎬 Kids in Action</span>
        <h2 className="reel-title">Watch the <span>Magic</span> Happen</h2>
        <p className="reel-sub">Real kids. Real smiles. Real Pigglitz moments.</p>
      </div>

      {/* Stacked card stage */}
      <div className="reel-stage">
        {reels.map((reel, i) => {
          const offset   = getOffset(i);
          const isActive = offset === 0;
          if (Math.abs(offset) > 2) return null;

          return (
            <div
              key={reel._id}
              className={`reel-card${isActive ? ' reel-card--active' : ''}`}
              style={isActive ? { zIndex: 10 } : cardStyle(offset)}
              onClick={() => !isActive && goTo(i)}
            >
              {isActive && playing ? (
                <iframe
                  className="reel-iframe"
                  src={getEmbedUrl(reel.youtubeUrl)}
                  title={reel.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    className="reel-thumb"
                    src={getThumbnail(reel.youtubeUrl)}
                    alt={reel.title}
                    loading="lazy"
                  />
                  <div className="reel-overlay" />

                  {isActive && <div className="reel-top-label">{reel.title}</div>}

                  {isActive && (
                    <button className="reel-play-btn" onClick={handlePlay} aria-label="Play video">
                      ▶
                    </button>
                  )}

                  <div className="reel-likes">
                    <Heart size={13} fill="white" color="white" />
                    <span>{reel.likes.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="reel-dots">
        {reels.map((_, i) => (
          <button
            key={i}
            className={`reel-dot${active === i ? ' reel-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Reel ${i + 1}`}
          />
        ))}
      </div>

      {/* Instagram handle pill */}
      <a
        href={`https://www.instagram.com/${HANDLE.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="reel-handle"
      >
        <InstagramIcon size={18} />
        {HANDLE}
      </a>
    </section>
  );
};

export default VideoReelSection;
