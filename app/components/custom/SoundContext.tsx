import React, { createContext, useContext, useState } from "react";

interface SoundContextProps {
  isMusicPlaying: boolean;
  isSoundOn: boolean;
  toggleMusic: () => void;
  toggleSound: () => void;
  playSound: (src: string) => void;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const toggleMusic = () => setIsMusicPlaying((prev) => !prev);
  const toggleSound = () => {
    setIsSoundOn((prev) => {
      console.log("isSoundOn cambia a:", !prev);
      return !prev;
    });
  };

  const playSound = (src: string) => {
    if (!isSoundOn) return; const audio = new Audio(src);
    console.log("Reproduciendo sonido:", src);
    audio.play().catch((err) => console.error("Error al reproducir el sonido:", err));
  };

  return (
    <SoundContext.Provider value={{ isMusicPlaying, 
    isSoundOn, 
    toggleMusic, 
    toggleSound, 
    playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSoundContext debe usarse dentro de SoundProvider");
  return context;
};
