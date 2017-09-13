var Trazo = function(id,pos,servicios) {
	var t = {
		inicializar: function(id,pos,servicios) {
			this.validarParametros(id,pos,servicios);
			this.id = 'trazo'+id;
			this.puntos = {};
			this.count = 0;
			this.puntoActivo;
			this.servicios = servicios;
			this.esNuevo = true;
			this.completado = false;
			this.agregarPunto(pos);
		},
		validarParametros: function(id,pos,servicios) {
			if(id == null || id === undefined)
				throw new Error('Un nuevo trazo require de un id.');
			if(pos == null || pos === undefined)
				throw new Error('Un nuevo trazo require de unas coordenadas.');
			if(servicios == null || servicios === undefined)
				throw new Error('Un nuevo trazo require de un servicio.');
		},
		inactivarPuntos: function() {
			for(var p in this.puntos) {
				this.puntos[p].punto.setAttributeNS(null,'fill','rgb(30,90,10)');
			}
		},
		seleccionaPuntos: function(x,y) {
			var hayPuntos = false;
			var puntos = [];
			for(var p in this.puntos) {
				var punto = this.puntos[p];
				var resultado = punto.enAreaActiva(x,y);
				if(resultado.enAreaActiva) {
					punto.punto.setAttributeNS(null,'fill','rgb(250,120,10)');
					hayPuntos = true;
					puntos.push(punto);
				}
			}
			return {'hayPuntos':hayPuntos,'puntos':puntos};
		},
		agregarPunto: function(pos,esInicial) {
			if(this.esNuevo) {
				this.empezarTrazo();
			}
			this.puntos[this.count] = Punto(this.count, pos.x, pos.y, this.esNuevo, this, this.puntoActivo);
			this.puntoActivo = this.puntos[this.count];
			this.count++;
			if(this.trazo)
				this.retrazar();
			else
				this.trazar();
			this.esNuevo = false;
			if(esInicial)
				this.completado = true;
		},
		empezarTrazo: function() {
			var grupoTrazo = document.createElementNS('http://www.w3.org/2000/svg','g');
			grupoTrazo.setAttributeNS(null,'id','g'+this.id);
			this.servicios.lienzo.appendChild(grupoTrazo);
			this.grupoTrazo = grupoTrazo;
		},
		trazar: function() {
			var color = 'rgb(200,200,200)';
			var trazo = document.createElementNS('http://www.w3.org/2000/svg','path');
			var cadenaD = this.obtenerD();
			trazo.setAttributeNS(null,'d',cadenaD);
			trazo.setAttributeNS(null,'id',this.id);
			trazo.setAttributeNS(null,'style','fill:'+color+';');
			trazo.addEventListener('click',this.agregarFuncion(this.servicios,this,'click'));
			this.grupoTrazo.appendChild(trazo);
			this.trazo = trazo;
		},
		agregarFuncion: function(servicios,trazo,accion) {
			var Fn;
			switch(accion) {
				case 'click':
					Fn = function(evento) {
						if(servicios.herramientaActiva.valor == 0) {
							servicios.trazoActivo = trazo;
						}
					};
			}
			return Fn;
		},
		retrazar: function() {
			var cadenaD = this.obtenerD();
			this.trazo.setAttributeNS(null,'d',cadenaD);
		},
		obtenerD: function() {
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
	};
	t.inicializar(id,pos,servicios);
	return t;
}