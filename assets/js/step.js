function Step(options){ //jmeno,start,end,popis,steps,first
	if(options.steps === undefined){
		this.steps = {};
		var first = undefined;
	}
	else{
		this.steps = options.steps;
		for(var i in this.steps){
			this.steps[i].parent = this;
		}
	}
	this.startCondition = options.startCondition;
	this.startAction = options.startAction;
	this.active = false;
	this.endCondition = options.endCondition;
	this.endAction = options.endAction;
	this.ended = false;
	if(first !== undefined) {this.current = options.steps[first];}
	this.description = options.description;
	this.title = options.title;
};
Step.prototype.add = function (step,name){
	this.steps[name] = step;
	step.parent = this;
};
Step.prototype.event = function (e){
	if(this.current === undefined){
		if(this.active){
			if(this.endCondition(e)){
				this.endAction(e);
				return true;
			}
		}
		if(!this.active && !this.ended){
			if(this.startCondition(e)){
				this.startAction(e);
				return true;
			}
		}
	}
	else {
		this.current.event(e);
		return true;
	}
};
Step.prototype.start = function (e){
	if(Object.keys( this.steps ) < 1){
		// if(this.startCondition(e)){
			this.startAction();
			game.progress.missions[this.title]=this;
			this.active = true;
			return this;
		// }
	}
	else{
		if(this.current === undefined){
			// if(this.startCondition(e)){
				this.startAction();
				game.progress.missions[this.title]=this;
				this.active = true;
				return this;
			// }
		}
		else{
			return this.current.start(e);
		}
	}
};