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
	this.scene.fog = new THREE.FogExp2(0x5D739C,0);
	
 	// jen takový malý návrh:
 	// this.gui.activate("loader")
	this.gui.menu("inGame").load();
	
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
				_this.camera = _this.level.camera;

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
	function rotatePoint(distance, center, angle){
		return new THREE.Vector2( distance*Math.cos(angle)-center.x, distance*Math.sin(angle)-center.y );
	}
	function pointInRectangle(point, rectangle){
		// Argumenty: point jako THREE.Vector2 a rectangle jako {stred: THREE.Vector2, rozmery: {width: 0, height: 0}, uhel: 0}
		// funkce vrátí, zda bod leží v rotovaném obdélníku
		// je geniální a napsal jsem jí na papír v letadle
		// pracuje tak, že obdélník s testovaným bodem rotuje na jednodušší situaci -> bod a nerotovaný obdélník.
		if(rectangle.uhel !== 0){
			var dx = rectangle.stred.x - point.x; // vzdálenost bodu od středu v ose X
			var dy = rectangle.stred.y - point.y; // vzdálenost bodu od středu v ose Y

			var pdistance = Math.sqrt( dx*dx + dy*dy ); // vzdálenost test. bodu od středu obdélníku ve 2D

			var alpha = Math.atan(dy/dx); // úhel natočení test. bodu od středu obdélníku
			if(dx < 0)
				alpha += Math.PI;
			var delta = alpha - rectangle.uhel; // výsledný úhel test. bodu po natočení celého grafu
			
			// b = souřadice natočeného bodu
			var b = rotatePoint(pdistance, rectangle.stred, delta);
		}
		else {
			var b = point;
		}

		var min = new THREE.Vector2(rectangle.stred.x-rectangle.rozmery.width/2, rectangle.stred.y-rectangle.rozmery.height/2);
		var max = new THREE.Vector2(rectangle.stred.x+rectangle.rozmery.width/2, rectangle.stred.y+rectangle.rozmery.height/2);
		if( b.x >= min.x && b.x <= max.x && b.y >= min.y && b.y <= max.y ){
			return true;
		}

		return false;
	}
	// konec geniálního kódu, následuje:
	// HODNĚ pochybná funkce

	// jejím úkolem je vzít 2 objekty, projet všech 8 rohů jejich boundingboxů a zjistit, zda neleží v tom druhém boundingboxu.

	var objs = [obj1, obj2];
	var rohy = [-1,1];

	// tenhle for vezme nejdříve 1. a pak 2. testovaný objekt
	for(var i=0; i < objs.length; i++){
		// vypočítání středu boundingboxu v prostoru - tahle část je nejpochybnější, 
		// protože i když se zdá, že by měla perfektně fungovat, tak funguje s chybou cca. 10%,
		// prostě wut.
		var stred_x = objs[1-i].mesh.position.x+(objs[1-i].geometry.boundingBox.max.x + objs[1-i].geometry.boundingBox.min.x)*objs[1-i].mesh.scale.x/2;
		var stred_y = objs[1-i].mesh.position.y+(objs[1-i].geometry.boundingBox.max.z + objs[1-i].geometry.boundingBox.min.z)*objs[1-i].mesh.scale.y/2;
		var stred = new THREE.Vector2(stred_x, stred_y);
		// a přesto že minulý kód nefunguje, tenhle funguje krásně
		// prostě wut.
		var halfWidth = (objs[1-i].geometry.boundingBox.max.x-objs[1-i].geometry.boundingBox.min.x) * objs[1-i].mesh.scale.x /2;
		var halfHeight = (objs[1-i].geometry.boundingBox.max.z-objs[1-i].geometry.boundingBox.min.z) * objs[1-i].mesh.scale.y/2;

		// takže jestli to debugneš, tak jsi fakt dobrej, koukal jsem na to 3 hodiny, zkoušel jsem úplně všechno a nic nefunguje...

		// spočítám si polovinu délky úhlopříčky
		var distance = Math.sqrt(halfWidth*halfWidth+halfHeight*halfHeight); // vzdálenost test. bodu od středu obdélníku ve 2D
		// a teď procházíme rohy:
		for (var radek = 0; radek < rohy.length; radek++) {
			for (var sloupec = 0; sloupec < rohy.length; sloupec++) {
				// otočí testovaný roh podle otočení svého mateřského objektu				
				var point = new THREE.Vector2( halfWidth*rohy[radek], halfHeight*rohy[sloupec] );
				
				var dx = point.x; // vzdálenost bodu od středu v ose X
				var dy = point.y; // vzdálenost bodu od středu v ose Y

				var alpha = Math.atan(dx/dy); // úhel natočení test. bodu od středu obdélníku
				if(dy < 0)
					alpha += Math.PI;
				var delta = alpha - objs[1-i].mesh.rotation.y;

				var rotated_point = new THREE.Vector2( distance*Math.sin(delta)+stred.x, distance*Math.cos(delta)+stred.y );
				// debug věc:
				// if(objs[1-i] instanceof Character){
				// 	game.objects.test.mesh.position.x = rotated_point.x;
				// 	game.objects.test.mesh.position.y = rotated_point.y;
				// }
				// použití geniální funkce:
				if( pointInRectangle(
					rotated_point,
					{
						stred: new THREE.Vector2( 
							objs[i].mesh.position.x + (objs[i].geometry.boundingBox.max.x+objs[i].geometry.boundingBox.min.x)*objs[i].mesh.scale.x/2, 
							objs[i].mesh.position.y + (objs[i].geometry.boundingBox.max.z+objs[i].geometry.boundingBox.min.z)*objs[i].mesh.scale.y/2 ),
						rozmery: {
							width: (objs[i].geometry.boundingBox.max.x-objs[i].geometry.boundingBox.min.x) * objs[i].mesh.scale.x,
							height: (objs[i].geometry.boundingBox.max.z-objs[i].geometry.boundingBox.min.z) * objs[i].mesh.scale.y
						}, 
						uhel: objs[i].mesh.rotation.y
					}
					) ){
					return true;
				};
			};
		};
	};

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