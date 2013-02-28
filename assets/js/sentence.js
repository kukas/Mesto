function Sentence(options){
	if(options.id === undefined){
		console.warn("Není zavedeno ID sentence");
		return false;
	}
	this.value = options.value === undefined ? "" : options.value;
	this.reaction = options.reaction === undefined ? function (){} : options.reaction;
	this.question = options.question === undefined ? false : options.question;
	this.answer = options.answer === undefined ? false : options.answer;
	this.questAction = function (){};
	this.condition = options.condition === undefined ? function (){return true;} : options.condition;
	this.spoken = false;
	
	this.id = options.id;
};
Sentence.prototype.text = function (sX,sY,sWidth){
	var _this = this;
	var txt = new game.gui.constructors.text({
		value:_this.value,
		x:sX,
		y:sY,
		width:sWidth,
		styles : {
			default : {
				size : 20
			}
		}
	});
	return txt;
};
Sentence.prototype.action = function (){
	this.spoken = true;
	var qE = new QuestEvent("sentenceSpoken",this);
	this.reaction(qE);
	this.questAction(qE);
	game.questManager.eventHandle(qE);
};