// import { globalWebSocketService } from "~/services/ws";
import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { changeDirection, sameDirection, dayPositions } from '../../../public/game/tilemap/positions';
import { diceResult } from '~/routes/game+';
import { emitter } from "~/utils/emitter.client";
/* START OF COMPILED CODE */
export class MainScene extends Phaser.Scene {
    [key: string]: any;
    private twelve!: Phaser.Tilemaps.Tilemap;
    private character!: Phaser.Physics.Arcade.Sprite;
    private casillasGroup!: Phaser.Physics.Arcade.StaticGroup;
    private lastHorizontalDirection: "left" | "right" = "right";
    private isStopped: boolean = false;
    private diceRollResult: number = 0;
    private currentCasillaId?: number;
    private changeDirection: any[];
    private dayPositions: any[];
    private sameDirection: any[];
    private upwardPointIds: number[] = [];
    private oppositeDirectionIds: number[] = [];
    private visitedCasillas: Set<number> = new Set();
    private direction: "up" | "horizontal" = "horizontal";
    private turns_order: any[] = [];
    private nextExpectedId: number = 1;
    private isFirstRollGame: boolean = true;
    private avatarId: number | null = null;
    private diceResult: number | null = null;

    constructor() {
        super({ key: 'MainScene', physics: { arcade: { debug: false } } });
        this.changeDirection = changeDirection;
        this.dayPositions = dayPositions;
        this.sameDirection = sameDirection;
    }

    init(data: { avatarId: string | number }) {
        this.avatarId = Number(data.avatarId) || 0;
        console.log("Cargando personaje con ID:", this.avatarId);
    }

    preload() {
        //const avatarId = 0;
        const avatarId = this.avatarId;
        console.log('Cargando personaje con ID:', avatarId);

        // Generar rutas dinámicas
        [1, 2, 3, 4].forEach((avatarId) => {
        const animJsonPath = `game/animations/character_${avatarId}/character_${avatarId}_anim.json`;
        const atlasPath = `game/sprites/character_${avatarId}.png`;
        const atlasJsonPath = `game/animations/character_${avatarId}/character_${avatarId}_atlas.json`;

        // Cargar el archivo JSON de animaciones y el atlas
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
        // pisos_1
        twelve.createLayer("pisos", ["tileset-offices"], mapOffsetX, mapOffsetY);
        // paredes_1
        const wall = twelve.createLayer("paredes", ["tileset-offices", "tematic"], mapOffsetX, mapOffsetY);
        if (wall) { wall.setDepth(12); }
        // decoracion
        const decoration = twelve.createLayer("decoracion2", ["tematic", "tileset-offices"], mapOffsetX, mapOffsetY);
        if (decoration) { decoration.setDepth(13); }
        // decoracion_1
        const decoration2 = twelve.createLayer("decoracion", ["tileset-offices", "tematic"], mapOffsetX, mapOffsetY);
        if (decoration2) {
            decoration2.setDepth(14);
        }
        this.twelve = twelve;
    }

    /* START-USER-CODE */
    create(data: { avatarId: string; diceResult: any }): void {
        this.promptDiceRoll();
        this.editorCreate();
        this.isStopped = false;
        let startX = 150;
        let startY = 6050;
        const avatarId = this.avatarId;

        if (avatarId === 1) {
            startX = 150;
            startY = 5950;
        } else if (avatarId === 2) {
            startX = 115;
            startY = 5980;
        } else if (avatarId === 3) {
            startX = 80;
            startY = 5950;
        } else if (avatarId === 4) {
            startX = 80;
            startY = 5980;
        }
        console.log('Personaje activo:', avatarId);
        const animData = this.cache.json.get(`character_${avatarId}_anim`);

        if (!animData || !animData.anims) {
            console.error(`No se encontraron datos de animación válidos para el avatarId ${avatarId}`);
            return;
        }

        animData.anims.forEach((animation: any) => {
            const frames = animation.frames.map((frameData: { key: string, frame: string }) => ({
                key: `character_${avatarId}`, 
                frame: frameData.frame,
            }));
            if (!this.anims.exists(animation.key)) {
                console.log(`Creando animación: ${animation.key} para avatarId ${avatarId}`);
                this.anims.create({
                    key: animation.key,
                    frames: frames,
                    frameRate: animation.frameRate,
                    repeat: animation.repeat,
                });
            }
        });

        this.character = this.physics.add.sprite(startX, startY, `character_${avatarId}`);
        this.character.setOrigin(1, 0.5);
        this.character.setDepth(10);
        this.character.anims.play('idle', true);
        this.cameras.main.setBounds(0, 0, this.twelve.widthInPixels, this.twelve.heightInPixels);
        this.cameras.main.startFollow(this.character);
        this.cameras.main.setZoom(1);
        this.casillasGroup = this.physics.add.staticGroup();
        this.changeDirection = changeDirection;
        this.dayPositions = dayPositions;
        this.sameDirection = sameDirection;

        this.dayPositions.forEach((pos) => {
            const casilla = this.casillasGroup.create(pos.x, pos.y, pos.type);
            casilla.setData('id', pos.id);
            if (pos.id === 400) {
                casilla.setAlpha(0);
            }
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

        this.physics.add.overlap(this.character, this.casillasGroup, this.handleCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.lastHorizontalDirection = "left";
        this.visitedCasillas = new Set();
        this.nextExpectedId = 1;
        this.initializeSpecialTiles();
        EventBus.emit('current-scene-ready', this);
        emitter.emit('renderPlayersOnMap', this.turns_order);
    }

    renderPlayers(players: any[]) {
        // Lógica para renderizar hasta 4 personajes
        players.slice(0, 4).forEach((player, index) => {
            const { playerId, avatarId, name } = player;
            const avatarKey = `character_${avatarId}`; 
            const xPosition = 100 + index * 100;
            const yPosition = 200;

            // Crear el sprite del personaje con física
            const avatar = this.physics.add.sprite(xPosition, yPosition, avatarKey);
            avatar.setData('playerId', playerId);
            avatar.setData('avatarId', avatarId);

            // Asignar animación inicial (idle)
            if (this.anims.exists('idle')) {
                avatar.anims.play('idle', true);
            } else {
                console.warn(`Animación 'idle' no encontrada para el avatar ${avatarKey}`);
            }
            this[`player_${playerId}`] = avatar;
        });
    }



    promptDiceRoll(): void {
        this.time.delayedCall(1000, () => {
            this.input.keyboard?.once('keydown-RIGHT', () => {
                const avatarId = this.avatarId ?? 0; 
                const userDiceResult = diceResult.find((res) => res.avatarId === avatarId);
    
                // Obtén el total del resultado encontrado o 0 si no existe
                const diceRoll = userDiceResult ? userDiceResult.total : 0;
    
                console.log("Total de dados para avatarId:", avatarId, "es", diceRoll);
    
                if (!isNaN(diceRoll)) {
                    this.setDiceRoll(diceRoll);
                    this.isStopped = false;
                    if (this.isFirstRollGame) {
                        this.isFirstRollGame = false;
                        this.moveCharacterForward();
                    } else {
                        this.moveCharacterToTarget();
                    }
                }
            });
        });
    }

    // Función para establecer el resultado del dado
    setDiceRoll(value: number): void {
        if (this.currentCasillaId === undefined || this.currentCasillaId === null) {
            this.currentCasillaId = 0;
        }
        this.diceRollResult = this.currentCasillaId + value;
        console.log(`Nuevo objetivo de casilla: ${this.diceRollResult}`);
    }

    // Función para obtener la casilla actual del personaje
    getCurrentCasillaId(character: Phaser.GameObjects.Sprite): number | null {
        const tolerance = 14;
        const casilla = this.casillasGroup.getChildren().find(casilla =>
            Phaser.Math.Distance.Between(character.x, character.y, (casilla as Phaser.GameObjects.Sprite).x, (casilla as Phaser.GameObjects.Sprite).y) < tolerance
        ) as Phaser.GameObjects.Sprite;
        return casilla ? casilla.getData('id') : null;
    }

    // Manejo de colisiones
    handleCollision(_: any, casilla: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body): void {
        if (this.isStopped) return;
        const casillaId = (casilla as Phaser.GameObjects.GameObject).getData('id');
        const tolerance = 14;
        const withinTolerance = Math.abs(Math.round(this.character.x) - (casilla as Phaser.GameObjects.Sprite).x) < tolerance &&
            Math.abs(Math.round(this.character.y + this.character.height / 2) - (casilla as Phaser.GameObjects.Sprite).y) < tolerance;

        if (!withinTolerance || this.visitedCasillas.has(casillaId)) return;
        console.log('Colisión con casilla ID:', casillaId);

        if (casillaId === this.diceRollResult || casillaId === 360) {
            this.stopCharacter(casillaId);
            return;
        }


        if (this.isSpecialTile(casillaId)) {
            this.handleSpecialTileMovement(casillaId);
            this.visitedCasillas.add(casillaId);
            return;
        }
        this.continueCurrentDirection();

        this.visitedCasillas.add(casillaId);
    }

    // Función para mover al personaje hacia la casilla objetivo
    moveCharacterToTarget(): void {

        const targetId = this.diceRollResult;
        console.log(`Buscando casilla con ID: ${targetId}`);

        const targetCasilla = this.casillasGroup.getChildren().find(
            casilla => casilla.getData('id') === targetId
        );

        if (!targetCasilla) {
            console.error(`No se encontró la casilla con ID: ${targetId}`);
            return;
        }

        const directionX = (targetCasilla as Phaser.GameObjects.Sprite).x > this.character.x ? 1 : -1;
        const directionY = (targetCasilla as Phaser.GameObjects.Sprite).y > this.character.y ? 1 : -1;

        this.character.setVelocityX(200 * directionX);

        if (directionX === 1 || directionX === -1) {
            if (directionX === 1) {
                this.character.anims.play('walk_right', true);
            } else {
                this.character.anims.play('walk_left', true);
            }
        } else {
            if (directionY === 1) {
                this.character.anims.play('walk_forward', true);
            } else {
                this.character.anims.play('walk_backward', true);
            }
        }

        console.log(`Moviendo al personaje hacia la casilla ID: ${targetId}`);
    }

    // Inicializa las casillas especiales
    initializeSpecialTiles() {
        this.changeDirection = this.changeDirection
        this.sameDirection = this.sameDirection
        this.dayPositions = this.dayPositions
        // Filtra IDs de casillas especiales
        this.upwardPointIds = this.dayPositions.filter(pos => pos.id % 7 === 0 && pos.id !== 1).map(pos => pos.id);
        this.oppositeDirectionIds = this.dayPositions.filter(pos => (pos.id - 1) % 7 === 0 && pos.id !== 1).map(pos => pos.id);
    }

    // Detiene al personaje en la casilla objetivo
    stopCharacter(casillaId: number) {
        const character = this.character as Phaser.Physics.Arcade.Sprite;
        character.setVelocityX(0);
        character.setVelocityY(0);
        character.anims.play('idle', true);
        this.isStopped = true;
        this.currentCasillaId = casillaId;
        this.promptDiceRoll();
        console.log(`Personaje detenido en la casilla ID: ${casillaId}`);
    }

    // Verifica si la casilla actual es especial
    isSpecialTile(casillaId: number) {
        return (
            this.changeDirection.some(pos => pos.id === casillaId) ||
            this.sameDirection.some(pos => pos.id === casillaId) ||
            this.upwardPointIds.includes(casillaId) ||
            this.oppositeDirectionIds.includes(casillaId)
        );
    }

    // Manejo de movimiento en casillas especiales
    handleSpecialTileMovement(casillaId: number) {
        const character = this.character;

        if (this.sameDirection.some(pos => pos.id === casillaId) && casillaId !== 369) {
            // Movimiento a la izquierda
            this.lastHorizontalDirection = "left";
            this.moveCharacterLeft();
            return;
        } else if (this.direction === "up" && casillaId === 369) {
            // Movimiento a la derecha
            this.lastHorizontalDirection = "right";
            this.moveCharacterLeft();
            return;
        }
        if (this.oppositeDirectionIds.includes(casillaId) && casillaId !== 92 && casillaId !== 120) {
            console.log(`Cambio de dirección opuesta detectado en casilla ID: ${casillaId}`);
            if (casillaId === 121) {
                this.lastHorizontalDirection = "right";
                this.moveCharacterRight();
            }
            this.updateDirection(character);
            return;
        }

        //Evaluacion de casillas especiales
        if (this.isUpwardOrChangeDirectionTile(casillaId)) {
            console.log(`Movimiento hacia arriba o cambio de dirección en casilla ID: ${casillaId}`);

            if (this.direction !== "up") {
                this.direction = "up";
                character.setVelocityX(0);
                character.setVelocityY(-200);
                character.anims.play('walk_backward', true);
            }
            else if (casillaId === 121) {
                // Caso especial para la casilla 121: Forzar dirección a la derecha
                console.log("Moviendo a la derecha desde casilla 121");
                this.lastHorizontalDirection = "right";
                this.moveCharacterRight();
            }
            else if (this.lastHorizontalDirection === "right") {
                console.log("Moviendo a la derecha");
                this.lastHorizontalDirection = "right";
                this.moveCharacterRight();
            }
            else if (this.lastHorizontalDirection === "left" && casillaId !== 331) {
                console.log("Moviendo a la izquierda");
                this.lastHorizontalDirection = "left";
                this.moveCharacterLeft();
            } else {
                this.lastHorizontalDirection = "right";
                this.moveCharacterRight();
            }

            return;
        }
        this.continueCurrentDirection();
    }


    // Función para verificar si la casilla actual es de cambio de dirección o hacia arriba
    isUpwardOrChangeDirectionTile(casillaId: number) {
        return this.upwardPointIds.includes(casillaId) || this.changeDirection.some(pos => pos.id === casillaId);
    }

    // Función para actualizar la dirección del personaje
    updateDirection(character: Phaser.Physics.Arcade.Sprite) {
        if (this.lastHorizontalDirection === "right") {
            this.lastHorizontalDirection = "left";
            this.moveCharacterLeft();
        }
        else {
            this.lastHorizontalDirection = "right";
            this.moveCharacterRight();
        }
        character.setVelocityY(0);
        this.direction = "horizontal";
    }


    // Función para continuar en la dirección actual
    continueCurrentDirection() {
        const character = this.character;
        if (this.lastHorizontalDirection === "left") {
            character.setVelocityX(-400);
            character.anims.play('walk_left', true);
        } else {
            character.setVelocityX(400);
            character.anims.play('walk_right', true);
        }
        character.setVelocityY(0);
        this.direction = "horizontal";
    }

    // Función para mover al personaje hacia la izquierda
    moveCharacterLeft() {
        console.log('Funcion Moviendo a la izquierda');
        const character = this.character as Phaser.Physics.Arcade.Sprite;
        character.setVelocityX(-400);
        character.setVelocityY(0);
        character.anims.play('walk_left', true);
        this.direction = "horizontal";
    }

    // Función para mover al personaje hacia la derecha
    moveCharacterRight() {
        const character = this.character as Phaser.Physics.Arcade.Sprite;
        character.setVelocityX(400);
        character.setVelocityY(0);
        character.anims.play('walk_right', true);
        this.direction = "horizontal";
    }

    restCharacter() {
        const character = this.character as Phaser.Physics.Arcade.Sprite;
        character.anims.play('rest', true);
        console.log(`Personaje descansando en la casilla ID: ${this.currentCasillaId}`);
        this.time.delayedCall(2000, () => {
            this.promptDiceRoll();
        });
    }

    moveCharacterForward(): void {
        const character = this.character as Phaser.Physics.Arcade.Sprite;
        character.setVelocityY(200);
        character.anims.play('walk_forward', true);
    }


    update() {
        const speed = 5
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
            this.cameras.main.scrollY += deltaY * 0.1;
            this.cameras.main.scrollX += deltaX * 0.1;
        });
    }


}
