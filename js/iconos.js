class ColeccionIconos {
	constructor() {
		this.cursores = {
			manoCerrada:function(){
				var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
				var trazo1 = document.createElementNS('http://www.w3.org/2000/svg','path');
				trazo1.setAttributeNS(null,'style','fill:black;');
				trazo1.setAttributeNS(null,'d','M320,53.333c-7.875,0-15.26,2.146-21.604,5.885C296.01,37.927,277.906,21.333,256,21.333'+
					'c-8.781,0-16.938,2.667-23.729,7.219C226.427,11.948,210.583,0,192,0s-34.427,11.948-40.271,28.552'+
					'C144.938,24,136.781,21.333,128,21.333c-23.531,0-42.667,19.135-42.667,42.667v38.25l-35.885,35.885'+
					'c-18.125,18.125-28.115,42.229-28.115,67.875c0,98.146,79.844,177.99,177.99,177.99H224c76.458,0,138.667-62.208,138.667-138.667V96'+
					'C362.667,72.469,343.531,53.333,320,53.333z');
				svg.appendChild(trazo1);
				return svg;
			}()
		};
	}
	obtenerURL(coleccion,nombre) {
		var svg = this[coleccion][nombre];
		var serializador = new XMLSerializer();
		var fuente = serializador.serializeToString(svg);
		if(!fuente.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/))
		    fuente = fuente.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
		if(!fuente.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/))
		    fuente = fuente.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
		if(fuente.match(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/))
			fuente = fuente.replace(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/, '');
		fuente = '<?xml version="1.0" standalone="no"?>\r\n' + fuente;
		var url = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(fuente);;
		return url;
	}
}