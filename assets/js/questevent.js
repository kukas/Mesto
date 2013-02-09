function QuestEvent(type,object,id){
	/*
	String type,
	Object object,
	whatever id
	
	Objekt QuestEvent je kompatibilní s questy a pokud nějaká událost může mít vliv na 
	průběh mise, měla by vzbuzovat Quest Event
	*/
	this.type = type;
	this.object = object;
	this.id = id;
	this.time = new Date().getTime();
};