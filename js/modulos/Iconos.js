var ColeccionIconos = function(){
	var ci = {
		inicializar: function() {
			this.botones = {
				expandirAbajo:function(ancho,alto,porcentaje){
					var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
					var grupo = document.createElementNS('http://www.w3.org/2000/svg','g');
					if(porcentaje < 100) {
						var redimension = porcentaje/100;
						var compensacion = (((100-porcentaje)/100)*ancho)/2;
						grupo.setAttributeNS(null,'transform','matrix('+redimension+',0,0,'+redimension+','+compensacion+','+compensacion+')');
					}
					var trazo1 = document.createElementNS('http://www.w3.org/2000/svg','path');
					trazo1.setAttributeNS(null,'style','fill:rgb(230,230,230);');
					trazo1.setAttributeNS(null,'d',''+
						'M'+(ancho*25/100)+','+(alto*25/100)+
						'H'+(ancho*75/100)+
						'L'+(ancho*50/100)+','+(alto*60/100)+
						'L'+(ancho*25/100)+','+(alto*25/100)+'Z'+
						'M'+(ancho*25/100)+','+(alto*40/100)+
						'H'+(ancho*75/100)+
						'L'+(ancho*50/100)+','+(alto*75/100)+
						'L'+(ancho*25/100)+','+(alto*40/100)+'Z');
					grupo.appendChild(trazo1);
					svg.appendChild(grupo);
					return svg;
				},
				pluma:function(ancho,alto,porcentaje){
					var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
					var grupo = document.createElementNS('','g');
					if(porcentaje < 100) {
						var redimension = porcentaje/100;
						var compensacion = (((100-porcentaje)/100)*ancho)/2;
						grupo.setAttributeNS(null,'transform','matrix('+redimension+',0,0,'+redimension+','+compensacion+','+compensacion+')');
					}
					var trazo1 = document.createElementNS('','path');
					trazo1.setAttributeNS(null,'style','fill:rgb(230,230,230)');
					trazo1.setAttributeNS(null,'d',''+
						'M'+(ancho*20/100)+','+(alto*80/100)+' '+
						'L'+(ancho*30/100)+','+(alto*40/100)+' '+
						'H'+(ancho*45/100)+' '+
						'L'+(ancho*60/100)+','+(alto*20/100)+' '+
						'L'+(ancho*80/100)+','+(alto*40/100)+' '+
						'L'+(ancho*60/100)+','+(alto*55/100)+' '+
						'V'+(alto*70/100)+' '+
						'L'+(ancho*20/100)+','+(alto*80/100)+' '+
						'M'+(ancho*27.5/100)+','+(alto*72.5/100)+' '+
						'L'+(ancho*55/100)+','+(alto*65/100)+' '+
						'V'+(alto*50/100)+' '+
						'L'+(ancho*50/100)+','+(alto*45/100)+' '+
						'H'+(ancho*35/100)+' '+
						'L'+(ancho*27.5/100)+','+(alto*72.5/100)+'Z'+
						'M'+(ancho*27.5/100)+','+(alto*72.5/100)+' '+
						'L'+(ancho*30/100)+','+(alto*65/100)+' '+
						'L'+(ancho*47.5/100)+','+(alto*52.5/100)+' '+
						'L'+(ancho*35/100)+','+(alto*70/100)+'Z'+
						'M'+(ancho*40/100)+','+(alto*55/100)+' '+
						'C'+(ancho*40/100)+','+(alto*52.5/100)+' '+(ancho*42.5/100)+','+(alto*50/100)+' '+(ancho*45/100)+','+(alto*50/100)+' '+
						'C'+(ancho*47.5/100)+','+(alto*50/100)+' '+(ancho*50/100)+','+(alto*52.5/100)+' '+(ancho*50/100)+','+(alto*52.5/100)+' '+
						'C'+(ancho*50/100)+','+(alto*57.5/100)+' '+(ancho*47.5/100)+','+(alto*60/100)+' '+(ancho*45/100)+','+(alto*60/100)+' '+
						'C'+(ancho*42.5/100)+','+(alto*60/100)+' '+(ancho*40/100)+','+(alto*57.5/100)+' '+(ancho*40/100)+','+(alto*55/100)+'Z');
					grupo.appendChild(trazo1);
					svg.appendChild(grupo);
					return svg;
				},
				plumaEliminar:function(ancho,alto,porcentaje) {
					var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
					var grupo = document.createElementNS('','g');
					if(porcentaje < 100) {
						var redimension = porcentaje/100;
						var compensacion = (((100-porcentaje)/100)*ancho)/2;
						grupo.setAttributeNS(null,'transform','matrix('+redimension+',0,0,'+redimension+','+compensacion+','+compensacion+')');
					}
					var trazo1 = document.createElementNS('','path');
					trazo1.setAttributeNS(null,'style','fill:rgb(230,230,230)');
					trazo1.setAttributeNS(null,'d',''+
						'M'+(ancho*20/100)+','+(alto*80/100)+' '+
						'L'+(ancho*30/100)+','+(alto*40/100)+' '+
						'L'+(ancho*45/100)+','+(alto*40/100)+' '+
						'L'+(ancho*60/100)+','+(alto*20/100)+' '+
						'L'+(ancho*80/100)+','+(alto*40/100)+' '+ 
						'L'+(ancho*60/100)+','+(alto*55/100)+' '+
						'L'+(ancho*60/100)+','+(alto*70/100)+' '+
						'L'+(ancho*20/100)+','+(alto*80/100)+' '+
						'M'+(ancho*27.5/100)+','+(alto*72.5/100)+' '+
						'L'+(ancho*55/100)+','+(alto*65/100)+' '+
						'L'+(ancho*55/100)+','+(alto*50/100)+' '+
						'L'+(ancho*50/100)+','+(alto*45/100)+' '+
						'L'+(ancho*35/100)+','+(alto*45/100)+' '+
						'L'+(ancho*27.5/100)+','+(alto*72.5/100)+'Z '+
						'M'+(ancho*27.5/100)+','+(alto*72.5/100)+' '+
						'L'+(ancho*30/100)+','+(alto*65/100)+' '+
						'L'+(ancho*47.5/100)+','+(alto*52.5/100)+' '+
						'L'+(ancho*35/100)+','+(alto*70/100)+'Z '+
						'M'+(ancho*40/100)+','+(alto*55/100)+' '+
						'C'+(ancho*40/100)+','+(alto*52.5/100)+' '+(ancho*42.5/100)+','+(alto*50/100)+' '+(ancho*45/100)+','+(alto*50/100)+' '+
						'C'+(ancho*47.5/100)+','+(alto*50/100)+' '+(ancho*50/100)+','+(alto*52.5/100)+' '+(ancho*50/100)+','+(alto*52.5/100)+' '+
						'C'+(ancho*50/100)+','+(alto*57.5/100)+' '+(ancho*47.5/100)+','+(alto*60/100)+' '+(ancho*45/100)+','+(alto*60/100)+' '+
						'C'+(ancho*42.5/100)+','+(alto*60/100)+' '+(ancho*40/100)+','+(alto*57.5/100)+' '+(ancho*40/100)+','+(alto*55/100)+'Z '+
						'M'+(ancho*55/100)+','+(alto*65/100)+' '+
						'H'+(ancho*80/100)+' '+
						'V'+(alto*70/100)+' '+
						'H'+(ancho*55/100)+'Z');
					grupo.appendChild(trazo1);
					svg.appendChild(grupo);
					return svg;
				}
			};
		},
		obtenerSVG: function(coleccion,nombre,ancho,alto,porcentaje) {
			var svg = this[coleccion][nombre](parseInt(ancho),parseInt(alto),parseInt(porcentaje));
			svg.setAttributeNS(null,'width',ancho);
			svg.setAttributeNS(null,'height',alto);
			return svg;
		},
		obtenerURL: function(coleccion,nombre,ancho,alto,porcentaje) {
			var svg = this[coleccion][nombre](parseInt(ancho),parseInt(alto),parseInt(porcentaje));
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
			return url;
		}
	};
	ci.inicializar();
	return ci;
}