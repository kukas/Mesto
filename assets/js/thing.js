function Thing( model, options ){
	this.options = options === undefined ? {} : options;

	this.geometry = model;

	this.initMesh();
	this.generateBoundingBox();
	this.initAnimation();
}

Thing.prototype = new SolidObject();

SolidObject.prototype.tick = function() {
	this.animate();
};