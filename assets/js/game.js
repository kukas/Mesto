function Game(){
	var _this = this;
}
Game.prototype.init = function() {
	// připraví jednotlivé canvasy
	this.webgl = new THREE.WebGLRenderer();
	this.canvas = document.createElement("canvas");
	// zařídí, aby canvas byl nad WebGL
	this.webgl.domElement.style.zIndex = "1";
	this.canvas.style.zIndex = "2";
	// přidá je do stránky
	document.body.appendChild( this.webgl.domElement );
	document.body.appendChild( this.canvas );


	// zavede některé důležité objekty
	this.eventhandler = new Eventhandler( this.webgl );
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


	// three.js stuff, který jsem zatím línej dělat:
	// this.scene, this.camera, this.renderer

	// pokud se změní velikost okna prohlížeče, změní velikost canvasů
	window.addEventListener( "resize", function(){
		game.resizeCanvas();
	}, true );
	// změní velikost canvasů
	this.resizeCanvas();
};

// funkce volaná při změně velikosti okna
Game.prototype.resizeCanvas = function() {
	this.webgl.width = this.canvas.width = window.innerWidth;
	this.webgl.height = this.canvas.height = window.innerHeight;
	console.log("resizing")
};