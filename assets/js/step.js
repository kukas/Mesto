function Step(start,end,steps,first){
	this.steps = steps;
	this.startAction = start[1];
	this.active = false;
	this.endAction = end[1];
	this.ended = false;
	this.conditions = [start[0],end[0]];
	this.current = steps.first;
	this.parent = {};
};
Step.prototype.add = function (step,name){
	this.steps.name = step;
	step.parent = this;
};
Step.prototype.event = function (e){
	if(this.current.conditions === undefined){
		if(this.conditions[1](e)) this.endAction(e);
		return true;
	}
	else {
		if(this.current.conditions[1](e)) this.current.endAction(e);
		return true;
	}
};
Step.prototype.start = function (e){
	if(Object.keys(this.steps) != 0){
		
	}
};