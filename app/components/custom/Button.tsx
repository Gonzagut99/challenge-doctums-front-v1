import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
    hoverImgSrc?: string; 
}

export function Button({ children, className, hoverImgSrc, ...rest }: ButtonProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleMouseEnter = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((err) => console.error("Error al reproducir el audio:", err));
        }
    };

    return (
        <>
        <button
            {...rest}
            onMouseEnter={handleMouseEnter} // Reproduce el audio en el hover
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
        <audio ref={audioRef} src="/assets/audios/sound-effects/button-press.mp3" preload="auto" />
        </>
    );
}
