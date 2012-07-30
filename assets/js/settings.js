function Settings(){
	this.debug = true;

	this.graphics = {
		resolution: {
			width: "auto",
			height: "auto",
			// // po odkomentování: RETRO!!
			// width: window.innerWidth/8,
			// height: window.innerHeight/8
		},
		shadows: {
			shadowMapEnabled: true,
			shadowMapSoft: true,
			shadowMapWidth: 512,
			shadowMapHeight: 512,

			// neimplementováno:
			castShadow: "all" // all, characters, player
		},
		camera: "topdown" // third_person, first_person, rotating_topdown, topdown
	}
	this.audio = {
		volume: 1
	}

	this.loadSettings();
}

Settings.prototype.loadSettings = function() {
	// json loader
	// localStorage.getItem('settings')
	return
};

Settings.prototype.saveSettings = function() {
	// json loader
	// localStorage.śetItem('settings')
	return
};

Settings.prototype.get = function(name) {
	var name_array = name.split(".");
	var opened = this.options;
	for(var i in name_array){
		if(opened[i]){
			opened = opened[i];
		}
	}
};