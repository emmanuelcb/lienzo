var ServiciosLienzo = function(contenedor,herramientas) {
	var sl = {
		validarParametros: function(contenedor,herramientas) {
			if(contenedor === undefined)
				throw new Error('Ups!, parece que tu desarrollador la cago, no hay parentElement definido.');
			if(Object.prototype.toString.call(herramientas) !== '[object Object]')
				throw new Error('Ups!, parece que tu desarrollador la cago, este no es un Object.');
		},
		crearLienzo: function() {
			var imagenSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
			imagenSVG.setAttributeNS(null,'width',20);
			imagenSVG.setAttributeNS(null,'height',20);
			var ubicacionesX = [0,10,0,10];
			var ubicacionesY = [0,0,10,10];
			var colores = ['rgb(230,230,255)','rgb(255,255,255)','rgb(255,255,255)','rgb(230,230,255)'];
			for(var i=0,j=4; i<j; i++) {
				var cuadrado = document.createElementNS('http://www.w3.org/2000/svg','rect');
				cuadrado.setAttributeNS(null,'x',ubicacionesX[i]);
				cuadrado.setAttributeNS(null,'y',ubicacionesY[i]);
				cuadrado.setAttributeNS(null,'width',10);
				cuadrado.setAttributeNS(null,'height',10);
				cuadrado.setAttributeNS(null,'fill',colores[i]);
				imagenSVG.appendChild(cuadrado);
			}
			var serializador = new XMLSerializer();
			var fuente = serializador.serializeToString(imagenSVG);
			if(!fuente.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/))
			    fuente = fuente.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
			if(!fuente.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/))
			    fuente = fuente.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
			if(fuente.match(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/))
				fuente = fuente.replace(/xmlns="http\:\/\/www\.w3\.org\/1999\/xhtml"/, '');
			fuente = '<?xml version="1.0" standalone="no"?>\r\n' + fuente;
			var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(fuente);

			var nuevoLienzo = document.createElementNS('http://www.w3.org/2000/svg','svg');
			nuevoLienzo.setAttributeNS(null,'id','lienzo');
			var hoja = document.styleSheets[0];
			if('insertRule' in hoja)
				hoja.insertRule('#lienzo'+'{background:url("'+url+'");margin: 0 auto;}',1);
			if('addRule' in hoja)
				hoja.addRule('#lienzo','background:url("'+url+'");margin: 0 auto;',1);
			this.contenedor.appendChild(nuevoLienzo);
			this.lienzo = nuevoLienzo;
		},
		agregarEventos: function() {
			this.lienzo.addEventListener('mousedown',this.manejadorRatonPresionado(this),false);
			this.lienzo.addEventListener('mouseup',this.manejadorRatonSuelto(this),false);
			this.lienzo.addEventListener('mousemove',this.manejadorRatonMoviendo(this),false);
		},
		manejadorRatonPresionado: function(servicios) {
			var ratonPresionadoFn = function(evento){
				if(evento.which == 1) {
					console.log(servicios);
					servicios.ratonPresionado = true;
					servicios.herramientaActiva.abajo(servicios,evento);
				}
			};
			return ratonPresionadoFn;
		},
		manejadorRatonSuelto: function(servicios) {
			var ratonSueltoFn = function(evento){
				if(evento.which == 1) {
					servicios.ratonPresionado = false;
					servicios.herramientaActiva.arriba(servicios,evento);
				}
			};
			return ratonSueltoFn;
		},
		manejadorRatonMoviendo: function(servicios) {
			var ratonMoviendoFn = function(evento){
				if(evento.which == 1) {
					var pos = servicios.obtenerPosicion(evento);
					if(servicios.hayPuntosActivos && servicios.ratonPresionado)
						servicios.moverPuntos(pos.x,pos.y);
				}
			};
			return ratonMoviendoFn;
		},
		obtenerPosicion: function(evento) {
			var x;
			var y;
			var lienzo = this.lienzo;
			var padre = lienzo.parentElement ? lienzo.parentElement : lienzo.parentNode;
			if (evento.pageX != undefined && evento.pageY != undefined) {
				x = evento.pageX;
				y = evento.pageY;
			} else {
				x = evento.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = evento.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			if(!isNaN(lienzo.offsetLeft) && !isNaN(lienzo.offsetTop)) {
				x -= lienzo.offsetLeft;
				y -= lienzo.offsetTop;
			} else if(!isNaN(padre.offsetLeft) && !isNaN(padre.offsetTop)) {
				x -= padre.offsetLeft;
				y -= padre.offsetTop;
			}

			return {x:x,y:y};
		},
		agregarTrazo: function(pos) {
			this.trazos[this.count] = Trazo(this.count,pos,this);
			this.trazoActivo = this.trazos[this.count];
			this.count++;
		},
		moverPuntos: function(x,y) {
			for(var p in this.hayPuntosActivos) {
				var punto = this.hayPuntosActivos[p];
				punto.mover(x,y);
			}
		},
		inicializar: function(contenedor,herramientas) {
			this.validarParametros(contenedor,herramientas);
			this.contenedor = contenedor;
			this.count = 0;
			this.crearLienzo();
			this.herramientas = Herramientas(this,herramientas);
			this.herramientaActiva = this.herramientas.pluma;
			this.puntoActivo = undefined;
			this.trazoActivo = undefined;
			this.trazos = {};
			this.agregarEventos();
		}
	};
	sl.inicializar(contenedor,herramientas);
	return sl;
}