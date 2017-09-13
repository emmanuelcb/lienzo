var Bezier = function() {
	var b = {
		inicializar: function(cx,cy,punto) {
			this.cx = cx;
			this.cy = cy;
			this.punto = punto;
			this.dibujarBezier();
		},
		dibujarBezier: function() {
			var circulo = document.createElementNS('http://www.w3.org/2000/svg','circle');
			circulo.setAttributeNS(null,'cx',this.x);
			circulo.setAttributeNS(null,'cy',this.y);
			circulo.setAttributeNS(null,'r',this.radio);
			circulo.setAttributeNS(null,'fill',color);
			this.punto.trazo.servicios.lienzo.appendChild(circulo);
		}
	};
	b.inicializar(cx,cy,punto);
	return b;
}