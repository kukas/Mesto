{
	objects: function(){
		_this.add( new Rectangle({
			x:0, y:0,
			width: _this.width, height: _this.height,
			color: "#000000"
		}), "background" );
		_this.add( new Text({
			value: " ",
			x: 0, y: _this.height - 110,
			width: _this.width, height: 50,
			align: "center",
			styles: {
				default: {
					color: "#FFFFFF",
					size: 50
				}
			}
		}), "subtitles" )
	},
	startTime: 0,
	tick: function(){
		var time = new Date().getTime() - this.startTime;
		for(var script in this.scene){
			if(this.scene[script].current === undefined)
				this.scene[script].current = -1;
			for(var stime in this.scene[script]){
				if(stime == "current")
					continue;
				if(stime > this.scene[script].current && stime <= time){
					this.scene[script].current = stime;
					if(script == "scenes"){
						// zachová pozadí a titulky ale vymaže vše ostatní
						var background = _this.get("background");
						var sub = _this.get("subtitles");
						_this.add( background );
						_this.children = [];
						// přidá vrstvy z cutscény
						for(var l in this.scene.scenes[this.scene[script].current]){
							var layer = new Layer(this.scene.scenes[this.scene[script].current][l]);
							_this.add( layer );
							console.log(layer)
						};
						_this.add( sub );
					}
					else if(script == "subtitles"){
						_this.get("subtitles").changeText(this.scene.subtitles[this.scene[script].current]);
					}
					else if(script == "dubbing"){
						this.scene.dubbing[this.scene[script].current].replay();
					}
					else if(script == "script"){
						this.scene.script[this.scene[script].current]();
					}
				}
			}
		}
	},
	controls: function(){
		game.eventhandler.addKeyboardControl(" ", undefined, function(){
			console.log("exitting")
		} );
	},
	// speciální pro cutscene
	switchCutscene: function(cutscene){
		var _this = this;
		$.get("./assets/cutscenes/"+cutscene+".js", function(data) {
			_this.scene = eval("(function(){return " + data + ";})()");
			_this.startTime = new Date().getTime();
			game.gui.switchGUI("cutscene");
		});
	}
}