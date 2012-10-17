function createCanvas(w, h){
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext("2d");
	return {canvas: canvas, ctx: ctx, width: w, height: h};
}
function makeFont(italic,weight,font,size){
	return italic+" "+weight+" "+size+"px '"+font+"'"
}