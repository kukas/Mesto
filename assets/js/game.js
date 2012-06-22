function Game(){
	var _this = this;
	this.levelsPath = "./assets/levels/";

	// zavede některé důležité objekty
	this.eventhandler = new Eventhandler();
	this.eventhandler.addKeyboardControl(32, false, function(){
		_this.load("test");
	} )
	// TODO: až budou, tak odkomentovat :)
	// this.textures = new Textures();
	// this.jukebox = new Jukebox();
	// this.models = new Models();
	// this.gui = new GUI();
	// this.progress = new Progress();
	// this.statistics = new Statistics();

	// WUT objekty, které nevím jestli loadnu tady nebo jinde
	// this.quests = new Quests();
	// this.dialogs = new Dialogs();

	// Scéna s objekty
	this.scene = new THREE.Scene();
	// Jediná kamera ve hře (I HOPE SO)
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 )
	this.camera.position.z = 1000;
	this.scene.add( this.camera );

	// připraví jednotlivé canvasy
	this.webgl = new THREE.WebGLRenderer();
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");


	// pokud se změní velikost okna prohlížeče, změní velikost canvasů
	window.addEventListener( "resize", function(){
		_this.resizeCanvas();
	}, true );
	// změní velikost canvasů
	this.resizeCanvas();
}
Game.prototype.load = function(levelName) {
	var _this = this;
	var levelScript = document.createElement("script");
	levelScript.src = this.levelsPath + levelName + ".js";
	levelScript.addEventListener( "load", function(){
		_this.levelLoad();
	}, true )
	document.body.appendChild(levelScript)
};

Game.prototype.levelLoad = function() {
	for(var i in level.objects){
		this.scene.add(level.objects[i]);
	}
};

Game.prototype.init = function() {
	// zařídí, aby canvas byl nad WebGL
	this.webgl.domElement.style.zIndex = "1";
	this.canvas.style.zIndex = "2";
	// přidá je do stránky
	document.body.appendChild( this.webgl.domElement );
	document.body.appendChild( this.canvas );
	// spustí render smyčku
	this.render();
};

Game.prototype.render = function() {
	stats.begin();
	var _this = this;
	requestAnimationFrame( function(){
		_this.render();
	} );

	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
	this.webgl.render( this.scene, this.camera );
	stats.end();
};

// funkce volaná při změně velikosti okna
Game.prototype.resizeCanvas = function() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	// Canvas s GUI
	this.canvas.width = w;
	this.canvas.height = h;
	// WebGL canvas
	this.webgl.setSize( w, h );
	// Aby se nezkosil obraz
	this.camera.aspect = w/h;
	this.camera.updateProjectionMatrix();
};