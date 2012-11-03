function Lamp( options ){
	SolidObject.call(this, options);

	// zatím tohle vypadá na dost prázdný konstruktor...
	// nenapadá tě něco výhradního pro lampu?
};
Lamp.prototype = Object.create( SolidObject.prototype );