class lienzo {
	constructor(canvas,tools) {
		this.validateValues(canvas,tools);
		this.initialize();
		this.canvas = canvas;
		this.cContext = this.canvas.getContext('2d');
		this.cActiveTool = this.tools.selectiontool;
		this.addEventListeners(tools);
	}
	validateValues(canvas,tools) {
		if(Object.prototype.toString.call(canvas) !== '[object HTMLCanvasElement]')
			throw new Error('Whoops!, seems like your developer mess it up, this is not a Canvas.');
		if(Object.prototype.toString.call(tools) !== '[object Object]')
			throw new Error('Whoops!, seems like your developer mess it up, this is not an Object.');
	}
	initialize() {
		this.allowedTools = ['selectiontool','directselection','pentool'];
		this.tools = {
			selectiontool : {
				value: 0, 
				name: 'Selection Tool',
				down: function(pos) {

				},
				up: function() {}
			},
			directselection : {
				value: 0, 
				name: 'Direct Selection',
				down: function(pos) {},
				up: function() {}
			},
			pentool : {
				value: 0,
				name: 'Pen Tool',
				keywordShortcut: 'P',
				down: function(pos) {},
				up: function() {}
			}
		}
	}
	addEventListeners(tools) {
		// General
		this.canvas.addEventListener('mousedown',this.mousedownHandler(this),false);
		this.canvas.addEventListener('mouseup',this.mouseupHandler(this),false);
		// Shortcuts
		document.addEventListener('keydown',function(e) {
			//console.log([e]);
		}, false);
		// Tools
		for(var [tool,element] in tools) {
			if(this.allowedTools.indexOf(tool) !== -1) {
				element.addEventListener('click',function() {
					this.cActiveTool = this.tools[tool];
				},false);
			}
		}
	}
	mousePosition(e) {
		/*var x;
		var y;
		if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
		y = e.pageY;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= gCanvas.offsetLeft;
		y -= gCanvas.offsetTop;
		
		return new Point(x, y);*/
	};
	mousedownHandler(_this) {
		var mousedownFn = function(e){
			console.log([_this]);
			var pos = _this.mousePosition(e);
			_this.cActiveTool.down(pos);
		}
		return mousedownFn;
	};
	mouseupHandler(_this) {
		var mouseupFn = function(e){
			console.log([_this]);
			var pos = _this.mousePosition(e);
			_this.cActiveTool.up();
		}
		return mouseupFn;
	}
}