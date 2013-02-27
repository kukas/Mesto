{
	objects : function (){
		var hlavni = new Rectangle({
			x:(_this.width-_this.width*0.6)/2,
			y:(_this.height-_this.height*0.75)/2,
			width:_this.width*0.6,
			height:_this.height*0.75,
			color : "#000000"
		});
		
		var obrazekHlavy = new Texture({
			image : game.textures.textures.error,
			x:5,
			y:5,
			width:_this.width*0.2,
			height:_this.height*9/20,
		});
		hlavni.add(obrazekHlavy, "profil");
		
		var obchod = new Button({
			x:5,
			y:_this.height*9/20+10,
			width:_this.width*0.2,
			height:25,
			mousedown:function (){
				alert("Nedokončeno, popravdě ani nenačnuto.");
			}
		});
		hlavni.add(obchod);
		
		var napisObchod = new Text({
			x:2.5,
			y:0,
			value:"Trade",
			width:_this.width*0.2,
			styles:{
				default : {
					size : 20
				}
			}
		});
		obchod.add(napisObchod);
		
		var presvedcovani = new Button({
			x:5,
			y:_this.height*9/20+35,
			width:_this.width*0.2,
			height:25,
			mousedown:function (){
				alert("Nedokončeno, popravdě ani nenačnuto.");
			}
		});
		hlavni.add(presvedcovani);
		
		var napisPresvedcovani = new Text({
			x:2.5,
			y:0,
			value:"Persuade",
			width:_this.width*0.2,
			styles:{
				default : {
					size : 20
				}
			}
		});
		presvedcovani.add(napisPresvedcovani);
		
		var screen = new Rectangle({
			x:_this.width*0.2+10,
			y:5,
			width:_this.width*0.4-15,
			height:_this.height*9/20+60,
			color : "#1F0600"
		});
		hlavni.add(screen, "screen");
		
		_this.add(hlavni, "dialog");
	},
	
	preload : function (){
		
	},
	
	controls : function (){
		_this.addControls();
		
		game.eventhandler.addKeyboardControl(27,undefined,function (){
			game.pause();
			game.scene.fog.density = 0;
			_this.switchGUI("inGame");
		} );
	},
	
	switchDialog : function (npc,id){
		var konverzace = npc.conversations[id];
		game.gui.switchGUI("dialog");
		var hlavni = game.gui.links.dialog;
		hlavni.add(new Texture({
			image : npc.profil,
			x:5,
			y:5,
			width:_this.width*0.2,
			height:_this.height*9/20,
		}), "profil");console.log(hlavni.links.profil);
	},
}