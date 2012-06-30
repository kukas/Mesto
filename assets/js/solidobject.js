function SolidObject(model, x, y){
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
}