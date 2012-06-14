function Game(){
	this.eventhandler;
	this.init = function (){
		var renderer = new THREE.WebGLRenderer();
		renderer.width = window.innerWidth;
		renderer.height = window.innerHeight;
		window.onResize = function(){
			renderer.width = window.innerWidth;
			renderer.height = window.innerHeight;
		};
		document.body.appendChild(renderer);
	};
	return;
}
Game.prototype.init = function() {
	return;
};