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
});
prvni.add(druhy,druhy.title);
prvni.current = druhy;
return prvni;