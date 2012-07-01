function Level(){

	this.objects = [];

	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.set(0,0,600);
	
	// svetlo = new THREE.PointLight("0xdddddd", 3, 0);
	// svetlo.position.set(0,0,0);
	// this.objects.push(svetlo);

	this.models = {
		lamp: this.modelpath+"lamp/untitled.js",
		kostka: this.modelpath+"anim.js",
	};
	// důležité: pro některé funkce musí mít textury rozměry power of two, tedy 2,4,8,16,32,64, ...
	this.textures = {
		steel: this.texturepath+"Steel_Texture2.jpg",
	};
}
Level.prototype = new Loader();

Level.prototype.afterLoad = function (){
	this.objects.push( new SolidObject(this.models.lamp, 0, 0) );
	this.objects.push( new SolidObject(this.models.kostka, 100, 100, 25) );
	this.objects.push( new Environment(this.textures.steel, 0, 0, 0, 2400, 1200, false) );
};

var level = new Level();