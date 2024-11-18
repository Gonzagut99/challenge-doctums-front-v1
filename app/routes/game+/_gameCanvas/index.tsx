import  { type LoaderFunctionArgs, type ActionFunctionArgs  } from "@remix-run/node";
import { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { globalWebSocketService } from "~/services/ws";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const isGameInitialized = globalWebSocketService.getIsGameInitialized();
//   const isRerenderedOneTime= globalWebSocketService.getIsRenderedOneTime();
// };

interface DicesResult {
    userId: string;
    avatarId: number;
    diceNumber: number;
    result: number[];
    total: number;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

interface GameCanvasProps extends HTMLAttributes<HTMLDivElement> {
    avatarId: string;
    diceResult: DicesResult[];
}
const GameCanvas = forwardRef<HTMLDivElement, GameCanvasProps>((props, ref) => {
    const { avatarId, diceResult, ...rest } = props;
    const localDivRef = useRef<HTMLDivElement | null>(null); // Referencia para el contenedor del canvas de Phaser
    const gameInstanceRef = useRef<Phaser.Game | null>(null); 
    const [grabbing, setGrabbing] = useState(false);

    useImperativeHandle(ref, () => localDivRef.current!);

    useEffect(() => {
        const parentElement = localDivRef.current;

        let isGameInitialized = false; // Variable para controlar la inicialización

        if (
            typeof window !== "undefined" &&
            parentElement &&
            !isGameInitialized
        ) {
            const loadMainScene = async () => {
                const { MainScene } = await import("~/game/scenes/MainScene"); // Importación dinámica

                const config:Phaser.Types.Core.GameConfig = {
                    type: Phaser.AUTO,
                    width: 790,
                    height: 440,
                    backgroundColor: undefined,
                    transparent: true,
                    parent: parentElement,
                    scene: MainScene,
                    physics: {
                        default: "arcade",
                        arcade: {
                            debug: true,
                            gravity: { x: 0, y: 0 },
                        },
                    },
                };
                // Crea la instancia del juego de Phaser y almacénala en una referencia
                if (!gameInstanceRef.current) {
                    gameInstanceRef.current = new Phaser.Game(config);
                    isGameInitialized = true;

                    //Iniciar la escena y pasar el avatarId
                    gameInstanceRef.current.scene.start("MainScene", {
                        avatarId,
                        diceResult,
                    });
                }
            };
            loadMainScene().catch((error) => {
                console.error("Error loading MainScene:", error);
            });
        }
        //Esto esta bien cuando se desmonta la vista, a menos que no lo hagamos por los modals
        /*
        return () => {
            Limpia la instancia del juego al desmontar el componente
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
                gameInstanceRef.current = null;
            }
        };*/
    }, []);
    return (
        <div
            {...rest}
            ref={localDivRef}
            id="GameCanvas"
            className={twMerge("w-[800px] h-[442px] cursor-grab", grabbing && "cursor-grabbing")}
            role="button"
            tabIndex={0}
            onMouseDown={() => setGrabbing(true)}
            onMouseUp={() => setGrabbing(false)}
            // onKeyDown={(e) => {
            //     if (e.key === "Enter" || e.key === " ") {
            //         setGrabbing(true);
            //     }
            // }}
            // onKeyUp={(e) => {
            //     if (e.key === "Enter" || e.key === " ") {
            //         setGrabbing(false);
            //     }
            // }}
        ></div>
    );
})

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;