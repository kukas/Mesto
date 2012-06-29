function Models(){
	this.textures = [];
	_this=this;
};
Models.prototype.count = function (){
	var v =0;
	for(i in this.objects){
		v++;
	};
	return v;
};
Models.prototype.loadModels = function (level){
	if(level.sum == level.objects.length){
		for(i in level.objects){
			game.scene.add(level.objects[i]);
		};
	}
	else{
		loadloop = window.setInterval( function () {
			if(level.sum == level.objects.length){
				for(i in level.objects){
					game.scene.add(level.objects[i]);
				};
				window.clearInterval(loadloop);
			}
			console.log("int");
			}, 10
		);
	}
};