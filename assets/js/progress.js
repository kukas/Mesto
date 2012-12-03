function Progress(){
	this.playerDistanceWalked = 0;
	this.missions = [{
		title:"walk 5 metres",
		description:"walk five metres around this great world",
		side:"slavers"
		},
		{
		title:"Another mission",
		description:"Kill the guy who is hiding in here.",
		side:"slavers"
		}];
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