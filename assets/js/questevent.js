function QuestEvent(type,object,id){
	this.type = type;
	this.object = object;
	this.id = id;
	this.time = new Date().getTime();
};