function Eventhandler() {
	var _this = this;
	this.keyboardControls = {};
	this.mouseControls = {};

	this.mouse = { x:0, y:0 };

	document.body.addEventListener( "keydown", function(ev){ _this.keyboardhandler(ev); }, true );
	document.body.addEventListener( "keyup", function(ev){ _this.keyboardhandler(ev); }, true );

	document.body.addEventListener( "mousemove", function(ev){ _this.mousehandler(ev); }, true );
	document.body.addEventListener( "mousedown", function(ev){ _this.mousehandler(ev); }, true );
	document.body.addEventListener( "mouseup", function(ev){ _this.mousehandler(ev); }, true );
	document.body.addEventListener( "contextmenu", function(ev){ _this.mousehandler(ev); }, true );
}

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

Eventhandler.prototype.addKeyboardControl = function(key, down, up, continuous) {
	this.keyboardControls[ key ] = new Key( down, up, continuous );
};

Eventhandler.prototype.addMouseControl = function(which, down, up, continuous) {
	this.mouseControls[ which ] = new Mouse( down, up, continuous );
};

Eventhandler.prototype.keyboardhandler = function(e) {
	var keycode = e.keyCode,
		type = e.type;
	if( this.keyboardControls[ keycode ] ){
		this.keyboardControls[ keycode ].down = (type == "keydown");
		if( this.keyboardControls[ keycode ][ type ] ){
			this.keyboardControls[ keycode ][ type ]();
		}
	}
	else{
		console.log([type,keycode]);
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
	for(k in this.keyboardControls){
		if( this.keyboardControls[ k ].down && this.keyboardControls[ k ].continuous ){
			this.keyboardControls[ k ].continuous();
		}
	}
	for(m in this.mouseControls){
		if( this.mouseControls[ m ].down && this.mouseControls[ m ].continuous ){
			this.mouseControls[ m ].continuous();
		}
	}
}