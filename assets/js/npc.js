function NPC ( options ){
	Character.call(this, options);
	
	this.conversations = {};
	this.profil = options.profil;
};
NPC.prototype = Object.create( Character.prototype );