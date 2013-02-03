function Loader(){
	this.modelpath = "assets/models/";
	this.texturepath = "assets/textures/";
	this.musicpath = "assets/music/";
	this.soundpath = "assets/sounds/";
	this.cutscenepath = "assets/cutscenes/";

	this.textures = {};
	this.models = {};
	this.music = {};
	this.sounds = {};
}

Loader.prototype.afterLoad = function(){};
	
Loader.prototype.add = function(obj, name) {
	if(name === undefined){
		var last = Object.keys(this.objects).length;
		while( this.objects[last] !== undefined ){
			last++;
		}
		this.objects[ last ] = obj;
	}
	else{
		this.objects[ name ] = obj;
	}
};