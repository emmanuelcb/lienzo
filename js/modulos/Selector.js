var Selector = function(atributo,etiquetas){
	var s = {
		inicializar: function(atributo,etiquetas) {
			if(Object.prototype.toString.call(etiquetas) !== '[object Array]')
				throw new Error('Ups!, parece que tu desarrollador la rego, este no es un Array.');
			for(var iA=0,numEtiquetas=etiquetas.length; iA<numEtiquetas; iA++) {
				var listEtiquetas = document.getElementsByTagName(etiquetas[iA]);
				for(var iB=0,numElementos=listEtiquetas.length; iB<numElementos; iB++) {
					var idEtiqueta = listEtiquetas[iB].getAttribute(atributo); 	
					if(idEtiqueta) {
						if(typeof this[idEtiqueta] === 'undefined'){
							this[idEtiqueta] = listEtiquetas[iB];
						}else if(typeof this[idEtiqueta] === 'string'){
							var temporal = [this[idEtiqueta],listEtiquetas[iB]];
							this[idEtiqueta] = temporal;
						}else{
							this[idEtiqueta].push(listEtiquetas[iB]);
						}
					}
				}
			}
		}
	};
	s.inicializar(atributo,etiquetas);
	return s;
}