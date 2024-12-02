import { useEffect, useRef } from "react";
import { useSoundContext } from "./SoundContext";

interface NotificationSoundProps {
  trigger: string; // Mensaje que activa el sonido
  audioSrc: string; // Ruta del archivo de audio
}

const NotificationSound = ({ trigger, audioSrc }: NotificationSoundProps) => {
  const { isSoundOn } = useSoundContext(); // Control global de sonido
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
    }

    if (trigger) {
      if (isSoundOn) {
        console.log("[NotificationSound]: Reproduciendo sonido - Trigger activado.");
        audioRef.current.currentTime = 0; 
        audioRef.current
          .play()
          .catch((err) =>
            console.error("Error al reproducir el sonido de notificación:", err)
          );
      } else {
        console.log("[NotificationSound]: No se reproduce el sonido - Sonido desactivado.");
      }
    }
  }, [trigger, audioSrc, isSoundOn]); 

  return null; 
};

export default NotificationSound;