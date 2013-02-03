{
	objects: function (){
		var pozadi = new Rectangle({
			x:game.gui.width/2 - 300,
			y:game.gui.height/2 - 200,
			width:600,
			height:400,
			color:"black"
		});
		_this.add(pozadi);
		
		var nadpisy = new Rectangle({
			x:5,
			y:5,
			width:150,
			height:390,
			color:"#C8D3DB"
		});
		pozadi.add(nadpisy);
		
		var screen = new Rectangle({
			x:160,
			y:5,
			width:455,
			height:390,
			color:"grey"
		});
		pozadi.add(screen);
		
		var pocet = 0;
		for(var i in game.progress.achievements){
			if(game.progress.achievements[i].done) continue;
			if(pocet++ > 10) break;
			
			var text = new Text({
					x:5,
					y:0,
					value:game.progress.achievements[i].title,
					width:130,
					styles:{
						default : {
							size:20
						}
					},
			});
			
			var ach = new Button({
				x:5,
				y:5+25*(pocet-1),
				width:140,
				height:20,
				mousedown:function (){
					for(var j in game.progress.achievements){console.log(this.links.title);
						if(game.progress.achievements[j].title == this.links.title.value){
							screen.children = [];
							screen.add(new Text({
								x:5,
								y:0,
								value: game.progress.achievements[j].description,
								width: screen.width-10,
								styles:{
									default : {
										size:20
									}
								}
							}));
						}
					}
				}
			});
			ach.add(text, "title");
			nadpisy.add(ach);
		};
	},
	
	preload: function (){
		
	},
	
	controls: function (){
		_this.addControls();
		game.eventhandler.addKeyboardControl(27, false, function(){
				_this.switchGUI("pause");
			},false,false );
	},
}