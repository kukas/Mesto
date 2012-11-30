function GUI( canvas ){
	var _this = this;

	GUIObject.call(this);

	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");

	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
	this.children = [];
	
	this.guis = {};
	$.get("assets/js/guis/cutscene.js",function(data){_this.loadGUI(data, "cutscene");})
	$.get("assets/js/guis/mainMenu.js",function(data){_this.loadGUI(data, "mainM");})
	$.get("assets/js/guis/inGame.js",function(data){_this.loadGUI(data, "inGame");})
	$.get("assets/js/guis/pause.js",function(data){_this.loadGUI(data, "pause");})
	$.get("assets/js/guis/notesObjectives.js",function(data){_this.loadGUI(data, "notesObjectives");})
	
	this.loadGUI = function(objectStr, name){
		this.guis[name] = eval("(function(){return "+objectStr+";})()");
		}
	
	function Rectangle(options){
		GUIObject.call(this, options);
		this.color = options.color === undefined ? "rgba(0,0,0,0.5)" : options.color;
	}
	Rectangle.prototype = Object.create( GUIObject.prototype );
	Rectangle.prototype.render = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	function Minimap(objects,options){
		this.objects = objects;
		Rectangle.call(this, options);
		this.zoomX = 1;
		this.zoomY = 1;
		this.maxVzdalenost = (this.width/this.zoomX)*(this.width/this.zoomX) + (this.height/this.zoomY)*(this.height/this.zoomY);
	};
	
	Minimap.prototype = Object.create( GUIObject.prototype );
	
	Minimap.prototype.tick = function (){
		_this = this;
		this.children = [];
		for(var i in this.objects){
			if(this.objects[i].bounding_mesh === undefined) continue;
			
			if(this.objects.player.mesh.position.distanceToSquared(this.objects[i].mesh.position) > this.maxVzdalenost){
				continue;
			}
			
			var poloha = new THREE.Vector3();
			// poloha.sub(this.objects[i].mesh.position,this.objects.player.mesh.position);
			poloha.x = this.objects[i].mesh.position.x+(this.objects[i].geometry.boundingBox.max.x + this.objects[i].geometry.boundingBox.min.x)*this.objects[i].mesh.scale.x/2;
			poloha.y = this.objects[i].mesh.position.y+(this.objects[i].geometry.boundingBox.max.z + this.objects[i].geometry.boundingBox.min.z)*this.objects[i].mesh.scale.y/2;

			poloha.x*=this.zoomX;
			poloha.y*=-this.zoomY;

			var rozmery = new THREE.Vector3();
			rozmery.x = _this.zoomX*_this.objects[i].mesh.scale.x*(_this.objects[i].geometry.boundingBox.max.x-_this.objects[i].geometry.boundingBox.min.x);
			rozmery.y = _this.zoomY*_this.objects[i].mesh.scale.z*(_this.objects[i].geometry.boundingBox.max.z-_this.objects[i].geometry.boundingBox.min.z);
			
			this.add(new Rectangle({
				color:"#ff0000",
				x:poloha.x-rozmery.x/2,
				y:poloha.y-rozmery.y/2,
				width:rozmery.x,
				height:rozmery.y,
				}));
				
			//Poslání kontrolních obdéníků do konzole
			if(this.sent) continue;
			console.log(new Rectangle({
				color:"#ff0000",
				x:poloha.x,
				y:poloha.y,
				width:rozmery.x,
				height:rozmery.y,
				}));
				
			console.log(_this.objects[i].mesh.position,_this.objects[i].geometry.boundingBox);
			console.log(poloha,rozmery);
		};
		this.sent = true;
	};
	
	Minimap.prototype.render = function(ctx){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.translate(this.width/2,this.height/2);
		this.renderChildren(ctx);
	};

	function Texture(options){
		GUIObject.call(this, options);

		var _this = this;

		this.image = options.image.image;
		if(options.width === undefined)
			this.width = this.image.width;
		if(options.height === undefined)
			this.height = this.image.height;

		this.clip = options.clip === undefined ? {x: 0, y: 0, width: _this.image.width, height: _this.image.height} : options.clip;
	}
	Texture.prototype = Object.create( GUIObject.prototype );
	Texture.prototype.render = function(ctx) {
		ctx.drawImage(this.image, this.clip.x, this.clip.y, this.clip.width, this.clip.height, this.x, this.y, this.width, this.height);
	};


	function Text(options){
		GUIObject.call(this, options);
		var _this = this;

		this.wrap = options.wrap === undefined ? true : options.wrap;
		this.align = options.align === undefined ? "left" : options.align;

		this.defaultStyle = {
			size: 12,
			lineHeight: 12,
			font: "VT220",
			weight: 400,
			italic: "normal",
			color: "#AAAAAA"
		};

		if(options.styles !== undefined){
			this.styles = options.styles;
			for(var style in this.styles){
				if(this.styles[style].lineHeight === undefined && this.styles[style].size !== undefined)
					this.styles[style].lineHeight = this.styles[style].size;
				for(var property in this.defaultStyle){
					if(this.styles[style][property] === undefined){
						this.styles[style][property] = this.defaultStyle[property];
					}
				}
			}
		}
		else {
			this.styles = {
				default: _this.defaultStyle
			};
		}

		this.changeText(options.value);

		// možná, do budoucnosti:
		// this.textCache = createCanvas(options.width, options.height);
	}
	Text.prototype = Object.create( GUIObject.prototype );

	Text.prototype.changeText = function(text) {
		// zalamování textu
		this.value = text;
		var textStyles = this.value.split("\\");
		if(this.wrap){
			this.text = [];
			var currentStyle = "default";
			var style = this.styles[currentStyle];
			var ctx = document.createElement("canvas").getContext("2d");
			ctx.font = makeFont(style.italic, style.weight, style.font, style.size);

			for(var s=0;s<textStyles.length;s++){
				if( this.styles[textStyles[s]] !== undefined ){
					currentStyle = textStyles[s];
					var style = this.styles[currentStyle];
					ctx.font = makeFont(style.italic, style.weight, style.font, style.size);
					this.text.push( textStyles[s] );
					continue;
				}
				var pole_slov = textStyles[s].split(" ");
				var last_slovo = 0;
				while(last_slovo < pole_slov.length){
					var pokus_radek = pole_slov[last_slovo];
					novy_radek = pokus_radek;
					for(var i = last_slovo+1; i < pole_slov.length; i++){
						pokus_radek += " " + pole_slov[i];
						if(ctx.measureText(pokus_radek).width > this.width){
							break;
						}
						novy_radek = pokus_radek;
					}
					last_slovo = i;
					this.text.push(novy_radek);
				}
			}
		}
		else {
			this.text = textStyles;
		}
	};

	Text.prototype.render = function(ctx) {
		var currentStyle = "default";
		var currentRow = 0;
		var currentX = 0;
		var preserveX = false;
		for(var line in this.text){
			if( this.styles[this.text[line]] !== undefined ){
				currentStyle = this.text[line];
				currentRow--;
				preserveX = true;
			}
			else {

				if(preserveX){
					preserveX = false;
				}
				else {
					currentX = 0;
				}
				currentRow++;

				var style = this.styles[currentStyle];

				var x = this.x + currentX;
				var y = this.y + currentRow*style.lineHeight;

				ctx.fillStyle = style.color;
				ctx.font = makeFont(style.italic, style.weight, style.font, style.size);

				if(this.align == "center")
					x += (this.width - ctx.measureText(this.text[line]).width)/2;
				if(this.align == "right")
					x += this.width - ctx.measureText(this.text[line]).width;

				ctx.fillText( this.text[line], x,y );
				currentX = ctx.measureText( this.text[line] ).width;
			}
		}
	};

	function Button(options){
		GUIObject.call(this, options);

		this.width = this.width === 0 ? 100 : this.width;
		this.height = this.height === 0 ? 50 : this.height;
		this.color = options.color === undefined ? "#888888" : options.color;

		if(options.text !== undefined){
			options.text.width = this.width;
			options.text.height = this.height;
			this.add( new Text(options.text), "text" )
		}

		if(options.texture !== undefined){
			options.text.width = this.width;
			options.text.height = this.height;
			this.add( new Texture(options.texture), "texture" )
		}

	}
	Button.prototype = Object.create( GUIObject.prototype );

	Button.prototype.render = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	// function Note(){

	// }

	function Layer(options){
		Texture.call(this, options);

		this.velocity = options.velocity === undefined ? new THREE.Vector2() : options.velocity;
		this.acceleration = options.acceleration === undefined ? new THREE.Vector2() : options.acceleration;
	}
	Layer.prototype = Object.create( Texture.prototype );
	Layer.prototype.tick = function(){
		console.log(this.x, this.y)
		this.velocity.addSelf( this.acceleration );

		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
};

GUI.prototype = Object.create( GUIObject.prototype );

GUI.prototype.tick = function (){
	this.tickChildren();

	// tickuje gui
	if(this.guis[this.currentGUI] !== undefined && this.guis[this.currentGUI].tick !== undefined)
		this.guis[this.currentGUI].tick();
};

GUI.prototype.render = function (){
	this.ctx.clearRect(0,0,this.width,this.height);
	
	this.renderChildren(this.ctx);
};

GUI.prototype.switchGUI = function( name ) {
	this.currentGUI = name;
	console.log("GUI: switching gui to "+name)
	var gui = this.guis[name];

	this.children = [];
	game.eventhandler.resetControls();
	
	if(gui.preload !== undefined)
		gui.preload();
	if(gui.controls !== undefined)
		gui.controls();
	if(gui.objects !== undefined)
		gui.objects();

	// for(var i in gui.objects){
	// 	this.add( gui.objects[i] );
	// };

	// this.resize(this.canvas.width,this.canvas.height);
};

GUI.prototype.resize = function ( w, h ){
	var X = w/(this.canvas.width);
	var Y = h/(this.canvas.height);
	for(var i in this.children){
		var obj = this.children[i];
		if(!obj.relative){
			obj.x *= X;
			obj.y *= Y;
		}
		else{
			obj.x *= this.canvas.width/1000;
			obj.y *= this.canvas.height/1000;
			obj.relative = false;
		}
		if(Math.abs(w - this.canvas.width) > Math.abs(h - this.canvas.height) && obj.size !== undefined){
			var cislo = parseInt(obj.size);
			var pripona = obj.size.split(parseInt(obj.size).toString())[1];
			cislo = Math.round(cislo*X);
			obj.size = cislo+pripona;
		}
		else if(obj.size !== undefined){
			var cislo = parseInt(obj.size);
			var pripona = obj.size.split(parseInt(obj.size).toString())[1];
			cislo = Math.round(cislo*Y);
			obj.size = cislo+pripona;
		}
		if(obj.text !== undefined){
			// obj.ctx.font = obj.size + " " + obj.font;
			// obj.width = obj.\ctx.measureText(obj.text).width;
			obj.height = -parseInt(obj.size);
		}
		if(obj.children.length > 0) obj.resize(X,Y,true);
	};
	this.canvas.width = w;
	this.canvas.height = h;
	this.width = this.canvas.width;
	this.height = this.canvas.height;
};

GUI.prototype.addControls = function() {
	var _this = this;
	game.eventhandler.addMouseControl(1, function(x,y){
		_this.mousehandler(x,y,"mousedown");
	}, function(x,y){
		_this.mousehandler(x,y,"mouseup");
	});
	game.eventhandler.addMouseControl(0, function(x,y){
		_this.mousehandler(x,y,"mousemove");
		// pohyb kurzoru
		game.cursor.style.left = x + "px";
		game.cursor.style.top = y + "px";
	});
};
