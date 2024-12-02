import { useRef, useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { useSoundContext } from "./SoundContext";

const GlobalMusic = () => {
  const { isMusicPlaying } = useSoundContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation(); 

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/audios/background-music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2; 
      audioRef.current
        .play()
        .catch((err) => console.error("Error al reproducir la música:", err));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (location.pathname === "/game/legacyRewards") {
        audioRef.current.volume = 0.05; 
      } else {
        audioRef.current.volume = 0.2; 
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch((err) =>
          console.error("Error al reproducir la música:", err)
        );
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  return null; 
};

export default GlobalMusic;
