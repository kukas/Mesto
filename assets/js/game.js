function Game(){
	var _this = this;
	this.levelspath = "./assets/levels/";
	this.mode = 1;

	// zavede některé důležité objekty
	this.eventhandler = new Eventhandler( this );

	// TODO: až budou, tak odkomentovat :)
	this.textures = new Textures();
	this.jukebox = new Jukebox();
	this.models = new Models();
	this.gui = new GUI( document.createElement("canvas") );
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

	this.cursor = document.createElement("div");
	this.cursor.style.backgroundImage = "url('assets/cursors/steampunk.png')";
	this.cursor.id = "cursor";
	$("body").append(this.cursor);

	this.objects = [];

	// pokud se změní velikost okna prohlížeče, změní velikost canvasů
	window.addEventListener( "resize", function(){
		_this.resizeCanvas();
	}, true );
}
Game.prototype.load = function(levelName) {
	var _this = this;

	console.log("Game: loading level "+levelName)
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
	this.scene.fog = new THREE.FogExp2(0x5D739C,0);

	
 	// jen takový malý návrh:
 	// this.gui.activate("loader")
	// this.gui.switchGUI("inGame");
	
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
				if(_this.level.camera)
					_this.camera = _this.level.camera;
				else
					_this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
				_this.scene.add(_this.camera);

				// změní velikost canvasů
				_this.resizeCanvas();
			} )
		} )
	} );
};

Game.prototype.findCollisions = function(obj) {
	// projde všechny objekty a ty, co kolidují otestuje funkcí checkCollision()
	// pokud kolidují, přidá je do arraye a vrátí.
	var collisions = [];
	for(var i in this.objects){
		if( this.objects[i].colliding && this.objects[i] != obj ){
			if( this.checkCollision( this.objects[i], obj ) ){
				collisions.push(this.objects[i]);
			}
		}
	}
	return collisions;
};

Game.prototype.checkCollision = function(obj1, obj2) {
	function rotatePoint(distance, position, rotation){
		return new THREE.Vector2( distance*Math.cos(rotation)-position.x, distance*Math.sin(rotation)-position.y );
	}
	function pointInRectangle(point, rectangle){
		// Argumenty: point jako THREE.Vector2 a rectangle jako {position: THREE.Vector2, dimensions: {width: 0, height: 0}, rotation: 0}
		// funkce vrátí, zda bod leží v rotovaném obdélníku
		// je geniální a napsal jsem jí na papír v letadle
		// pracuje tak, že obdélník s testovaným bodem rotuje na jednodušší situaci -> bod a nerotovaný obdélník.
		if(rectangle.rotation !== 0){
			var dx = rectangle.position.x - point.x; // vzdálenost bodu od středu v ose X
			var dy = rectangle.position.y - point.y; // vzdálenost bodu od středu v ose Y

			var pdistance = Math.sqrt( dx*dx + dy*dy ); // vzdálenost test. bodu od středu obdélníku ve 2D

			var alpha = Math.atan(dy/dx); // úhel natočení test. bodu od středu obdélníku
			if(dx < 0)
				alpha += Math.PI;
			var delta = alpha - rectangle.rotation; // výsledný úhel test. bodu po natočení celého grafu
			
			// b = souřadice natočeného bodu
			var b = rotatePoint(pdistance, rectangle.position, delta);
		}
		else {
			var b = point;
		}

		var min = new THREE.Vector2(rectangle.position.x-rectangle.dimensions.width/2, rectangle.position.y-rectangle.dimensions.height/2);
		var max = new THREE.Vector2(rectangle.position.x+rectangle.dimensions.width/2, rectangle.position.y+rectangle.dimensions.height/2);
		if( b.x >= min.x && b.x <= max.x && b.y >= min.y && b.y <= max.y ){
			return true;
		}

		return false;
	}
	function rotateRectangle(rectangle){
		var points = [];

		var angle = Math.atan(rectangle.dimensions.height/rectangle.dimensions.width);
		var doplnekAngle = Math.PI/2 - angle;

		var halfdiagonal = new THREE.Vector2(rectangle.dimensions.height, rectangle.dimensions.width).length()/2;

		var newAngle = - rectangle.rotation - angle;

		if(rectangle.rotation !== 0){
			for(var i = 1; i<5; i++){
				var sinAngle = Math.sin(newAngle);
				var cosAngle = Math.cos(newAngle);
				
				points.push( new THREE.Vector2(
					-cosAngle*halfdiagonal,
					sinAngle*halfdiagonal
					).addSelf( rectangle.position ) );

				if(i == 1 || i == 3)
					newAngle += angle*2;
				else
					newAngle += doplnekAngle*2;
			}
		}
		else {
			for(var i = 0; i<4; i++){
				var col = i % 2 === 0 ? -1 : 1;
				var row = i >> 1 === 0 ? -1 : 1;
				points.push( new THREE.Vector2(
					col*rectangle.dimensions.width/2,
					row*rectangle.dimensions.height/2
					).addSelf( rectangle.position ) );
			}
		}

		return points;
	}

	var objs = [obj1, obj2];
	var rectangles = [];
	var points = [];

	for(var i=0; i < 2; i++){
		var obj = objs[i];
		var position_x = obj.mesh.position.x+(obj.geometry.boundingBox.max.x + obj.geometry.boundingBox.min.x)*obj.mesh.scale.x/2;
		var position_y = obj.mesh.position.y+(obj.geometry.boundingBox.max.z + obj.geometry.boundingBox.min.z)*obj.mesh.scale.y/2;
		rectangles.push({
			position: new THREE.Vector2(position_x, position_y),
			dimensions: {
				width: (obj.geometry.boundingBox.max.x-obj.geometry.boundingBox.min.x) * obj.mesh.scale.x,
				height: (obj.geometry.boundingBox.max.z-obj.geometry.boundingBox.min.z) * obj.mesh.scale.y
			},
			rotation: obj.mesh.rotation.y
		});

		points.push( rotateRectangle(rectangles[i]) );
	}

	for(var i=0; i < 2; i++){
		for(var p = 0; p < 4; p++){
			var pInRect = pointInRectangle(points[i][p], rectangles[1-i]);
			if(pInRect){
				// console.log(objs[1-i],new THREE.Vector2().add(objs[1-i].mesh.position, new Vector2(objs[1-i].bounding_mesh.position.x * obj.mesh.scale.x, )) , points[i][p], rectangles[1-i])
				return true;
			}
		}
	}

	return false;
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
		for(var i in this.objects){
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
	this.resizeCanvas();
	// abychom pořád neklikali mezerník :)
	this.load("menu");
	// this.gui.switchGUI("mainM");
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
	this.gui.tick();
	if(game.mode == 1){
		for(var i in this.objects){
			this.objects[i].tick();
		}
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
	this.gui.resize( w, h );
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