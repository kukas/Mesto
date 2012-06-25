function Level(){
	this.objects = [];
	this.loader = new THREE.JSONLoader();
	_this=this;

<<<<<<< HEAD
	geometry = new THREE.CubeGeometry( 10, 10, 10 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	mesh = new THREE.Mesh( geometry, material );
=======
	_geometry = new THREE.CubeGeometry( 200, 200, 200 );
	_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	_mesh = new THREE.Mesh( _geometry, _material );
>>>>>>> 8647bfe422ded239a938fb7e336795bc95b9d5e0
	
	this.loader.load("./assets/models/stul-rozb.js", function ( geometry ) {
			material = new THREE.MeshFaceMaterial();
			mesh = new THREE.Mesh(geometry,material);
			mesh.position.set(0,0,0);
			_this.objects.push(mesh);
		}
	);
	
	this.objects.push( _mesh );
}
var level = new Level();