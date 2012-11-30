{
	objects : function(){
		_this.add( new Button({
			x: 20, y: _this.height-60,
			visible: false,
			text:{
				value:"100",
				styles: {
					default: {
						color:"#ffb400",
						size:48,
					}
				}
			},
			// mouseover : function (){
			// 	this.children[0].display = true;
			// },
			// mouseout : function (){
			// 	this.children[0].display = false;
			// },
			// poznamka : {
			// 	value : "This is your health. If it goes to zero, you die. But be aware of losing it anyway. Several harms and wounds may cause permanent disabilities, unless you have an admirable medicae skill or a lot of luck.",
			// 	size : "10pt",
			// 	font : "sans-sarif",
			// 	color : "#0000ff",
			// 	y : -40,
			// 	width : 250,
			// 	bg : {
			// 		bgColor : "#ffffff",
			// 	},
			// },
		}) );
	},
	preload : function (){},
	controls : function (){
					_this.addControls();

					game.eventhandler.addMouseControl(0,function(){
						// game.camera.position.x = game.eventhandler.mouse.projected.x/10;
						// game.camera.position.y = game.eventhandler.mouse.projected.y/10;
						game.cursor.style.left = game.eventhandler.mouse.x + "px";
						game.cursor.style.top = game.eventhandler.mouse.y + "px";
					});
					game.eventhandler.addMouseControl(1, undefined, function(){
						console.log(Math.round(game.eventhandler.mouse.projected.x)+","+Math.round(game.eventhandler.mouse.projected.y)+","+game.eventhandler.mouse.projected.z)
					});

					game.eventhandler.addKeyboardControl(82, undefined, undefined, function(){ // R
						game.camera.position.z += 10;
					} );
					game.eventhandler.addKeyboardControl(70, undefined, undefined, function(){ // F
						game.camera.position.z -= 10;
					} );
					game.eventhandler.addKeyboardControl(84, undefined, undefined, function(){ // T
						game.scene.fog.density += 0.001
						console.log(game.scene.fog.density)
					} );
					game.eventhandler.addKeyboardControl(71, undefined, undefined, function(){ // G
						game.scene.fog.density -= game.scene.fog.density > 0 ? 0.001 : 0;
						console.log(game.scene.fog.density)
					} );
					game.eventhandler.addKeyboardControl(77, undefined, undefined, function(){ // M - minimapa
						_this.add(new Minimap(game.objects,{x:150,y:500,width:150,height:150,color:"#ffffff"}));
					} );
					game.eventhandler.addKeyboardControl(27, undefined, function(){ // escape
						game.pause();
						game.scene.fog.density = 0.0025;
						_this.switchGUI("pause");
					} );
					game.eventhandler.addKeyboardControl("O", undefined, function (){ // Poznámky, cíle - deník  O
						game.pause();
						game.scene.fog.density = 0.0025;
						_this.switchGUI("notesObjectives");
					});
					game.eventhandler.addKeyboardControl("I", undefined, function (){ // Poznámky, cíle - deník  O
						game.gui.guis.cutscene.switchCutscene("test")
					});
					// ovládání panáčka
					game.eventhandler.addKeyboardControl(87, undefined, function(){
						game.objects.player.toggleAnim("standing");
					}, function(){ // W
						game.objects.player.toggleAnim("walking");
						game.objects.player.move(Math.PI);
						if(game.settings.graphics.camera == "topdown")
							game.camera.follow(game.objects.player.mesh);
					} );
					game.eventhandler.addKeyboardControl(83, undefined, function(){
						game.objects.player.toggleAnim("standing");
					}, function(){ // S
						game.objects.player.toggleAnim("walking");
						game.objects.player.move(0);
						if(game.settings.graphics.camera == "topdown")
							game.camera.follow(game.objects.player.mesh);
					} );
					game.eventhandler.addKeyboardControl(65, undefined, function(){
						game.objects.player.toggleAnim("standing");
					}, function(){ // A
						game.objects.player.toggleAnim("walking");
						//game.objects.player.move(Math.PI/2);
						game.objects.player.rotate(0.05);
						if(game.settings.graphics.camera == "topdown")
							game.camera.follow(game.objects.player.mesh);
					} );
					game.eventhandler.addKeyboardControl(68, undefined, function(){
						game.objects.player.toggleAnim("standing");
					}, function(){ // D
						game.objects.player.toggleAnim("walking");
						//game.objects.player.move(-Math.PI/2);
						game.objects.player.rotate(-0.05);
						if(game.settings.graphics.camera == "topdown")
							game.camera.follow(game.objects.player.mesh);
					} );

					},
}