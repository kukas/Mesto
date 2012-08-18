function GUI( canvas ){
	var _this = this;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
	this.children = [];
	
	function Note(text,bg,object){
		this.ctx = _this.ctx;
		this.children = [];
		var noteObj = this;
		this.display = false;
		this.text = text.value;
		
		this.x = text.x !== undefined ? text.x : 0;
		this.y = text.y !== undefined ? text.y : 0;
		
		this.size = text.size !== undefined ? text.size : "10pt";
		this.font = text.font !== undefined ? text.font : "VT220";
		this.color = text.color !== undefined ? text.color : "#000000";
		this.width = text.width !== undefined ? text.width : 100;
		this.height = function (){
			var pole = new Array();
			var ctx = noteObj.ctx;
			ctx.save();
			ctx.font = noteObj.size + " " + noteObj.font;
			var radkovani = parseInt(noteObj.size)/4;
			pole[0] = noteObj.text;
			while(ctx.measureText(pole[pole.length-1]).width >= noteObj.width){
				var poleSlov = pole[pole.length-1].split(" ");
				var radek = "";
				var i = 0;
				while(ctx.measureText(radek).width < noteObj.width){
					var lastIndex = radek.length;
					if(i != 0) {
						radek = [radek,poleSlov[i]].join(" ");
					}
					else{
						radek = poleSlov[i];
					}
					if(ctx.measureText(radek).width >= noteObj.width){
						var novy = radek.split(" ");
						novy.splice(novy.length-1,1);
						if(novy[0] == "") novy.splice(0,1);
						radek = novy.join(" ");
						break;
					}
					i++;
				};
				pole[pole.length-1] = pole[pole.length-1].substring(radek.length,pole[pole.length-1].length);
				pole.splice(pole.length-1,0,radek);
			};
			noteObj.text = pole;
			var h = pole.length*(parseInt(noteObj.size)+radkovani);
			ctx.restore();
			return h;
		}();
		
		if(bg !== undefined){
			this.bgColor = bg.bgColor !== undefined ? bg.bgColor : false;
			this.bgImg = bg.bgImg !== undefined ? bg.bgImg : false;
		}
		else{
			this.bgColor = false;
			this.bgImg = false;
		}
		
		this.render = function (){
			var ctx = noteObj.ctx;
			
			if(this.display){
				ctx.save();
				if(this.bgColor){
					ctx.fillStyle = this.bgColor;
					ctx.fillRect(this.parent.width,this.parent.height-parseInt(this.size),this.width,this.height);
					/*ctx.beginPath();
					ctx.translate(this.parent.width-20,game.eventhandler.mouse.y-this.parent.y);
					ctx.moveTo(0,0);
					ctx.lineTo(11,-5);
					ctx.lineTo(11,5);
					ctx.lineTo(0,0);
					ctx.fill();
					ctx.closePath();*/
				}
				ctx.restore();
				ctx.save();
				if(this.bgImg){
					console.log("hura");
				}
				ctx.restore();
				ctx.save();
				ctx.fillStyle = this.color;
				ctx.font = this.size + " " + this.font;
				for(var i = 0;i<this.text.length;i++){
					ctx.fillText(this.text[i],this.parent.width+this.x,i*5/4*(parseInt(this.size))+this.y);
				};
				ctx.restore();
			}	
		};
		return this;
	};
	Note.prototype = new GUIObject();
	
	function Button(x,y,options){
		this.ctx = _this.ctx;
		this.children = [];
		this.x = x;
		this.y = y;
		this.relative = options.relative === undefined ? true : options.relative;
		
		this.text = options.text.value;
		if(options.img !== undefined){
			this.img = new Image();
			this.img.src = "assets/textures/" + options.img;
			this.imgSize = options.imgSize !== undefined ? options.imgSize : false;
			this.imgCoor = options.imgCoor !== undefined ? options.imgCoor : false;
		}
		this.textColor = options.text.color === undefined ? "#ffffff" : options.text.color;
		this.size = options.text.size === undefined ? "20pt" : options.text.size;
		this.font = options.text.font === undefined ? "VT220" : options.text.font;
		if(this.text !== undefined){
			_this.ctx.font = this.size + " " + this.font;
			this.width = _this.ctx.measureText(this.text).width;
			this.height = -parseInt(this.size);
		}
		
		this.tick = options.tick !== undefined ? options.tick : function (){};
		this.onmouseover = options.onmouseover !== undefined ? options.onmouseover : function (){};
		this.onmouseout = options.onmouseout !== undefined ? options.onmouseout : function (){};
		this.onclick = options.onclick !== undefined ? options.onclick : function (){};
		if(options.poznamka !== undefined){
			this.add(new Note(options.poznamka,options.poznamka.bg));
		}
		
		this.render = function (){
			if(this.img !== undefined){
				_this.ctx.drawImage(this.img,this.x+this.imgCoor.x,this.y+this.imgCoor.y,this.width,this.height);
			}
			_this.ctx.font = this.size + " " + this.font;
			_this.ctx.fillStyle = this.textColor;
			_this.ctx.fillText(this.text,this.x,this.y);
		};
		
		this.inButton = function (x,y){
			if(this.y > y && this.y+this.height <= y){
				_this.ctx.font = this.size + " " + this.font;
				if(this.x < x && this.x+this.width > x){
					return true;
				}
				else{return false;}
			}
			else{return false;}
		};
	};
	Button.prototype = new GUIObject();
	
	function Background( img ){
		this.ctx = _this.ctx;
		this.children = [];
		this.img = new Image();
		this.img.src = "assets/textures/" + img;
		this.render = function (){
			this.ctx.drawImage(this.img,0,0,game.gui.canvas.width,game.gui.canvas.height);
		};
	};
	Background.prototype = new GUIObject();
	
	function Menu( options ){
		this.objects = options.objects;
		this.bg = options.bg !== undefined ? options.bg : false;
		this.load = function (){
			_this.children = [];
			options.preload();
			this.controls = options.controls;
			this.controls();
			this.bg ? _this.add(this.bg) : false;
			for(var i in this.objects){
				_this.add(this.objects[i]);
			};
			_this.resize(_this.canvas.width,_this.canvas.height);
			return this;
		};
	};
	
	this.guis = {
		mainM : {
			objects : [
				new Button(450,100,{
					text:{
						value:"Play",
						color:"#aaaaff",
						size:"25pt",
						font:"sans-serif",
					},
					onmouseover:function (){
						this.textColor = "#ff0000";
					},
					onmouseout:function (){
						this.textColor = "#aaaaff";
					},
					onclick:function (){
						game.mode = 1;
						game.load("test");
					},
				}),
				
				new Button(450,145,{
					text:{
						value:"Load",
						color:"#aaaaff",
						size:"25pt",
						font:"sans-serif",
					},
					onmouseover:function (){
						this.textColor = "#ff0000";
					},
					onmouseout:function (){
						this.textColor = "#aaaaff";
					},
					onclick:function (){
						alert("In development");
					},
				}),
				
				new Button(450,190,{
					text:{
						value:"Options",
						color:"#aaaaff",
						size:"25pt",
						font:"sans-serif",
					},
					onmouseover:function (){
						this.textColor = "#ff0000";
					},
					onmouseout:function (){
						this.textColor = "#aaaaff";
					},
					onclick:function (){
						alert("In develoment");
					},
				}),
				
				new Button(450,235,{
					text:{
						value:"Website",
						color:"#aaaaff",
						size:"25pt",
						font:"sans-serif",
					},
					onmouseover:function (){
						this.textColor = "#ff0000";
					},
					onmouseout:function (){
						this.textColor = "#aaaaff";
					},
					onclick:function (){
						alert("In development");
					},
				}),
			],
			bg : new Background ("bg.png"),
			preload : function (){game.scene = new THREE.Scene();},
			controls : function (){_this.menuControls(true);},
		},
		inGame : {
			objects : [
				new Button(10,970,{
					text:{
						value:"100",
						color:"#ffb400",
						size:"40pt",
					},
					onmouseover : function (){
						this.children[0].display = true;
					},
					onmouseout : function (){
						this.children[0].display = false;
					},
					poznamka : {
						value : "This is your health. If it goes to zero, you die. But be aware of losing it anyway. Several harms and wounds may cause permanent disabilities, unless you have an admirable medicae skill or a lot of luck.",
						size : "10pt",
						font : "sans-sarif",
						color : "#0000ff",
						y : -40,
						width : 250,
						bg : {
							bgColor : "#ffffff",
						},
					},
				}),],
			preload : function (){},
			controls : function (){
							game.eventhandler.addMouseControl(0,function(){
								_this.menuControls(false)[0]();
								// game.camera.position.x = game.eventhandler.mouse.projected.x/10;
								// game.camera.position.y = game.eventhandler.mouse.projected.y/10;
								game.cursor.style.left = game.eventhandler.mouse.x + "px";
								game.cursor.style.top = game.eventhandler.mouse.y + "px";
							});
							game.eventhandler.addMouseControl(1,_this.menuControls()[1],false,false);

							game.eventhandler.addKeyboardControl(82, false, false, function(){ // R
								game.camera.position.z += 10;
							} );
							game.eventhandler.addKeyboardControl(70, false, false, function(){ // F
								game.camera.position.z -= 10;
							} );
							game.eventhandler.addKeyboardControl(84, false, false, function(){ // T
								game.scene.fog.density += 0.001
								console.log(game.scene.fog.density)
							} );
							game.eventhandler.addKeyboardControl(71, false, false, function(){ // G
								game.scene.fog.density -= game.scene.fog.density > 0 ? 0.001 : 0;
								console.log(game.scene.fog.density)
							} );
							game.eventhandler.addKeyboardControl(27, false, function(){ // escape
								game.pause();
								game.scene.fog.density = 0.0025;
								_this.menu("pause").load();
							},false,false );
							// ovládání panáčka
							game.eventhandler.addKeyboardControl(87, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // W
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.move(Math.PI);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.monster.mesh);
							} );
							game.eventhandler.addKeyboardControl(83, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // S
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.move(0);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.monster.mesh);
							} );
							game.eventhandler.addKeyboardControl(65, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // A
								game.objects.monster.toggleAnim("walking");
								// game.objects.monster.move(Math.PI/2);
								game.objects.monster.rotate(0.1);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.monster.mesh);
							} );
							game.eventhandler.addKeyboardControl(68, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // D
								game.objects.monster.toggleAnim("walking");
								// game.objects.monster.move(-Math.PI/2);
								game.objects.monster.rotate(-0.1);
								if(game.settings.graphics.camera == "topdown")
									game.camera.follow(game.objects.monster.mesh);
							} );

							},
		},
		pause : {
			objects : [
				new Button(500,100,{
					text : {
						value : "Resume",
						color : "#aaaaff",
						size : "55pt",
					},
					onmouseover : function (){
						this.textColor = "#000000";
					},
					onmouseout : function (){
						this.textColor = "#aaaaff";
					},
					onclick : function (){
						game.pause();
						game.scene.fog.density = 0;
						_this.menu("inGame").load();
					},
				}),
				new Button(500,170,{
					text : {
						value : "Save",
						color : "#aaaaff",
						size : "55pt",
					},
					onmouseover : function (){
						this.textColor = "#000000";
					},
					onmouseout : function (){
						this.textColor = "#aaaaff";
					},
					onclick : function (){
						alert("In development");
					},
				}),
				new Button(500,240,{
					text : {
						value : "Load",
						color : "#aaaaff",
						size : "55pt",
					},
					onmouseover : function (){
						this.textColor = "#000000";
					},
					onmouseout : function (){
						this.textColor = "#aaaaff";
					},
					onclick : function (){
						alert("In development");
					},
				}),
				new Button(500,310,{
					text : {
						value : "Achievements",
						color : "#aaaaff",
						size : "55pt",
					},
					onmouseover : function (){
						this.textColor = "#000000";
					},
					onmouseout : function (){
						this.textColor = "#aaaaff";
					},
					onclick : function (){
						alert("In development");
					},
				}),
				new Button(500,380,{
					text : {
						value : "Exit",
						color : "#aaaaff",
						size : "55pt",
					},
					onmouseover : function (){
						this.textColor = "#000000";
					},
					onmouseout : function (){
						this.textColor = "#aaaaff";
					},
					onclick : function (){
						_this.menu("mainM").load();
					},
				}),
			],
			preload : function (){},
			controls : function (){_this.menuControls(true);
				game.eventhandler.addKeyboardControl(27, false, function(){
								game.pause();
								game.scene.fog.density = 0;
								_this.menu("inGame").load();
							},false,false );
				},
		},
	};
	
	this.menu = function ( which ){
		//game.progress.mode = which;
		return new Menu(this.guis[which]);
	};
};

GUI.prototype = new GUIObject();

GUI.prototype.tick = function (){
	this.tickChildren();
};

GUI.prototype.render = function (){
	this.ctx.clearRect(0,0,this.width,this.height);
	
	this.renderChildren();
	// this.ctx.fillStyle = "#ffffff";
	// this.ctx.fillRect(game.eventhandler.mouse.x,game.eventhandler.mouse.y,10,10);
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

GUI.prototype.menuControls = function ( Initiate ){
	var _this = this;
	if(Initiate){
		game.eventhandler.keyboardControls = [];
		game.eventhandler.mouseControls = [];
		game.eventhandler.addMouseControl(0,function (){
			game.cursor.style.left = game.eventhandler.mouse.x + "px";
			game.cursor.style.top = game.eventhandler.mouse.y + "px";
			_this.eventHand("onmouseover");
			_this.eventHand("onmouseout");
			},false,false);
	game.eventhandler.addMouseControl(1,function (){
			_this.eventHand("onclick");
		},false,false);
	}
	else{
		var pole = new Array();
		pole[0] = function (){
			game.cursor.style.left = game.eventhandler.mouse.x + "px";
			game.cursor.style.top = game.eventhandler.mouse.y + "px";
			_this.eventHand("onmouseover");
			_this.eventHand("onmouseout");
		};
		pole[1] =function (){
			_this.eventHand("onclick");
		};
		return pole;
	};
};
