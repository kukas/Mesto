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
	this.eventhandler.addMouseControl(0,function(){
		_this.camera.position.x = _this.eventhandler.mouse.projected.x/10;
		_this.camera.position.y = _this.eventhandler.mouse.projected.y/10;
	});
	// TODO: až budou, tak odkomentovat :)
	this.textures = new Textures();
	// this.jukebox = new Jukebox();
	this.models = new Models();
	// this.gui = new GUI();
	// this.progress = new Progress();
	// this.statistics = new Statistics();

	// WUT objekty, které nevím jestli loadnu tady nebo jinde
	// this.quests = new Quests();
	// this.dialogs = new Dialogs();
	
	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 1000;

	var light = new THREE.PointLight(0xFFFFFF, 100);
	light.position.z = 10;

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);
	this.scene.add(light);

	// připraví jednotlivé canvasy
	this.webgl = new THREE.WebGLRenderer( { clearColor:0x111111, clearAlpha:1 } );
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
	this.camera = level.camera;
	this.scene.add( this.camera );
	
	this.models.loadModels( level.models, function(){
		_this.level.models = _this.models.models;
		_this.textures.loadTextures( level.textures, function(){
			_this.level.textures = _this.textures.textures;
			_this.level.afterLoad();
			_this.objectsAdd();
		} )
	} );
};

Game.prototype.objectsAdd = function() {
	this.objects = this.level.objects;
	for(var i in this.objects){
		this.scene.add(this.objects[i].mesh);
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
	// spustí render smyčku
	this.render();
};

Game.prototype.render = function() {
	stats.begin();
	var _this = this;
	requestAnimationFrame( function(){
		_this.render();
	} );
	this.tick();
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
	this.webgl.render( this.scene, this.camera );
	stats.end();
};

Game.prototype.tick = function() {
	this.animate();
	this.eventhandler.loop();
};

Game.prototype.animate = function (){
	var time = new Date().getTime();
	if(this.objects !== undefined){
		for(var i in this.objects){
			if(this.objects[i].animated){
				var faze = (time-this.objects[i].creationTime) % this.objects[i].animLength;
				var frame = Math.floor(faze/this.objects[i].interpolation);
				if(frame != this.objects[i].keyframe){
					this.objects[i].getEditMesh().morphTargetInfluences[this.objects[i].keyframe] = 0;
					this.objects[i].getEditMesh().morphTargetInfluences[frame] = 1;
					this.objects[i].keyframe = frame;
				}
			}
		};
		}
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
	if(this.camera){
		this.camera.aspect = w/h;
		this.camera.updateProjectionMatrix();
	}
};