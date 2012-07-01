function SolidObject(model, x, y, interpolace){
    this.geometry = model;
    this.material = new THREE.MeshFaceMaterial();

    // bounding box pro debugging
	this.geometry.computeBoundingBox()
	bounding_geometry = new THREE.CubeGeometry( 
		this.geometry.boundingBox.max.x-this.geometry.boundingBox.min.x,
		this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y,
		this.geometry.boundingBox.max.z-this.geometry.boundingBox.min.z );
    bounding_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    bounding_mesh = new THREE.Mesh( bounding_geometry, bounding_material );
    bounding_mesh.position.y = (this.geometry.boundingBox.max.y-this.geometry.boundingBox.min.y)/2

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.set(x, y, 0);
    this.mesh.scale.set(100, 100, 100);
    this.mesh.rotation.x = Math.PI/2;

    // takhle se dají přidávat child objekty v three.js
    this.mesh.add( bounding_mesh );
    
    if( interpolace !== undefined ){
	this.animated = true;
	this.geometry.materials[0].morphTargets = true;
	// přídání času vytvoření, vhodné pro animace, dále také začáteční a konečný frame, součný keyframe
	// a celková délka animace
	this.creationTime = new Date().getTime();
	this.borderFrames = [1,40];
	this.keyframe = 0;
	this.animLength = interpolace*(this.borderFrames[1]-this.borderFrames[0]+1);
	this.interpolation = interpolace;
    }
    this.getPoradi = function (){
	    for(i in game.scene.__objects){
		if(this.mesh.id == game.scene.__objects[i].id){
			return i;
		}    
	    }
};
}