function Level(){

	this.objects = {};
	
	this.models = {
		lamp: this.modelpath+"lamp/lamp.js",
		monster: this.modelpath+"monster.js",
		panacek: this.modelpath+"panacek.js",
		spalovna: this.modelpath+"spalovna/spalovna.js",
	};
	// důležité: pro některé funkce musí mít textury rozměry power of two, tedy 2,4,8,16,32,64, ...
	this.textures = {
		steel: this.texturepath+"steel_floor.jpg",

		cs_test_bg: this.texturepath+"cutscenes/test/bg.jpg",
		cs_test_fg: this.texturepath+"cutscenes/test/fg.png",
	};

	this.sounds = {
		solarFields: this.musicpath+"Circles_Of_Motion.mp3",
	};

	this.cutscenes = {
		test: this.cutscenepath+"test.js"
	}
}
Level.prototype = new Loader();

Level.prototype.afterLoad = function (){
	var monster = new Thing(this.models.monster, {
		position: new THREE.Vector3(200,100, 0),
		scale: new THREE.Vector3(0.1,0.1,0.1),
		animation: {
			boundingFrame: 1,

			interpolation: 50,
			startingAnimation: "walking",
			modelAnimations: {
				standing: [1,1],
				walking: [1,23]
			},
		}
	})
	this.add( monster );
	
	var spalovna = new Thing(this.models.spalovna, {
		position: new THREE.Vector3(-250,400, 0),
		// rotation: new THREE.Vector3(0, 1, 0), // oops, kolize mad?
		rotation: new THREE.Vector3(0, Math.PI, 0),
		scale: new THREE.Vector3(100,100,100),
		}
	);
	this.add( spalovna );

	var player = new Character(this.models.panacek, {
		position: new THREE.Vector3(0, 0, 0),
		scale: new THREE.Vector3(50,50,50),
		rotation: new THREE.Vector3(0,Math.PI,0),
		speed: 2,
		animation: {
			boundingFrame: 1,

			interpolation: 20,
			startingAnimation: "standing",
			modelAnimations: {
				standing: [1,1],
				walking: [5,75],
				nodding: [80,110],
				falling: [110,190],
			},
		}
	})
	this.add( player, "player" );

	// jen takové blbinky:
	var third_person_camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	player.mesh.add( third_person_camera );
	third_person_camera.position.set(0,5,-4);
	third_person_camera.rotation.y = Math.PI;
	third_person_camera.rotation.x = 0.3;

	var first_person_camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	player.mesh.add( first_person_camera );
	first_person_camera.position.set(0,2,0);
	first_person_camera.rotation.y = Math.PI;

	var rotating_topdown_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	player.mesh.add( rotating_topdown_camera );
	rotating_topdown_camera.position.set(0,10,0);
	rotating_topdown_camera.rotation.y = Math.PI;
	rotating_topdown_camera.rotation.x = Math.PI/2;

	var topdown_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	// game.scene.add( topdown_camera );
	topdown_camera.position.set(0,0,500);

	var vyber = {
		"third_person": third_person_camera,
		"first_person": first_person_camera,
		"rotating_topdown": rotating_topdown_camera,
		"topdown": topdown_camera
	}
	this.camera = vyber[ game.settings.graphics.camera ];
	
	this.add( new Environment(this.textures.steel, 0, 0, 0, 2400, 1200, false) );

	this.add( new Environment(this.textures.cs_test_bg, 0, 0, -100, 5800, 3200, true) );
	
	this.add( new Lamp(this.models.lamp, {
			scale: new THREE.Vector3(100,100,100),
			position: new THREE.Vector3(325,-31,0),
			light:{
				color: 0xd5def4, // zářivka
				// color: 0xffc560, // žárovka
				position: new THREE.Vector3(0.65,2,0),
				intensity: 1, // intenzita světla
				distance: 0, // něco jako intenzita/10000, ale více to ovlivňuje odrazy na povrchu (prostě dafuq)
				exponent: 0.5 // jak moc se světlo rozšiřuje
			}
		}
		));

	this.add( new Lamp(this.models.lamp, {
			scale: new THREE.Vector3(100,100,100),
			position: new THREE.Vector3(-454,188,0),
			light:{
				color: 0xffc560, // žárovka
				position: new THREE.Vector3(0.65,2,0),
				intensity: 2, // intenzita světla
				distance: 0, // něco jako intenzita/10000, ale více to ovlivňuje odrazy na povrchu (prostě dafuq)
				exponent: 7 // jak moc se světlo rozšiřuje
			}
		}
		));
	
	// spustí hudbu
	// this.sounds.solarFields.play();
	// nahraje srávné gui
	game.gui.switchGUI("inGame");
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