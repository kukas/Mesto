{
	objects : function (){
		_this.add( new Rectangle ({
				x:(_this.width - _this.width*0.4)/2,
				y:(_this.height - _this.height*0.75)/2,
				width: _this.width*0.4,
				height: _this.height*0.75,
				color:"#ffffff"
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