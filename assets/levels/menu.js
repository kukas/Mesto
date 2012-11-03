function Level(){
	this.objects = {};
	this.textures = {
		rust: this.texturepath+"GUI/rust.jpg",
	};
}
Level.prototype = new Loader();

Level.prototype.afterLoad = function (){
	game.gui.switchGUI("mainM");
};
// umožní nám důležité objekty pojmenovávat (ty, se kterými budeme chtít dále pracovat i po pouhém přidání do scene - třeba player)
Level.prototype.add = function(obj, name) {
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

var level = new Level();