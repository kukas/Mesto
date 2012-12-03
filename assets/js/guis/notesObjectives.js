{
	objects : function (){
		
		var hlavni = new Rectangle ({
				x:(_this.width - _this.width*0.6)/2,
				y:(_this.height - _this.height*0.75)/2,
				width: _this.width*0.6,
				height: _this.height*0.75,
				color:"#332F2E"
			} );
		
		var menu = new Rectangle({
				x:5,
				y:5,
				width:hlavni.width*0.25,
				height:hlavni.height-10,
				color:"#A83D25"//"#ADBEC4"
			});
		hlavni.add( menu , "menu");
			
		var screen = new Rectangle({
			x:5+hlavni.width*0.25+5,
			y:5,
			width:hlavni.width*0.75-15,
			height:hlavni.height-10,
			color:"#1F0600"
		});
		hlavni.add( screen , "screen");
		
		var l = game.progress.missions.length
		for(var j = 0;j < l;j++){
			var text = new Text({
					x:5,
					y:0,
					value:game.progress.missions[j].title,
					width:menu.width-10,
					styles:{
						default : {
							size:20
						}
					},
				});
			var description = game.progress.missions[j].description;
			console.log(description);
			var text2 = new Text({
				x:5,
				y:5,
				value:description,
				width:screen.width-10,
				styles:{
					default : {
						size:20
					}
				}
			});
			text2.visible = false;
			screen.add(text2);
			var button = new Button({
				x:5,
				y:5+25*j,
				width:menu.width-10,
				height:25,
				mousedown:function (){console.log(description);
						for(var i in screen.children){
							screen.children[i].visible = false;
						};
						text2.visible = true;
					},
			});
			button.add(text);
			
			menu.add(button);
		};
		
		_this.add( hlavni , "diary");
	},
	preload : function (){
		
	},
	controls : function (){
		_this.addControls();
		
		game.eventhandler.addKeyboardControl(79,undefined,function (){
			game.pause();
			game.scene.fog.density = 0;
			_this.switchGUI("inGame");
		} );
		game.eventhandler.addKeyboardControl(27,undefined,function (){
			game.pause();
			game.scene.fog.density = 0;
			_this.switchGUI("inGame");
		} );
	}
}