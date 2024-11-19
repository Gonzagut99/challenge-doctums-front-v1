import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { changeDirection, sameDirection, dayPositions } from "~/game/resources/tilemap/positions";
import { emitter } from "~/utils/emitter.client";
import { PlayerCanvasState } from "~/types/gameCanvasState";

type InitData = { 
    avatarId: string | number;
    gamePlayersPositions: PlayerCanvasState[]
};

export class MainScene extends Phaser.Scene {
    [key: string]: any;
    private twelve!: Phaser.Tilemaps.Tilemap;
    private playersCharacter: Record<string, Phaser.Physics.Arcade.Sprite> = {};
    private localPlayerCharacter!: Phaser.Physics.Arcade.Sprite;
    private character!: Phaser.Physics.Arcade.Sprite;
    private casillasGroup!: Phaser.Physics.Arcade.StaticGroup;
    private lastHorizontalDirection: Record<string, "left" | "right"> = {};
    private isStopped: Record<string, boolean> = {};
    private diceRollResult: number = 0;
    private currentCasillaId: Record<string, number> = {};
    private changeDirection: any[];
    private dayPositions: any[];
    private sameDirection: any[];
    private upwardPointIds: number[] = [];
    private oppositeDirectionIds: number[] = [];
    private visitedCasillas: Record<string, Set<number>> = {};
    private direction: Record<string, "up" | "horizontal"> = {};
    private turns_order: any[] = [];
    private nextExpectedId: number = 1;
    private isFirstRollGame: boolean = true;
    private avatarId: number | null = null;
    private playerPositions: PlayerCanvasState[] = [];
    private localPlayerPosition: PlayerCanvasState;
    private mainCamera: Phaser.Cameras.Scene2D.Camera;
    private scrollCamera: Phaser.Cameras.Scene2D.Camera;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'MainScene', physics: { arcade: { debug: true } } });
        this.changeDirection = changeDirection;
        this.dayPositions = dayPositions;
        this.sameDirection = sameDirection;
    }

    init({ avatarId, gamePlayersPositions }: InitData) {
        this.avatarId = Number(avatarId) || 2;
        this.playerPositions = gamePlayersPositions;
        this.localPlayerPosition = gamePlayersPositions.find(player => player.isLocalPlayer) as PlayerCanvasState;
    }

    preload() {
        const playersAvatars = this.playerPositions.map(player => player.avatarId);
        playersAvatars.forEach((avatarId) => {
            const animJsonPath = `game/animations/character_${avatarId}/character_${avatarId}_anim.json`;
            const atlasPath = `game/sprites/character_${avatarId}.png`;
            const atlasJsonPath = `game/animations/character_${avatarId}/character_${avatarId}_atlas.json`;
            this.load.json(`character_${avatarId}_anim`, animJsonPath);
            this.load.atlas(`character_${avatarId}`, atlasPath, atlasJsonPath);
        });
        this.load.tilemapTiledJSON("twelve", "game/tilemap/twelve.json");
        this.load.image("tileset-offices", "game/tilesets/tileset-offices.png");
        this.load.image("tematic", "game/tilesets/tematic.png");
        this.load.image("level-1", "game/tile-field/level-1.png");
        this.load.image("level-2", "game/tile-field/level-2.png");
        this.load.image("level-3", "game/tile-field/level-3.png");
        this.load.image("level-4", "game/tile-field/level-4.png");
        this.load.image("level-5", "game/tile-field/level-5.png");
        this.load.image("level-6", "game/tile-field/level-6.png");
        this.load.image("rest", "game/tile-field/rest.png"); 
    }

    editorCreate(): void {
        const twelve = this.add.tilemap("twelve");
        twelve.addTilesetImage("tileset-offices");
        twelve.addTilesetImage("tematic");
        const mapOffsetX = -370;
        const mapOffsetY = 170;
        twelve.createLayer("pisos", ["tileset-offices"], mapOffsetX, mapOffsetY);
        const wall = twelve.createLayer("paredes", ["tileset-offices", "tematic"], mapOffsetX, mapOffsetY);
        if (wall) {
            wall.setDepth(12);
        }
        const decoration = twelve.createLayer("decoracion2", ["tematic", "tileset-offices"], mapOffsetX, mapOffsetY);
        if (decoration) {
            decoration.setDepth(13);
        }
        const decoration2 = twelve.createLayer("decoracion", ["tileset-offices", "tematic"], mapOffsetX, mapOffsetY);
        if (decoration2) {
            decoration2.setDepth(14);
        }
        this.twelve = twelve;
    }

    initializeDefaultValues() {
        if (this.playerPositions.length > 0) {
            this.playerPositions.forEach((player) => {
                this.isStopped[player.playerId] = false;
                this.lastHorizontalDirection[player.playerId] = "left";
                this.direction[player.playerId] = "horizontal";
                this.visitedCasillas[player.playerId] = new Set();
                this.currentCasillaId[player.playerId] = 0;
            });
        }
    }

    create(): void {
        this.promptDiceRoll();
        this.editorCreate();
        this.initializeDefaultValues();
        const playersAnimData: Record<string, any> = {};
        this.playerPositions.forEach((playerState) => {
            const { avatarId, playerId } = playerState;
            playersAnimData[playerId] = this.cache.json.get(`character_${avatarId}_anim`);
            if (!playersAnimData[playerId] || !playersAnimData[playerId].anims) {
                return;
            }
        });
        this.playerPositions.forEach((playerState) => {
            const { avatarId, playerId } = playerState;
            playersAnimData[playerId].anims.forEach((animation: any) => {
                const frames = animation.frames.map((frameData: { key: string, frame: string }) => ({
                    key: `character_${avatarId}`,
                    frame: frameData.frame,
                }));
                if (!this.anims.exists(animation.key)) {
                    this.anims.create({
                        key: `${animation.key}`,
                        frames: frames,
                        frameRate: animation.frameRate,
                        repeat: animation.repeat,
                    });
                }
            });
        });
        const defaultPositions = [
            { x: 150, y: 5950 },
            { x: 115, y: 5980 },
            { x: 80, y: 5950 },
            { x: 80, y: 5980 },
        ];    
        this.playerPositions.forEach((playerState, idx) => {
            this.playersCharacter[playerState.playerId] = this.physics.add.sprite(defaultPositions[idx].x, defaultPositions[idx].y, `character_${playerState.avatarId}`);
            this.playersCharacter[playerState.playerId].setOrigin(1, 0.5);
            this.playersCharacter[playerState.playerId].setDepth(10);
            this.playersCharacter[playerState.playerId].anims.play(`idle_${playerState.avatarId}`, true);
            if (playerState.isLocalPlayer) {
                this.localPlayerCharacter = this.playersCharacter[playerState.playerId];
            }
        });
        this.scrollCamera = this.cameras.add(0, 0, this.sys.game.config.width as number, this.sys.game.config.height as number);
        this.setupPointerScroll();
        this.casillasGroup = this.physics.add.staticGroup();
        this.changeDirection = changeDirection;
        this.dayPositions = dayPositions;
        this.sameDirection = sameDirection;
        this.dayPositions.forEach((pos) => {
            const casilla = this.casillasGroup.create(pos.x, pos.y, pos.type);
            casilla.setData('id', pos.id);
            casilla.refreshBody();
        });
        this.changeDirection.forEach((pos) => {
            const casilla = this.casillasGroup.create(pos.x, pos.y, pos.type);
            casilla.setData('id', pos.id);
            casilla.setAlpha(0);
            casilla.refreshBody();
        });
        this.sameDirection.forEach((pos) => {
            const casilla = this.casillasGroup.create(pos.x, pos.y, pos.type);
            casilla.setData('id', pos.id);
            casilla.setAlpha(0);
            casilla.refreshBody();
        });
        this.playerPositions.forEach((playerState) => {
            const character = this.getCharacterByPlayerId(playerState.playerId);
            const callback = (character: Phaser.GameObjects.Sprite, casilla: Phaser.GameObjects.GameObject) => {
                this.handleCollision(null, casilla, playerState.playerId);
            };
            this.physics.add.overlap(character, this.casillasGroup, callback as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        });
        this.nextExpectedId = 1;
        this.initializeSpecialTiles();
        EventBus.emit('current-scene-ready', this);
        emitter.emit('renderPlayersOnMap', this.turns_order);
    }

    promptDiceRoll(): void {
        this.time.delayedCall(1000, () => {
            this.input.keyboard?.once('keydown-RIGHT', () => {
                const playerId = prompt("Ingresa el ID del jugador:") || "0";
                const diceRoll = parseInt(prompt("Ingresa el valor del dado:") || "0", 10);
                if (!isNaN(diceRoll)) {
                    this.setDiceRoll(diceRoll, playerId);
                    this.isStopped[playerId] = false;
                    if (this.isFirstRollGame) {
                        this.isFirstRollGame = false;
                        this.moveCharacterDown(playerId);
                    } else {
                        this.moveCharacterToTarget(playerId);
                    }
                }
            });
        });
    }

    setDiceRoll(value: number, playerId: string): void {
        // if (!this.currentCasillaId[playerId]) {
        //     return;
        // }
        this.diceRollResult = this.currentCasillaId[playerId] + value;
    }

    getCurrentCasillaId(character: Phaser.GameObjects.Sprite): number | null {
        const casilla = this.casillasGroup.getChildren().find(casilla =>
            Phaser.Math.Distance.Between(
                character.x, character.y, 
                (casilla as Phaser.GameObjects.Sprite).x, 
                (casilla as Phaser.GameObjects.Sprite).y
            ) < this.tolerance
        ) as Phaser.GameObjects.Sprite;
        return casilla ? casilla.getData('id') : null;
    }

    private isWithinTolerance(casilla: Phaser.GameObjects.GameObject, playerId: string): boolean {
        const character = this.getCharacterByPlayerId(playerId);
        const tolerance = 14;
        const isWithinTolerance =  Math.abs(Math.round(character.x) - (casilla as Phaser.GameObjects.Sprite).x) < tolerance && Math.abs(Math.round(character.y + character.height / 2) - (casilla as Phaser.GameObjects.Sprite).y) < tolerance
        return isWithinTolerance;
    }

    handleCollision(_: any, casilla: Phaser.GameObjects.GameObject, playerId: string): void {
        const casillaId = casilla.getData('id');
        if (this.visitedCasillas[playerId].has(casillaId)|| this.isStopped[playerId] || !this.isWithinTolerance(casilla, playerId)) return;
        this.smoothSetBounds(130, -40, this.twelve.widthInPixels - 130, this.twelve.heightInPixels, 1000);
        if (casillaId === this.diceRollResult || casillaId === 360) {
            this.stopCharacter(casillaId, playerId);
            return;
        }
        if (this.isSpecialTile(casillaId)) {
            this.handleSpecialTileMovement(casillaId, playerId);
            this.visitedCasillas[playerId].add(casillaId);
            return;
        }
        this.continueCurrentDirection(playerId);
        this.visitedCasillas[playerId].add(casillaId);
    }

    getCharacterByPlayerId(playerId: string): Phaser.Physics.Arcade.Sprite {
        return this.playersCharacter[playerId];
    }

    getAvatarIdByPlayerId(playerId: string) {
        return this.playerPositions.find(player => player.playerId === playerId)?.avatarId;
    }

    getAnimKeyByAvatarId(avatarId: number) {
        const idle = `idle_${avatarId}`;
        const walkLeft = `walk_left_${avatarId}`;
        const walkRight = `walk_right_${avatarId}`;
        const walkForward = `walk_forward_${avatarId}`;
        const walkBackward = `walk_backward_${avatarId}`;
        const rest = `rest_${avatarId}`;
        return {
            idle,
            walkLeft,
            walkRight,
            walkForward,
            walkBackward,
            rest
        };
    }

    getAnimKeyByPlayerId(playerId: string) {
        const avatarId = this.getAvatarIdByPlayerId(playerId);
        return this.getAnimKeyByAvatarId(avatarId!);
    }

    moveCharacterToTarget(playerId: string): void {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        const targetId = this.diceRollResult;
        const targetCasilla = this.casillasGroup.getChildren().find(casilla => casilla.getData('id') === targetId);
        if (!targetCasilla) {
            return;
        }
        const directionX = (targetCasilla as Phaser.GameObjects.Sprite).x > character.x ? 1 : -1;
        const directionY = (targetCasilla as Phaser.GameObjects.Sprite).y > character.y ? 1 : -1;
        character.setVelocityX(200 * directionX);
        if (directionX !== 0) {
            character.anims.play(directionX === 1 ? animationKey.walkRight : animationKey.walkLeft, true);
        } else {
            character.anims.play(directionY === 1 ? animationKey.walkForward : animationKey.walkBackward, true);
        }
    }

    initializeSpecialTiles() {
        this.upwardPointIds = this.dayPositions.filter(pos => pos.id % 7 === 0).map(pos => pos.id);
        this.oppositeDirectionIds = this.dayPositions.filter(pos => (pos.id - 1) % 7 === 0 && pos.id !== 1).map(pos => pos.id);
    }

    stopCharacter(casillaId: number, playerId: string): void {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        character.setVelocityX(0);
        character.setVelocityY(0);
        character.anims.play(animationKey.idle, true);
        this.isStopped[playerId] = true;
        this.currentCasillaId[playerId] = casillaId;
        this.promptDiceRoll();
    }

    isSpecialTile(casillaId: number) {
        return (
            this.changeDirection.some(pos => pos.id === casillaId) ||
            this.sameDirection.some(pos => pos.id === casillaId) ||
            this.upwardPointIds.includes(casillaId) ||
            this.oppositeDirectionIds.includes(casillaId)
        );
    }

    private excludedCasillaIds: number[] = [92, 120, 302];

    handleSpecialTileMovement(casillaId: number, playerId: string) {
        const character = this.getCharacterByPlayerId(playerId);
        if (this.sameDirection.some(pos => pos.id === casillaId) && casillaId !== 369) {
            this.lastHorizontalDirection[playerId] = "left";
            this.moveCharacterLeft(playerId);
            return;
        } else if (this.direction[playerId] === "up" && casillaId === 369) {
            this.lastHorizontalDirection[playerId] = "right";
            this.moveCharacterLeft(playerId);
            return;
        }
        if (this.oppositeDirectionIds.includes(casillaId) && !this.excludedCasillaIds.includes(casillaId)) {
            if (casillaId === 121) {
                this.lastHorizontalDirection[playerId] = "right";
                this.moveCharacterRight(playerId);
            }
            this.updateDirection(playerId);
            return;
        }
        if (this.isUpwardOrChangeDirectionTile(casillaId)) {
            if (this.direction[playerId] !== "up") {
                this.direction[playerId] = "up";
                character.setVelocityX(0);
                character.setVelocityY(-200);
                character.anims.play('walk_backward', true);
            } else if (casillaId === 121) {
                this.lastHorizontalDirection[playerId] = "right";
                this.moveCharacterRight(playerId);
            } else if (this.lastHorizontalDirection[playerId] === "right") {
                this.moveCharacterRight(playerId);
            } else if (this.lastHorizontalDirection[playerId] === "left" && casillaId !== 331) {
                this.moveCharacterLeft(playerId);
            } else {
                this.lastHorizontalDirection[playerId] = "right";
                this.moveCharacterRight(playerId);
            }
            return;
        }
        this.continueCurrentDirection(playerId);
    }

    isUpwardOrChangeDirectionTile(casillaId: number) {
        return this.upwardPointIds.includes(casillaId) || this.changeDirection.some(pos => pos.id === casillaId);
    }

    updateDirection(playerId: string) {
        const character = this.getCharacterByPlayerId(playerId);
        if (this.lastHorizontalDirection[playerId] === "right") {
            this.lastHorizontalDirection[playerId] = "left";
            this.moveCharacterLeft(playerId);
        } else {
            this.lastHorizontalDirection[playerId] = "right";
            this.moveCharacterRight(playerId);
        }
        character.setVelocityY(0);
        this.direction[playerId] = "horizontal";
    }

    continueCurrentDirection(playerId: string) {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        if (this.lastHorizontalDirection[playerId] === "left") {
            character.setVelocityX(-400);
            character.anims.play(animationKey.walkLeft, true);
        } else {
            character.setVelocityX(400);
            character.anims.play(animationKey.walkRight, true);
        }
        character.setVelocityY(0);
        this.direction[playerId] = "horizontal";
    }

    private setCharacterVelocity(directionX: number, directionY: number, playerId: string): void {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        const velocity = 400;
        character.setVelocityX(velocity * directionX);
        character.setVelocityY(200 * directionY);
        if (directionX !== 0) {
            this.lastHorizontalDirection[playerId] = directionX > 0 ? 'right' : 'left';
            character.anims.play(directionX > 0 ? animationKey.walkRight : animationKey.walkLeft, true);
        } else if (directionY !== 0) {
            character.anims.play(directionY > 0 ? animationKey.walkForward : animationKey.walkBackward, true);
        }
        this.direction[playerId] = directionX !== 0 ? 'horizontal' : this.direction[playerId];
    }

    moveCharacterLeft(playerId: string): void {
        this.setCharacterVelocity(-1, 0, playerId);
        this.lastHorizontalDirection[playerId] = 'left';
    }

    moveCharacterRight(playerId: string): void {
        this.setCharacterVelocity(1, 0, playerId);
        this.lastHorizontalDirection[playerId] = 'right';
    }

    moveCharacterUp(playerId: string): void {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        character.setVelocityY(-200);
        character.anims.play(animationKey.walkBackward, true);
    }

    moveCharacterDown(playerId: string): void {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        character.setVelocityY(200);
        character.anims.play(animationKey.walkForward, true);
    }

    restCharacter(playerId: string): void {
        const character = this.playersCharacter[playerId] as Phaser.Physics.Arcade.Sprite;
        const animationKey = this.getAnimKeyByPlayerId(playerId);
        character.anims.play(animationKey.rest, true);
        this.time.delayedCall(2000, () => {
            this.promptDiceRoll();
        });
    }

    setupPointerScroll() {
        this.scrollCamera.startFollow(this.localPlayerCharacter);
        this.scrollCamera.setZoom(0.8);
        this.scrollCamera.setBounds(0, 0, this.twelve.widthInPixels, this.twelve.heightInPixels);
        let manualCameraControl = false;
        let followTimeout: any;
        const lerpFactor = 0.02;
        const smoothFollow = () => {
            if (!manualCameraControl) {
                const targetX = this.localPlayerCharacter.x - this.scrollCamera.width / 2;
                const targetY = this.localPlayerCharacter.y - this.scrollCamera.height / 2;
                this.scrollCamera.scrollX += (targetX - this.scrollCamera.scrollX) * lerpFactor;
                this.scrollCamera.scrollY += (targetY - this.scrollCamera.scrollY) * lerpFactor;
                if (Math.abs(targetX - this.scrollCamera.scrollX) > 1 || Math.abs(targetY - this.scrollCamera.scrollY) > 1) {
                    requestAnimationFrame(smoothFollow);
                } else {
                    this.scrollCamera.startFollow(this.localPlayerCharacter);
                }
            }
        };
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) {
                manualCameraControl = true;
                this.scrollCamera.stopFollow();
                this.scrollCamera.setBounds(130, 0, this.twelve.widthInPixels, this.twelve.heightInPixels);
                const deltaX = pointer.prevPosition.x - pointer.position.x;
                const deltaY = pointer.prevPosition.y - pointer.position.y;
                this.scrollCamera.scrollY -= deltaY * -1.2;
                this.scrollCamera.scrollX -= deltaX * -1;
                const tilemapHeight = this.twelve.heightInPixels;
                const tilemapWidth = this.twelve.widthInPixels;
                this.scrollCamera.scrollX = Phaser.Math.Clamp(this.scrollCamera.scrollX, 0, tilemapWidth - this.scrollCamera.width);
                this.scrollCamera.scrollY = Phaser.Math.Clamp(this.scrollCamera.scrollY, 0, tilemapHeight - this.scrollCamera.height);
                clearTimeout(followTimeout);
                followTimeout = setTimeout(() => {
                    manualCameraControl = false;
                    smoothFollow();
                }, 2000);
            }
        });
    }

    smoothSetBounds(newX: number, newY: number, newWidth: number, newHeight: number, duration: number) {
        const bounds = this.scrollCamera.getBounds();
        const startX = bounds.x;
        const startY = bounds.y;
        const startWidth = bounds.width;
        const startHeight = bounds.height;
        const startTime = performance.now();
        const animate = (time: number) => {
            const progress = Phaser.Math.Clamp((time - startTime) / duration, 0, 1);
            const lerp = (start: number, end: number) => start + (end - start) * progress;
            this.scrollCamera.setBounds(
                lerp(startX, newX),
                lerp(startY, newY),
                lerp(startWidth, newWidth),
                lerp(startHeight, newHeight)
            );
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    update() {}
}
