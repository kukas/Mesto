function QuestManager (){
	this.missions = {};
	_this = this;
	$.get("assets/missions/test.js",function(data){
		var hlavni = eval("(function (){"+data+"})()");
		_this.first = hlavni;
		_this.missions.firstMission = hlavni;
		_this.init(game);
		});
};
QuestManager.prototype.eventHandle = function (e){//console.log(e);
	for(var i in game.progress.missions){
		game.progress.missions[i].event(e);
	};
};
QuestManager.prototype.giveEventTo = function (name,type,id){ // Funguje zatím pouze pro onCollision
	if(game.objects[name] === undefined) return false;
	_this = this;
	game.objects[name].actions[type].push([function (){return true;},function (obj){console.log("halo");
		__this = obj;
		_this.eventHandle(new QuestEvent(
			type,__this,id
		) );
	}]);
};
QuestManager.prototype.init = function (game){
	var prvni = this.first.start(new QuestEvent("gameStart",game));
	if(prvni) game.progress.missions[prvni.title] = prvni;
};
QuestManager.prototype.end = function (name){
	delete game.progress.missions[name];
};
QuestManager.prototype.start = function (obj,e){
	obj.start(e);
};