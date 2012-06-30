function Models(){
	this.texturepath = "assets/textures";

	this.modelsSrc = {};
	this.models = {};
	this.loader = new THREE.JSONLoader();
};

Models.prototype.loadModels = function(modelsSrc, callback) {
	var _this = this;
	this.modelsSrc = modelsSrc;

	this.modelsToLoad = Object.keys(this.modelsSrc).length;
	for(var i in this.modelsSrc){
		(function(name, callback){
			_this.loader.load(_this.modelsSrc[i], function(geometry){
				_this.models[name] = geometry;
				if( --_this.modelsToLoad <= 0 ){
					callback();
				}
			}, _this.texturepath);
		})(i, callback)
	}
};