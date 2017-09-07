class ServiciosLienzo {
	constructor(contenedor,herramientas) {
		this.validarParametros(contenedor,herramientas);
		this.inicializar(contenedor,herramientas);
		this.agregarEventos(herramientas);
	}
	validarParametros(contenedor,herramientas) {
		if(contenedor === undefined)
			throw new Error('Ups!, parece que tu desarrollador la cago, no hay parentElement definido.');
		if(Object.prototype.toString.call(herramientas) !== '[object Object]')
			throw new Error('Ups!, parece que tu desarrollador la cago, este no es un Object.');
	}
	inicializar(contenedor,herramientas) {
		this.contenedor = contenedor;
		this.crearLienzo();
		this.trazos = {};
		this.count = 0;
		this.trazoActivo = undefined;
		this.puntoActivo = undefined;
		this.herramientasPermitidas = ['seleccion','selecciondirecta','pluma','plumaeliminar'];
		this.herramientas = {
			seleccion : {
				valor: 0,
				nombre: 'Seleccion',
				abajo: function(este,evento) {},
				arriba: function(este,evento) {}
			},
			selecciondirecta : {
				valor: 1,
				nombre: 'Seleccion directa',
				abajo: function(este,evento) {
					var pos = este.obtenerPosicion(evento);
					if(este.trazoActivo) {
						este.trazoActivo.inactivarPuntos();
						var hayPunto = este.trazoActivo.seleccionaPunto(pos.x,pos.y);
						if(hayPunto)
							este.hayPuntoActivo = este.trazoActivo.puntoActivo;

					} else {
						for(var t in este.trazos) {
							var trazo = este.trazos[t];
							var hayPunto = trazo.seleccionaPunto(pos.x,pos.y);
							if(hayPunto){
								este.hayPuntoActivo = este.trazoActivo.puntoActivo;
								break;
							}
						}
					}
				},
				arriba: function(este,evento) {
					if(este.hayPuntoActivo)
						este.hayPuntoActivo = undefined;
				}
			},
			pluma : {
				valor: 3,
				nombre: 'Pluma',
				abajo: function(este,evento) {
					var pos = este.obtenerPosicion(evento);
					if(este.trazoActivo !== undefined) {
						var enAreaActiva;
						for(var p in este.trazoActivo.puntos) {
							var punto = este.trazoActivo.puntos[p];
							enAreaActiva = punto.enAreaActiva(pos.x,pos.y);
							if(enAreaActiva)
								break;
						}
						if(!enAreaActiva)
							este.trazoActivo.agregarPunto(pos);
					}
					else {
						este.agregarTrazo(pos);
					}
				},
				arriba: function(este,evento) {}
			},
			plumaeliminar : {
				valor: 4,
				nombre: 'Pluma eliminar puntos',
				abajo: function(este,evento) {
					var pos = este.obtenerPosicion(evento);
					if(este.trazoActivo) {
						var hayPunto = este.trazoActivo.seleccionaPunto(pos.x,pos.y);
						if(hayPunto)
							este.trazoActivo.puntoActivo.eliminar();

					}
				},
				arriba: function(este,evento) {}
			}
		}
		this.herramientaActiva = this.herramientas.pluma;
		this.atajos = {
			V : 'seleccion',
			A : 'selecciondirecta',
			P : 'pluma',
			AltP : 'plumaeliminar'
		}
	}
	crearLienzo(width,height) {
		var imageSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
		imageSVG.setAttributeNS(null,'width',20);
		imageSVG.setAttributeNS(null,'height',20);
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

		var nuevoLienzo = document.createElementNS('http://www.w3.org/2000/svg','svg');
		nuevoLienzo.setAttributeNS(null,'id','lienzo');
		var hoja = document.styleSheets[0];
		if('insertRule' in hoja)
			hoja.insertRule('#lienzo'+'{background:url("'+url+'");margin: 0 auto;}',1);
		if('addRule' in hoja)
			hoja.addRule('#lienzo','background:url("'+url+'");margin: 0 auto;',1);
		this.contenedor.appendChild(nuevoLienzo);
		this.lienzo = nuevoLienzo;
	}
	agregarEventos(herramientas) {
		// General
		this.lienzo.addEventListener('mousedown',this.manejadorRatonPresionado(this),false);
		this.lienzo.addEventListener('mouseup',this.manejadorRatonSuelto(this),false);
		this.lienzo.addEventListener('mousemove',this.manejadorRatonMoviendo(this),false);
		// Atajos
		document.addEventListener('keydown',this.agregarAtajoFuncion(this),false);
		// Herramientas
		for(var herramienta in herramientas) {
			if(this.herramientasPermitidas.indexOf(herramienta) !== -1) {
				herramientas[herramienta].addEventListener('click',this.agregaFuncion(this,herramienta),false);
			}
		}
	}
	manejadorRatonPresionado(este) {
		var ratonPresionadoFn = function(evento){
			if(evento.which == 1)
				este.herramientaActiva.abajo(este,evento);
		};
		return ratonPresionadoFn;
	}
	manejadorRatonSuelto(este) {
		var ratonSueltoFn = function(evento){
			if(evento.which == 1)
				este.herramientaActiva.arriba(este,evento);
		};
		return ratonSueltoFn;
	}
	manejadorRatonMoviendo(este) {
		var ratonMoviendoFn = function(evento){
			if(evento.which == 1) {
				var pos = este.obtenerPosicion(evento);
				if(este.hayPuntoActivo)
					este.hayPuntoActivo.mover(pos.x,pos.y);
			}
		};
		return ratonMoviendoFn;
	}
	agregarAtajoFuncion(este) {
		var fn = function(evento) {
			var tecla = evento.key;
			var atajo = evento.altKey ? 'Alt'+tecla.toUpperCase() : tecla.toUpperCase();
			if(este.atajos[atajo]) {
				var herramienta = este.atajos[atajo];
				este.herramientaActiva = este.herramientas[herramienta];
				console.log([atajo,este.herramientaActiva]);
			}
		}
		return fn;
	}
	agregaFuncion(este,herramienta) {
		var fn = function(evento){
			este.herramientaActiva = este.herramientas[herramienta];
		}
		return fn;
	}
	obtenerPosicion(evento) {
		var x;
		var y;
		if (evento.pageX != undefined && evento.pageY != undefined) {
			x = evento.pageX;
			y = evento.pageY;
		} else {
			x = evento.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = evento.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		if(!isNaN(this.lienzo.offsetLeft) && !isNaN(this.lienzo.offsetTop)) {
			x -= this.lienzo.offsetLeft;
			y -= this.lienzo.offsetTop;
		} else if(!isNaN(this.lienzo.parentElement.offsetLeft) && !isNaN(this.lienzo.parentElement.offsetTop)) {
			x -= this.lienzo.parentElement.offsetLeft;
			y -= this.lienzo.parentElement.offsetTop;
		}

		return {x:x,y:y};
	}
	agregarTrazo(pos) {
		this.trazos[this.count] = new Trazo(this.count,pos,this);
		this.trazoActivo = this.trazos[this.count];
		this.count++;
	}
}
class Trazo {
	constructor(id,pos,servicios) {
		this.validarParametros(id,pos,servicios);
		this.id = 'trazo'+id;
		this.puntos = {};
		this.count = 0;
		this.puntoActivo;
		this.servicios = servicios;
		this.esNuevo = true;
		this.agregarPunto(pos);
	}
	validarParametros(id,pos,servicios) {
		if(id == null || id === undefined)
			throw new Error('Un nuevo trazo require de un id.');
		if(pos == null || pos === undefined)
			throw new Error('Un nuevo trazo require de unas coordenadas.');
		if(servicios == null || servicios === undefined)
			throw new Error('Un nuevo trazo require de un servicio.');
	}
	inactivarPuntos() {
		for(var p in this.puntos) {
			this.puntos[p].punto.setAttributeNS(null,'fill','rgb(30,90,10)');
		}
	}
	seleccionaPunto(x,y) {
		var hayPunto = false;
		for(var p in this.puntos) {
			var punto = this.puntos[p];
			if(punto.enAreaActiva(x,y)) {
				punto.punto.setAttributeNS(null,'fill','rgb(250,120,10)');
				this.servicios.trazoActivo = this;
				this.puntoActivo = punto;
				hayPunto = true;
				break;
			}
		}
		return hayPunto;
	}
	agregarPunto(pos) {
		if(this.esNuevo) {
			this.esNuevo = false;
			this.empezarTrazo();
		}
		this.puntos[this.count] = new Punto(this.count, pos.x, pos.y, this.esNuevo, this, this.puntoActivo);
		this.puntoActivo = this.puntos[this.count];
		this.count++;
		if(this.trazo)
			this.retrazar();
		else
			this.trazar();
	}
	empezarTrazo() {
		var grupoTrazo = document.createElementNS('http://www.w3.org/2000/svg','g');
		grupoTrazo.setAttributeNS(null,'id','g'+this.id);
		this.servicios.lienzo.appendChild(grupoTrazo);
		this.grupoTrazo = grupoTrazo;
	}
	trazar() {
		var color = 'rgb(200,200,200)';
		var trazo = document.createElementNS('http://www.w3.org/2000/svg','path');
		var cadenaD = this.obtenerD();
		trazo.setAttributeNS(null,'d',cadenaD);
		trazo.setAttributeNS(null,'id',this.id);
		trazo.setAttributeNS(null,'style','fill:'+color+';');
		this.grupoTrazo.appendChild(trazo);
		this.trazo = trazo;
	}
	retrazar() {
		var cadenaD = this.obtenerD();
		this.trazo.setAttributeNS(null,'d',cadenaD);
	}
	obtenerD() {
		var cadenaD = '';
		var puntoAnterior;
		for(var p in this.puntos) {
			var punto = this.puntos[p];
			if(punto.eliminado)
				continue;
			if(cadenaD=='') {
				cadenaD += 'M'+punto.x+','+punto.y+' ';
				puntoAnterior = punto;
				continue;
			}
			if(punto.bezierAnt && puntoAnterior.bezierSig) {
				cadenaD += 'C'+puntoAnterior.bezierSig.cx+','+puntoAnterior.bezierSig.cy;
				cadenaD += ' '+punto.bezierAnt.cx+','+punto.bezierAnt.cy;
				cadenaD += ' '+punto.x+','+punto.y+' ';
			} else {
				cadenaD += 'L'+punto.x+','+punto.y+' ';
			}
			puntoAnterior = punto;
		}
		return cadenaD;
	}
}
class Punto {
	constructor(id,x,y,inicial,trazo,anterior) {
		this.validarParametros(id,x,y,inicial,trazo,anterior);
		this.id = id;
		this.x = x;
		this.y = y;
		this.inicial = inicial;
		this.bezierAnt = undefined;
		this.bezierSig = undefined;
		this.trazo = trazo;
		this.radio = 3;
		this.radioActivo = 6;
		this.eliminado = false;
		this.dibujarPunto();
		if(anterior) {
			this.anterior = anterior;
			this.anterior.siguiente = this;
			this.dibujarLinea();
		}
	}
	validarParametros(id,x,y,inicial,trazo,anterior) {
		if(id == null || id === undefined)
			throw new Error('Para crear un nuevo punto requires de un id.');
		if(x == null || x === undefined)
			throw new Error('Para crear un nuevo punto requires de una coordenada x.');
		if(y == null || y === undefined)
			throw new Error('Para crear un nuevo punto requires de una coordenada y.');
		if(inicial == null || inicial === undefined)
			throw new Error('Para crear un nuevo punto necesitas especificar si es el punto inicial.');
		if(trazo == null || trazo === undefined)
			throw new Error('Un nuevo punto require de un trazo definido.');
		if(anterior) {
			if(anterior.siguiente)
				throw new Error('No se puede continuar el trazo desde este punto, selecciona el punto correcto.');
		}
	}
	dibujarPunto() {
		var color = 'rgb(30,90,10)';
		var cuadrado = document.createElementNS('http://www.w3.org/2000/svg','rect');
		cuadrado.setAttributeNS(null,'x',this.x-this.radio);
		cuadrado.setAttributeNS(null,'y',this.y-this.radio);
		cuadrado.setAttributeNS(null,'width',this.radio*2);
		cuadrado.setAttributeNS(null,'height',this.radio*2);
		cuadrado.setAttributeNS(null,'fill',color);
		this.trazo.grupoTrazo.appendChild(cuadrado);
		this.punto = cuadrado;
	}
	dibujarLinea() {
		var color = 'rgb(30,90,10)';
		var linea = document.createElementNS('http://www.w3.org/2000/svg','path');
		var atributoD = 'M'+this.anterior.x+','+this.anterior.y+
			(this.anterior.bezierSig ? (
				' C'+this.anterior.bezierSig.cx+','+this.anterior.bezierSig.cy) : (
				' C'+this.anterior.x+','+this.anterior.y))+
			(this.bezierAnt ? (
				' '+this.bezierAnt.cx+','+this.bezierAnt.cy) : (
				' '+this.x+','+this.y))+
			' '+this.x+','+this.y;
		linea.setAttributeNS(null,'d',atributoD);
		linea.setAttributeNS(null,'stroke',color);
		linea.setAttributeNS(null,'stroke-width',2);
		linea.setAttributeNS(null,'fill','none');
		this.trazo.grupoTrazo.appendChild(linea);
		this.linea = linea;
	}
	reubicarPunto() {
		this.punto.setAttributeNS(null,'x',this.x-this.radio);
		this.punto.setAttributeNS(null,'y',this.y-this.radio);
	}
	reubicarLinea() {
		var atributoD = 'M'+this.anterior.x+','+this.anterior.y+
			(this.anterior.bezierSig ? (
				' C'+this.anterior.bezierSig.cx+','+this.anterior.bezierSig.cy) : (
				' C'+this.anterior.x+','+this.anterior.y))+
			(this.bezierAnt ? (
				' '+this.bezierAnt.cx+','+this.bezierAnt.cy) : (
				' '+this.x+','+this.y))+
			' '+this.x+','+this.y;
		this.linea.setAttributeNS(null,'d',atributoD);
	}
	enAreaActiva(x,y) {
		return x < (this.x + this.radioActivo) &&
		x > (this.x - this.radioActivo) &&
		y < (this.y + this.radioActivo) &&
		y > (this.y - this.radioActivo) ? true : false;
	}
	agregarBezier(tipoBezier,punto) {
		if(tipoBezier == 'anterior')
			this.bezierAnt = new Bezier(this.x+5,this.y+5,this);
		else
			this.bezierSig = new Bezier(this.x+5,this.y+5,this);
	}
	mover(x,y) {
		this.compensar('x',x);
		this.compensar('y',y);
		this.reubicarPunto();
		if(this.linea)
			this.reubicarLinea();
		if(this.siguiente)
			this.siguiente.reubicarLinea();
		this.trazo.retrazar();
	}
	compensar(coordenada,valor) {
		var diferencia = (this[coordenada] - valor)*-1;
		this[coordenada] = this[coordenada] + diferencia;
		if(this.bezierAnt)
			this.bezierAnt['c'+coordenada] = this.bezierAnt['c'+coordenada] + diferencia;
		if(this.bezierSig)
			this.bezierSig['c'+coordenada] = this.bezierSig['c'+coordenada] + diferencia;
	}
	eliminar() {
		var padreLinea = this.linea.parentElement;
		var padrePunto = this.punto.parentElement;
		padrePunto.removeChild(this.punto);
		padreLinea.removeChild(this.linea);
		if(this.siguiente && this.anterior) {
			this.siguiente.anterior = this.anterior;
			this.anterior.siguiente = this.siguiente;
			this.siguiente.reubicarLinea();
			this.eliminado = true;
			this.trazo.retrazar();
		}
	}
}
class Bezier {
	constructor(cx,cy,punto) {
		this.cx = cx;
		this.cy = cy;
		this.punto = punto;
		this.dibujarBezier();
	}
	dibujarBezier() {
		var circulo = document.createElementNS('http://www.w3.org/2000/svg','circle');
		circulo.setAttributeNS(null,'cx',this.x);
		circulo.setAttributeNS(null,'cy',this.y);
		circulo.setAttributeNS(null,'r',this.radio);
		circulo.setAttributeNS(null,'fill',color);
		this.punto.trazo.servicios.lienzo.appendChild(circulo);
	}
}
