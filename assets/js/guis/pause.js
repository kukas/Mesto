{
	objects: function(){
		_this.add( new Button({
			x: _this.width/2-150, y: 100,
			width: 300, height: 60,
			visible: false,
			text : {
				value: "Resume",
				align: "center",
				styles: {
					default: {
						color: "#aaaaff",
						size: 60,
					}
				}
			},
			mouseover: function (){
				this.get("text").styles.default.color = "#000000";
			},
			mouseout: function (){
				this.get("text").styles.default.color = "#aaaaff";
			},
			mousedown: function (){
				game.pause();
				game.scene.fog.density = 0;
				_this.switchGUI("inGame");
			},
		}) );
		_this.add( new Button({
			x: _this.width/2-150, y: 170,
			width: 300, height: 60,
			visible: false,
			text : {
				value: "Save",
				align: "center",
				styles: {
					default: {
						color: "#aaaaff",
						size: 60,
					}
				}
			},
			mouseover: function (){
				this.get("text").styles.default.color = "#000000";
			},
			mouseout: function (){
				this.get("text").styles.default.color = "#aaaaff";
			},
			mousedown: function (){
				alert("In development");
			},
		}) );
		_this.add( new Button({
			x: _this.width/2-150, y: 240,
			width: 300, height: 60,
			visible: false,
			text : {
				value: "Load",
				align: "center",
				styles: {
					default: {
						color: "#aaaaff",
						size: 60,
					}
				}
			},
			mouseover: function (){
				this.get("text").styles.default.color = "#000000";
			},
			mouseout: function (){
				this.get("text").styles.default.color = "#aaaaff";
			},
			mousedown: function (){
				alert("In development");
			},
		}) );
		_this.add( new Button({
			x: _this.width/2-150, y: 310,
			width: 300, height: 60,
			visible: false,
			text : {
				value: "Achievements",
				align: "center",
				styles: {
					default: {
						color: "#aaaaff",
						size: 60,
					}
				}
			},
			mouseover: function (){
				this.get("text").styles.default.color = "#000000";
			},
			mouseout: function (){
				this.get("text").styles.default.color = "#aaaaff";
			},
			mousedown: function (){
				alert("In development");
			},
		}) );
		_this.add( new Button({
			x: _this.width/2-150, y: 380,
			width: 300, height: 60,
			visible: false,
			text : {
				value: "Exit",
				align: "center",
				styles: {
					default: {
						color: "#aaaaff",
						size: 60,
					}
				}
			},
			mouseover: function (){
				this.get("text").styles.default.color = "#000000";
			},
			mouseout: function (){
				this.get("text").styles.default.color = "#aaaaff";
			},
			mousedown: function (){
				_this.switchGUI("mainM");
			},
		}) );
	},
	preload : function (){},
	controls : function (){
		_this.addControls();
		game.eventhandler.addKeyboardControl(27, false, function(){
				game.pause();
				game.scene.fog.density = 0;
				_this.switchGUI("inGame");
			},false,false );
		},
}