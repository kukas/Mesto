function Environment(width, height, image, stretch){
	this.geometry = new THREE.PlaneGeometry( 200, 200 );
    this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    this.mesh = new THREE.Mesh( geometry, material );

    // pozadi
		geometry = new THREE.PlaneGeometry( 5000, 5000 );
		texture = THREE.ImageUtils.loadTexture( image )
	if( !stretch ){
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.x = 5000/image.width;
		texture.repeat.y = 20;
	}
		
		material = new THREE.MeshBasicMaterial( { map:pozadiTexture } );

		pozadi = new THREE.Mesh( geometry, material );
		pozadi.position.z = -100
}