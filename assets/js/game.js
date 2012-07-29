function Game(){
	var _this = this;
	this.levelspath = "./assets/levels/";

	// zavede některé důležité objekty
	this.eventhandler = new Eventhandler( this );
	this.eventhandler.addKeyboardControl(32, false, function(){
		_this.load("test");
	} );
	this.eventhandler.addKeyboardControl(82, false, false, function(){
		_this.camera.position.z += 10;
	} );
	this.eventhandler.addKeyboardControl(70, false, false, function(){
		_this.camera.position.z -= 10;
	} );
	// ovládání monstera
	this.eventhandler.addKeyboardControl(87, false, function(){
		_this.objects.monster.toggleAnim("standing");
	}, function(){ // W
		_this.objects.monster.toggleAnim("walking");
		_this.objects.monster.move(Math.PI/2);
		_this.camera.follow(_this.objects.monster.mesh);
	} );
	this.eventhandler.addKeyboardControl(83, false, function(){
		_this.objects.monster.toggleAnim("standing");
	}, function(){ // S
		_this.objects.monster.toggleAnim("walking");
		_this.objects.monster.move(-Math.PI/2);
		_this.camera.follow(_this.objects.monster.mesh);
	} );
	this.eventhandler.addKeyboardControl(65, false, function(){
		_this.objects.monster.toggleAnim("standing");
	}, function(){ // A
		_this.objects.monster.toggleAnim("walking");
		_this.objects.monster.rotate(0.05);
	} );
	this.eventhandler.addKeyboardControl(68, false, function(){
		_this.objects.monster.toggleAnim("standing");
	}, function(){ // D
		_this.objects.monster.toggleAnim("walking");
		_this.objects.monster.rotate(-0.05);
	} );


	this.eventhandler.addMouseControl(0,function(){
		// _this.camera.position.x = _this.eventhandler.mouse.projected.x/10;
		// _this.camera.position.y = _this.eventhandler.mouse.projected.y/10;
	});
	// TODO: až budou, tak odkomentovat :)
	this.textures = new Textures();
	this.jukebox = new Jukebox();
	this.models = new Models();
	this.gui = new GUI();
	// this.progress = new Progress();
	// this.statistics = new Statistics();
	this.settings = new Settings();

	// WUT objekty, které nevím jestli loadnu tady nebo jinde
	// this.quests = new Quests();
	// this.dialogs = new Dialogs();
	
	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

	// připraví jednotlivé canvasy
	this.webgl = new THREE.WebGLRenderer( { clearColor: 0x111111, clearAlpha: 1, maxLights: 20 } );
	// maxLights: 20 -> teď už o světla nouzi mít nebudeme
	this.webgl.shadowMapEnabled = this.settings.graphics.shadows.shadowMapEnabled;
	this.webgl.shadowMapSoft = this.settings.graphics.shadows.shadowMapSoft;

	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");

	this.objects = [];

	// pokud se změní velikost okna prohlížeče, změní velikost canvasů
	window.addEventListener( "resize", function(){
		_this.resizeCanvas();
	}, true );
}
Game.prototype.load = function(levelName) {
	var _this = this;

	var levelScript = document.createElement("script");
	levelScript.src = this.levelspath + levelName + ".js";
	levelScript.addEventListener( "load", function(){
		_this.levelLoad(level);
	}, true );
	document.body.appendChild(levelScript);
};

Game.prototype.levelLoad = function(level) {
	var _this = this;

	this.level = level;
	this.scene = new THREE.Scene();
	this.camera = level.camera;
	this.scene.add( this.camera );

	// jen takový malý návrh:
	// this.gui.activate("loader")
	
	this.models.loadModels( level.models, function(){
		_this.level.models = _this.models.models;
		// this.gui.loader.setProgress(33) // procenta

		_this.textures.loadTextures( level.textures, function(){
			_this.level.textures = _this.textures.textures;
			// this.gui.loader.setProgress(66)

			_this.jukebox.loadSounds( level.sounds, function(){
				_this.level.sounds = _this.jukebox.sounds;
				// this.gui.loader.setProgress(100)

				_this.level.afterLoad();
				_this.objectsAdd();

				// změní velikost canvasů
				_this.resizeCanvas();
			} )
		} )
	} );
};

Game.prototype.checkCollision = function(obj1, obj2) {
	return
};

Game.prototype.objectsAdd = function() {
	this.objects = this.level.objects;
	for(var i in this.objects){
		this.objects[i].mesh !== undefined ? this.scene.add(this.objects[i].mesh) : false;
	}
};

Game.prototype.init = function() {
	// zařídí, aby canvas byl nad WebGL
	this.webgl.domElement.style.zIndex = "1";
	this.canvas.style.zIndex = "2";
	// přidá je do stránky
	document.body.appendChild( this.webgl.domElement );
	document.body.appendChild( this.canvas );
	// abychom pořád neklikali mezerník :)
	this.load("test");
	// this.gui.menu("mainM").load();
	// spustí render smyčku
	this.render();
};

Game.prototype.render = function() {
	stats.begin();
	var _this = this;
	requestAnimationFrame( function(){
		_this.render();
	} );
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.webgl.render( this.scene, this.camera );
	this.tick();
	
	stats.end();
};

Game.prototype.tick = function() {
	this.eventhandler.loop();
	for(var i in this.objects){
		this.objects[i].tick();
	}
};

// funkce volaná při změně velikosti okna
Game.prototype.resizeCanvas = function() {
	if(this.settings.graphics.resolution.width != "auto")
		var w = this.settings.graphics.resolution.width;
	else
		var w = window.innerWidth;

	if(this.settings.graphics.resolution.height != "auto")
		var h = this.settings.graphics.resolution.height;
	else
		var h = window.innerHeight;

	// Canvas s GUI
	this.canvas.width = w;
	this.canvas.height = h;
	// WebGL canvas
	this.webgl.setSize( w, h );
	// Aby se nezkosil obraz
	if(this.camera){
		this.camera.aspect = w/h;
		this.camera.updateProjectionMatrix();
	}
};

THREE.Camera.prototype.follow = function(object) {
	this.position.x = object.position.x;
	this.position.y = object.position.y;
};