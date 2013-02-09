function Progress(){
	this.achievements = {
		walking : {
			title:"First steps",
			description:"Walk at least 5 metres over the rusty floor of the City",
			onUnlock:"You've walked 5 metres here, in the City! Great!",
			value:0,
			condition:function (val){
				if(val > 5){return true;}
				else return false;
			},
			done : false
		},
		traveler:{
			title:"Traveler",
			description:"Walk at least for 10 metres around the City",
			onUnlock:"What a distance, 10 metres... Wow!",
			value:0,
			condition:function (val){
				if(val > 10){return true;}
				else return false;
			},
			done: false
		}
	};
	this.missions = {};
};
Progress.prototype.log = function (what){
	if(what !== undefined){
		if(this[what] !== undefined){
			return this[what];
		}
		else{
			console.warn("No such progress cathegory!");
		}
	}
};
Progress.prototype.checkAchievements = function (){
	for(var i in this.achievements){
		if(!this.achievements[i].done){
			if(this.achievements[i].condition(this.achievements[i].value)){
				this.achievements[i].done = true;
				game.gui.makePopout(this.achievements[i].onUnlock);
			}
		}
	};
};