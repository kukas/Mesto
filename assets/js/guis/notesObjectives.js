{
	objects : function (){
		_this.add( new Texture ({
				image : game.textures.textures.rust,
				x:(_this.width - _this.width*0.75)/2,y:(_this.height - _this.height*0.5)/2,
				width: _this.width*0.75,height: _this.height*0.5
			} )
		);
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