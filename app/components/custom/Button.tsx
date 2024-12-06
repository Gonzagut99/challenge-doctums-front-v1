import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { SoundProvider, useSoundContext } from "./music/SoundContext";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
    hoverImgSrc?: string; 
}

export function Button({ children, className, hoverImgSrc, ...rest }: ButtonProps) {
    
    const { isSoundOn } = useSoundContext();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!isSoundOn && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
      }, [isSoundOn]);
      

    const handleMouseEnter = () => {
        console.log("isSoundOn cambia a:", isSoundOn);
        if (!isSoundOn) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          return;
        }
      
        if (!audioRef.current) {
          audioRef.current = new Audio("/assets/audios/sound-effects/button-press.mp3");
        }
      
        audioRef.current
          .play()
          .catch((err) => console.error("Error al reproducir el sonido del botón:", err));
      };

      
      

    return (
        <>
        <button
            {...rest}
            onMouseEnter={handleMouseEnter} 
            className={twMerge(
                "relative w-60 aspect-[16/5] flex items-center justify-center group overflow-hidden",
                className
            )}
        >
            <img
                className="absolute inset-0 w-full h-full block group-hover:hidden"
                src="/assets/buttons/Button.png"
                alt="Button"
            />
            {hoverImgSrc && (
                <img
                    className="absolute inset-0 w-full h-full hidden group-hover:block"
                    src={hoverImgSrc}
                    alt="Button Hover"
                />
            )}
            <p className="z-10">
                {children}
            </p>
        </button>
        {/* <audio ref={audioRef} src="/assets/audios/sound-effects/button-press.mp3" preload="auto" /> */}
        </>
    );
}
