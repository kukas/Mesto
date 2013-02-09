var hlavni = new Step({
	title : "Epilog",
	description : "That's it, you finished the quest, feel free to do whathever you want.",
	startCondition : function (){return this.steps.treti.ended;},
	startAction : function (){console.log("startuji hlavní celek");game.gui.makePopout("New mission: "+this.title);},
	endCondition : function (){return false;},
	endAction : function (){console.log("whut?")},
});
var prvni = new Step({
	title : "First step",
	description: "Go to the building north-west.",
	startCondition : function (e){return true;},
	startAction : function (){console.log("Start - první mise");},
	endCondition : function (e){
		if(e.type == "levelEnter" && e.object.name == "vnitrek") return true;
		else return false;
	},
	endAction : function (){
		this.active = false;
		this.ended = true;
		this.parent.current = this.parent.steps.druhy;
		game.questManager.end(this.title);
		game.questManager.start(this.parent,new QuestEvent("missionEnded",this));
	}
});
var druhy = new Step({
	title : "Get to the bar",
	description: "Go to the building north-west.",
	startCondition : function (){return this.parent.steps.prvni.ended;},
	startAction : function (){game.gui.makePopout("New Mission: "+this.title);game.questManager.giveEventTo("linka","onCollision","naraz01");},
	endCondition : function (e){if(e.id == "naraz01") return true;console.log(e.id);},
	endAction : function (){
		this.active = false;
		this.ended = true;
		this.parent.current = this.parent.steps.treti;
		game.questManager.end(this.title);
		game.questManager.start(this.parent,new QuestEvent("missionEnded",this));
	}
});
var treti = new Step({
	title : "Get out of the bar",
	description: "You have no need to stay where they don't want you.",
	startCondition : function (){return this.parent.steps.druhy.ended;},
	startAction : function (){
		game.gui.makePopout("New Mission: "+this.title);
	},
	endCondition : function (e){
		if(e.type == "levelEnter" && e.object.name == "test") return true;
		else return false;
		},
	endAction : function (){
		this.active = false;
		this.ended = true;
		this.parent.current = undefined;
		game.questManager.end(this.title);
		game.questManager.start(this.parent,new QuestEvent("missionEnded",this));
	}
});
hlavni.add(prvni, "prvni");
hlavni.add(druhy, "druhy");
hlavni.add(treti, "treti");
hlavni.current = hlavni.steps.prvni;
return hlavni;