var svgLienzoServices;
var seleccionar;
var anchoVentana;
var altoVentana;

window.onload = function() {
	seleccionar = new Selector('id',['body','div','ul','li','svg']);

	// Creamos el fondo del contenedor del lienzo
	var imageSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
	imageSVG.setAttributeNS(null,'width',20);
	imageSVG.setAttributeNS(null,'height',20);
	var ubicacionesX = [0,10,0,10];
	var ubicacionesY = [0,0,10,10];
	var colores = ['rgb(200,200,200)','rgb(255,255,255)','rgb(255,255,255)','rgb(200,200,200)'];
	for(var i=0,j=4; i<j; i++) {
		var cuadrado = document.createElementNS('http://www.w3.org/2000/svg','rect');
		cuadrado.setAttributeNS(null,'x',ubicacionesX[i]);
		cuadrado.setAttributeNS(null,'y',ubicacionesY[i]);
		cuadrado.setAttributeNS(null,'width',10);
		cuadrado.setAttributeNS(null,'height',10);
		cuadrado.setAttributeNS(null,'fill',colores[i]);
		imageSVG.appendChild(cuadrado);
	}
	var serializador = new XMLSerializer();
	var fuente = serializador.serializeToString(imageSVG);
	if(!fuente.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/))
	    fuente = fuente.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	if(!fuente.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/))
	    fuente = fuente.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
	if(fuente.match(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/))
		fuente = fuente.replace(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/, '');
	fuente = '<?xml version="1.0" standalone="no"?>\r\n' + fuente;
	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(fuente);
	seleccionar.contenedorLienzo.style.background = 'url("'+url+'")';

	// Creamos y agregamos el SVG
	var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
	svg.setAttributeNS(null,'id','lienzo');
	svg.setAttributeNS(null,'style','width:95vw;height:90vh;');
	seleccionar.contenedorLienzo.appendChild(svg);
	seleccionar = new Selector('id',['body','div','ul','li','svg']);

	// Creamos un nuevo servicio de SVGLienzo
	svgLienzoServices = new SVGLienzo(seleccionar.lienzo,{
		'seleccion':seleccionar.seleccion,
		'selecciondirecta':seleccionar.seleccionDirecta,
		'pluma':seleccionar.pluma,
		'plumaeliminar':seleccionar.plumaEliminar
	},seleccionar.barraEstado);
};