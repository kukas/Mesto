function SolidObject(options){
	options = options === undefined ? {} : options;
	this.name = options.name;
	// pouze výplň, dokud se neobjeví opravdové geometry, material a mesh
	this.geometry = options.model === undefined ? new THREE.Geometry() : options.model;
	this.material = options.material === undefined ? new THREE.MeshFaceMaterial() : options.material;

	this.mesh = new THREE.Mesh( this.geometry, this.material );

	if(options.castShadow !== false){
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
	}

	this.mesh.rotation.x = Math.PI/2;
	if( options.scale !== undefined )
		this.mesh.scale = options.scale;
	if( options.position !== undefined )
		this.mesh.position = options.position;
	if( options.rotation !== undefined )
		this.mesh.rotation.addSelf(options.rotation);

	// vygeneruje boundingbox kvůli kolizím
	this.generateBoundingBox();
	this.colliding = true;

	// pokud má objekt nastavené animace, připraví je.
	if( options.animation !== undefined ){
		this.animation = options.animation;

		// materiály se mění v závislosti na čase
		for(var m in this.geometry.materials){
			this.geometry.materials[m].morphTargets = true;
		}
		
		this.toggleAnim(this.animation.startingAnimation);
	}

	if( options.light !== undefined ){
		this.initLight(options.light);
	}
};

SolidObject.prototype.tick = function() {
	if(this.animation){
		this.animate();
	}
};

SolidObject.prototype.onCollide = function() {
	// args: object (ten, co narazil)
};

SolidObject.prototype.handleCollision = function(collisions, object) {
	for(var i in collisions){
		collisions[i].onCollide(object);
	}
};

// ohraničí objekt krásným, modrým kvádrem
SolidObject.prototype.generateBoundingBox = function() {
	// bounding box pro debugging
	// interní funkce Three.JS - vypočítá rozměry boundingboxu (minima a maxima ve 3 rozměrech)
	this.geometry.computeBoundingBox();
	if(this.animation){
		if(this.animation.boundingFrame === undefined){
			var keyframe = this.animation.keyframe;
		}
		else {
			var keyframe = this.animation.boundingFrame;
		}

		var vertices = this.geometry.morphTargets[ keyframe ].vertices;

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
		this.geometry.boundingBox = boundingBox;
	}
	if(game.settings.debug){
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
		this.bounding_mesh.position.x = (this.geometry.boundingBox.max.x+this.geometry.boundingBox.min.x)/2
		this.bounding_mesh.position.y = (this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y)/2
		this.bounding_mesh.position.z = (this.geometry.boundingBox.max.z+this.geometry.boundingBox.min.z)/2
		
		// takhle se dají přidávat child objekty v three.js
		this.mesh.add( this.bounding_mesh );
	}
};

SolidObject.prototype.animate = function (){
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

// přidá světla
SolidObject.prototype.initLight = function(options) {
	this.light = new THREE.SpotLight(
		options.color, 
		options.intensity,
		options.distance,
		undefined, // angle - vůbec nevim na co to je
		options.exponent);
	this.light.position = options.position || new THREE.Vector3(0,0,0);
	
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
};