function GUI( canvas ){
	
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	
	this.objects = [];
	
	function Note(text,object){
		this.display = false;
		this.render = function (){
			var ctx = game.gui.ctx;
			ctx.save();
			ctx.translate(object.x,object.y);
			ctx.fillStyle = "#ffffff"
			ctx.fillRect(0,0,100,100);
			ctx.restore();
			console.log("vykreslovÃ¡nÃ­");
		};
	};
	
	function Button(x,y,options){
		this.x = x;
		this.y = y;
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
		
		this.tick = options.tick !== undefined ? options.tick : function (){};
		this.onmouseover = options.onmouseover !== undefined ? options.onmouseover : function (){};
		this.onmouseout = options.onmouseout !== undefined ? options.onmouseout : function (){};
		this.onclick = options.onclick !== undefined ? options.onclick : function (){};
		this.poznamka = options.poznamka !== undefined ? new Note(options.poznamka, this) : false; 
		
		this.render = function (){
			game.gui.ctx.font = this.size + " " + this.font;
			game.gui.ctx.fillStyle = this.textColor;
			if(this.img !== undefined){
				game.gui.ctx.drawImage(this.img,this.x+this.imgCoor.x,this.y+this.imgCoor.y,this.imgSize.x || game.gui.ctx.measureText(this.text).width,this.imgSize.y || parseInt(this.size));
			}
			if(this.poznamka && this.poznamka.display) this.poznamka.render(); 
			game.gui.ctx.fillText(this.text,this.x,this.y);
		};
		
		this.inButton = function (x,y){
			if(this.y > y && this.y-parseInt(this.size) <= y){
				game.gui.ctx.font = this.size + " " + this.font;
				if(this.x < x && this.x+game.gui.ctx.measureText(this.text).width > x){
					return true;
				}
				else{return false;}
			}
			else{return false;}
		};
	};
	
	function Background( img ){
		this.img = new Image();
		this.img.src = "assets/textures/" + img;
		this.tick = function(){
			
		};
		this.render = function (){
			game.gui.ctx.drawImage(this.img,0,0,game.gui.canvas.width,game.gui.canvas.height);
		};
	};
	
	function Menu( options ){
		this.buttons = options.buttons;
		this.bg = options.bg !== undefined ? options.bg : false;
		this.load = function (){
			game.gui.objects = [];
			options.preload();
			this.controls = options.controls;
			this.controls();
			this.bg ? game.gui.objects.push(this.bg) : false;
			for(var i in this.buttons){
				game.gui.objects.push(this.buttons[i]);
			};
			return this;
		};
	};
	
	this.guis = {
		mainM : {
			buttons : [
				new Button(500,100,{
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
				
				new Button(500,130,{
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
				
				new Button(500,160,{
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
				
				new Button(500,190,{
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
			controls : function (){game.gui.menuControls(true);},
		},
		inGame : {
			buttons : [
				new Button(10,window.innerHeight-10,{
					text:{
						value:"100",
						color:"#ffb400",
						size:"40pt",
					},
					onmouseover : function (){
						this.poznamka.display = true;
					},
					onmouseout : function (){
						this.poznamka.display = false;
					},
				}),],
			preload : function (){},
			controls : function (){game.eventhandler.addMouseControl(0,function(){
							game.gui.menuControls(false)[0]();
							game.camera.position.x = game.eventhandler.mouse.projected.x/10;
							game.camera.position.y = game.eventhandler.mouse.projected.y/10;
							});
							game.eventhandler.addMouseControl(1,game.gui.menuControls()[1],false,false);
							game.eventhandler.addKeyboardControl(82, false, false, function(){
								game.camera.position.z += 10;
							} );
							game.eventhandler.addKeyboardControl(70, false, false, function(){
								game.camera.position.z -= 10;
							} );
							game.eventhandler.addKeyboardControl(27, function(){
								game.pause();
								game.scene.fog.density = 0.0025;
								game.gui.menu("pause").load();
							},false,false );
							// ovládání panáèka
							game.eventhandler.addKeyboardControl(87, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // W
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.move(Math.PI/2);
								game.camera.follow(game.objects.monster.mesh);
							} );
							game.eventhandler.addKeyboardControl(83, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // S
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.move(-Math.PI/2);
								game.camera.follow(game.objects.monster.mesh);
							} );
							game.eventhandler.addKeyboardControl(65, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // A
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.rotate(0.05);
							} );
							game.eventhandler.addKeyboardControl(68, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // D
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.rotate(-0.05);
							} );

							},
		},
		pause : {
			buttons : [
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
						game.gui.menu("inGame").load();
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
						game.gui.menu("mainM").load();
					},
				}),
			],
			preload : function (){},
			controls : function (){game.gui.menuControls(true);
				game.eventhandler.addKeyboardControl(27, function(){
								game.pause();
								game.scene.fog.density = 0;
								game.gui.menu("inGame").load();
							},false,false );
				},
		},
	};
	
	this.menu = function ( which ){
		//game.progress.mode = which;
		return new Menu(this.guis[which]);
	};
};

GUI.prototype.tick = function (){
	for(var i in this.objects){
		this.objects[i].tick();
	};
};

GUI.prototype.render = function (){
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	for(var i in this.objects){
		this.objects[i].render();
	};
};

GUI.prototype.resize = function ( w, h ){
	var X = w/(this.canvas.width);
	var Y = h/(this.canvas.height);
	for(var i in this.objects){
		this.objects[i].x *= X;
		this.objects[i].y *= Y;
	};
	this.canvas.width = w;
	this.canvas.height = h;
};

GUI.prototype.menuControls = function ( Initiate ){
	if(Initiate){
		game.eventhandler.keyboardControls = [];
		game.eventhandler.mouseControls = [];
		game.eventhandler.addMouseControl(0,function (){
			for(var i in game.gui.objects){
				if(game.gui.objects[i].onmouseover !== undefined){
					if(game.gui.objects[i].inButton(game.eventhandler.mouse.x,game.eventhandler.mouse.y)){
						game.gui.objects[i].onmouseover();
					}
					else{
						game.gui.objects[i].onmouseout !== undefined ? game.gui.objects[i].onmouseout() : false;
					}
				}
			} },false,false);
	game.eventhandler.addMouseControl(1,function (){
		for(var i in game.gui.objects){
			if(game.gui.objects[i].onclick !== undefined && game.gui.objects[i].inButton(game.eventhandler.mouse.x,game.eventhandler.mouse.y)){
				game.gui.objects[i].onclick();
			}
		} },false,false);
	}
	else{
		var pole = new Array();
		pole[0] = function (){
			for(var i in game.gui.objects){
				if(game.gui.objects[i].onmouseover !== undefined){
					if(game.gui.objects[i].inButton(game.eventhandler.mouse.x,game.eventhandler.mouse.y)){
						game.gui.objects[i].onmouseover();
					}
					else{
						game.gui.objects[i].onmouseout !== undefined ? game.gui.objects[i].onmouseout() : false;
					}
				}
			}
		};
		pole[1] = function (){
			for(var i in game.gui.objects){
				if(game.gui.objects[i].onclick !== undefined && game.gui.objects[i].inButton(game.eventhandler.mouse.x,game.eventhandler.mouse.y)){
					game.gui.objects[i].onclick();
				}
			}
		};
		return pole;
	};
};