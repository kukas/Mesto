function GUI(){
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
		this.font = options.text.font === undefined ? "sans-serif" : options.text.size;
		this.tick = function(){
			this.render();
		};
		this.render = function (){
			game.ctx.font = this.size + " " + this.font;
			game.ctx.fillStyle = this.textColor;
			if(this.img !== undefined){
				game.ctx.drawImage(this.img,this.x,this.y-parseInt(this.size),game.ctx.measureText(this.text).width,parseInt(this.size));
			}
			game.ctx.fillText(this.text,this.x,this.y);
		};
	};
	
	function Background( img ){
		this.img = new Image();
		this.img.src = "assets/textures/" + img;
		this.tick = function(){
			this.render();
		};
		this.render = function (){
			game.ctx.drawImage(this.img,0,0,game.canvas.width,game.canvas.height);
		};
	};
	
	function Menu( options ){
		this.buttons = options.buttons;
		this.bg = options.bg;
		this.load = function (){
			options.preload();
			this.controls = options.controls;
			this.controls();
			game.objects.push(this.bg);
			for(var i in this.buttons){
				game.objects.push(this.buttons[i]);
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
					},
					img:"blue.jpg",
				}),
			],
			bg : new Background ("bg.png"),
			preload : function (){game.scene = new THREE.Scene();},
			controls : function (){game.eventhandler.keyboardControls = [];game.eventhandler.mouseControls = [];game.eventhandler.addKeyboardControl(13,false,function (){game.load("test");});},
		},
	};
	
	this.menu = function ( which ){
		//game.progress.mode = which;
		return new Menu(this.guis[which]);
	};
};

