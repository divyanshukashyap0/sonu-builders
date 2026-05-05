import React from 'react';

interface YouTubeBackgroundProps {
  videoUrl: string;
  overlayOpacity?: number;
  className?: string;
}

const YouTubeBackground: React.FC<YouTubeBackgroundProps> = ({ 
  videoUrl, 
  overlayOpacity = 0.5,
  className = "" 
}) => {
  // Extract video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 z-0">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
          className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ border: 'none' }}
          allow="autoplay; encrypted-media"
          title="Background Video"
        />
      </div>
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} 
      />
    </div>
  );
};

export default YouTubeBackground;
