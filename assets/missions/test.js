var hlavni = new Step({
	title : "Epilog",
	id : "epilog",
	description : "That's it, you finished the quest, feel free to do whathever you want.",
	startCondition : function (){return this.steps.treti.ended;},
	startAction : function (){console.log("startuji hlavní celek");game.gui.makePopout("New mission: "+this.title);},
	endCondition : function (){return false;},
	endAction : function (){},
});
var prvni = new Step({
	title : "First step",
	id : "first",
	description: "Go to the building north-west.",
	startCondition : function (e){return true;},
	startAction : function (){console.log("Start - první mise");},
	endCondition : function (e){
		if(e.type == "levelEnter" && e.object.name == "vnitrek") return true;
		else return false;
	},
	endAction : function (){
		game.questManager.end(this);
		this.parent.current = this.parent.steps.second;
		game.questManager.start(this.parent,new QuestEvent("missionEnded",this));
	}
});
var druhy = new Step({
	title : "Get to the bar",
	id : "second",
	description: "Go to the building north-west.",
	startCondition : function (){return this.parent.steps.prvni.ended;},
	startAction : function (){game.gui.makePopout("New Mission: "+this.title);game.questManager.giveEventTo("linka","onCollision","naraz01");},
	endCondition : function (e){if(e.id == "naraz01") return true;console.log(e.id);},
	endAction : function (){
		game.questManager.end(this);
		this.parent.current = this.parent.steps.third;
		game.questManager.start(this.parent,new QuestEvent("missionEnded",this));
	}
});
var treti = new Step({
	title : "Get out of the bar",
	id : "third",
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
		game.questManager.end(this);
		this.parent.current = undefined;
		game.questManager.start(this.parent,new QuestEvent("missionEnded",this));
	}
});
hlavni.add(prvni);
hlavni.add(druhy);
hlavni.add(treti);
hlavni.current = hlavni.steps.first;
return hlavni;
/*
Propracovanější konstrukce, vyhazuje popouty při novém kroku a také je složitější - jít do budovy, dojít a dotknou se baru, jít pryč z budovy.
Je vidět, že náročnost kódu stoupá velmi rychle a bude potřeba mnoho zjednodušujících funkcí, které budou zastupovat základní operace.
*/