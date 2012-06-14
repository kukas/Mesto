var game;
$(document).ready( function(){
	// Zjištění WebGL podpory
	if( !Detector.webgl ){
		Detector.addGetWebGLMessage();
		return;
	}
	// Zavedení objektu game
	game = new Game();
	
	game.eventhandler = new Eventhandler();
	
	game.init();
	
	
} );