var lienzo;
var seleccionar;
var anchoVentana;
var altoVentana;

window.onload = function() {
	seleccionar = new Selector('id',['body','div','ul','li','canvas']);
	anchoVentana = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	altoVentana = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	seleccionar.cuerpo.style.width = anchoVentana;
	seleccionar.cuerpo.style.height = altoVentana;
	lienzo = new ServiciosLienzo(seleccionar.lienzo,{
		'seleccion':seleccionar.seleccion,
		'selecciondirecta':seleccionar.seleccionDirecta,
		'pluma':seleccionar.pluma,
		'plumaeliminar':seleccionar.plumaEliminar
	},anchoVentana-40,altoVentana-80,seleccionar.barraEstado);
};