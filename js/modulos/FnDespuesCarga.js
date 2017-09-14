var seleccionar;
window.onload = function() {
	seleccionar = Selector('id',['body','div','ul','li','svg','path','button']);

	var lienzo = ServiciosLienzo(seleccionar.contenedorLienzo,{
		'seleccion':seleccionar.seleccion,
		'selecciondirecta':seleccionar.seleccionDirecta,
		'pluma':seleccionar.btnPluma,
		'plumaeliminar':seleccionar.btnPlumaEliminar
	});

	agregarReglaCSS(document.styleSheets[0],'#btnExpandirAbajo','background:url("'+
		iconos.obtenerURL(
			'botones',
			'expandirAbajo',
			seleccionar.btnExpandirAbajo.offsetWidth,
			seleccionar.btnExpandirAbajo.offsetHeight,
			60
		)+'")',1);
	agregarReglaCSS(document.styleSheets[0],'#btnPluma','background:url("'+
		iconos.obtenerURL(
			'botones',
			'pluma',
			seleccionar.btnPluma.offsetWidth,
			seleccionar.btnPluma.offsetHeight,
			60
		)+'")',1);
	agregarReglaCSS(document.styleSheets[0],'#btnPlumaEliminar','background:url("'+
		iconos.obtenerURL(
			'botones',
			'plumaEliminar',
			seleccionar.btnPlumaEliminar.offsetWidth,
			seleccionar.btnPlumaEliminar.offsetHeight,
			60
		)+'")',1);
};
 
function agregarReglaCSS(hoja,selector,reglas,indice) {
	if('insertRule' in hoja)
		hoja.insertRule(selector+'{'+reglas+'}',(indice!==undefined ? 1 : indice));
	if('addRule' in hoja)
		hoja.addRule(selector,reglas,(indice!==undefined ? 1 : indice));
}