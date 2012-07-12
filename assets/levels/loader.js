function Loader(){
	this.modelpath = "assets/models/";
	this.texturepath = "assets/textures/";
	this.musicpath = "assets/music/";
	this.soundpath = "assets/music/";

	this.textures = {};
	this.models = {};
	this.music = {};
	this.sounds = {};
}

Loader.prototype.afterLoad = function(){};