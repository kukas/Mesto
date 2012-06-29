function Level(){
	this.objects = [];
	this.sum = 2;
	this.loader = new THREE.JSONLoader();
	_this=this;
	
	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.set(0,0,1000);
	
	svetlo = new THREE.PointLight("0xdddddd", 3, 0);
	svetlo.position.set(0,0,0);
	this.objects.push(svetlo);
	
	_geometry = new THREE.CubeGeometry( 200, 200, 200 );
	_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	kostka = new THREE.Mesh( _geometry, _material );
	this.objects.push( kostka );
	
	//this.addObject("./assets/models/stul-rozb.js");
	
	this.addObject("./assets/models/lamp/untitled.js", {scale:{x:100,y:100,z:100}, position:{x:100,y:0,z:0}})
		
	/*this.addObject("./assets/models/velky-model.js", {
		scale:{x:100,y:100,z:100},
		rotation:{x:0,y:Math.PI/4,z:0},
		position:{x:50,y:50,z:0}
	});*/
	
	
}
Level.prototype.addObject = function (src, pole){
	this.loader.load(src, function (geometry) {
		var material = new THREE.MeshFaceMaterial();
		var mesh = new THREE.Mesh(geometry,material);
		if(pole !== undefined){
			pole.scale !== undefined ? mesh.scale.set(pole.scale.x,pole.scale.y,pole.scale.z) : mesh.scale.set(1,1,1);
			pole.rotation !== undefined ? mesh.rotation.set(pole.rotation.x+Math.PI/2,pole.rotation.y,pole.rotation.z) : mesh.rotation.set(Math.PI/2,0,0);
			pole.position !== undefined ? mesh.position.set(pole.position.x,pole.position.y,pole.position.z) : mesh.position.set(0,0,0);
		}
		else{
			mesh.rotation.x = Math.PI/2;
		}
		_this.objects.push(mesh);
	}
	);
	this.sum++;
};
var level = new Level();