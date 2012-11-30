{
	objects : function(){
		// background obrázek
		_this.add( new Texture({
			image: game.textures.textures.rust,
			x: 0,y: 0,
			width: _this.width, height: _this.height
		}) )
		// modrý obdélník
		_this.add( new Rectangle({
			x: _this.width/2 - 150, y: 50,
			width: 300, height: 500,
			color: "#4b5c9a"
		}), "menuRectangle" );
		// nápis město
		_this.get("menuRectangle").add( new Text({
			value: "Mesto",
			align: "center",
			width: _this.get("menuRectangle").width,
			styles: {
				default: {
					color: "#DAE5F0",
					size: 60,
				}
			}
		}) );
		// buttony
		_this.get("menuRectangle").add( new Button({
			x: 0, y: 100,
			width: _this.get("menuRectangle").width, height: 50,
			color: "#4b5c9a",
			text:{
				y: 12,
				value:"Start Game",
				align: "center",
				styles: {
					default: {
						color: "#DAE5F0",
						font: "Arial",
						size: 20,
					}
				}
			},
			mouseover:function (){
				this.color = "#5C6894";
				this.get("text").styles.default.color = "#E6ECF2";
			},
			mouseout:function (){
				this.color = "#4b5c9a";
				this.get("text").styles.default.color = "#DAE5F0";
			},
			mousedown:function (){
				game.mode = 1;
				game.load("test");
			},
		}) );
		_this.get("menuRectangle").add( new Button({
			x: 0, y: 150,
			width: _this.get("menuRectangle").width, height: 50,
			color: "#4b5c9a",
			text:{
				y: 12,
				value:"Load",
				align: "center",
				styles: {
					default: {
						color: "#DAE5F0",
						font: "Arial",
						size: 20,
					}
				}
			},
			mouseover:function (){
				this.color = "#5C6894";
				this.get("text").styles.default.color = "#E6ECF2";
			},
			mouseout:function (){
				this.color = "#4b5c9a";
				this.get("text").styles.default.color = "#DAE5F0";
			},
			mousedown:function (){
				alert("nope")
			},
		}) );
		_this.get("menuRectangle").add( new Button({
			x: 0, y: 200,
			width: _this.get("menuRectangle").width, height: 50,
			color: "#4b5c9a",
			text:{
				y: 12,
				value:"Options",
				align: "center",
				styles: {
					default: {
						color: "#DAE5F0",
						font: "Arial",
						size: 20,
					}
				}
			},
			mouseover:function (){
				this.color = "#5C6894";
				this.get("text").styles.default.color = "#E6ECF2";
			},
			mouseout:function (){
				this.color = "#4b5c9a";
				this.get("text").styles.default.color = "#DAE5F0";
			},
			mousedown:function (){
				alert("nope")
			},
		}) );
		_this.get("menuRectangle").add( new Button({
			x: 0, y: 250,
			width: _this.get("menuRectangle").width, height: 50,
			color: "#4b5c9a",
			text:{
				y: 12,
				value:"Website",
				align: "center",
				styles: {
					default: {
						color: "#DAE5F0",
						font: "Arial",
						size: 20,
					}
				}
			},
			mouseover:function (){
				this.color = "#5C6894";
				this.get("text").styles.default.color = "#E6ECF2";
			},
			mouseout:function (){
				this.color = "#4b5c9a";
				this.get("text").styles.default.color = "#DAE5F0";
			},
			mousedown:function (){
				window.location.href = "http://kuka.zby.cz/mesto/page"
			},
		}) );
	},
	preload : function (){
		game.scene = new THREE.Scene();
	},
	controls : function (){
		_this.addControls();
	}
}