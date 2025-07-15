import { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { getWebSocketService } from "~/services/ws";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const sessionCode = url.searchParams.get("sessionCode") as string;
  const playerId = url.searchParams.get("playerId") as string;
  const wsService = getWebSocketService(sessionCode, playerId);

  console.log(`[game.stream] Stream initialized for sessionCode=${sessionCode}, playerId=${playerId}`);

  return eventStream(request.signal, (send) => {
    // Send initial state
    console.log(`[game.stream] Sending initial state for sessionCode=${sessionCode}, playerId=${playerId}`);
    send({ data: JSON.stringify({ type: "init", state: wsService?.getGameState() }) });

    // Listen for game updates
    const handler = (gameState: any) => {
      console.log(`[game.stream] Game event for sessionCode=${sessionCode}, playerId=${playerId}:`, gameState);
      send({ data: JSON.stringify({ type: "update", state: gameState }) });
    };
    wsService?.onGameEvent(handler);

    // Clean up
    return () => {
      console.log(`[game.stream] Cleanup for sessionCode=${sessionCode}, playerId=${playerId}`);
      wsService?.offGameEvent(handler);
    };
  });
};

export const headers = () => ({
  "Cache-Control": "no-store",
});

export const meta = () => [{ title: "Game Stream" }]; 