
import { createCookie } from "@remix-run/node";
import cookie from 'cookie'

export const gameCanvasStateCookie = createCookie("gameCanvasState", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo en producción
    sameSite: "lax",
    path: "/game",
    maxAge: 60 * 120, // 2 horas
})

type GameCanvasCookie = {
    players: [
        {
            avatarId: string,
            diceResult: number,
            previousPosition: number,
            currentPosition: number,
        }
    ];
};

export const setGameCanvasStateCookie = async (
    gameCanvasState: GameCanvasCookie,
) => {
    const gameCanvasStateCookieHeader = await gameCanvasStateCookie.serialize(
        gameCanvasState
    );
    const headers = new Headers();
    headers.append("Set-Cookie", gameCanvasStateCookieHeader);
    return headers;
}

export const removeGameCanvasStateCookie = async () => {
    const gameCanvasStateCookieHeader = await gameCanvasStateCookie.serialize("", {maxAge: 0});
    const headers = new Headers();
    headers.append("Set-Cookie", gameCanvasStateCookieHeader);
    return headers;
}

export const getGameCanvasState = async (request: Request) => {
    const cookieHeader = request.headers.get("cookie");
    const cookies = cookie.parse(cookieHeader || "");
    const gameCanvasState = cookies.gameCanvasState;
    return gameCanvasState;
}

export const changePlayerPosition = async (
    request: Request,
    avatarId: string,
    diceResult: number,
    previousPosition: number,
    currentPosition: number,
) => {
    const gameCanvasState = await getGameCanvasState(request);
    if (!gameCanvasState) {
        return;
    }
    const gameCanvasStateObject = JSON.parse(gameCanvasState) as GameCanvasCookie;
    const playerIndex = gameCanvasStateObject.players.findIndex(
        (player) => player.avatarId === avatarId
    );
    if (playerIndex === -1) {
        return;
    }
    gameCanvasStateObject.players[playerIndex] = {
        avatarId,
        diceResult,
        previousPosition,
        currentPosition,
    };
    return setGameCanvasStateCookie(gameCanvasStateObject);
}

export const getPlayerPosition = async (
    request: Request,
    avatarId: string,
) => {
    const gameCanvasState = await getGameCanvasState(request);
    if (!gameCanvasState) {
        return;
    }
    const gameCanvasStateObject = JSON.parse(gameCanvasState) as GameCanvasCookie;
    const player = gameCanvasStateObject.players.find(
        (player) => player.avatarId === avatarId
    );
    return player;
}

export const resetGameCanvasState = async () => {
    return removeGameCanvasStateCookie();
}

export const removePlayer = async (
    request: Request,
    avatarId: string,
) => {
    const gameCanvasState = await getGameCanvasState(request);
    if (!gameCanvasState) {
        return;
    }
    const gameCanvasStateObject = JSON.parse(gameCanvasState) as GameCanvasCookie;
    const playerIndex = gameCanvasStateObject.players.findIndex(
        (player) => player.avatarId === avatarId
    );
    if (playerIndex === -1) {
        return;
    }
    gameCanvasStateObject.players.splice(playerIndex, 1);
    return setGameCanvasStateCookie(gameCanvasStateObject);
}

export const addPlayer = async (
    request: Request,
    avatarId: string,
    diceResult: number,
    previousPosition: number,
    currentPosition: number,
) => {
    const gameCanvasState = await getGameCanvasState(request);
    if (!gameCanvasState) {
        return;
    }
    const gameCanvasStateObject = JSON.parse(gameCanvasState) as GameCanvasCookie;
    gameCanvasStateObject.players.push({
        avatarId,
        diceResult,
        previousPosition,
        currentPosition,
    });
    return setGameCanvasStateCookie(gameCanvasStateObject);
}
