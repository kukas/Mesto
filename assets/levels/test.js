function Level(){
	this.objects = [];

	geometry = new THREE.CubeGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	mesh = new THREE.Mesh( geometry, material );
	
	this.objects.push( mesh );
}
var level = new Level();