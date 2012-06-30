function Loader(){
	this.modelpath = "assets/models/";
	this.texturepath = "assets/textures/";
	this.musicpath = "assets/music/";

	this.textures = {};
	this.models = {};
	this.sounds = {};
}

Loader.prototype.afterLoad = function(){};