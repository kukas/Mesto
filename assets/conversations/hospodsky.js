var uvod = new Sentence({
	value : "Hi Zane, do you have the money for me?",
	id : "uvod",
	question : true,
	condition : function (){return !this.spoken;},
});
var odp1 = new Sentence({
	value : "What money?",
	id : "odp1",
	answer : true,
	condition : function (){console.log("Neviděno "+this.id+"?");
		console.log(!this.seen);
		if(!this.seen && !this.parent.sentences["odp2"].seen){
			return true;
		}
		else return false;
	},
	reaction : function (){console.log("běží");
		this.parent.aspects["angry"] += 1;
	}
});
var odp2 = new Sentence({
	value : "I am sorry, I don't have it right now.",
	id : "odp2",
	answer : true,
	condition : function (){
		if(!this.seen && !this.parent.sentences["odp1"].seen){
			return true;
		}
		else return false;
	},
	reaction : function (){
		this.parent.aspects["sad"] += 1;
	}
});
var react1 = new Sentence({
	value : "Ok, nevermind, you'll pay me later.",
	id : "react1",
	question : true,
	condition : function (){
		if(!this.spoken && this.parent.sentences["uvod"].spoken){
			if(this.parent.aspects["sad"] < 5 && this.parent.aspects["angry"] < 5){
				return true;
			}
			else return false;
		}
	},
});
var react2 = new Sentence({
	value : "Stop fucking with me Zane! You owe me a vast amount of money and I have to pay to slavers as you know. One more time and I will tell them to find you and take their money from you.",
	id : "react2",
	question : true,
	condition : function (){
		if(!this.spoken && this.parent.sentences["uvod"].spoken && !this.parent.sentences["react3"].spoken){
			if(this.parent.aspects["angry"] >= 5) return true;
			else return false;
		}
	}
});
var react3 = new Sentence({
	value : "Zane, I cannot sell you any other drink if you won't pay your debts. I am myself on the edge of bancrupt, so please find me the money you promised to give me.",
	id : "react3",
	question : true,
	condition : function (){
		if(!this.spoken && this.parent.sentences["uvod"].spoken && !this.parent.sentences["react2"].spoken){
			if(this.parent.aspects["sad"] >= 5 && this.parent.aspects["angry"] < 5) return true;
			else return false;
		}
	}
});

var konverzace = new Conversation({
	sentences : [uvod,odp1,odp2,react1,react2,react3],
	onEnd : function (){
		for(var i in this.sentences){
			this.sentences[i].spoken = false;
			this.sentences[i].seen = false;
		};
	},
	aspects : {
		"angry" : 3,
		"sad" : 3,
	}
});

return konverzace;