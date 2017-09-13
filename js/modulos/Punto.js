var Punto = function(id,x,y,inicial,trazo,anterior){
	var p = {
		inicializar: function(id,x,y,inicial,trazo,anterior) {
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
		},
		validarParametros: function(id,x,y,inicial,trazo,anterior) {
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
		},
		dibujarPunto: function() {
			var color = 'rgb(30,90,10)';
			var cuadrado = document.createElementNS('http://www.w3.org/2000/svg','rect');
			cuadrado.setAttributeNS(null,'x',this.x-this.radio);
			cuadrado.setAttributeNS(null,'y',this.y-this.radio);
			cuadrado.setAttributeNS(null,'width',this.radio*2);
			cuadrado.setAttributeNS(null,'height',this.radio*2);
			cuadrado.setAttributeNS(null,'fill',color);
			this.trazo.grupoTrazo.appendChild(cuadrado);
			this.punto = cuadrado;
		},
		dibujarLinea: function() {
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
		},
		reubicarPunto: function() {
			this.punto.setAttributeNS(null,'x',this.x-this.radio);
			this.punto.setAttributeNS(null,'y',this.y-this.radio);
		},
		reubicarLinea: function() {
			var atributoD = 'M'+this.anterior.x+','+this.anterior.y+
				(this.anterior.bezierSig ? (
					' C'+this.anterior.bezierSig.cx+','+this.anterior.bezierSig.cy) : (
					' C'+this.anterior.x+','+this.anterior.y))+
				(this.bezierAnt ? (
					' '+this.bezierAnt.cx+','+this.bezierAnt.cy) : (
					' '+this.x+','+this.y))+
				' '+this.x+','+this.y;
			this.linea.setAttributeNS(null,'d',atributoD);
		},
		enAreaActiva: function(x,y) {
			return x < (this.x + this.radioActivo) &&
			x > (this.x - this.radioActivo) &&
			y < (this.y + this.radioActivo) &&
			y > (this.y - this.radioActivo) ? {'enAreaActiva':true,'esInicial':this.inicial,'punto':this} : {'enAreaActiva':false};
		},
		agregarBezier: function(tipoBezier,punto) {
			if(tipoBezier == 'anterior')
				this.bezierAnt = Bezier(this.x+5,this.y+5,this);
			else
				this.bezierSig = Bezier(this.x+5,this.y+5,this);
		},
		mover: function(x,y) {
			this.compensar('x',x);
			this.compensar('y',y);
			this.reubicarPunto();
			if(this.linea)
				this.reubicarLinea();
			if(this.siguiente)
				this.siguiente.reubicarLinea();
			this.trazo.retrazar();
		},
		compensar: function(coordenada,valor) {
			var diferencia = (this[coordenada] - valor)*-1;
			this[coordenada] = this[coordenada] + diferencia;
			if(this.bezierAnt)
				this.bezierAnt['c'+coordenada] = this.bezierAnt['c'+coordenada] + diferencia;
			if(this.bezierSig)
				this.bezierSig['c'+coordenada] = this.bezierSig['c'+coordenada] + diferencia;
		},
		eliminar: function() {
			var padreLinea = this.linea ? this.linea.parentElement : undefined;
			var padrePunto = this.punto.parentElement;
			padrePunto.removeChild(this.punto);
			if(padreLinea)
				padreLinea.removeChild(this.linea);
			if(this.inicial) {
				this.siguiente.anterior = undefined;
				this.siguiente.inicial = true;
				this.siguiente.linea.parentElement.removeChild(this.siguiente.linea);
				this.eliminado = true;
				this.trazo.retrazar();
			}
			if(this.siguiente && this.anterior) {
				this.siguiente.anterior = this.anterior;
				this.anterior.siguiente = this.siguiente;
				this.siguiente.reubicarLinea();
				this.eliminado = true;
				this.trazo.retrazar();
			}
		}
	}
	p.inicializar(id,x,y,inicial,trazo,anterior);
	return p;
}