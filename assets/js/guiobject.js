function GUIObject(){
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	
	this.rotation = 0;
	
	this.onmouseover = false;
	this.onclick = false;
	this.onrightclick = false;
	
	this.parent = false;
	this.children = [];
	
	this.add = function ( obj ){
		obj.parent = this;
		obj.ctx = this.ctx;
		this.children.push( obj );
		console.log(obj);
	};
	
	this.tickChildren = function (){
		for (i in this.children){
			this.children[i].tick();
			this.children[i].tickChildren();
		};
	};
	
	this.renderChildren = function (){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.rotation);
		for (i in this.children){
			this.children[i].render();
			this.children[i].renderChildren();
		};
		ctx.restore();
	};
	
	this.tick = function (){
		
	};
	
	this.render = function (){
		
	};
	
	this.resize = function (X,Y,condition){
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
			if(condition && obj.size !== undefined){
				var cislo = parseInt(obj.size);
				var pripona = obj.size.split(parseInt(obj.size).toString())[1];
				cislo = Math.floor(cislo*X);
				obj.size = cislo+pripona;
			}
			else if(obj.size !== undefined){
				var cislo = parseInt(obj.size);
				var pripona = obj.size.split(parseInt(obj.size).toString())[1];
				cislo = Math.floor(cislo*Y);
				obj.size = cislo+pripona;
			}
			if(obj.children.length > 0) obj.resize(x,y);
		};
	};
	
	this.getMouse = function (){
		var mouse = {x:game.eventhandler.mouse.x,y:game.eventhandler.mouse.y};
		mouse.x-=this.x;
		mouse.y-=this.y;
		return mouse;
	};
};