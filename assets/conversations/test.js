var veta01 = new Sentence({
	value : "Hey, what are you looking at?",
	question : true,
	id : "veta01",
	condition : function (){if(!this.spoken) return true; else return false;}
});
var odp01 = new Sentence({
	value : "Nothing, I am just walking around",
	answer : true,
	id : "odp01",
	condition : function (){if(!this.spoken) return true; else return false;},
});
var veta02 = new Sentence({
	value : "That's what I like to hear",
	question : true,
	id : "veta02",
	condition : function (){if(this.parent.sentences.veta01.spoken) return true; else return false;}
});
var konverzace = new Conversation({
	sentences : [veta01,veta02,odp01],
	onEnd : function (){this.reset();}
});
return konverzace;