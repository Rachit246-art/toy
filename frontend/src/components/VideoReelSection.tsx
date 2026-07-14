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
  youtubeUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;      // direct MP4 from Cloudinary — plays inline
  likes: number;
}

/* ── Helpers ── */
function getVideoType(url: string): 'youtube' | 'instagram' | 'other' {
  if (!url) return 'other';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/instagram\.com/.test(url)) return 'instagram';
  return 'other';
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
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

function getInstaEmbed(url: string): string {
  if (!url) return '';
  let base = url.split('?')[0];
  if (!base.endsWith('/')) base += '/';
  return base + 'embed';
}

function getDisplayThumb(reel: Reel): string {
  // Custom thumbnail (Cloudinary) takes priority
  if (reel.thumbnailUrl && reel.thumbnailUrl.trim()) return reel.thumbnailUrl;
  // Auto-generate for YouTube
  const type = getVideoType(reel.youtubeUrl);
  if (type === 'youtube') return getYouTubeThumbnail(reel.youtubeUrl);
  return '';
}

/* ── Card offset transform (no CSS abs()) ── */
function cardStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset);
  return {
    transform: `translateX(${offset * 90}px) scale(${1 - abs * 0.12}) rotate(${offset * 6}deg)`,
    opacity: 1 - abs * 0.35,
    zIndex: 10 - abs,
  };
}

const HANDLE = '@pigglitz3d';

const VideoReelSection: React.FC = () => {
  const [reels, setReels]         = useState<Reel[]>([]);
  const [active, setActive]       = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/reels`)
      .then(res => setReels(res.data))
      .catch(() => {});
  }, []);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startTimer = useCallback((len: number) => {
    stopTimer();
    if (len < 2) return;
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % len);
      setPlayingId(null);
    }, 3500);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (reels.length > 0 && !playingId) startTimer(reels.length);
    return stopTimer;
  }, [reels.length, playingId, startTimer]);

  const goTo = (i: number) => {
    setActive(i);
    setPlayingId(null);
    startTimer(reels.length);
  };

  const handlePlay = (e: React.MouseEvent, reel: Reel) => {
    e.stopPropagation();
    // If direct video file exists — play inline always
    if (reel.videoUrl) {
      stopTimer();
      setPlayingId(reel._id);
      return;
    }
    const type = getVideoType(reel.youtubeUrl);
    if (type === 'youtube' || type === 'instagram') {
      stopTimer();
      setPlayingId(reel._id);
    } else {
      // other without video file — open in new tab
      window.open(reel.youtubeUrl, '_blank', 'noopener,noreferrer');
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
          const offset    = getOffset(i);
          const isActive  = offset === 0;
          if (Math.abs(offset) > 2) return null;

          const type      = getVideoType(reel.youtubeUrl);
          const isPlaying = playingId === reel._id && isActive;
          const isInsta   = type === 'instagram';
          const thumb     = getDisplayThumb(reel);

          return (
            <div
              key={reel._id}
              className={`reel-card${isActive ? ' reel-card--active' : ''}`}
              style={isActive ? { zIndex: 10 } : cardStyle(offset)}
              onClick={() => !isActive && goTo(i)}
            >
              {/* ── Playing Instagram ── */}
              {isPlaying && type === 'instagram' && !reel.videoUrl ? (
                <iframe
                  className="reel-iframe"
                  src={getInstaEmbed(reel.youtubeUrl)}
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  allow="encrypted-media"
                  style={{ background: 'white', width: '100%', height: '100%' }}
                />
              ) : isPlaying && type === 'youtube' && !reel.videoUrl ? (
                <iframe
                  className="reel-iframe"
                  src={getYouTubeEmbed(reel.youtubeUrl)}
                  title={reel.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isPlaying && reel.videoUrl ? (
                /* ── Direct video (Instagram reel uploaded as MP4) ── */
                <video
                  className="reel-iframe"
                  src={reel.videoUrl}
                  autoPlay
                  controls
                  playsInline
                  loop
                  style={{ objectFit: 'cover', background: '#000' }}
                />
              ) : (
                <>
                  {/* Thumbnail or gradient placeholder */}
                  {thumb ? (
                    <img
                      className="reel-thumb"
                      src={thumb}
                      alt={reel.title}
                      loading="lazy"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="reel-insta-placeholder">
                      {isInsta ? <InstagramIcon size={48} /> : <span style={{ fontSize: '3rem' }}>🎬</span>}
                      <span>{reel.title}</span>
                    </div>
                  )}

                  {/* Dark gradient overlay */}
                  <div className="reel-overlay" />

                  {/* Title label */}
                  {isActive && reel.title && (
                    <div className="reel-top-label">{reel.title}</div>
                  )}

                  {/* Play / Open button — active card only */}
                  {isActive && (
                    <button
                      className={`reel-play-btn${isInsta ? ' reel-play-btn--insta' : ''}`}
                      onClick={e => handlePlay(e, reel)}
                      aria-label={isInsta ? 'Open on Instagram' : 'Play video'}
                    >
                      {isInsta
                        ? <InstagramIcon size={26} />
                        : <Play size={26} fill="var(--color-purple)" color="var(--color-purple)" />
                      }
                    </button>
                  )}

                  {/* Instagram badge */}
                  {isInsta && isActive && (
                    <div className="reel-insta-badge">
                      <InstagramIcon size={12} /> Instagram
                    </div>
                  )}

                  {/* Likes */}
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

      {/* Instagram handle */}
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
