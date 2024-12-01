import { useEffect, useRef } from "react";
import { useSoundContext } from "./SoundContext";

interface NotificationSoundProps {
  trigger: boolean; 
  audioSrc: string; 
}

const NotificationSound = ({ trigger, audioSrc }: NotificationSoundProps) => {
  const { isSoundOn } = useSoundContext(); // Control global de sonido
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Actualiza la referencia de audio cuando cambia la fuente
  useEffect(() => {
    audioRef.current = new Audio(audioSrc); 
    console.log("[NotificationSound]: Audio inicializado con src:", audioSrc);
  }, [audioSrc]);

  // Reproduce el sonido cuando trigger cambia
  useEffect(() => {
    if (trigger && isSoundOn) {
      if (audioRef.current) {
        console.log("[NotificationSound]: Reproduciendo sonido - Trigger activado.");
        audioRef.current.currentTime = 0; // Reinicia el audio
        audioRef.current
          .play()
          .catch((err) =>
            console.error("Error al reproducir el sonido de notificación:", err)
          );
      }
    }
  }, [trigger, isSoundOn]);

  return null; 
};

export default NotificationSound;
