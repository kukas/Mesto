function QuestManager (){
	/*
	Objekt pro řízení misí, v budoucnosti asi bude obsahovat více řídících prvků a
	bude propracovanější. Základní funkce je zatím předávání Quest Eventů aktivním
	questům.
	*/
	this.missions = {};
	_this = this;
	/*
	Mise se načítají ze souborů, které jsou externě uloženy, podobně jako guis, ale 
	zde lze provádět normální operace v souboru, protože není uložený ve formátu
	JSON. Na konci souboru mise je potřeba vrátit hlavní rámec.
	*/
	$.get("assets/missions/testQC.js",function(data){
		var hlavni = eval("(function (){"+data+"})()");
		_this.first = hlavni;
		_this.missions.firstMission = hlavni;
		_this.init(game);
		});
};
QuestManager.prototype.eventHandle = function (e){//console.log(e);
	/*
	QuestEvent e
	
	Předávání eventu aktivním questům, zatím odlišených přiřazením do progressu.
	*/
	for(var i in game.progress.missions){
		game.progress.missions[i].event(e);
	};
};
QuestManager.prototype.giveEventTo = function (name,type,id,condition){
	/*
	String name,
	String type,
	whatever id,
	function condition - očekává různé parametry, podle typu akce
	
	Umístění triggeru/akce na určitý objekt, při aktivaci akce dojde k vyvolání 
	Quest eventu.
	*/
	if(game.objects[name] === undefined) return false;
	_this = this;
	var podminka = condition === undefined ? function (){return true;} : condition;
	game.objects[name].actions[type].push([podminka,function (obj){
		__this = obj;
		_this.eventHandle(new QuestEvent(
			type,__this,id
		) );
	},id]);
};
QuestManager.prototype.init = function (game){ // Hlavní panel
	var prvni = this.first.start(new QuestEvent("gameStart",game));
};
QuestManager.prototype.end = function (step){
	delete game.progress.missions[step.id];
	step.active = false;
	step.ended = true;
	return true;
};
QuestManager.prototype.start = function (obj,e){ // Dědičné spouštění
	obj.start(e);
};
QuestManager.prototype.goToQuest = function (whereString,descOptions,questOptions){ 
	// String whereString as "level/predmetID - v game objects"
	// descOptions.title; descOptions.description
	// questOptions.after; questOptions.before
};