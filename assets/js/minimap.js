function Minimap(objects,options){
	this.objects = objects;
	Rectangle.call(this, options);
	this.zoomX = this.width/window.innerWidth;
	this.zoomY = this.height/window.innerHeight;
};
Minimap.prototype.tick = function (){
	_this = this;
	this.children = [];
	for(var i in this.objects){
		this.add(new Rectangle({
			color:"#00ff00",
			x:zoomX*(_this.objects[i].position.x+_this.objects[i].bounding_mesh.position.x),
			y:zoomY*(_this.objects[i].position.y+_this.objects[i].bounding_mesh.position.y),
			width:zoomX*(_this.objects[i].geometry.boundingBox.max.x-_this.objects[i].geometry.bounidngBox.min.x),
			height:zoomY*(_this.objects[i].geometry.boundingBox.max.y-_this.objects[i].geometry.bounidngBox.min.y),
			}));
	};
};