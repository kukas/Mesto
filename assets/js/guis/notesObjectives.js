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
		var j = 0;
		for(var k in game.progress.missions){ // Zde jsou uloženy aktivní mise
			if(!game.progress.missions[k].visible) continue;
			var text = new Text({
					x:5,
					y:0,
					value:game.progress.missions[k].title,
					width:menu.width-10,
					styles:{
						default : {
							size:20
						}
					},
				});
			var button = new Button({
				x:5,
				y:5+25*j,
				width:menu.width-10,
				height:25,
				mousedown:function (){
						for(var i in game.progress.missions){console.log(this.links.title);
							if(game.progress.missions[i].title == this.links.title.value){
								screen.children = [];
								screen.add(new Text({
									x:0,
									y:0,
									value: game.progress.missions[i].description,
									width: screen.width,
									styles:{
										default : {
											size:20
										}
									}
								}));
							}
						};
					},
			});
			button.add(text,"title");
			
			menu.add(button);
			j++;
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