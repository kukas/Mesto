function Character( model, options ){
	this.options = options === undefined ? {} : options;

	this.geometry = model;

	this.initMesh();
	this.generateBoundingBox();
	this.initAnimation();

	this.speed = options.speed || 5;
}

Character.prototype = new SolidObject();

Character.prototype.move = function(direction) {
	this.mesh.position.x += Math.sin(direction-this.mesh.rotation.y)*this.speed;
	this.mesh.position.y += Math.cos(direction-this.mesh.rotation.y)*this.speed;
};
Character.prototype.rotate = function(angle) {
	this.mesh.rotation.y += angle;
};

Character.prototype.tick = function() {
	this.animate();
};