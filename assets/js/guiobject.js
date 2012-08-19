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
		this.children.push( obj );
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
	
	this.inThis = function (mx,my,modX,modY){
		var x = modX !== undefined ? this.x+modX : this.x;
		var y = modY !== undefined ? this.y+modY : this.y;
		if(y > my && y+this.height <= my){
				if(x < mx && x+this.width > mx){
					return true;
				}
				else{return false;}
			}
			else{return false;}
	};
	
	this.eventHand = function (definer,modX,modY){
		if(definer !== "onmouseout"){
			if(this.inThis(game.eventhandler.mouse.x,game.eventhandler.mouse.y,modX,modY)){
				this[definer] !== undefined ? this[definer]() : false;
			}
		}
		else{
			if(!this.inThis(game.eventhandler.mouse.x,game.eventhandler.mouse.y,modX,modY))
			this[definer] !== undefined ? this[definer]() : false;
		}
		for(var i in this.children){
			this.children[i].eventHand(definer,this.x+modX,this.y+modY)
		};
	};
	
	this.getContext = function (){
		if(this.ctx !== undefined) return this.ctx;
		else if(this.parent.ctx !== undefined) return this.parent.ctx;
		else if(this.parent) this.parent.getContext();
	};
};