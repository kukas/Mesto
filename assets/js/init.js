var game, stats;
$(document).ready( function(){
	// Zjištění WebGL podpory
	if( !Detector.webgl ){
		Detector.addGetWebGLMessage();
		return;
	}
	// Zavedení objektu game
	stats = new Stats();
	stats.setMode(1); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = '100';

	document.body.appendChild( stats.domElement );

	game = new Game();

	game.init();

} );