function QuestManager (){
	this.missions = {};
	var prvni = new Step({
		title : "Second quest",
		description : "Here it is, the second quest, after the first quest.",
		startCondition : function (){return true;},
		startAction : function (){console.log("start mise "+this.title);},
		endCondition : function (e){if(e.type == "levelEnter" && e.object.name == "vnitrek") return true;},
		endAction : function (){console.log("konec mise "+this.title);game.questManager.end(this.title);},
	});
	var druhy = new Step({
		title : "First quest",
		description : "This is the first official quest by Izzet's quest engine",
		startCondition : function (){return true;},
		startAction : function (){console.log("start mise "+this.title);},
		endCondition : function (e){if(e.type == "levelEnter" && e.object.name == "vnitrek") return true;},
		endAction : function (){console.log("konec mise "+this.title);
				this.active = false;
				this.ended = true;
				this.parent.current = undefined;
				game.questManager.end(this.title);
				game.questManager.start(this.parent);
				console.log(this);
			},
	})
	prvni.add(druhy,druhy.title);
	prvni.current = druhy;
	this.first = prvni;
	this.missions.firstMission = prvni;
};
QuestManager.prototype.eventHandle = function (e){console.log(e);
	for(var i in game.progress.missions){
		game.progress.missions[i].event(e);
	};
};
QuestManager.prototype.giveEventTo = function (name,type,id){
	if(game.links[name] === undefined) return false;
	_this = this;
	game.links[name].actions[type] = function (){
		__this = this;
		_this.eventHandle(new QuestEvent(
			type,__this,id
		) );
	};
};
QuestManager.prototype.init = function (game){
	var prvni = this.first.start();
	game.progress.missions[prvni.title] = prvni;
};
QuestManager.prototype.end = function (name){
	delete game.progress.missions[name];
};
QuestManager.prototype.start = function (obj){
	game.progress.missions[obj.title]=obj;
	obj.active = true;
	obj.start();
};