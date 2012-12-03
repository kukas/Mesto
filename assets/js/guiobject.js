function GUIObject(options){
	options = options === undefined ? {} : options;
	this.x = options.x === undefined ? 0 : options.x;
	this.y = options.y === undefined ? 0 : options.y;
	this.width = options.width === undefined ? 0 : options.width;
	this.height = options.height === undefined ? 0 : options.height;

	this.visible = options.visible === undefined ? true : options.visible;

	this.mouseIn = false;

	this.mouseover = options.mouseover === undefined ? function(){} : options.mouseover;
	this.mouseout = options.mouseout === undefined ? function(){} : options.mouseout;
	
	this.mousedown = options.mousedown === undefined ? function( which ){} : options.mousedown;
	this.mouseup = options.mouseup === undefined ? function( which ){} : options.mouseup;

	this.mousescroll = options.mousescroll === undefined ? function( speed ){} : options.mousescroll;

	this.parent = false;
	this.children = options.children === undefined ? [] : options.children;
	this.links = {};
}

GUIObject.prototype.add = function( obj, name ) {
	obj.parent = this;
	this.children.push( obj );

	if(name){
		this.links[name] = obj;
	}
};

GUIObject.prototype.remove = function(obj){
	var search = this.children.indexOf(obj);
	if(search > -1){
		this.children.splice(search, 1);
	}

	for (var i in this.links) {
		if(this.links[i] == obj)
			delete this.links[i];
	};
};
GUIObject.prototype.removeAll = function (){
	this.children.splice(0,this.children.length);
	this.links = {};
};
// returne požadované dítě
GUIObject.prototype.get = function( name, recursive ) {
	// ***** TODO: Rekurzivní hledání linku *****
	// if(recursive && this.links[name] === undefined){
	// 	for(var i = 0; i < this.children.length; i++){
	// 		var child = this.children[i].get(name, true);
	// 	}
	// 	return child;
	// }
	return this.links[name];
};

GUIObject.prototype.tickChildren = function (){
	// mouseHandling
	if(this.mouseIn && this.mouseover){
		this.mouseover();
	}

	for (var i = 0; i < this.children.length; i++){
		this.children[i].tick();
		if(this.children[i].tickChildren)
			this.children[i].tickChildren();
	};
};

GUIObject.prototype.renderChildren = function (ctx){
	ctx.save();
	ctx.translate(this.x, this.y);
	for (var i = 0; i < this.children.length; i++){
		if(this.children[i].visible)
			this.children[i].render(ctx);
		if(this.children[i].renderChildren)
			this.children[i].renderChildren(ctx);
	};
	ctx.restore();
};

GUIObject.prototype.tick = function (){
	return;
};

GUIObject.prototype.render = function (ctx){
	return;
};

GUIObject.prototype.mousehandler = function(x,y,type) {
	this.mouseIn = false;
	if((this[type] || (type == "mousemove" && (this.mouseover || this.mouseout))) && !(this instanceof GUI)){
		if( x > this.x && x < this.x+this.width &&
			y > this.y && y < this.y+this.height){
			if(type != "mousemove"){
				this[type]();
			}
			else if(this.mouseover){
				this.mouseIn = true;
				// samotná funkce se vykoná v ticku
			}
		}
		else if(this.mouseout){
			this.mouseout();
		}
	}
	for (var i = 0; i < this.children.length; i++){
		this.children[i].mousehandler(x-this.x,y-this.y,type);
	}
};

GUIObject.prototype.resize = function (X,Y,condition){
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
		if(obj.children.length > 0) obj.resize(X,Y);
	};
};