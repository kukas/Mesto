// Test lodingu questů ve hře
var pravda = function (){return true;};
var predkrok = new Step({
	title : "",
	id : "prestep",
	description : "",
	startCondition : pravda,
	startAction : function (){console.log("Startuji předkrok k "+this.parent.id)},
	endCondition : function (e){if(e.type == "levelEnter" && e.object.name == "test") return true;},
	endAction : function (){
		this.parent.end(this);
		var rodic = this.parent;
		$.get("assets/missions/testGoToQuestConst.js",function (data){console.log(game.progress.missions);
			var q = eval("(function (){"+data+"})();");
			rodic.add(q);
			rodic.startQuest(q.id,new QuestEvent("missionEnded",_this));
		});
	}
});
var kontejner = new Questcontainer("questToLoad");
kontejner.add(predkrok);
kontejner.current[predkrok.id] = predkrok;
return kontejner;
