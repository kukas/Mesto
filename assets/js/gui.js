function GUI( canvas ){
	var _this = this;

	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");

	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
	this.children = [];

	function Rectangle(options){
		GUIObject.call(this, options);
		this.color = options.color === undefined ? "rgba(0,0,0,0.5)" : options.color;
	}
	Rectangle.prototype = new GUIObject();
	Rectangle.prototype.render = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	function Minimap(objects,options){
		this.objects = objects;
		Rectangle.call(this, options);
		this.zoomX = 0.2;
		this.zoomY = 0.2;
		this.maxVzdalenost = (this.width/this.zoomX)*(this.width/this.zoomX) + (this.height/this.zoomY)*(this.height/this.zoomY);
	};
	
	Minimap.prototype = new GUIObject();
	
	Minimap.prototype.tick = function (){
		_this = this;
		this.children = [];
		for(var i in this.objects){
			if(this.objects[i].bounding_mesh === undefined) continue;
			
			if(this.objects.player.mesh.position.distanceToSquared(this.objects[i].mesh.position) > this.maxVzdalenost){
				continue;
			}
			
			var poloha = new THREE.Vector3();
			poloha.sub(this.objects[i].mesh.position,this.objects.player.mesh.position);
			poloha.x*=this.zoomX;
			poloha.y*=this.zoomY;
			
			var rozmery = new THREE.Vector3();
			rozmery.x = _this.zoomX*_this.objects[i].mesh.scale.x*(_this.objects[i].geometry.boundingBox.max.x-_this.objects[i].geometry.boundingBox.min.x);
			rozmery.y = _this.zoomY*_this.objects[i].mesh.scale.y*(_this.objects[i].geometry.boundingBox.max.y-_this.objects[i].geometry.boundingBox.min.y);
			
			this.add(new Rectangle({
				color:"#ff0000",
				x:poloha.x,
				y:poloha.y,
				width:rozmery.x,
				height:rozmery.y,
				}));
				
			//Posl�n� prvn�ch obd�ln�k�
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
	Texture.prototype = new GUIObject();
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
	Text.prototype = new GUIObject();

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
	Button.prototype = new GUIObject();

	Button.prototype.render = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	// function Note(){

	// }
	
	// function Note(text,bg,object){
	// 	this.ctx = _this.ctx;

	// 	this.children = [];
	// 	var noteObj = this;
	// 	this.display = false;
	// 	this.text = text.value;
		
	// 	this.x = text.x !== undefined ? text.x : 0;
	// 	this.y = text.y !== undefined ? text.y : 0;
		
	// 	this.size = text.size !== undefined ? text.size : "10pt";
	// 	this.font = text.font !== undefined ? text.font : "VT220";
	// 	this.color = text.color !== undefined ? text.color : "#000000";
	// 	this.width = text.width !== undefined ? text.width : 100;
		
	// 	if(bg !== undefined){
	// 		this.bgColor = bg.bgColor !== undefined ? bg.bgColor : false;
	// 		this.bgImg = bg.bgImg !== undefined ? bg.bgImg : false;
	// 	}
	// 	else{
	// 		this.bgColor = false;
	// 		this.bgImg = false;
	// 	}
		
	// 	this.render = function (){
	// 		var ctx = noteObj.ctx;
			
	// 		if(this.display){
	// 			ctx.save();
	// 			if(this.bgColor){
	// 				ctx.fillStyle = this.bgColor;
	// 				ctx.fillRect(this.parent.width,this.parent.height-parseInt(this.size),this.width,this.height);
	// 				/*ctx.beginPath();
	// 				ctx.translate(this.parent.width-20,game.eventhandler.mouse.y-this.parent.y);
	// 				ctx.moveTo(0,0);
	// 				ctx.lineTo(11,-5);
	// 				ctx.lineTo(11,5);
	// 				ctx.lineTo(0,0);
	// 				ctx.fill();
	// 				ctx.closePath();*/
	// 			}
	// 			ctx.restore();
	// 			ctx.save();
	// 			if(this.bgImg){
	// 				console.log("hura");
	// 			}
	// 			ctx.restore();
	// 			ctx.save();
	// 			ctx.fillStyle = this.color;
	// 			ctx.font = this.size + " " + this.font;
	// 			for(var i = 0;i<this.text.length;i++){
	// 				ctx.fillText(this.text[i],this.parent.width+this.x,i*5/4*(parseInt(this.size))+this.y);
	// 			};
	// 			ctx.restore();
	// 		}	
	// 	};
	// 	return this;
	// };
	// Note.prototype = new GUIObject();
	
	this.guis = {
		mainM : {
			objects : function(){
				// background obrázek
				_this.add( new Texture({
					image: game.textures.textures.rust,
					x: 0,y: 0,
					width: _this.width, height: _this.height
				}) )
				// modrý obdélník
				_this.add( new Rectangle({
					x: _this.width/2 - 150, y: 50,
					width: 300, height: 500,
					color: "#4b5c9a"
				}), "menuRectangle" );
				// nápis město
				_this.get("menuRectangle").add( new Text({
					value: "Mesto",
					align: "center",
					width: _this.get("menuRectangle").width,
					styles: {
						default: {
							color: "#DAE5F0",
							size: 60,
						}
					}
				}) );
				// buttony
				_this.get("menuRectangle").add( new Button({
					x: 0, y: 100,
					width: _this.get("menuRectangle").width, height: 50,
					color: "#4b5c9a",
					text:{
						y: 12,
						value:"Start Game",
						align: "center",
						styles: {
							default: {
								color: "#DAE5F0",
								font: "Arial",
								size: 20,
							}
						}
					},
					mouseover:function (){
						this.color = "#5C6894";
						this.get("text").styles.default.color = "#E6ECF2";
					},
					mouseout:function (){
						this.color = "#4b5c9a";
						this.get("text").styles.default.color = "#DAE5F0";
					},
					mousedown:function (){
						game.mode = 1;
						game.load("test");
					},
				}) );
				_this.get("menuRectangle").add( new Button({
					x: 0, y: 150,
					width: _this.get("menuRectangle").width, height: 50,
					color: "#4b5c9a",
					text:{
						y: 12,
						value:"Load",
						align: "center",
						styles: {
							default: {
								color: "#DAE5F0",
								font: "Arial",
								size: 20,
							}
						}
					},
					mouseover:function (){
						this.color = "#5C6894";
						this.get("text").styles.default.color = "#E6ECF2";
					},
					mouseout:function (){
						this.color = "#4b5c9a";
						this.get("text").styles.default.color = "#DAE5F0";
					},
					mousedown:function (){
						alert("nope")
					},
				}) );
				_this.get("menuRectangle").add( new Button({
					x: 0, y: 200,
					width: _this.get("menuRectangle").width, height: 50,
					color: "#4b5c9a",
					text:{
						y: 12,
						value:"Options",
						align: "center",
						styles: {
							default: {
								color: "#DAE5F0",
								font: "Arial",
								size: 20,
							}
						}
					},
					mouseover:function (){
						this.color = "#5C6894";
						this.get("text").styles.default.color = "#E6ECF2";
					},
					mouseout:function (){
						this.color = "#4b5c9a";
						this.get("text").styles.default.color = "#DAE5F0";
					},
					mousedown:function (){
						alert("nope")
					},
				}) );
				_this.get("menuRectangle").add( new Button({
					x: 0, y: 250,
					width: _this.get("menuRectangle").width, height: 50,
					color: "#4b5c9a",
					text:{
						y: 12,
						value:"Website",
						align: "center",
						styles: {
							default: {
								color: "#DAE5F0",
								font: "Arial",
								size: 20,
							}
						}
					},
					mouseover:function (){
						this.color = "#5C6894";
						this.get("text").styles.default.color = "#E6ECF2";
					},
					mouseout:function (){
						this.color = "#4b5c9a";
						this.get("text").styles.default.color = "#DAE5F0";
					},
					mousedown:function (){
						window.location.href = "http://kuka.zby.cz/mesto/page"
					},
				}) );
			},
			preload : function (){
				game.scene = new THREE.Scene();
			},
			controls : function (){
				_this.addControls();
			},
		},
		inGame : {
			objects : function(){
				_this.add( new Button({
					x: 20, y: _this.height-60,
					visible: false,
					text:{
						value:"100",
						styles: {
							default: {
								color:"#ffb400",
								size:48,
							}
						}
					},
					// mouseover : function (){
					// 	this.children[0].display = true;
					// },
					// mouseout : function (){
					// 	this.children[0].display = false;
					// },
					// poznamka : {
					// 	value : "This is your health. If it goes to zero, you die. But be aware of losing it anyway. Several harms and wounds may cause permanent disabilities, unless you have an admirable medicae skill or a lot of luck.",
					// 	size : "10pt",
					// 	font : "sans-sarif",
					// 	color : "#0000ff",
					// 	y : -40,
					// 	width : 250,
					// 	bg : {
					// 		bgColor : "#ffffff",
					// 	},
					// },
				}) );
			},
			preload : function (){},
			controls : function (){
							_this.addControls();

							game.eventhandler.addMouseControl(0,function(){
								// game.camera.position.x = game.eventhandler.mouse.projected.x/10;
								// game.camera.position.y = game.eventhandler.mouse.projected.y/10;
								game.cursor.style.left = game.eventhandler.mouse.x + "px";
								game.cursor.style.top = game.eventhandler.mouse.y + "px";
							});

							game.eventhandler.addKeyboardControl(82, undefined, undefined, function(){ // R
								game.camera.position.z += 10;
							} );
							game.eventhandler.addKeyboardControl(70, undefined, undefined, function(){ // F
								game.camera.position.z -= 10;
							} );
							game.eventhandler.addKeyboardControl(84, undefined, undefined, function(){ // T
								game.scene.fog.density += 0.001
								console.log(game.scene.fog.density)
							} );
							game.eventhandler.addKeyboardControl(71, undefined, undefined, function(){ // G
								game.scene.fog.density -= game.scene.fog.density > 0 ? 0.001 : 0;
								console.log(game.scene.fog.density)
							} );
							game.eventhandler.addKeyboardControl(77, undefined, undefined, function(){ // M - minimapa
								_this.add(new Minimap(game.objects,{x:50,y:500,width:100,height:100,color:"#ffffff"}));
							} );
							game.eventhandler.addKeyboardControl(27, undefined, function(){ // escape
								game.pause();
								game.scene.fog.density = 0.0025;
								_this.switchGUI("pause");
							} );
							// ovládání panáčka
							game.eventhandler.addKeyboardControl(87, undefined, function(){
								game.objects.player.toggleAnim("standing");
							}, function(){ // W
								game.objects.player.toggleAnim("walking");
								game.objects.player.move(Math.PI);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.player.mesh);
							} );
							game.eventhandler.addKeyboardControl(83, undefined, function(){
								game.objects.player.toggleAnim("standing");
							}, function(){ // S
								game.objects.player.toggleAnim("walking");
								game.objects.player.move(0);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.player.mesh);
							} );
							game.eventhandler.addKeyboardControl(65, undefined, function(){
								game.objects.player.toggleAnim("standing");
							}, function(){ // A
								game.objects.player.toggleAnim("walking");
								game.objects.player.move(Math.PI/2);
								// game.objects.monster.rotate(0.1);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.player.mesh);
							} );
							game.eventhandler.addKeyboardControl(68, undefined, function(){
								game.objects.player.toggleAnim("standing");
							}, function(){ // D
								game.objects.player.toggleAnim("walking");
								game.objects.player.move(-Math.PI/2);
								// game.objects.monster.rotate(-0.1);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.player.mesh);
							} );

							},
		},
		pause : {
			objects: function(){
				_this.add( new Button({
					x: _this.width/2-150, y: 100,
					width: 300, height: 60,
					visible: false,
					text : {
						value: "Resume",
						align: "center",
						styles: {
							default: {
								color: "#aaaaff",
								size: 60,
							}
						}
					},
					mouseover: function (){
						this.get("text").styles.default.color = "#000000";
					},
					mouseout: function (){
						this.get("text").styles.default.color = "#aaaaff";
					},
					mousedown: function (){
						game.pause();
						game.scene.fog.density = 0;
						_this.switchGUI("inGame");
					},
				}) );
				_this.add( new Button({
					x: _this.width/2-150, y: 170,
					width: 300, height: 60,
					visible: false,
					text : {
						value: "Save",
						align: "center",
						styles: {
							default: {
								color: "#aaaaff",
								size: 60,
							}
						}
					},
					mouseover: function (){
						this.get("text").styles.default.color = "#000000";
					},
					mouseout: function (){
						this.get("text").styles.default.color = "#aaaaff";
					},
					mousedown: function (){
						alert("In development");
					},
				}) );
				_this.add( new Button({
					x: _this.width/2-150, y: 240,
					width: 300, height: 60,
					visible: false,
					text : {
						value: "Load",
						align: "center",
						styles: {
							default: {
								color: "#aaaaff",
								size: 60,
							}
						}
					},
					mouseover: function (){
						this.get("text").styles.default.color = "#000000";
					},
					mouseout: function (){
						this.get("text").styles.default.color = "#aaaaff";
					},
					mousedown: function (){
						alert("In development");
					},
				}) );
				_this.add( new Button({
					x: _this.width/2-150, y: 310,
					width: 300, height: 60,
					visible: false,
					text : {
						value: "Achievements",
						align: "center",
						styles: {
							default: {
								color: "#aaaaff",
								size: 60,
							}
						}
					},
					mouseover: function (){
						this.get("text").styles.default.color = "#000000";
					},
					mouseout: function (){
						this.get("text").styles.default.color = "#aaaaff";
					},
					mousedown: function (){
						alert("In development");
					},
				}) );
				_this.add( new Button({
					x: _this.width/2-150, y: 380,
					width: 300, height: 60,
					visible: false,
					text : {
						value: "Exit",
						align: "center",
						styles: {
							default: {
								color: "#aaaaff",
								size: 60,
							}
						}
					},
					mouseover: function (){
						this.get("text").styles.default.color = "#000000";
					},
					mouseout: function (){
						this.get("text").styles.default.color = "#aaaaff";
					},
					mousedown: function (){
						_this.switchGUI("mainM");
					},
				}) );
			},
			preload : function (){},
			controls : function (){
				_this.addControls();
				game.eventhandler.addKeyboardControl(27, false, function(){
						game.pause();
						game.scene.fog.density = 0;
						_this.switchGUI("inGame");
					},false,false );
				},
		},
	};
};

GUI.prototype = new GUIObject();

GUI.prototype.tick = function (){
	this.tickChildren();
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
	
	gui.preload();
	gui.controls();
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
			obj.ctx.font = obj.size + " " + obj.font;
			obj.width = obj.ctx.measureText(obj.text).width;
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
