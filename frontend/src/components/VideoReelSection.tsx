import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Heart, Play } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../config';
import './VideoReelSection.css';

/* ── Inline Instagram SVG ── */
const InstagramIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

interface Reel {
  _id: string;
  title: string;
  youtubeUrl: string;   // stores any video URL: YouTube or Instagram
  thumbnailUrl?: string; // optional custom thumbnail from Cloudinary
  likes: number;
}

/* ── URL helpers ── */
function getVideoType(url: string): 'youtube' | 'instagram' | 'other' {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/instagram\.com/.test(url)) return 'instagram';
  return 'other';
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]{11})/);
  return m ? m[1] : null;
}

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function getYouTubeEmbed(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : '';
}

function getThumbnail(reel: Reel): string {
  if (reel.thumbnailUrl) return reel.thumbnailUrl;
  const type = getVideoType(reel.youtubeUrl);
  if (type === 'youtube') return getYouTubeThumbnail(reel.youtubeUrl);
  // Instagram — return empty, we'll show a gradient placeholder
  return '';
}

/* ── Card offset transform ── */
function cardStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset);
  return {
    transform: `translateX(${offset * 90}px) scale(${1 - abs * 0.12}) rotate(${offset * 6}deg)`,
    opacity: 1 - abs * 0.35,
    zIndex: 10 - abs,
  };
}

const HANDLE = '@pigglitz';

const VideoReelSection: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/reels`)
      .then(res => setReels(res.data))
      .catch(() => {});
  }, []);

  const startTimer = useCallback((len: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (len < 2) return;
    timerRef.current = setInterval(() => setActive(i => (i + 1) % len), 3500);
  }, []);

  useEffect(() => {
    if (!playing && reels.length > 0) startTimer(reels.length);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, reels.length, startTimer]);

  const goTo = (i: number) => { setActive(i); setPlaying(false); startTimer(reels.length); };

  const handlePlay = (e: React.MouseEvent, reel: Reel) => {
    e.stopPropagation();
    const type = getVideoType(reel.youtubeUrl);
    if (type === 'instagram' || type === 'other') {
      // Instagram can't be embedded — open in new tab
      window.open(reel.youtubeUrl, '_blank', 'noopener,noreferrer');
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPlaying(true);
    }
  };

  if (reels.length === 0) return null;

  const getOffset = (i: number) => {
    let d = i - active;
    if (d > reels.length / 2)  d -= reels.length;
    if (d < -reels.length / 2) d += reels.length;
    return d;
  };

  return (
    <section className="reel-section">
      <div className="reel-heading">
        <span className="reel-pill">🎬 Kids in Action</span>
        <h2 className="reel-title">Watch the <span>Magic</span> Happen</h2>
        <p className="reel-sub">Real kids. Real smiles. Real Pigglitz moments.</p>
      </div>

      <div className="reel-stage">
        {reels.map((reel, i) => {
          const offset   = getOffset(i);
          const isActive = offset === 0;
          if (Math.abs(offset) > 2) return null;

          const type      = getVideoType(reel.youtubeUrl);
          const thumb     = getThumbnail(reel);
          const isInsta   = type === 'instagram';

          return (
            <div
              key={reel._id}
              className={`reel-card${isActive ? ' reel-card--active' : ''}`}
              style={isActive ? { zIndex: 10 } : cardStyle(offset)}
              onClick={() => !isActive && goTo(i)}
            >
              {isActive && playing && type === 'youtube' ? (
                /* YouTube embed */
                <iframe
                  className="reel-iframe"
                  src={getYouTubeEmbed(reel.youtubeUrl)}
                  title={reel.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Thumbnail */}
                  {thumb ? (
                    <img className="reel-thumb" src={thumb} alt={reel.title} loading="lazy" />
                  ) : (
                    /* Instagram placeholder gradient */
                    <div className="reel-insta-placeholder">
                      <InstagramIcon size={48} />
                      <span>{reel.title}</span>
                    </div>
                  )}

                  <div className="reel-overlay" />

                  {isActive && <div className="reel-top-label">{reel.title}</div>}

                  {/* Play / Open button */}
                  {isActive && (
                    <button
                      className={`reel-play-btn${isInsta ? ' reel-play-btn--insta' : ''}`}
                      onClick={e => handlePlay(e, reel)}
                      aria-label={isInsta ? 'Open on Instagram' : 'Play video'}
                    >
                      {isInsta ? <InstagramIcon size={26} /> : <Play size={26} fill="currentColor" />}
                    </button>
                  )}

                  {isInsta && isActive && (
                    <div className="reel-insta-badge">
                      <InstagramIcon size={12} /> Instagram Reel
                    </div>
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

      <div className="reel-dots">
        {reels.map((_, i) => (
          <button key={i}
            className={`reel-dot${active === i ? ' reel-dot--active' : ''}`}
            onClick={() => goTo(i)} aria-label={`Reel ${i + 1}`} />
        ))}
      </div>

      <a href={`https://www.instagram.com/${HANDLE.replace('@', '')}`}
        target="_blank" rel="noopener noreferrer" className="reel-handle">
        <InstagramIcon size={18} />
        {HANDLE}
      </a>
    </section>
  );
};

export default VideoReelSection;
