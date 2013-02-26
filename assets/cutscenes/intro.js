{
	scenes : {
		0 : [
			{
				image : game.textures.get("intro1"),
				x:0,
				y:0,
				width: game.gui.width,
				height: game.gui.height,
				velocity : new THREE.Vector2(0.1,0),
			},
		],
		2000 : [
			{
				image : game.textures.get("intro2"),
				x:0,
				y:0,
				width: game.gui.width,
				height: game.gui.height,
				velocity : new THREE.Vector2(-0.1,0),
			},
		],
		4000 : [
			{
				image : game.textures.get("intro3"),
				x:0,
				y:0,
				width: game.gui.width,
				height: game.gui.height,
				velocity : new THREE.Vector2(0.1,0),	
			},
		],
	},
	subtitles : {
		0 : "First picture",
		2000 : "Second picture",
		4000 : "Third picture",
	},
	script : {
		0 : function (){console.log("začátek intra");},
		6000 : function (){
			game.gui.switchGUI("inGame");
			game.jukebox.stopAll();
			console.log("konec intra");
		}
	},
}