class SVGLienzo {
	constructor(lienzo,herramientas,barraEstado) {
		this.validarParametros(lienzo,herramientas);
		this.inicializar(lienzo,barraEstado);
		this.herramientaActiva = this.herramientas.pluma;
		this.agregarEventos(herramientas);
	}
	validarParametros(lienzo,herramientas) {
		if(Object.prototype.toString.call(lienzo) !== '[object SVGSVGElement]')
			throw new Error('Ups!, parece que tu desarrollador la cago, este no es un SVG.');
		if(Object.prototype.toString.call(herramientas) !== '[object Object]')
			throw new Error('Ups!, parece que tu desarrollador la cago, este no es un Object.');
	}
	inicializar(lienzo,barraEstado) {
		this.barraEstado = barraEstado;
		this.lienzo = lienzo;
		this.herramientasPermitidas = ['seleccion','selecciondirecta','pluma','plumaeliminar'];
		this.herramientas = {
			seleccion : {
				valor: 0, 
				nombre: 'Seleccion',
				abajo: function(este,pos) {},
				arriba: function(este,evento) {}
			},
			selecciondirecta : {
				valor: 1, 
				nombre: 'Seleccion directa',
				abajo: function(este,pos) {
					if(!este.trazoCurvo){
						return false;
					}
					var activo = este.trazoCurvo.seleccionarPunto(pos);
					if(activo) {

						este.herramientaActiva = este.herramientas.mover;
						este.barraEstado.innerHTML = este.herramientaActiva.nombre+' en uso.';
						este.lienzo.addEventListener('mousemove',este.actualizarSeleccion(este),false);
						return true;
					}
					return false;
				},
				arriba: function(este,evento) {
					este.lienzo.removeEventListener('mousemove',este.actualizarSeleccion(este),false);
					este.trazoCurvo.limpiarSeleccion();
				}
			},
			mover : {
				valor: 2,
				nombre: 'Mover',
				abajo: function() {},
				arriba:function(este,evento) {
					este.lienzo.removeEventListener('mousemove',este.actualizarSeleccion(este),false);
					este.trazoCurvo.limpiarSeleccion();
					este.herramientaActiva = este.herramientas.selecciondirecta;
				}
			},
			pluma : {
				valor: 3,
				nombre: 'Pluma',
				abajo: function(este,pos) {
					if(!este.trazoCurvo)
						este.trazoCurvo = new TrazoCurvo(este,pos);
					else {
						if(este.herramientas.selecciondirecta.abajo(este,pos)) 
							return;
						este.trazoCurvo.agregarPunto(pos);
					}
					este.hacer();
				},
				arriba: function(este,evento) {
					este.lienzo.removeEventListener('mousemove',este.actualizarSeleccion(este),false);
					este.trazoCurvo.limpiarSeleccion();
				}
			},
			plumaeliminar : {
				valor: 4,
				nombre: 'Pluma eliminar puntos',
				abajo: function(este,pos) {
					if(!este.trazoCurvo)
						return;
					var eliminado = este.trazoCurvo.eliminarPunto(pos);
					if(eliminado)
						este.hacer();
				},
				arriba: function(este,evento) {}
			}
		}
		this.atajos = {
			V : 'seleccion',
			A : 'selecciondirecta',
			P : 'pluma',
			AltP : 'plumaeliminar'
		}
	}
	agregarEventos(herramientas) {
		// General
		this.lienzo.addEventListener('mousedown',this.manejadorRatonPresionado(this),false);
		this.lienzo.addEventListener('mouseup',this.manejadorRatonSuelto(this),false);
		// Atajos
		document.addEventListener('keydown',this.agregarAtajoFuncion(this),false);
		// Herramientas
		for(var herramienta in herramientas) {
			if(this.herramientasPermitidas.indexOf(herramienta) !== -1) {
				herramientas[herramienta].addEventListener('click',this.agregaFuncion(this,herramienta),false);
			}
		}
	}
	agregarAtajoFuncion(este) {
		var fn = function(evento) {
			var tecla = evento.key;
			if(este.atajos[tecla.toUpperCase()]) {
				var herramienta = este.atajos[tecla.toUpperCase()];
				este.herramientaActiva = este.herramientas[herramienta];
			}
		}
		return fn;
	}
	agregaFuncion(este,herramienta) {
		var fn = function(evento){
			//console.log([evento]);
			//console.log([este]);
			este.herramientaActiva = este.herramientas[herramienta];
		}
		return fn;
	}
	obtenerRatonPosicion(evento) {
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
		
		return new Punto(this,x,y);
	}
	actualizarSeleccion(este) {
		var actualizarSeleccionFn = function(evento) {
			var pos = este.obtenerRatonPosicion(evento);
			este.trazoCurvo.actualizarSeleccion(pos);
			este.hacer();
		};
		return actualizarSeleccionFn;
	}
	manejadorRatonPresionado(este) {
		var ratonPresionadoFn = function(evento){
			//console.log([evento]);
			//console.log([este]); 
			var pos = este.obtenerRatonPosicion(evento);
			if(evento.which == 1)
				este.herramientaActiva.abajo(este,pos);

		};
		return ratonPresionadoFn;
	}
	manejadorRatonSuelto(este) {
		var ratonSueltoFn = function(evento){
			//console.log([evento]);
			//console.log([este]);
			if(evento.which == 1)
				este.herramientaActiva.arriba(este,evento);
			este.barraEstado.innerHTML = este.herramientaActiva.nombre+' en uso.';
		};
		return ratonSueltoFn;
	}
	hacer() {
		this.lienzo.innerHTML = '';
		if(this.trazoCurvo) {
			this.trazoCurvo.dibujar();
			this.barraEstado.innerHTML = '';
			this.barraEstado.innerHTML = this.trazoCurvo.convertirATextoJS();
		}
	}
}
class Punto {
	constructor(serviciosLienzo,nuevoX,nuevoY) {
		this.serviciosLienzo = serviciosLienzo;
		this.x = nuevoX;
		this.y = nuevoY;
		this.radio = 3;
		this.radioActivo = this.radio + 2;
	}
	asignar(x,y) {
		this.x = x;
		this.y = y;
	}
	dibujarCuadrado(color) {
		var cuadrado = document.createElementNS('http://www.w3.org/2000/svg','rect');
		cuadrado.setAttributeNS(null,'x',this.x-this.radio);
		cuadrado.setAttributeNS(null,'y',this.y-this.radio);
		cuadrado.setAttributeNS(null,'width',this.radio*2);
		cuadrado.setAttributeNS(null,'height',this.radio*2);
		cuadrado.setAttributeNS(null,'fill',color);
		this.serviciosLienzo.lienzo.appendChild(cuadrado);
	}
	dibujarCirculo(color) {
		var circulo = document.createElementNS('http://www.w3.org/2000/svg','circle');
		circulo.setAttributeNS(null,'cx',this.x);
		circulo.setAttributeNS(null,'cy',this.y);
		circulo.setAttributeNS(null,'r',this.radio);
		circulo.setAttributeNS(null,'fill',color);
		this.serviciosLienzo.lienzo.appendChild(circulo);
	}
	calcularInclinacion(punto) {
		return (punto.y-this.y) / (punto.x-this.x);
	}
	contiene(punto) {
		var xEnRango = punto.x >= this.x-this.radioActivo && punto.x <= this.x+this.radioActivo;
		var yEnRango = punto.y >= this.y-this.radioActivo && punto.y <= this.y+this.radioActivo;
		return xEnRango && yEnRango;
	}
	compensar(punto) {
		return {
			xDelta : punto.x - this.x,
			yDelta : punto.y - this.y,
		};
	}
	trasladar(xDelta,yDelta) {
		this.x += xDelta;
		this.y += yDelta;
	}
}
class PuntoControl {
	constructor(serviciosLienzo,angulo,magnitud,padre,esPrimero) {
		this.serviciosLienzo = serviciosLienzo;
		this.angulo = angulo;
		this.magnitud = magnitud;
		this.padre = padre;
		this.esPrimero = esPrimero;
		if(this.__proto__.sincVecino)
			this.actualizarVecino()
	}
	asignarAngulo(grados) {
		if(this.angulo != grados)
			this.angulo = grados;
	}
	origen() {
		var linea = null;
		if(this.esPrimero)
			linea = this.padre.anterior;
		else
			linea = this.padre;
		if(linea)
			return new Punto(this.serviciosLienzo,linea.punto.x,linea.punto.y);
		return null;
	}
	nuevoPunto() {
		return new Punto(this.serviciosLienzo,this.x(),this.y());
	}
	x() {
		return this.origen().x + this.xDelta();
	}
	y() {
		return this.origen().y + this.yDelta();
	}
	xDelta() {
		return this.magnitud * Math.cos(this.angulo);
	}
	yDelta() {
		return this.magnitud * Math.sin(this.angulo);
	}
	calcularAnguloMagnitudDeCompensacion(xDelta,yDelta) {
		this.magnitud = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
		var intentaAngulo = Math.atan(yDelta/xDelta);
		if(!isNaN(intentaAngulo)) {
			this.angulo = intentaAngulo;
			if(xDelta < 0)
				this.angulo += Math.PI;
		}
	}
	trasladar(xDelta,yDelta) {
		var nuevaUbicacion = this.nuevoPunto();
		nuevaUbicacion.trasladar(xDelta,yDelta);
		var distancia = this.origen().compensar(nuevaUbicacion);
		this.calcularAnguloMagnitudDeCompensacion(distancia.xDelta, distancia.yDelta);
		if(this.__proto__.sincVecino)
			this.actualizarVecino();
	}
	actualizarVecino() {
		var vecino = null;
		if(this.esPrimero && this.padre.anterior)
			vecino = this.padre.anterior.puntoCtrl2;
		else if(!this.esPrimero && this.padre.siguiente)
			vecino = this.padre.siguiente.puntoCtrl1;
		if(vecino)
			vecino.asignarAngulo(this.angulo + Math.PI);
	}
	contiene(punto) {
		return this.nuevoPunto().contiene(punto);
	}
	compensar(punto) {
		return this.nuevoPunto().compensar(punto);
	}
	dibujar() {
		var puntoInicio = this.origen();
		var puntoFinal = this.nuevoPunto();
		var linea = document.createElementNS('http://www.w3.org/2000/svg','line');
		linea.setAttributeNS(null,'x1',puntoInicio.x);
		linea.setAttributeNS(null,'y1',puntoInicio.y);
		linea.setAttributeNS(null,'x2',puntoFinal.x);
		linea.setAttributeNS(null,'y2',puntoFinal.y);
		linea.setAttributeNS(null,'fill','none');
		linea.setAttributeNS(null,'style','stroke:gray;stroke-width:1;fill:none;');
		this.serviciosLienzo.lienzo.appendChild(linea);
		puntoFinal.dibujarCirculo('gray');
	}
}
// Variable estatica que dicta si los vecinos deben mantenerse sincronizados.
PuntoControl.prototype.sincVecino = false;
class SegmentoLinea {
	constructor(serviciosLienzo,punto,anterior) {
		this.serviciosLienzo = serviciosLienzo;
		this.puntoCtrl1;
		this.puntoCtrl2;
		this.siguiente;
		this.puntoActivo;
		this.inicializar(punto,anterior);
	}
	dibujar() {
		this.punto.dibujarCuadrado('black');
		if(this.puntoCtrl1)
			this.puntoCtrl1.dibujar('black');
		if(this.puntoCtrl2)
			this.puntoCtrl2.dibujar('black');
		if(this.anterior)
			this.dibujarCurva('black');
	}
	convertirATextoJS() {
		if(!this.anterior)
			return 'M'+Math.round(this.punto.x)+','+Math.round(this.punto.y)+' ';
		else {
			var puntoCtrl1x = 0;
			var puntoCtrl1y = 0;
			var puntoCtrl2x = 0;
			var puntoCtrl2y = 0;
			var x = 0;
			var y = 0;
			
			if(this.puntoCtrl1) {
				puntoCtrl1x = Math.round(this.puntoCtrl1.x());
				puntoCtrl1y = Math.round(this.puntoCtrl1.y());
			}
			
			if(this.puntoCtrl2) {
				puntoCtrl2x = Math.round(this.puntoCtrl2.x());
				puntoCtrl2y = Math.round(this.puntoCtrl2.y());
			}

			if(this.punto) {
				x = Math.round(this.punto.x);
				y = Math.round(this.punto.y);
			}

			return 'C'+puntoCtrl1x+','+puntoCtrl1y+' '+puntoCtrl2x+','+puntoCtrl2y+' '+x+','+y+' ';
		}
	}
	seEncuentraEnSegmentoLinea(pos) {
		if(this.intersectaPuntoEnTrazo(pos)) {
			this.puntoActivo = this.punto;
			return true;
		} else if(this.puntoCtrl1 && this.puntoCtrl1.contiene(pos)) {
			this.puntoActivo = this.puntoCtrl1;
			return true;
		} else if(this.puntoCtrl2 && this.puntoCtrl2.contiene(pos)) {
			this.puntoActivo = this.puntoCtrl2;
			return true;
		}
		return false;
	}
	intersectaPuntoEnTrazo(pos) {
		return this.punto && this.punto.contiene(pos);
	}
	mover(pos) {
		var distancia = this.puntoActivo.compensar(pos);
		this.puntoActivo.trasladar(distancia.xDelta, distancia.yDelta);
	}
	dibujarCurva() {
		var cadenaD = 'M'+this.anterior.punto.x+','+this.anterior.punto.y+
			' C'+this.puntoCtrl1.x()+','+this.puntoCtrl1.y()+
			' '+this.puntoCtrl2.x()+','+this.puntoCtrl2.y()+
			' '+this.punto.x+','+this.punto.y;
		var trazo = document.createElementNS('http://www.w3.org/2000/svg','path');
		trazo.setAttributeNS(null,'d',cadenaD);
		trazo.setAttributeNS(null,'stroke','black');
		trazo.setAttributeNS(null,'stroke-width',2);
		trazo.setAttributeNS(null,'fill','none');
		this.serviciosLienzo.lienzo.appendChild(trazo);
	}
	inicializar(punto,anterior) {	
		this.punto = punto;
		this.anterior = anterior;
		if(this.anterior) {
			var inclinacion = this.punto.calcularInclinacion(this.anterior.punto);
			var angulo = Math.atan(inclinacion);
			if(this.anterior.punto.x > this.punto.x)
				angulo *= -1;
			this.puntoCtrl1 = new PuntoControl(this.serviciosLienzo,angulo+Math.PI,15,this,true);
			this.puntoCtrl2 = new PuntoControl(this.serviciosLienzo,angulo,15,this,false);
		}
	}
}
class TrazoCurvo {
	constructor(serviciosLienzo,puntoInicio) {
		this.serviciosLienzo = serviciosLienzo;
		this.cabeza = null;
		this.pie = null;
		this.segmentoActivo;
		this.inicializar(puntoInicio);
	}
	agregarPunto(punto) {
		var nuevoPunto = new SegmentoLinea(this.serviciosLienzo,punto,this.pie);
		if(this.pie	== null) {
			this.pie = nuevoPunto;
			this.cabeza = nuevoPunto;
		} else {
			this.pie.siguiente = nuevoPunto;
			this.pie = this.pie.siguiente;
		}
		return nuevoPunto;
	}
	dibujar() {
		if(this.cabeza == null)
			return;
		var activo = this.cabeza;
		while(activo != null) {
			activo.dibujar();
			activo = activo.siguiente;
		}
	}
	seleccionarPunto(pos) {
		var activo = this.cabeza;
		while(activo != null) {
			if(activo.seEncuentraEnSegmentoLinea(pos)) {
				this.segmentoActivo = activo;
				return true;
			}
			activo = activo.siguiente;
		}
		return false;
	}
	eliminarPunto(pos) {
		var activo = this.cabeza;
		while(activo != null) {
			if(activo.intersectaPuntoEnTrazo(pos)) {
				var porEliminar = activo;
				var vecinoIzq = activo.anterior;
				var vecinoDer = activo.siguiente;
				// Caso medio
				if(vecinoIzq && vecinoDer) {
					vecinoIzq.siguiente = vecinoDer;
					vecinoDer.anterior = vecinoIzq;
				} else if(!vecinoIzq) { // Caso Cabeza
					this.cabeza = vecinoDer;
					if(this.cabeza) {
						vecinoDer.puntoCtrl1 = null;
						vecinoDer.puntoCtrl2 = null;
						this.cabeza.anterior = null;
					} else
						this.pie = null;
				} else if(!vecinoDer) { // Caso Pie
					this.pie = vecinoIzq;
					if(this.pie)
						this.pie.siguiente = null;
					else
						this.cabeza = null
				}
				return true;
			}
			activo = activo.siguiente;
		}
		return false;
	}
	limpiarSeleccion() {
		this.segmentoActivo = null;
	}
	actualizarSeleccion(pos) {
		if(this.segmentoActivo) {
			this.segmentoActivo.mover(pos);
		}
	}
	convertirATextoJS() {
		var cadena = [
			'<path d="'
		];
		var activo = this.cabeza;
		while(activo != null) {
			cadena.push(activo.convertirATextoJS());
			activo = activo.siguiente;
		}
		cadena.push('" />');
		return cadena.join('\n');
	}
	inicializar(puntoInicio) {
		this.agregarPunto(puntoInicio);
	}
}