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
		jirka: this.texturepath+"cutscenes/test/jirka.png",
		jirka_smile: this.texturepath+"cutscenes/test/jirka_smile.png",
		ruka: this.texturepath+"cutscenes/test/ruka.png",
		city: this.texturepath+"cutscenes/test/city.png",
	};

	this.sounds = {
		solarFields: this.musicpath+"Circles_Of_Motion.mp3",
		dub1: this.soundpath+"dub1.mp3",
	};

	this.cutscenes = {
		test: this.cutscenepath+"test.js"
	}
	this.name = "test";
}
Level.prototype = new Loader();

Level.prototype.afterLoad = function (poziceHrace){
	if(poziceHrace === undefined) var poziceHrace = new THREE.Vector3(0,0,0);
	
	var dvere = new Door(new THREE.Vector3(-300,200,2),{type:"rect",width:100,height:100},"vnitrek",true,new THREE.Vector3(0,-360,0));
	this.add(dvere);
	
	var monster = new SolidObject({
		model: this.models.monster,
		position: new THREE.Vector3(200,100, 0),
		rotation: new THREE.Vector3(0,1,0),
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
	
	monster.addAction("onCollision",1,function (){return true;},function (monst_obj){
		monst_obj.removeAction(1);
		monst_obj.addAction("onActionKeyDown",function(){return true;},function (){
			game.gui.guis.cutscene.switchCutscene("test");
			monst_obj.actions.onActionKeyDown = [];
			})
		})
	// atributy předávané reakční funkci jsou [mateřský objekt(v tomto případě monster), druhý kolizní objekt (zpravidla hýbající se postava)]
	
	var spalovna = new SolidObject({
		model: this.models.spalovna,
		position: new THREE.Vector3(-250,400, 0),
		// rotation: new THREE.Vector3(0, 1, 0), // oops, kolize mad?
		rotation: new THREE.Vector3(0, Math.PI, 0),
		scale: new THREE.Vector3(100,100,100),
		}
	);
	this.add( spalovna );
		
	

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
	})
	this.add( player, "player" );
			
	vzkaz = {};
		
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
	topdown_camera.position.set(poziceHrace.x,poziceHrace.y,500);

	var vyber = {
		"third_person": third_person_camera,
		"first_person": first_person_camera,
		"rotating_topdown": rotating_topdown_camera,
		"topdown": topdown_camera
	}
	this.camera = vyber[ game.settings.graphics.camera ];
	
	this.add( new Environment(this.textures.steel, 0, 0, 0, 2400, 1200, false) );

	this.add( new Environment(this.textures.cs_test_bg, 0, 0, -100, 5800, 3200, true) );
	
	this.add( new Lamp({
			model: this.models.lamp,
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

	this.add( new Lamp({
			model: this.models.lamp,
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