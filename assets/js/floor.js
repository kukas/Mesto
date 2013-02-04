function Floor(texture,width,height,stretch){
	Environment.call(this, texture,0,0,0,width,height,stretch);
	this.xBoundaries = {min:-width/2,max:width/2};
	this.yBoundaries = {min:-height/2,max:height/2};
};
Floor.prototype = Object.create(Environment.prototype);