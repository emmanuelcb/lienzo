class ColeccionIconos {
	constructor() {
		this.botones = {
			expandirAbajo:function(width,height){
				var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
				var grupo = document.createElementNS('http://www.w3.org/2000/svg','g');
				var trazo1 = document.createElementNS('http://www.w3.org/2000/svg','path');
				trazo1.setAttributeNS(null,'style','fill:rgb(230,230,230);');
				trazo1.setAttributeNS(null,'d',''+
					'M'+(width*30/100)+','+(height*30/100)+
					'H'+(width*70/100)+
					'L'+(width*50/100)+','+(height*60/100)+
					'L'+(width*30/100)+','+(height*30/100)+'Z');
				grupo.appendChild(trazo1);
				var trazo2 = document.createElementNS('http://www.w3.org/2000/svg','path');
				trazo2.setAttributeNS(null,'style','fill:rgb(190,190,190);');
				trazo2.setAttributeNS(null,'d',''+
					'M'+(width*30/100)+','+(height*40/100)+
					'H'+(width*70/100)+
					'L'+(width*50/100)+','+(height*70/100)+
					'L'+(width*30/100)+','+(height*40/100)+'Z');
				grupo.appendChild(trazo2);
				svg.appendChild(grupo);
				return svg;
			}
		};
	}
	obtenerSVG(coleccion,nombre,width,height) {
		var svg = this[coleccion][nombre](parseInt(width),parseInt(height));
		svg.setAttributeNS(null,'width',width);
		svg.setAttributeNS(null,'height',height);
		return svg;
	}
	obtenerURL(coleccion,nombre,width,height) {
		var svg = this[coleccion][nombre](parseInt(width),parseInt(height));
		var serializador = new XMLSerializer();
		var fuente = serializador.serializeToString(svg);
		if(!fuente.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/))
		    fuente = fuente.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
		if(!fuente.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/))
		    fuente = fuente.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
		if(fuente.match(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/))
			fuente = fuente.replace(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/, '');
		fuente = '<?xml version="1.0" standalone="no"?>\r\n' + fuente;
		var url = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(fuente);
		console.log(url);
		return url;
	}
}