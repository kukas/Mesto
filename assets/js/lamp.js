function Lamp(model, x, y, options){
	
	this.prototype = new SolidObject(model,x,y,options);
	
	
	if(options.light.on){
		var svetlo = new THREE.PointLight((options.light.color || 0xffffff), options.light.intensity);
		svetlo.position = options.light.position !== undefined ? options.light.position : new THREE.Vector3(0,0,0);
		this.prototype.mesh.add(svetlo);
	}
	
	this.mesh = this.prototype.mesh;
};
Lamp.prototype.constructor = Lamp;