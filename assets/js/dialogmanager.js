function DialogManager(){
	
};
DialogManager.prototype.loadConversation = function (adress,callback){
	$.get("assets/conversations/"+adress,function (data){
		var konverzace = eval("(function (){"+data+"})();");
		callback(konverzace);
	});
};