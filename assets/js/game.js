function Game(){
	var _this = this;
	this.levelspath = "./assets/levels/";
	this.mode = 0;

	// zavede některé důležité objekty
	this.eventhandler = new Eventhandler( this );
	this.eventhandler.addKeyboardControl(32, false, function(){
		_this.load("test");
	} );

	// TODO: až budou, tak odkomentovat :)
	this.textures = new Textures();
	this.jukebox = new Jukebox();
	this.models = new Models();
	this.gui = new GUI( document.createElement("canvas") );
	// this.progress = new Progress();
	// this.statistics = new Statistics();

	// WUT objekty, které nevím jestli loadnu tady nebo jinde
	// this.quests = new Quests();
	// this.dialogs = new Dialogs();
	
	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 1000;

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

	// připraví jednotlivé canvasy
	this.webgl = new THREE.WebGLRenderer( { clearColor:0x111111, clearAlpha:1 } );
	this.canvas = document.createElement("canvas");

	this.objects = [];

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
	levelScript.src = this.levelspath + levelName + ".js";
	levelScript.addEventListener( "load", function(){
		_this.levelLoad(level);
	}, true )
	document.body.appendChild(levelScript)
};

Game.prototype.levelLoad = function(level) {
	var _this = this;

	this.level = level;
	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2(0x0000ff,0);
	this.camera = level.camera;
	this.scene.add( this.camera );
	this.gui.menu("inGame").load();
	
	this.models.loadModels( level.models, function(){
		_this.level.models = _this.models.models;

		_this.textures.loadTextures( level.textures, function(){
			_this.level.textures = _this.textures.textures;

			_this.jukebox.loadSounds( level.sounds, function(){
				_this.level.sounds = _this.jukebox.sounds;

				_this.level.afterLoad();
				_this.objectsAdd();
			} )
		} )
	} );
};

Game.prototype.objectsAdd = function() {
	this.objects = this.level.objects;
	for(var i in this.objects){
		this.objects[i].mesh !== undefined ? this.scene.add(this.objects[i].mesh) : false;
	}
};

Game.prototype.pause = function (){
	if(this.mode == 1){
		this.mode = 0;
		this.pauseTime = new Date().getTime();
	}
	else if(this.mode == 0){
		var cas = new Date().getTime();
		for(i in this.objects){
			if(this.objects[i].animation)
				this.objects[i].creationTime += cas-this.pauseTime;
		};
		game.mode = 1;
	}
};

Game.prototype.init = function() {
	// zařídí, aby canvas byl nad WebGL
	this.webgl.domElement.style.zIndex = "1";
	this.gui.canvas.style.zIndex = "2";
	// přidá je do stránky
	document.body.appendChild( this.webgl.domElement );
	document.body.appendChild( this.gui.canvas );
	// abychom pořád neklikali mezerník :)
	//this.load("test");
	this.gui.menu("mainM").load();
	// spustí render smyčku
	this.render();
};

Game.prototype.render = function() {
	stats.begin();
	var _this = this;
	requestAnimationFrame( function(){
		_this.render();
	} );
	this.gui.render();
	this.webgl.render( this.scene, this.camera );
	this.tick();
	
	stats.end();
};

Game.prototype.tick = function() {
	this.eventhandler.loop();
	if(game.mode == 1){
		this.gui.tick();
		for(var i in this.objects){
			this.objects[i].tick();
		}
	}
};

// funkce volaná při změně velikosti okna
Game.prototype.resizeCanvas = function() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	// Canvas s GUI
	this.gui.resize( w, h );
	// WebGL canvas
	this.webgl.setSize( w, h );
	// Aby se nezkosil obraz
	if(this.camera){
		this.camera.aspect = w/h;
		this.camera.updateProjectionMatrix();
	}
};