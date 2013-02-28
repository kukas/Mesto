function Conversation( options ){
	/*
		Object options.aspects
			"id" : value
		Array options.sentences
			[Sentence,Sentence,...]
		Function options.onStart
			argument QuestEvent
		Function options.onEnd
			argument QuestEvent
	*/
	this.aspects = options.aspects === undefined ? {} : options.aspects;
	this.aspectsBackup = options.aspects === undefined ? {} : options.aspects;
	this.sentences = {};
	this.sentencesBackup = {};
	if(options.sentences !== undefined){
		for(var i = 0; i < options.sentences.length;i++){
			this.sentences[options.sentences[i].id] = options.sentences[i];
			this.sentencesBackup[options.sentences[i].id] = options.sentences[i];
			this.sentences[options.sentences[i].id].parent = this;
			this.sentencesBackup[options.sentences[i].id].parent = this;
		};
	}
	this.npc = {};
	this.onStart = options.onStart === undefined ? function (){} : options.onStart;
	this.onEnd = options.onEnd === undefined ? function (){} : options.onEnd;
	
	
};
Conversation.prototype.update = function (){
	var qs = [];
	var ans = [];
	var vyskaY = 5;
	for(var i  in this.sentences){
		var veta = this.sentences[i];
		if(veta.question){
			if(veta.condition()){
				qs.push(veta);
			}
		}
		if(veta.answer){
			if(veta.condition()){
				ans.push(veta);
			}
		}
	};
	for(var i in qs){
		qs[i].action();
		qs[i] = qs[i].text(2.5,2.5,game.gui.width*0.4-20);
	};
	var buttons = [];
	for(var i  in ans){
		var txt = ans[i].text(0,0,game.gui.width*0.6-15);
		var button = new game.gui.constructors.button({
			x:0,
			y:vyskaY,
			width:txt.width+5,
			height:txt.text.length*20+5,
			mousedown:function (){
				ans[i].action();
				ans[i].parent.update();
			}
		});
		
		vyskaY += txt.height+2.5;
		button.add(txt);
		buttons.push(button);
	};
	this.render({"questions" : qs,"answers" : buttons});
};
Conversation.prototype.render = function (objekty){
	game.gui.links.dialog.links.screen.removeAll();
	game.gui.links.dialog.links.answers.removeAll();
	for(var i in objekty.questions){
		game.gui.links.dialog.links.screen.add(objekty.questions[i]);
	};
	for(var i in objekty.answers){
		game.gui.links.dialog.links.answers.add(objekty.answers[i]);
	};
};
Conversation.prototype.setTo = function (obj){
	this.npc = obj;
	this.npc.conversation = this;
	this.npc.addAction("onCollision",1,function (){return true;},function (npc_obj){
		if(npc_obj.actionExists(2)) return false;
		npc_obj.addAction("onActionKeyDown",2,function(){return true;},function (npc_obj){
			game.pause();
			game.scene.fog.density = 0.0025;
			game.gui.guis.dialog.switchDialog(npc_obj);
			npc_obj.removeAction(2);
			var ev = new QuestEvent("conversationStart",npc_obj.conversation);
			npc_obj.conversation.onStart(ev);
			npc_obj.conversation.update();
			})
		});
};
Conversation.prototype.end = function (){
	var qe = new QuestEvent("conversationEnd", this);
	this.onEnd(qe);console.log(this.onEnd);
	game.questManager.eventHandle(qe);
};
Conversation.prototype.add = function (s){
	this.sentences[s.id] = s;
	this.sentencesBackup[s.id] = s;
	this.sentences[s.id].parent = this;
	this.sentencesBackup[s.id].parent = this;
};
Conversation.prototype.reset = function (){
	this.sentences = this.sentencesBackup;
	this.aspects = this.aspectsBackup;
	for(var i  in this.sentences){
		this.sentences[i].spoken = false;
	};
};