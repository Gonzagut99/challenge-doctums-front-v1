import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
// You can write more code here

/* START OF COMPILED CODE */

export class LevelOne extends Scene {

	constructor() {
		super("LevelOne");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	
	/* START-USER-CODE */

	// Write your code here

	editorPreload(){
		this.load.pack("asset-pack", "public/assets/asset-pack.json");
	}
	editorCreate() {
		EventBus.emit('current-scene-ready', this);
	}

	changeScene ()
    {
        this.scene.start('MainMenu');
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
