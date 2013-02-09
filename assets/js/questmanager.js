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
	$.get("assets/missions/test.js",function(data){
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
QuestManager.prototype.giveEventTo = function (name,type,id){
	/*
	String name,
	String type,
	whatever id,
	
	Umístění triggeru/akce na určitý objekt, při aktivaci akce dojde k vyvolání 
	Quest eventu.
	*/
	if(game.objects[name] === undefined) return false;
	_this = this;
	game.objects[name].actions[type].push([function (){return true;},function (obj){console.log("halo");
		__this = obj;
		_this.eventHandle(new QuestEvent(
			type,__this,id
		) );
	}]);
};
QuestManager.prototype.init = function (game){ // Hlavní panel
	var prvni = this.first.start(new QuestEvent("gameStart",game));
	if(prvni) game.progress.missions[prvni.title] = prvni;
};
QuestManager.prototype.end = function (name){
	delete game.progress.missions[name];
};
QuestManager.prototype.start = function (obj,e){ // Dědičné spouštění
	obj.start(e);
};