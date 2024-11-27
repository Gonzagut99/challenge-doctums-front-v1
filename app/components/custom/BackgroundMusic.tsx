import React, { useEffect, useRef, useState } from "react";
import { useSoundContext } from "./SoundContext"; // Importa el contexto

const MusicAndSoundControls: React.FC = () => {
  const { isMusicPlaying, isSoundOn, toggleMusic, toggleSound } = useSoundContext(); 
  const [isExpanded, setIsExpanded] = useState(false); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    

    if (audioElement) {
      audioElement.volume = 0;
      audioElement.play().catch((err) => console.error("Error al reproducir la música:", err));

      const volumeInterval = setInterval(() => {
        if (audioElement.volume < 0.2) {
          audioElement.volume = Math.min(audioElement.volume + 0.1, 1);
        } else {
          clearInterval(volumeInterval);
        }
      }, 200);

      return () => {
        clearInterval(volumeInterval);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch((err) => console.error("Error al reproducir la música:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]); 


  return (
    <div
      className="relative z-40"
      onMouseEnter={() => setIsExpanded(true)} 
      onMouseLeave={() => setIsExpanded(false)} 
    >
      <button className="p-4 text-white">
        <img
          src={isExpanded ? "/assets/setting/button-setting2.png" : "/assets/setting/button-setting1.png"}
          alt="Botón de configuración"
        />
      </button>

      {isExpanded && (
        <div
          className="absolute top-4 right-full ml-4 w-60 p-4 text-white rounded-lg shadow-lg transition-all duration-300"
          style={{
            backgroundImage: "url(/assets/setting/panel-setting.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h3 className="text-lg mb-4 text-black text-center font-easvhs">Controles de Sonido</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-between w-32 items-center">
              <img
                src={isMusicPlaying ? "/assets/setting/music-on.png" : "/assets/setting/music-off.png"}
                alt="Icono de música"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMusic();
                }}
                className="w-12 h-10"
              >
                <img
                  className="w-64"
                  src={isMusicPlaying ? "/assets/setting/switch-on.png" : "/assets/setting/switch-off.png"}
                  alt="Control de música"
                />
              </button>
            </div>

            <div className="flex justify-between w-32 items-center">
              <img
                src={isSoundOn ? "/assets/setting/sound-on.png" : "/assets/setting/sound-off.png"}
                alt="Icono de efectos de sonido"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSound();
                }}
                className="w-12 h-10"
              >
                <img
                  className="w-64"
                  src={isSoundOn ? "/assets/setting/switch-on.png" : "/assets/setting/switch-off.png"}
                  alt="Control de efectos de sonido"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} loop>
        <source src="/assets/audios/background-music.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
};

export default MusicAndSoundControls;
