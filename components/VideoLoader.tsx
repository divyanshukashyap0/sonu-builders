import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoLoaderProps {
    isLoading: boolean;
    onComplete: () => void;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ isLoading, onComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.error("Video play failed:", error);
                // If autoplay is blocked, we might need to fallback. 
                // For now, we assume standard autoplay policies (muted) allow it.
            });
        }
    }, []);

    const handleVideoEnded = () => {
        // This event fires when the video reaches the end of its duration.
        // If loading is done, we can finish.
        // If loading is NOT done, we must loop.
        if (!isLoading) {
            onComplete();
        } else {
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(console.error);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
        >
            <video
                ref={videoRef}
                src="/Loader.mp4"
                preload="auto"
                className="w-[28rem] h-auto object-contain mix-blend-screen pointer-events-none"
                style={{
                    transform: 'translateZ(0)', // Force GPU acceleration
                    WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                    maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                    filter: 'contrast(1.2) brightness(1.1)' // Crushes compression grays to pure black making it perfectly transparent!
                }}
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                loop={isLoading} // Loop while loading
                onContextMenu={(e) => e.preventDefault()}
                onEnded={handleVideoEnded}
            />
        </motion.div>
    );
};

export default VideoLoader;
