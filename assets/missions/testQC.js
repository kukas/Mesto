// Test questcontaineru
var pravda = function (){return true;};
var predkrok = new Step({
	title : "",
	id : "prestep",
	description : "",
	startCondition : pravda,
	startAction : function (){console.log("Startuji předkrok")},
	endCondition : function (e){if(e.type == "levelEnter" && e.object.name == "test") return true;},
	endAction : function (){
		this.parent.end(this);
		this.parent.startQuest("first",new QuestEvent("missionEnded",this));
		this.parent.startQuest("simul",new QuestEvent("missionEnded",this));
	}
});
var first = new Step({
	title : "Task for the QC test",
	id : "first",
	description : "First task to test the Quest container, hopefuly to handle the quest to the second task at the collision to the monster.",
	startCondition : pravda,
	startAction : function (){game.gui.makePopout("New mission: "+this.title);game.questManager.giveEventTo("monstrum","onCollision","naraz01");},
	endCondition : function (e){if(e.id == "naraz01") return true;},
	endAction : function (){
		this.parent.end(this);
		this.parent.startQuest("second",new QuestEvent("missionEnded",this));
	}
});
var second = new Step({
	title : "Second task",
	id : "second",
	description : "It seems that everything works.",
	startCondition : pravda,
	startAction : function (){game.gui.makePopout("New mission: "+this.title);},
	endCondition : function (){return false;},
	endAction : function (){console.log("something went terribly wrong in second quest");}
});
var simul = new Step({
	title : "Side quest",
	id : "simul",
	description : "This quest should be active simultaneously with the main line and should never end.",
	startCondition : pravda,
	startAction : function (){console.log("Startuji "+this.title);},
	endCondition : function (){return false;},
	endAction : function (){return false;}
});
/*var cont = new Questcontainer("kont01",[predkrok,first,second,simul],predkrok);
cont.current["simul"] = simul; // Přidání druhého aktivního questu
return cont;*/
var cont = new Questcontainer("kont01");
cont.add(predkrok,first,second,simul);
cont.current["prestep"]=predkrok;
return cont;