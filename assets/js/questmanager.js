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
	$.get("assets/missions/loading.js",function(data){
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
	// String descOptions.titleIn;String descOptions.titleOut; String descOptions.descriptionIn; String descOptions.descriptionOut;
	// Function questOptions.after; Function questOptions.before;
	// Whatever questOptions.id
	//  questOptions.type: String onCollision|onAreaEnter; Function questOptions.typeCondition - pouze pro onAreaEnter
	var levelName = whereString.split("/")[0];
	var objectName = whereString.split("/")[1];
	var condition = questOptions.typeCondition === undefined ? function (){return true;} : questOptions.typeCondition;
	var kontejner = new Questcontainer(questOptions.id);
	var finalniKrok = new Step({
		title : descOptions.titleIn,
		id : questOptions.id+"02",
		description : descOptions.descriptionIn,
		startCondition : function (){return true;},
		startAction : function (e){
			if(game.objects[objectName] !== undefined){
				game.questManager.giveEventTo(objectName,questOptions.type,this.id+".naraz01",condition);
			}
			else{console.warn("Problem in item locating in quest "+this.id);}
			questOptions.onInside(this);
		},
		endCondition : function (e){if(e.id == this.id+".naraz01") return true;},
		endAction : function (e){
			questOptions.after(e);
			this.parent.end(this);
			this.parent.end(this.parent.current[questOptions.id+"00"]);
		},
	});
	var krokPrichodu = new Step({
		title : descOptions.titleOut,
		id : questOptions.id+"01",
		description : descOptions.descriptionOut,
		startCondition : function (){return true;},
		startAction : function (){console.log("Start questu, čekání na vstoupení do správného levelu");},
		endCondition : function (e){console.log(levelName);if(e.type == "levelEnter" && e.object.name == levelName) return true;},
		endAction : function (){
			this.parent.end(this);
			this.parent.startQuest(questOptions.id+"00",new QuestEvent("missionEnded",this));
			this.parent.startQuest(questOptions.id+"02",new QuestEvent("missionEnded",this));
		},
	});
	var krokOdchodu = new Step({
		title : "kontrola "+questOptions.id+"00",
		id : questOptions.id+"00",
		description : "kontrola opousteni levelu",
		startCondition : function (){return true;},
		startAction : function (){console.log("level nalezen, kontrola odchodu");},
		endCondition : function (e){if(e.type == "levelEnter" && e.object.name != levelName) return true;},
		endAction : function (){
			this.parent.end(this);
			this.parent.end(this.parent.current[questOptions.id+"02"]);
			this.parent.steps[questOptions.id+"02"].ended = false;
			this.parent.startQuest(questOptions.id+"01",new QuestEvent("missionEnded",this));
		},
		visible : false
	});
	kontejner.add(finalniKrok,krokPrichodu,krokOdchodu);
	if(levelName == game.level.name){
		kontejner.current[questOptions.id+"02"] = finalniKrok;
		kontejner.current[questOptions.id+"00"] = krokOdchodu;
		questOptions.before(finalniKrok);
	}
	else{
		kontejner.current[questOptions.id+"01"] = krokPrichodu;
		questOptions.before(krokPrichodu);
	}
	return kontejner;
};