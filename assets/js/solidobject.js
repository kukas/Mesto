function SolidObject(){
	// pouze výplň, dokud se neobjeví opravdové geometry, material a mesh
	this.geometry = new THREE.Geometry();
	this.material = new THREE.MeshFaceMaterial();

	this.colliding = true;
}

SolidObject.prototype.tick = function() {
	
};

SolidObject.prototype.initMesh = function() {
	this.mesh = new THREE.Mesh( this.geometry, this.material );

	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;

	this.mesh.rotation.x = Math.PI/2;
	if( this.options.scale !== undefined )
		this.mesh.scale = this.options.scale;
	if( this.options.position !== undefined )
		this.mesh.position = this.options.position;
	if( this.options.rotation !== undefined )
		this.mesh.rotation = this.options.rotation;
};

// ohraničí objekt krásným, modrým kvádrem
SolidObject.prototype.generateBoundingBox = function() {
	// bounding box pro debugging
	// interní funkce Three.JS - vypočítá rozměry boundingboxu (minima a maxima ve 3 rozměrech)
	this.geometry.computeBoundingBox()
	// Udělám kostku o daných rozměrech
	bounding_geometry = new THREE.CubeGeometry( 
	this.geometry.boundingBox.max.x-this.geometry.boundingBox.min.x,
	this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y,
	this.geometry.boundingBox.max.z-this.geometry.boundingBox.min.z );
	// Město modrá barva, protože debugging nástroje musí být také cool!
	bounding_material = new THREE.MeshBasicMaterial( { color: 0x5D739C, wireframe: true } );
	bounding_mesh = new THREE.Mesh( bounding_geometry, bounding_material );
	// A napozicuje kostku doprostřed minima a maxima v každém směru (krom Y, tam to chceme nad povrchem)
	bounding_mesh.position.y = (this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y)/2
	bounding_mesh.position.x = (this.geometry.boundingBox.max.x+this.geometry.boundingBox.min.x)/2
	bounding_mesh.position.z = (this.geometry.boundingBox.max.z+this.geometry.boundingBox.min.z)/2

	// takhle se dají přidávat child objekty v three.js
	if(game.settings.debug)
		this.mesh.add( bounding_mesh );
};

// pokud má objekt nastavené animace, připraví je.
SolidObject.prototype.initAnimation = function() {
	if( this.options.animation !== undefined ){
		this.animation = this.options.animation;

		// materiály se mění v závislosti na čase
		this.geometry.materials[0].morphTargets = true;
		
		this.toggleAnim(this.animation.startingAnimation);
	}
};

SolidObject.prototype.animate = function (){
	var time = new Date().getTime();
	if(this.animation){
		var faze = (time-this.animation.creationTime) % this.animation.animLength;
		var frame = Math.floor(faze/this.animation.interpolation) + this.animation.borderFrames[0]-1;
		if(frame != this.animation.keyframe || this.animation.interpolation == this.animation.animLength){
			this.mesh.morphTargetInfluences[this.animation.keyframe] = 0;
			this.mesh.morphTargetInfluences[frame] = 1;
			this.animation.keyframe = frame;
		}
	}
};

//metoda pro přepínání mezi animacemi
SolidObject.prototype.toggleAnim = function( animID ) {
	if(this.animation.modelAnimations[animID] !== undefined){
		if(this.animation.currentAnimation != animID){
			this.animation.currentAnimation = animID;
			if(this.animation.keyframe !== undefined)
				this.mesh.morphTargetInfluences[this.animation.keyframe] = 0; // Musí se zrušit ovlivňování stavů z minulých animací
			this.animation.creationTime = new Date().getTime(); // Aby animace začala od začátku
			this.animation.borderFrames = this.animation.modelAnimations[animID];
			this.animation.keyframe = this.animation.borderFrames[0]-1;
			this.animation.animLength = this.animation.interpolation*(this.animation.borderFrames[1]-this.animation.borderFrames[0]+1);
		}
	}
	else{
		console.log("No animation with ID " + animID + " for this model");
	}
};