function Lamp( model, options ){
	this.options = options === undefined ? {} : options;

	this.geometry = model;

	this.initMesh();
	this.generateBoundingBox();
	this.initLight();
};
Lamp.prototype = new SolidObject();

// pokud má objekt nastavené animace, připraví je.
Lamp.prototype.initLight = function() {
	if(this.options.light){
		this.light = new THREE.SpotLight(
			this.options.light.color, 
			this.options.light.intensity,
			this.options.light.distance,
			undefined, // angle - vůbec nevim na co to je
			this.options.light.exponent);
		this.light.position = this.options.light.position || new THREE.Vector3(0,0,0);
		
		this.mesh.add(this.light.target);
		this.light.target.position.x = this.light.position.x;

		this.light.castShadow = true;

		this.light.shadowCameraNear = 10;
		this.light.shadowCameraFar = 300;
		this.light.shadowCameraFov = 165;

		this.light.shadowCameraVisible = game.settings.debug;

		this.light.shadowMapWidth = game.settings.graphics.shadows.shadowMapWidth;
		this.light.shadowMapHeight = game.settings.graphics.shadows.shadowMapHeight;
		this.light.shadowBias = 0;
		this.light.shadowDarkness = 0.5;

		// u mad, štěpán?
		this.mesh.add(this.light);
	}
};