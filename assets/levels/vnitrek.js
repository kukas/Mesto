function Level(){

	this.objects = {
		
	};
	
	this.models = {
		linka: this.modelpath+"bar_z/bar.js",
		panacek: this.modelpath+"panacek.js",
		lamp:this.modelpath+"lamp/lamp.js",
	};
	
	this.textures = {
		steel: this.texturepath+"steel_floor.jpg",
	};
	
	this.sounds = {};
	
	this.cutscenes = {};
	
	this.name = "vnitrek";
};
Level.prototype = new Loader();

Level.prototype.afterLoad = function (poziceHrace){
	//game.gui.guis.cutscene.switchCutscene("test");
	
	var dvere = new Door(
		new THREE.Vector3(0,-360,2),
		{type:"rect",width:100,height:100},
		"test",
		true,
		new THREE.Vector3(-300,200,0)
	);
	this.add(dvere);
	
	var linka = new SolidObject({
		model:this.models.linka,
		position:new THREE.Vector3(200,0,10),
		scale:new THREE.Vector3(30,30,30),
	});
	this.add(linka, "linka");
	
	var player = new Character({
		model: this.models.panacek,
		position: poziceHrace,
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
	});
	this.add( player, "player" );
	
	this.add( new Lamp({
			model: this.models.lamp,
			scale: new THREE.Vector3(100,100,100),
			position: new THREE.Vector3(-454,188,0),
			light:{
				color: 0xffc560, // žárovka
				position: new THREE.Vector3(0.65,2,0),
				intensity: 3, // intenzita světla
				distance: 0, // něco jako intenzita/10000, ale více to ovlivňuje odrazy na povrchu (prostě dafuq)
				exponent: 1 // jak moc se světlo rozšiřuje
			}
		}
	));
	
	this.add( new Floor(this.textures.steel,1000, 800, false), "floor" );
	
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
	topdown_camera.position.set(player.mesh.position.x,player.mesh.position.y,500);
	
	var vyber = {
		"third_person": third_person_camera,
		"first_person": first_person_camera,
		"rotating_topdown": rotating_topdown_camera,
		"topdown": topdown_camera
	};
	this.camera = vyber[ game.settings.graphics.camera ];
	
	game.gui.switchGUI("inGame");
};
var level = new Level();