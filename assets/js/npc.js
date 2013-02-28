function NPC ( options ){
	Character.call(this, options);
	
	this.conversation = {};
	this.profil = options.profil;
};
NPC.prototype = Object.create( Character.prototype );