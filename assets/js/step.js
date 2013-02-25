function Step(options){
	/*
	options:
		String title,
		String id,
		String description,
		Object steps,
		String first,
		function startCondition, startAction, endCondition, endAction
	
	Celá konstrukce questů je založena na dvoupodmínkových krocích, které na sebe
	navazují a zároveň jsou příbuzné. Velké celky tedy lze zpracovávat po různě
	dělených menších krocích, což by mělo být jednodušší.
	Zatím se celý strom questů naloaduje při spuštění, ale asi nebude problém to
	také rozdělit.
	*/
	if(options.steps === undefined){
		this.steps = {}; // Asociované pole vnitřních kroků
		var first = undefined;
	}
	else{
		this.steps = options.steps;
		for(var i in this.steps){
			this.steps[i].parent = this;
		}
	}
	this.id = options.id;
	this.startCondition = options.startCondition; // Argument QuestEvent
	this.startAction = options.startAction; // Argument QuestEvent
	this.active = false;
	this.endCondition = options.endCondition; // Argument QuestEvent
	this.endAction = options.endAction; // Argument QuestEvent
	this.ended = false;
	if(first !== undefined) {this.current = options.steps[first];}
	// Začínající krok !! povinný argument pro dělené kroky
	this.description = options.description;
	this.title = options.title;
};
Step.prototype.add = function (step){ // Neargumentové přidávání
	this.steps[step.id] = step;
	step.parent = this;
};
Step.prototype.event = function (e){ // Eventové vyhodnocování
	if(this.current === undefined){
		if(this.active){
			if(this.endCondition(e)){
				this.endAction(e);
				return true;
			}
		}
		if(!this.active && !this.ended){ // Asi funguje
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
Step.prototype.start = function (e){ // Ještě ne zcela dodělané, problémy s
	// oddálením začátku mise po menu
	if(Object.keys( this.steps ) < 1){
		// if(this.startCondition(e)){
			this.startAction();
			game.progress.missions[this.id]=this;
			this.active = true;
			return this;
		// }
	}
	else{
		if(this.current === undefined){
			// if(this.startCondition(e)){
				this.startAction();
				game.progress.missions[this.id]=this;
				this.active = true;
				return this;
			// }
		}
		else{
			return this.current.start(e);
		}
	}
};