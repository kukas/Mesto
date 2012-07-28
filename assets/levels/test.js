function Level(){

	this.objects = {};

	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.set(0,0,600);
	
	this.models = {
		lamp: this.modelpath+"lamp/untitled.js",
		kostka: this.modelpath+"anim.js",
		monster: this.modelpath+"monster.js",
	};
	// důležité: pro některé funkce musí mít textury rozměry power of two, tedy 2,4,8,16,32,64, ...
	this.textures = {
		steel: this.texturepath+"Steel_Texture2.jpg",
	};

	this.sounds = {
		solarFields: this.musicpath+"Circles_Of_Motion.mp3",
	}
}
Level.prototype = new Loader();

Level.prototype.afterLoad = function (){
	// for(var i=2;i--;){
	// 	var monster = new Thing(this.models.monster, {
	// 		position: new THREE.Vector3(1000*Math.random()-500, 1000*Math.random()-500, 0),
	// 		scale: new THREE.Vector3(0.1,0.1,0.1),
	// 		animation: {
	// 			interpolace: 50,
	// 			startingAnim: "walking",
	// 			modelAnimations: {
	// 				// štěpán chce animovat i stání, good luck
	// 				standing: [1,1],
	// 				walking: [1,23]
	// 			},
	// 		}
	// 	})
	// 	this.add( monster );
	// }

	var monster = new Character(this.models.monster, {
		position: new THREE.Vector3(1, 1, 0),
		scale: new THREE.Vector3(0.1, 0.1, 0.1),
		animation: {
			interpolation: 50,
			startingAnimation: "standing",
			modelAnimations: {
				// štěpán chce animovat i stání, good luck
				standing: [6,6],
				walking: [1,23]
			},
		}
	})
	this.add( monster, "monster" );
	
	this.add( new Environment(this.textures.steel, 0, 0, 0, 2400, 1200, false) );
	
	this.add( new Lamp(this.models.lamp, {
			scale: new THREE.Vector3(100,100,100),
			position: new THREE.Vector3(0,0,0),
			light:{
				color:0xffffff,
				position: new THREE.Vector3(0.65,2,0),
				intensity:1,
			}
		}
		));
	
	// spustí hudbu
	// this.sounds.solarFields.play();
};
// umožní nám důležité objekty pojmenovávat (ty, se kterými budeme chtít dále pracovat i po pouhém přidání do scene - třeba player)
Level.prototype.add = function(obj, name) {
	if(name === undefined){
		var last = Object.keys(this.objects).length;
		while( this.objects[last] !== undefined ){
			last++;
		}
		this.objects[ last ] = obj;
	}
	else{
		this.objects[ name ] = obj;
	}
};

var level = new Level();