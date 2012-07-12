function Jukebox(){
	this.soundsSrc = {};
	this.sounds = {};
}

Jukebox.prototype.loadSounds = function(soundsSrc, callback) {
	var _this = this;
	this.soundsSrc = soundsSrc;

	this.soundsToLoad = Object.keys(this.soundsSrc).length;
	for(var i in this.soundsSrc){
		(function(name, callback){
			var audio = new Audio();
			$(audio).on("loadeddata", function(){
				if( --_this.soundsToLoad <= 0 ){
					callback();
				}
			});
			audio.src = _this.soundsSrc[name];
			audio.volume = 1;

			_this.sounds[name] = audio;
		})(i, callback);
	}
};

Audio.prototype.replay = function() {
	this.pause();
	this.currentTime = 0;
	this.play();
};

// J j