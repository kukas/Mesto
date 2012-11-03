function Character( model, options ){
	this.options = options === undefined ? {} : options;

	this.geometry = model;
	this.geometry.morphTargetsNeedUpdate = true

	this.initMesh();
	// this.generateBoundingBox();
	this.initAnimation();

	this.speed = options.speed || 5;
	this.turningSpeed = 0.05; // radiánů
}

Character.prototype = new SolidObject();

Character.prototype.move = function(direction) {
	var posun_x = Math.sin(direction-this.mesh.rotation.y)*this.speed;
	var posun_y = Math.cos(direction-this.mesh.rotation.y)*this.speed;
	this.mesh.position.x += posun_x;
	this.mesh.position.y += posun_y;
	var collisions = game.findCollisions( this );
	if( collisions.length !== 0 ){
		this.mesh.position.x -= posun_x;
		this.mesh.position.y -= posun_y;

		this.handleCollision(collisions, this);
	}
};
Character.prototype.rotate = function(direction) {
	if(direction < 0)
		angle = -this.turningSpeed;
	else
		angle = this.turningSpeed;
	this.mesh.rotation.y += angle;
	var collisions = game.findCollisions( this );
	if( collisions.length !== 0 ){
		this.mesh.rotation.y -= angle;
	}
};

Character.prototype.tick = function() {
	this.animate();
};