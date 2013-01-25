function Level(){

	this.objects = {
		
	};
	
	this.models = {
		linka: this.modelpath+"bar_z/bar.js",
		panacek: this.modelpath+"panacek.js",
	};
	
	this.texures = {};
	
	this.sounds = {};
	
	this.cutscenes = {};
	
};
Level.prototype = new Loader();

Level.prototype.afterLoad = function (){
	var linka = new SolidObject({
		model:this.models.linka,
		position:new THREE.Vector3(200,0,0),
		scale:new THREE.Vector3(100,100,100),
	});
	this.add(linka);
	
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
	
	game.gui.switchGUI("inGame");
};