function Textures(){
	this.texturesSrc = {};
	this.textures = {};
};
// bonus pro kohokoli, kdo tohle přepíše do obecné varianty pro modely, hudbu a textury. Mě bolí hlava.
Textures.prototype.loadTextures = function(texturesSrc, callback) {
	var _this = this;
	this.texturesSrc = texturesSrc;

	this.texturesToLoad = Object.keys(this.texturesSrc).length;
	for(var i in this.texturesSrc){
		(function(name, callback){
			_this.textures[name] = THREE.ImageUtils.loadTexture(_this.texturesSrc[i], undefined, function(){
				if( --_this.texturesToLoad <= 0 ){
					callback();
				}
			});
		})(i, callback)
	}
};