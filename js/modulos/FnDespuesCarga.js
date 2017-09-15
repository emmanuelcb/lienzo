var seleccionar;
window.onload = function() {
	seleccionar = Selector('id',['body','div','ul','li','svg','path','button']);

	var lienzo = ServiciosLienzo(seleccionar.contenedorLienzo,{
		'seleccion':seleccionar.btnSeleccion,
		'selecciondirecta':seleccionar.btnSeleccionDirecta,
		'pluma':seleccionar.btnPluma,
		'plumaeliminar':seleccionar.btnPlumaEliminar
	});

	var docStyleSheets = document.styleSheets[0];
	var reglasPorAgregar = ['expandirAbajo','pluma','plumaEliminar','seleccion','seleccionDirecta'];

	for(var i=0; i<reglasPorAgregar.length; i++) {
		var reglaId = reglasPorAgregar[i];
		var selector = reglaId.charAt(0).toUpperCase() + reglaId.slice(1);
		agregarReglaCSS(docStyleSheets,'#btn'+selector,'background:url("'+
			iconos.obtenerURL('botones',reglaId,seleccionar['btn'+selector].offsetWidth,seleccionar['btn'+selector].offsetHeight,60)+'")',1);
	}
};
 
function agregarReglaCSS(hoja,selector,reglas,indice) {
	if('insertRule' in hoja)
		hoja.insertRule(selector+'{'+reglas+'}',(indice!==undefined ? 1 : indice));
	if('addRule' in hoja)
		hoja.addRule(selector,reglas,(indice!==undefined ? 1 : indice));
}