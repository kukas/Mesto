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
	this.geometry.computeBoundingBox();
	if(this.animation){
		var time = new Date().getTime();

		var vertices = this.geometry.morphTargets[ this.animation.keyframe ].vertices;
		var boundingBox = { min: new THREE.Vector3(), max: new THREE.Vector3() };
			
		var position, firstPosition = vertices[ 0 ];

		boundingBox.min.copy( firstPosition );
		boundingBox.max.copy( firstPosition );

		var min = boundingBox.min,
			max = boundingBox.max;

		for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {
			position = vertices[ v ];
			if ( position.x < min.x ) {
				min.x = position.x;
			} else if ( position.x > max.x ) {
				max.x = position.x;
			}

			if ( position.y < min.y ) {
				min.y = position.y;
			} else if ( position.y > max.y ) {
				max.y = position.y;
			}

			if ( position.z < min.z ) {
				min.z = position.z;
			} else if ( position.z > max.z ) {
				max.z = position.z;
			}
		}
		// console.log(this.animation.keyframe, min, max);
		this.geometry.boundingBox = boundingBox;
	}
	// Udělám kostku o daných rozměrech
	bounding_geometry = new THREE.CubeGeometry( 
	this.geometry.boundingBox.max.x-this.geometry.boundingBox.min.x,
	this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y,
	this.geometry.boundingBox.max.z-this.geometry.boundingBox.min.z );
	// Město modrá barva, protože debugging nástroje musí být také cool!
	bounding_material = new THREE.MeshBasicMaterial( { color: 0x5D739C, wireframe: true } );

	this.mesh.remove(this.bounding_mesh);
	this.bounding_mesh = new THREE.Mesh( bounding_geometry, bounding_material );

	// A napozicuje kostku doprostřed minima a maxima v každém směru (krom Y, tam to chceme nad povrchem)
	this.bounding_mesh.position.y = (this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y)/2
	this.bounding_mesh.position.x = (this.geometry.boundingBox.max.x+this.geometry.boundingBox.min.x)/2
	this.bounding_mesh.position.z = (this.geometry.boundingBox.max.z+this.geometry.boundingBox.min.z)/2

	// takhle se dají přidávat child objekty v three.js
	if(game.settings.debug)
		this.mesh.add( this.bounding_mesh );
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
	if(this.animation){
		var time = new Date().getTime();
		if(this.animation.toggledAnimation){
			this.animation.creationTime = time; // Aby animace začala od začátku
			this.animation.borderFrames = this.animation.modelAnimations[ this.animation.toggledAnimation ];
			this.animation.animLength = this.animation.interpolation*(this.animation.borderFrames[1]-this.animation.borderFrames[0]+1);
			
			this.animation.toggledAnimation = false;
		}
		var faze = (time-this.animation.creationTime) % this.animation.animLength;
		var frame = Math.floor(faze/this.animation.interpolation) + this.animation.borderFrames[0];
		if(frame != this.animation.keyframe || this.animation.interpolation == this.animation.animLength){
			// Zakomentuj pro never ending source of lulz:
			this.mesh.morphTargetInfluences[this.animation.keyframe] = 0;
			this.mesh.morphTargetInfluences[frame] = 1;

			this.animation.keyframe = frame;

			this.generateBoundingBox()
		}
	}
};

//metoda pro přepínání mezi animacemi
SolidObject.prototype.toggleAnim = function( animID ) {
	if(this.animation.modelAnimations[animID] !== undefined){
		if(this.animation.currentAnimation != animID){
			this.animation.currentAnimation = animID;
			if(this.animation.keyframe === undefined){
				this.animation.creationTime = new Date().getTime(); // Aby animace začala od začátku
				this.animation.borderFrames = this.animation.modelAnimations[ animID ];
				this.animation.keyframe = this.animation.borderFrames[0];
				this.animation.animLength = this.animation.interpolation*(this.animation.borderFrames[1]-this.animation.borderFrames[0]+1);
				this.mesh.morphTargetInfluences[this.animation.keyframe] = 0; // Musí se zrušit ovlivňování stavů z minulých animací
			}
			else {
				this.animation.toggledAnimation = animID;
			}
		}
	}
	else{
		console.log("No animation with ID " + animID + " for this model");
	}
};