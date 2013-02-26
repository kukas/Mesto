/*
	Toto je test konstruktoru Questmanager.goToQuest
	Předkrok je nutný, protože kontruktor pracuje s objektem
	game, který v kontextu vykonávaného kódu není zavedený
	(questManager konstruktor se provádí přímo v game konstruktoru).
	Navíc předkrok je příjemné odlišení questů ve hře a mimo hru.
*/
var co = "vnitrek/linka";
var popisy = {
	titleIn : "Get to the bar, it seems something is waiting here.",
	descriptionIn : "You managed to get into the building. Now get to the bar",
	titleOut : "Building north-west",
	descriptionOut : "You heard that best way to try if new constructor works is to go to the building north-west",
};
var vlastnosti = {
	after : function (){game.gui.makePopout("No, it was just a rat!");},
	before : function (q){game.gui.makePopout("New Mission: "+q.title);},
	onInside : function (q){game.gui.makePopout("Mission update: "+q.title);},
	id : "toTheBar1",
	type : "onCollision"
};
var predkrok = new Step({
	title : "",
	id : "prestep",
	description : "",
	startCondition : function (){return true;},
	startAction : function (){console.log("Startuji předkrok")},
	endCondition : function (e){if(e.type == "levelEnter" && e.object.name == "test") return true;},
	endAction : function (){
		this.parent.end(this);
		var mise = game.questManager.goToQuest(co,popisy,vlastnosti);
		this.parent.add(mise);
		this.parent.startQuest(mise.id,new QuestEvent("missionEnded",this));
	}
});
var kont = new Questcontainer("hlavni");
kont.add(predkrok);
kont.current[predkrok.id] = predkrok;
return kont;