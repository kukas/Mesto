// Quest k načtení
var pravda = function (){return true;};
var napis = new Step({
	title : "Quest loaded",
	id : "questToLoad01",
	description : "The quest is succesfully loaded",
	startCondition : pravda,
	startAction : function (){game.gui.makePopout("Quest loaded");},
	endCondition : function (){return !pravda();},
	endAction : function (){console.log("something is wrong in pravda condition");}
});
return napis;