function GUI( canvas ){//game.pause();game.scene.fog.density == 0 ? game.scene.fog.density = 0.0025 : game.scene.fog.density = 0;
	
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	
	this.objects = [];
	
	function Button(x,y,options){
		this.x = x;
		this.y = y;
		this.text = options.text.value;
		if(options.img !== undefined){
			this.img = new Image();
			this.img.src = "assets/textures/" + options.img;
		}
		this.textColor = options.text.color === undefined ? "#ffffff" : options.text.color;
		this.size = options.text.size === undefined ? "20pt" : options.text.size;
		this.font = options.text.font === undefined ? "VT220" : options.text.font;
		this.tick = function(){
			
		};
		this.render = function (){
			game.gui.ctx.font = this.size + " " + this.font;
			game.gui.ctx.fillStyle = this.textColor;
			if(this.img !== undefined){
				game.gui.ctx.drawImage(this.img,this.x,this.y-parseInt(this.size),game.gui.ctx.measureText(this.text).width,parseInt(this.size));
			}
			game.gui.ctx.fillText(this.text,this.x,this.y);
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
				new Button(100,100,{
					text:{
						value:"První tlačítko",
						color:"#aaaaff",
						size:"25pt",
						font:"sans-serif",
					},
					img:"blue.jpg",
				}),
			],
			bg : new Background ("bg.png"),
			preload : function (){game.scene = new THREE.Scene();},
			controls : function (){game.eventhandler.keyboardControls = [];game.eventhandler.mouseControls = [];game.eventhandler.addKeyboardControl(13,false,function (){game.mode = 1;game.load("test");});},
		},
		inGame : {
			buttons : [
				new Button(10,window.innerHeight-10,{
					text:{
						value:"100",
						color:"#ffb400",
						size:"40pt",
					},
				}),],
			preload : function (){},
			controls : function (){
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
							game.eventhandler.addKeyboardControl(76, false, false, function(){ // L
								console.log(game.scene)
							} );

							game.eventhandler.addKeyboardControl(27, false, function(){ // escape
								game.pause();
							}, false );

							game.eventhandler.addKeyboardControl(88, false, function(){ // X
								game.objects.monster.generateBoundingBox();
							}, false );
							
							// ovládání panáčka
							game.eventhandler.addKeyboardControl(87, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // W
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.move(Math.PI);
							} );
							game.eventhandler.addKeyboardControl(83, false, function(){
								game.objects.monster.toggleAnim("standing");
							}, function(){ // S
								game.objects.monster.toggleAnim("walking");
								game.objects.monster.move(0);
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
	};
	
	this.menu = function ( which ){
		//game.progress.mode = which;
		return new Menu(this.guis[which]);
	};
};

GUI.prototype.tick = function (){
	for(i in this.objects){
		this.objects[i].tick();
	};
};

GUI.prototype.render = function (){
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	for(i in this.objects){
		this.objects[i].render();
	};
};

GUI.prototype.resize = function ( w, h ){
	var X = w/(this.canvas.width);
	var Y = h/(this.canvas.height);
	for(i in this.objects){
		this.objects[i].x *= X;
		this.objects[i].y *= Y;
	};
	this.canvas.width = w;
	this.canvas.height = h;
};
