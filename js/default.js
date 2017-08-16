var lienzoElem;
var idSelect;
var windowWidth;
var windowHeight;
var cContext;

window.onload = function() {
	idSelect = new selector('id',['body','div','ul','li','canvas']);
	windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	idSelect.mainBody.style.width = windowWidth;
	idSelect.mainBody.style.height = windowHeight;
	idSelect.myCanvas.setAttribute('width',windowWidth-40);
	idSelect.myCanvas.setAttribute('height',windowHeight-80);
	lienzoElem = new lienzo(idSelect.myCanvas,{
		'selectiontool':idSelect.selectionTool,
		'directselection':idSelect.directSelection,
		'pentool':idSelect.penTool
	});
};