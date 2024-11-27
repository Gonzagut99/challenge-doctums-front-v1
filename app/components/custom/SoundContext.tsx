import React, { createContext, useContext, useState, ReactNode } from "react";

interface SoundContextType {
  isMusicPlaying: boolean;
  isSoundOn: boolean;
  toggleMusic: () => void;
  toggleSound: () => void;
  setMusicState: (state: boolean) => void;
  setSoundState: (state: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSoundContext = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
};

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const toggleMusic = () => setIsMusicPlaying((prev) => !prev);
  const toggleSound = () => setIsSoundOn((prev) => !prev);

  const setMusicState = (state: boolean) => setIsMusicPlaying(state);
  const setSoundState = (state: boolean) => setIsSoundOn(state);

  return (
    <SoundContext.Provider
      value={{
        isMusicPlaying,
        isSoundOn,
        toggleMusic,
        toggleSound,
        setMusicState,
        setSoundState,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
