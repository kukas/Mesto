function Jukebox(){
	this.soundsSrc = {};
	this.sounds = {};
}

Jukebox.prototype.loadSounds = function(soundsSrc, callback) {
	var _this = this;
	this.soundsSrc = soundsSrc;

	this.soundsToLoad = Object.keys(this.soundsSrc).length;
	if(this.soundsToLoad<=0)
		callback();
	for(var i in this.soundsSrc){
		(function(name, callback){
			var audio = new Audio();
			$(audio).on("loadeddata", function(){
				if( --_this.soundsToLoad <= 0 ){
					callback();
				}
			});
			audio.src = _this.soundsSrc[name];
			audio.volume = game.settings.audio.volume;

			_this.sounds[name] = audio;
		})(i, callback);
	}
};

Jukebox.prototype.get = function(name) {
	return this.sounds[name];
};

Jukebox.prototype.stopAll = function() {
	for(var i in this.sounds){
		this.sounds[i].stop();
	}
};

Audio.prototype.replay = function() {
	this.pause();
	this.currentTime = 0;
	this.play();
};

Audio.prototype.stop = function() {
	this.pause();
	this.currentTime = 0;
};