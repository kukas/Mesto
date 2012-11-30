{
	scenes: {
		0: [{
			image: game.textures.get("cs_test_bg"),
			x: game.gui.width-1632, y: 0,
			width: 1632, height: 920,
			velocity: new THREE.Vector2(0.4, 0),
			// acceleration: new THREE.Vector2(-0.001)
		},{
			image: game.textures.get("jirka"),
			x: -100, y: game.gui.height-778,
			width: 918, height: 778,
			velocity: new THREE.Vector2(0.7, 0),
		}],
		3800: [{
			image: game.textures.get("city"),
			x: 0, y: -150,
			width: 700*2, height: 522*2,
			velocity: new THREE.Vector2(-0.2, 0),
		},{
			image: game.textures.get("jirka_smile"),
			x: game.gui.width/3, y: game.gui.height-392*1.3,
			width: 584*1.3, height: 392*1.3,
			velocity: new THREE.Vector2(-0.5, 0),
		},{
			image: game.textures.get("ruka"),
			x: game.gui.width/3-100, y: game.gui.height-313*1.3,
			width: 255*1.3, height: 313*1.3,
			velocity: new THREE.Vector2(-0.6, 0),
		}],
		7500: [{
			image: game.textures.get("city"),
			x: 0, y: -150,
			width: 700*2, height: 522*2,
		}],
	},
	subtitles: {
		0: "I was wandering if mesto would be as good as we imagined",
		3800: "and then I realised it would!",
		7500: "The end"
	},
	dubbing: {
		0: game.jukebox.get("solarFields"),
		1: game.jukebox.get("dub1"),
	},
	script: {
		0: function(){
			console.log("start cutscény");
		},
		10000: function(){
			console.log("konec cutscény");
			game.gui.switchGUI("inGame");
			game.jukebox.stopAll();
		}
	},
}