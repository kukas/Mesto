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
	this.progress = new Progress();
	// this.statistics = new Statistics();
	this.settings = new Settings();

	// WUT objekty, které nevím jestli loadnu tady nebo jinde
	this.dialogManager = new DialogManager();
	this.questManager = new QuestManager();
	
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

	levelScript.src = this.levelspath + levelName + ".js";
	levelScript.addEventListener( "load", function(){
		_this.levelLoad(level);
	}, true );
	document.body.appendChild(levelScript);
};

Game.prototype.load = function(levelName,poziceHrace) { // Argument poziceHrace jde z door - destination
	var _this = this;
	console.log("Game: loading level "+levelName);
	
	$.getScript(this.levelspath + levelName + ".js", function(){
		_this.level = level;

		if(_this.level.scene){
			_this.scene = _this.level.scene;
		}
		else {
			_this.scene = new THREE.Scene();
			_this.scene.fog = new THREE.FogExp2(0x5D739C,0);
		}

		_this.models.loadModels( _this.level.models, function(){
			_this.level.models = _this.models.models;

			_this.textures.loadTextures( _this.level.textures, function(){
				_this.level.textures = _this.textures.textures;

				_this.jukebox.loadSounds( _this.level.sounds, function(){
					_this.level.sounds = _this.jukebox.sounds;

					_this.level.afterLoad(poziceHrace); // Aby bylo kam umístit hráče

					_this.objectsAdd();
					if(_this.level.camera)
						_this.camera = _this.level.camera;
					else
						_this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
					_this.scene.add(_this.camera);

					// změní velikost canvasů
					_this.resizeCanvas();
					
					_this.questManager.eventHandle(new QuestEvent("levelEnter",_this.level)); // Questová událost
				} )
			} )
		} );
	}).fail(function(){console.log(arguments);});
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
			//var vectorToPoint = new THREE.Vector2().sub(point,rectangle.position);
		}
			
		var vectorToPoint = new THREE.Vector2().sub(point,rectangle.position);
		var dimensionVector = new THREE.Vector2(rectangle.dimensions.width/2,rectangle.dimensions.height/2);
		//var min = new THREE.Vector2(rectangle.position.x-rectangle.dimensions.width/2, rectangle.position.y-rectangle.dimensions.height/2);
		//var max = new THREE.Vector2(rectangle.position.x+rectangle.dimensions.width/2, rectangle.position.y+rectangle.dimensions.height/2);
		
		var inIntervalX = vectorToPoint.x >= -dimensionVector.x && vectorToPoint.x <= dimensionVector.x;
		var inIntervalY = vectorToPoint.y >= -dimensionVector.y && vectorToPoint.y <= dimensionVector.y;
		
		if( inIntervalX && inIntervalY ){
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

Game.prototype.checkCollision2 = function (prvniObj,druhyObj){
	/*
	Můj pokus ohledně kolizí - vnímá obdélník jako funkci v radiální soustavě souřadnic,
	poté určuje, zda je vektor, který ukazuje na bod v obdélníku kratší než vektor ukazující na
	daný bod ze středu obdélníku
	*/
	function inInterval(max,min,n,uzavreny){ // Pomocná funkce
		if(uzavreny){
			if(max >= n && min <= n){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			if(max > n && min < n){
				return true;
			}
			else{
				return false;
			}
		}
	};
	
	function getVectorAngle(vec){ // Úhel, který svírá vektor a osa x
		if(vec.y < 0){
			return Math.atan(vec.y/vec.x)+Math.PI;
		}
		else{
			if(vec.y = 0 && vec.x < 0){
				return Math.PI;
			}
			else{
				return Math.atan(vec.y/vec.x);
			}
		}
	};
	
	function Obdelnik(position,dimension,rotation){
		this.position = position;
		this.width = dimension.width;
		this.constantX = dimension.width/2;
		this.height = dimension.height;
		this.constantY = dimension.height/2;
		this.gama = Math.atan(this.height/this.width);
		this.halfDiagonal = Math.sqrt((this.width*this.width+this.height*this.height)/4);
		this.rotation = rotation;
		this.points = [];
		var uhelObdelniku = Math.atan(this.constantY/this.constantX);
		this.points.push( new THREE.Vector2(
			Math.cos(this.rotation+uhelObdelniku)*this.halfDiagonal,
			Math.sin(this.rotation+uhelObdelniku)*this.halfDiagonal
		) );
		this.points.push( new THREE.Vector2(
			Math.cos(this.rotation+Math.PI-uhelObdelniku)*this.halfDiagonal,
			Math.sin(this.rotation+Math.PI-uhelObdelniku)*this.halfDiagonal
		) );
		this.points.push( new THREE.Vector2(
			Math.cos(this.rotation+uhelObdelniku+Math.PI)*this.halfDiagonal,
			Math.sin(this.rotation+uhelObdelniku+Math.PI)*this.halfDiagonal
		) );
		this.points.push( new THREE.Vector2(
			Math.cos(this.rotation+Math.PI*2-uhelObdelniku)*this.halfDiagonal,
			Math.sin(this.rotation+Math.PI*2-uhelObdelniku)*this.halfDiagonal
		) );
	};
	Obdelnik.prototype.getNormalVector = function (pozicniUhel){ // Úhel bodu vzhledem k obdélníku
		var uhel = pozicniUhel%(Math.PI*2);
		if(inInterval(this.gama,0,uhel,true) || inInterval(2*Math.PI,2*Math.PI-this.gama,uhel,true)){ // Levá vertikální hrana
			var vector = new THREE.Vector2(this.constantX,Math.tan(uhel)*this.constantX); // Odpovídající funkce
			return vector
		}
		if(inInterval(Math.PI-this.gama,this.gama,uhel,false)){
			var vector = new THREE.Vector2(this.constantY/Math.tan(uhel),this.constantY);
			return vector;
		}
		if(inInterval(Math.PI+this.gama,Math.PI-this.gama,uhel,true)){
			var vector = new THREE.Vector2(-this.constantX,-this.constantX*Math.tan(uhel));
			return vector;
		}
		if(inInterval(Math.PI*2-this.gama,Math.PI+this.gama,uhel,false)){
			var vector = new THREE.Vector2(-this.constantY/Math.tan(uhel),-this.constantY);
			return vector;
		}
		else{
			console.log("PROBLÉM - vektorové kolize mají zadaný nevyhovující úhel: "+uhel);
			return new THREE.Vector2(0,0);
		}
	};
	Obdelnik.prototype.checkPoint = function (bod){ // Zjistí, zda je bod v obdélníku
		var pozVector = new THREE.Vector2().sub(bod,this.position);
		var uhelKObdelniku = getVectorAngle(pozVector);
		var uhelSRotaci = uhelKObdelniku+this.rotation;
		var bodNaObdelniku = this.getNormalVector(uhelSRotaci);
		if(bodNaObdelniku.lengthSq() <= bod.lengthSq()){
			return true;
		}
		else{
			return false;
		}
	};
	var objekty = [prvniObj,druhyObj];
	var obdelniky = [];
	for(var i = 0;i < 2;i++){ // Velmi podobný zdroják
		var obj = objekty[i];
		obdelniky.push( new Obdelnik(
			new THREE.Vector2(
				obj.mesh.position.x+(obj.geometry.boundingBox.max.x + obj.geometry.boundingBox.min.x)*obj.mesh.scale.x/2,
				obj.mesh.position.y+(obj.geometry.boundingBox.max.z + obj.geometry.boundingBox.min.z)*obj.mesh.scale.y/2
			),
			{
				width: (obj.geometry.boundingBox.max.x-obj.geometry.boundingBox.min.x) * obj.mesh.scale.x,
				height: (obj.geometry.boundingBox.max.z-obj.geometry.boundingBox.min.z) * obj.mesh.scale.y
			},
			obj.mesh.rotation.y
		) );
	};
	for(var i = 0;i < 2;i++){
		var rpo = new THREE.Vector2().sub(obdelniky[1-i].position,obdelniky[i].position); // Relativní pozice obdélníku
		for(var j = 0;j < 4;j++){
			if(obdelniky[i].checkPoint(new THREE.Vector2().add(obdelniky[1-i].points[j],rpo))){
				console.log(obdelniky[i],new THREE.Vector2().add(obdelniky[1-i].points[j],rpo));
				return true;
			}
		};
	};
	return false;
};

Game.prototype.checkFloor = function (character){
	/*
	Kontroluje, jestli je hráč nad podlahou, jinak znemožňuje pohyb
	*/
	if(game.objects.floor === undefined) return true; // Může se hýbat jakkoli v testovacích levelech
	var x_zleva = game.objects.floor.xBoundaries.min < character.mesh.position.x+character.mesh.geometry.boundingBox.min.x*character.mesh.scale.x/2;
	var x_zprava = game.objects.floor.xBoundaries.max > character.mesh.position.x+character.mesh.geometry.boundingBox.max.x*character.mesh.scale.x/2;
	var y_shora = game.objects.floor.yBoundaries.max > character.mesh.position.y-character.mesh.geometry.boundingBox.max.y*character.mesh.scale.y*0; // WHUT?
	var y_zdola = game.objects.floor.yBoundaries.min < character.mesh.position.y+character.mesh.geometry.boundingBox.min.y*character.mesh.scale.y/2;
	if(x_zleva && x_zprava && y_shora && y_zdola){
		return true;
	}
	else{return false;}
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
	this.progress.checkAchievements(); // Achievementy můžou být úplně všechno
	this.gui.tick();
	if(game.mode == 1){
		for(var i in this.objects){
			if(this.objects[i].tick) this.objects[i].tick();
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