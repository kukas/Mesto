function Level(){

	this.objects = {};
	
	this.models = {
		lamp: this.modelpath+"lamp/untitled.js",
		kostka: this.modelpath+"anim.js",
		monster: this.modelpath+"monster.js",
		panacek: this.modelpath+"panacek.js",
	};
	// důležité: pro některé funkce musí mít textury rozměry power of two, tedy 2,4,8,16,32,64, ...
	this.textures = {
		steel: this.texturepath+"Steel_Texture2.jpg",

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
		position: new THREE.Vector3(1000*Math.random()-500, 1000*Math.random()-500, 0),
		scale: new THREE.Vector3(0.1,0.1,0.1),
		animation: {
			interpolation: 50,
			startingAnimation: "walking",
			modelAnimations: {
				standing: [1,1],
				walking: [1,23]
			},
		}
	})
	this.add( monster );


	var player = new Character(this.models.panacek, {
		position: new THREE.Vector3(250,0,0),
		scale: new THREE.Vector3(50,50,50),
		speed: 5,
		animation: {
			interpolation: 20,
			startingAnimation: "standing",
			modelAnimations: {
				standing: [1,2],
				walking: [5,75],
				nodding: [80,110],
				falling: [110,190],
			},
		}
	})
	this.add( player, "monster" );

	// jen takové blbinky:
	var third_person_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	player.mesh.add( third_person_camera );
	third_person_camera.position.set(0,5,-4);
	third_person_camera.rotation.y = Math.PI;

	var first_person_camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	player.mesh.add( first_person_camera );
	first_person_camera.position.set(0,2,0);
	first_person_camera.rotation.y = Math.PI;

	var topdown_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	player.mesh.add( topdown_camera );
	topdown_camera.position.set(0,10,0);
	topdown_camera.rotation.y = Math.PI;
	topdown_camera.rotation.x = Math.PI/2;

	this.camera = topdown_camera;
	
	this.add( new Environment(this.textures.steel, 0, 0, 0, 2400, 1200, false) );

	this.add( new Environment(this.textures.cs_test_bg, 0, 0, -100, 5800, 3200, true) );
	
	// todo: udělat to obecný a hezký -> světlo = lampa
	this.add( new Lamp(this.models.lamp, {
			scale: new THREE.Vector3(100,100,100),
			position: new THREE.Vector3(0,0,0),
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
			position: new THREE.Vector3(400,400,0),
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