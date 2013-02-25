function Questcontainer (id,steps,first){
	this.steps = {};
	this.current = {};
	for(var i in steps){
		this.steps[steps[i].id] = steps[i];
		this.steps[steps[i].id].parent = this;
	};
	if(first !== undefined){
		this.current[first.id] = first;
	}
	this.id = id;
};
Questcontainer.prototype.startQuest = function (id,e){
	this.current[id] = this.steps[id];
	this.current[id].start(e);
	this.event(e);
};
Questcontainer.prototype.event = function (e){
	for(var id in this.current){
		if(this.current[id].active) this.current[id].event(e);
	};
};
Questcontainer.prototype.add = function (){ // Neargumentové přidávání
	for(var i in arguments){
		var step = arguments[i];
		this.steps[step.id] = step;
		step.parent = this;
	};
};
Questcontainer.prototype.start = function (e){
	for(var id in this.current){
		this.current[id].start(e);
	};
};
Questcontainer.prototype.end = function (obj){
	if(this.current[obj.id] !== undefined){
		delete this.current[obj.id];
		game.questManager.end(obj);
		return true;
	}
	return false;
};