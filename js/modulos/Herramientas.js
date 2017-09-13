var Herramientas = function(servicios,herramientas) {
	var h = {
		inicializar: function(servicios,herramientas) {
			this.servicios = servicios;
			this.permitidas = ['seleccion','selecciondirecta','pluma','plumaeliminar'];
			this.atajos = {
				V : 'seleccion',
				A : 'selecciondirecta',
				P : 'pluma',
				AltP : 'plumaeliminar'
			};
			this.seleccion = {
				valor: 0,
				nombre: 'Seleccion',
				abajo: function(servicios,evento) {},
				arriba: function(servicios,evento) {}
			};
			this.selecciondirecta = {
				valor: 1,
				nombre: 'Seleccion directa',
				abajo: function(servicios,evento) {
					var pos = servicios.obtenerPosicion(evento);
					if(servicios.trazoActivo) {
						servicios.trazoActivo.inactivarPuntos();
						var resultado = servicios.trazoActivo.seleccionaPuntos(pos.x,pos.y);
						if(resultado.hayPuntos) {
							servicios.hayPuntosActivos = resultado.puntos;
						}
					} else {
						for(var t in servicios.trazos) {
							var trazo = servicios.trazos[t];
							var resultado = trazo.seleccionaPuntos(pos.x,pos.y);
							if(resultado.hayPuntos){
								servicios.hayPuntosActivos = resultado.puntos;
								break;
							}
						}
					}
				},
				arriba: function(servicios,evento) {
					if(servicios.hayPuntosActivos)
						servicios.hayPuntosActivos = undefined;
				}
			};
			this.pluma = {
				valor: 2,
				nombre: 'Pluma',
				abajo: function(servicios,evento) {
					var pos = servicios.obtenerPosicion(evento);
					if(servicios.trazoActivo !== undefined) {
						if(!servicios.trazoActivo.completado) {
							var resultado;
							for(var p in servicios.trazoActivo.puntos) {
								var punto = servicios.trazoActivo.puntos[p];
								resultado = punto.enAreaActiva(pos.x,pos.y);
								if(resultado.enAreaActiva)
									break;
							}
							if(!resultado.enAreaActiva)
								servicios.trazoActivo.agregarPunto(pos,false);
							else if(resultado.enAreaActiva && resultado.esInicial){
								servicios.trazoActivo.agregarPunto({x:resultado.punto.x,y:resultado.punto.y},true);
							}
						}
					}
					else {
						servicios.agregarTrazo(pos);
					}
				},
				arriba: function(servicios,evento) {}
			};
			this.plumaeliminar = {
				valor: 3,
				nombre: 'Pluma eliminar puntos',
				abajo: function(servicios,evento) {
					var pos = servicios.obtenerPosicion(evento);
					if(servicios.trazoActivo) {
						var hayPunto = servicios.trazoActivo.seleccionaPuntos(pos.x,pos.y);
						if(hayPunto)
							servicios.trazoActivo.puntoActivo.eliminar();

					}
				},
				arriba: function(servicios,evento) {}
			};
			this.agregarEventos(this.servicios,herramientas);
		},
		agregarEventos: function(servicios,herramientas) {
			// Atajos
			document.addEventListener('keydown',function(evento) {
				var tecla = evento.key;
				var atajo = evento.altKey ? 'Alt'+tecla.toUpperCase() : tecla.toUpperCase();
				if(servicios.herramientas.atajos[atajo]) {
					var herramienta = servicios.herramientas.atajos[atajo];
					servicios.herramientaActiva = servicios.herramientas[herramienta];
				}
			},false);
			// Herramientas
			for(var herramienta in herramientas) {
				if(this.permitidas.indexOf(herramienta) !== -1) {
					herramientas[herramienta].addEventListener('click',this.agregaFuncion(servicios,herramienta),false);
				}
			}
		},
		agregaFuncion: function(servicios,herramienta) {
			var fn = function(evento){
				servicios.herramientaActiva = servicios.herramientas[herramienta];
			}
			return fn;
		}
	};
	h.inicializar(servicios,herramientas);
	return h;
}