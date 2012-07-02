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
		monster: this.modelpath+"monster.js",
	};
	// důležité: pro některé funkce musí mít textury rozměry power of two, tedy 2,4,8,16,32,64, ...
	this.textures = {
		steel: this.texturepath+"Steel_Texture2.jpg",
	};
}
Level.prototype = new Loader();

Level.prototype.afterLoad = function (){
	this.objects.push( new SolidObject(this.models.lamp, 0, 0, {
		scale: new THREE.Vector3(100,100,100),
	}) );
	for(var i=2;i--;){
		var monster = new SolidObject(this.models.monster, 1000*Math.random()-500, 1000*Math.random()-500, {
			scale: new THREE.Vector3(0.1,0.1,0.1),
			interpolace: 50,
			startingAnim: "walking",
			modelAnimations: {
		        // štěpán chce animovat i stání, good luck
		        standing: [1,1],
		        walking: [1,23]
		    }
		})
		this.objects.push( monster );

	}
	this.objects.push( new Environment(this.textures.steel, 0, 0, 0, 2400, 1200, false) );

	// todo: udělat to obecný a hezký -> světlo = lampa
	var light = new THREE.PointLight("0xFFFFFF", 10);
	light.position.z = 10
	light.position.x = 100
	
	this.objects.push( {mesh: light});
};

var level = new Level();