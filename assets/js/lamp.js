function Lamp( model, options ){
	this.options = options === undefined ? {} : options;

	this.geometry = model;

	this.initMesh();
	this.generateBoundingBox();
	this.initLight();
};
Lamp.prototype = new SolidObject();
// Lamp.prototype.constructor = Lamp;

// pokud má objekt nastavené animace, připraví je.
Lamp.prototype.initLight = function() {
	if(this.options.light){
		this.light = new THREE.PointLight(
			this.options.light.color || 0xffffff, 
			this.options.light.intensity);
		this.light.position = this.options.light.position || new THREE.Vector3(0,0,0);

		// debug kostka pro znázornění polohy světla
		var debug = new THREE.Mesh(new THREE.CubeGeometry(0.1,0.1,0.1), new THREE.MeshBasicMaterial( { color: 0xFF0000 } ));
		debug.position = this.options.light.position || new THREE.Vector3(0,0,0);
		// u mad, štěpán?
		this.mesh.add(this.light);
		this.mesh.add(debug);
	}
};