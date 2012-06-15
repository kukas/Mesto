function Eventhandler( dom ) {
	var _this = this;
	this.controls = {
		32 : new Key( false, function(){
			console.log("mezerník!")
		} )
	};
	this.mouseControls = {
		
	};

	function Key(keydown, keyup, continuous) {
		this.keydown = keydown === undefined ? false : keydown;
		this.keyup = keyup === undefined ? false : keyup;
		this.continuous = continuous === undefined ? false : continuous;
		this.down = false;
	};

	function Mouse(mousedown, mouseup, continuous) {
		this.mousedown = mousedown === undefined ? false : mousedown;
		this.mouseup = mouseup === undefined ? false : mouseup;
		this.continuous = continuous === undefined ? false : continuous;
		this.down = false;
	};

	this.dom = dom;

	this.mouse = { x:0, y:0 };

	document.body.addEventListener( "keydown", function(ev){ _this.keyboardhandler(ev); }, true );
	document.body.addEventListener( "keyup", function(ev){ _this.keyboardhandler(ev); }, true );

	document.body.addEventListener( "mousemove", function(ev){ _this.mousehandler(ev); }, true );
	document.body.addEventListener( "mousedown", function(ev){ _this.mousehandler(ev); }, true );
	document.body.addEventListener( "mouseup", function(ev){ _this.mousehandler(ev); }, true );
	document.body.addEventListener( "contextmenu", function(ev){ ev.preventDefault() }, true );
}

Eventhandler.prototype.keyboardhandler = function(e) {
	var keycode = e.keyCode,
		type = e.type;
	if( this.controls[ keycode ] ){
		this.controls[ keycode ].down = (type == "keydown");
		if( this.controls[ keycode ][ type ] ){
			this.controls[ keycode ][ type ]();
		}
	}
	else{
		console.log([type,keycode])
	}
}

Eventhandler.prototype.mousehandler = function(e) {
	var which = e.which,
		type = e.type;
	this.mouse.x = e.clientX;
	this.mouse.y = e.clientY;

	if( this.mouseControls[ which ] ){
		if( type == "mousedown" || (this.mouseControls[ which ].down && type == "mousemove") ){
			this.mouseControls[ which ].down = true;
		}
		else {
			this.mouseControls[ which ].down = false;
		}

		if( this.mouseControls[ which ][ type ] ){
			this.mouseControls[ which ][ type ]( type )
		}
		else if( (which == 0 && this.mouseControls[ which ]) || (this.mouseControls[ which ].down == false && type == "mousemove") ){
			this.mouseControls[ 0 ]();
		}
	}
	// else{
	// 	console.log([which,type])
	// }
	e.preventDefault();
};

Eventhandler.prototype.loop = function() {
	for(k in this.controls){
		if( this.controls[ k ].down && this.controls[ k ].continuous ){
			this.controls[ k ].continuous();
		}
	}
	for(m in this.mouseControls){
		if( this.mouseControls[ m ].down && this.mouseControls[ m ].continuous ){
			this.mouseControls[ m ].continuous();
		}
	}
}