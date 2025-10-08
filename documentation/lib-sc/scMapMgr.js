


window.scMapMgr = {
	fEltBuild : document.createElement("div"),
	addElt : function (pStr) {
		this.fEltBuild.innerHTML = pStr;
		const vElt = this.fEltBuild.firstChild.cloneNode(true);
		this.fEltBuild.innerHTML = "";
		return vElt;
	},
	append: function(parent, elem) {
		parent.appendChild( elem );
	},
	before: function(elem, pre) {
		pre.parentNode.insertBefore( elem, pre );
	},
	remove: function(elem) {
		return elem.parentNode.removeChild( elem )
	},
	each: function( obj, callback ) {
		let name,
			i = 0,
			length = obj.length,
			isObj = length === undefined;
		if ( isObj ) {
			for ( name in obj ) {
				if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
					break;
				}
			}
		} else {
			for ( ; i < length; ) {
				if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
					break;
				}
			}
		}
		return obj;
	},
	data : function(elt, key) {
		return this.deserialiseObjJs(elt.getAttribute("data-"+key));
	},
	deserialiseObjJs : function(pStr){
		if(!pStr) return {};
		try{
			return JSON.parse(pStr);
		} catch(e){ // TODO: purge when there is little chance of non JSON content.
			console.warn("WARNING depreciated non-JSON content :", pStr);
			let vVal;
			eval("vVal="+pStr);
			return vVal;
		}
	},
	css : function(elt, rules) {
		for (const name in rules ) {
			elt.style[name] = rules[name];
		}
		return this;
	},
	addClass: function(elem,  value ) {
		let classNames, setClass, c, cl;

		if ( value && typeof value === "string" ) {
			classNames = value.split( " " );

			if ( elem.nodeType === 1 ) {
				if ( !elem.className && classNames.length === 1 ) {
					elem.className = value;

				} else {
					setClass = " " + elem.className + " ";

					for ( c = 0, cl = classNames.length; c < cl; c++ ) {
						if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
							setClass += classNames[ c ] + " ";
						}
					}
					elem.className = setClass;
				}
			}
		}
	},

	extend : function() {
		let options, name, src, copy,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		for ( ; i < length; i++ ) {

			if ( (options = arguments[ i ]) != null ) {

				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];


					if ( target === copy ) {
						continue;
					}

					if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}


		return target;
	},

	register : function(element, type, func) {
		element.addEventListener(type, func, false);
	},

	unregister : function(element, type, func) {
		if (element.removeEventListener) {
			element.removeEventListener(type, func, false);
		} else if (element.detachEvent) {
			if (element._listeners && element._listeners[type] && element._listeners[type][func]) {
				element.detachEvent('on' + type, element._listeners[type][func]);
			}
		}
	}

};

(function($) {
	let has_VML, has_canvas, create_canvas_for, add_shape_to, clear_canvas, shape_from_area,
		canvas_style, hex_to_decimal, css3color, is_image_loaded, options_from_area;


	has_VML = document.namespaces;
	has_canvas = !!document.createElement('canvas').getContext;

	if(!(has_canvas || has_VML)) {
		$.maphighlight = function() {};
		return;
	}

	if(has_canvas) {
		hex_to_decimal = function(hex) {
			return Math.max(0, Math.min(parseInt(hex, 16), 255));
		};
		css3color = function(color, opacity) {
			return 'rgba('+hex_to_decimal(color.substr(0,2))+','+hex_to_decimal(color.substr(2,2))+','+hex_to_decimal(color.substr(4,2))+','+opacity+')';
		};
		create_canvas_for = function(img) {
			const c = $.addElt('<canvas style="width:' + img.width + 'px;height:' + img.height + 'px;"></canvas>');
			c.getContext("2d").clearRect(0, 0, c.width, c.height);
			return c;
		};
		const draw_shape = function (context, shape, coords, x_shift, y_shift) {
			x_shift = x_shift || 0;
			y_shift = y_shift || 0;

			context.beginPath();
			if (shape === 'rect') {

				context.rect(coords[0] + x_shift, coords[1] + y_shift, coords[2] - coords[0], coords[3] - coords[1]);
			} else if (shape === 'poly') {
				context.moveTo(coords[0] + x_shift, coords[1] + y_shift);
				for (let i = 2; i < coords.length; i += 2) {
					context.lineTo(coords[i] + x_shift, coords[i + 1] + y_shift);
				}
			} else if (shape === 'circ') {

				context.arc(coords[0] + x_shift, coords[1] + y_shift, coords[2], 0, Math.PI * 2, false);
			}
			context.closePath();
		};
		add_shape_to = function(canvas, shape, coords, options, name) {
			let context = canvas.getContext('2d');





			if(options.shadow) {
				context.save();
				if(options.shadowPosition === "inside") {

					draw_shape(context, shape, coords);
					context.clip();
				}




				const x_shift = canvas.width * 100;
				const y_shift = canvas.height * 100;
				draw_shape(context, shape, coords, x_shift, y_shift);

				context.shadowOffsetX = options.shadowX - x_shift;
				context.shadowOffsetY = options.shadowY - y_shift;
				context.shadowBlur = options.shadowRadius;
				context.shadowColor = css3color(options.shadowColor, options.shadowOpacity);




				let shadowFrom = options.shadowFrom;
				if (!shadowFrom) {
					if (options.shadowPosition === 'outside') {
						shadowFrom = 'fill';
					} else {
						shadowFrom = 'stroke';
					}
				}
				if (shadowFrom === 'stroke') {
					context.strokeStyle = "rgba(0,0,0,1)";
					context.stroke();
				} else if (shadowFrom === 'fill') {
					context.fillStyle = "rgba(0,0,0,1)";
					context.fill();
				}
				context.restore();


				if(options.shadowPosition === "outside") {
					context.save();

					draw_shape(context, shape, coords);
					context.globalCompositeOperation = "destination-out";
					context.fillStyle = "rgba(0,0,0,1);";
					context.fill();
					context.restore();
				}
			}

			context.save();

			draw_shape(context, shape, coords);



			if(options.fill) {
				context.fillStyle = css3color(options.fillColor, options.fillOpacity);
				context.fill();
			}


			if(options.stroke) {
				context.strokeStyle = css3color(options.strokeColor, options.strokeOpacity);
				context.lineWidth = options.strokeWidth;
				context.stroke();
			}

			context.restore();

		};
		clear_canvas = function(canvas) {
			canvas.getContext('2d').clearRect(0, 0, canvas.width,canvas.height);
		};
	} else {   // ie executes this code
		create_canvas_for = function(img) {
			return $.addElt('<var style="zoom:1;overflow:hidden;display:block;width:'+img.width+'px;height:'+img.height+'px;"></var>');
		};
		add_shape_to = function(canvas, shape, coords, options, name) {
			let fill, stroke, opacity, e;
			fill = '<v:fill color="#'+options.fillColor+'" opacity="'+(options.fill ? options.fillOpacity : 0)+'" />';
			stroke = (options.stroke ? 'strokeweight="'+options.strokeWidth+'" stroked="t" strokecolor="#'+options.strokeColor+'"' : 'stroked="f"');
			opacity = '<v:stroke opacity="'+options.strokeOpacity+'"/>';
			if(shape === 'rect') {
				e = $.addElt('<v:rect name="'+name+'" filled="t" '+stroke+' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+coords[0]+'px;top:'+coords[1]+'px;width:'+(coords[2] - coords[0])+'px;height:'+(coords[3] - coords[1])+'px;"></v:rect>');
			} else if(shape === 'poly') {
				e = $.addElt('<v:shape name="'+name+'" filled="t" '+stroke+' coordorigin="0,0" coordsize="'+canvas.width+','+canvas.height+'" path="m '+coords[0]+','+coords[1]+' l '+coords.join(',')+' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:'+canvas.width+'px;height:'+canvas.height+'px;"></v:shape>');
			} else if(shape === 'circ') {
				e = $.addElt('<v:oval name="'+name+'" filled="t" '+stroke+' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+(coords[0] - coords[2])+'px;top:'+(coords[1] - coords[2])+'px;width:'+(coords[2]*2)+'px;height:'+(coords[2]*2)+'px;"></v:oval>');
			}
			e.innerHTML = fill+opacity;
			$.append(canvas, e);
		};
		clear_canvas = function(canvas) {
			$.each(scPaLib.findNodes("des:", canvas), function() {
				if (this.getAttribute('name')==='highlighted') $.remove(this);
			});
		};
	}

	shape_from_area = function(area) {
		let i, coords = area.getAttribute('coords').split(',');
		for (i=0; i < coords.length; i++) { coords[i] = parseFloat(coords[i]); }
		return [area.getAttribute('shape').toLowerCase().substr(0,4), coords];
	};

	options_from_area = function(area, options) {
		return $.extend({}, options, $.data(area, 'maphighlight'), (area.maphighlight ? area.maphighlight : false));
	};

	is_image_loaded = function(img) {
		if(!img.complete) { return false; } // IE
		if(typeof img.naturalWidth != "undefined" && img.naturalWidth === 0) { return false; } // Others
		return true;
	};

	canvas_style = {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: 0,
		border: 0
	};

	let ie_hax_done = false;
	$.maphighlight = function(img, opts) {
		opts = $.extend({}, $.defaults, opts);

		if(!has_canvas && scCoLib.isIE && !ie_hax_done) {
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			const style = document.createStyleSheet();
			const shapes = ['shape', 'rect', 'oval', 'circ', 'fill', 'stroke', 'imagedata', 'group', 'textbox'];
			$.each(shapes,
				function() {
					style.addRule('v\\:' + this, "behavior: url(#default#VML); antialias:true");
				}
			);
			ie_hax_done = true;
		}

		let wrap, options, maps, map, canvas, canvas_always, addAlwaysOn, mouseover, mouseout, usemap;

		if(!is_image_loaded(img)) {

			return window.setTimeout(function() {
				$.maphighlight(img, opts);
			}, 200);
		}

		options = $.extend({}, opts, $.data(img, 'maphighlight'));



		usemap = img.getAttribute('usemap');
		maps = scDynUiMgr.getDocument(img).getElementsByTagName("map");
		for (let i=0; i<maps.length; i++){
			if (maps[i].getAttribute('name') === usemap.substr(1)) map = maps[i];
		}

		if(!(usemap && map.childNodes.length > 0)) {
			return;
		}

		if(img.className.indexOf('maphighlighted')>=0) {



			const wrapper = img.parentNode;
			const imgWidth = img.width, imgHeight = img.height;
			$.before(img, wrapper);
			img.width = Math.max(imgWidth, img.width);
			img.height = Math.max(imgHeight, img.height);
			$.remove(wrapper);
			$.each(scPaLib.findNodes("chi:area", map), function() {
				$.unregister(this, 'mouseover', mouseover);
				$.unregister(this, 'mouseout', mouseout);
			});
		}

		wrap = $.addElt('<div></div>')
		if (scDynUiMgr.readStyle(img,"position") === "absolute"){
			$.css(wrap, {
				display:'block',
				background:'url("'+img.src+'")',
				position:'absolute',
				padding:0,
				width:img.width+"px",
				height:img.height+"px",
				top:scDynUiMgr.readStyle(img,"top"),
				left:scDynUiMgr.readStyle(img,"left")
			});
		} else {
			$.css(wrap, {
				display:'block',
				background:'url("'+img.src+'")',
				position:'relative',
				padding:0,
				width:img.width+"px",
				height:img.height+"px"
			});
		}
		if(options.wrapClass) {
			if(options.wrapClass === true) {
				$.addClass(wrap, img.className);
			} else {
				$.addClass(wrap, options.wrapClass);
			}
		}
		$.before(wrap, img);
		$.css(img, {opacity: 0}).css(img, canvas_style);
		if(scCoLib.isIE) { $.css(img, 'filter', 'Alpha(opacity=0)'); }
		$.remove(img);
		$.append(wrap, img);

		canvas = create_canvas_for(img);
		$.css(canvas, canvas_style);
		canvas.height = img.height;
		canvas.width = img.width;

		mouseover = function(e) {
			let shape, area_options;
			area_options = options_from_area(this, options);
			if( !area_options.neverOn && !area_options.alwaysOn ) {
				shape = shape_from_area(this);
				add_shape_to(canvas, shape[0], shape[1], area_options, "highlighted");
				if(area_options.groupBy) {
					let areas;

					if(/^[a-zA-Z][-a-zA-Z]+$/.test(area_options.groupBy)) {
						areas = map.find('area['+area_options.groupBy+'="'+$(this).attr(area_options.groupBy)+'"]')
					} else {
						areas = map.find(area_options.groupBy);
					}
					const first = this;
					$.each(areas, function() {
						if(this !== first) {
							const subarea_options = options_from_area(this, options);
							if(!subarea_options.neverOn && !subarea_options.alwaysOn) {
								const shape = shape_from_area(this);
								add_shape_to(canvas, shape[0], shape[1], subarea_options, "highlighted");
							}
						}
					});
				}
			}
		}
		mouseout = function(e) {
			clear_canvas(canvas);
		}

		addAlwaysOn = function() {


			if(canvas_always) {
				clear_canvas(canvas_always)
			}
			if(!has_canvas) {
				canvas.innerHTML = "";
			}
			$.each(scPaLib.findNodes("chi:area", map), function() {
				let shape, area_options;
				area_options = options_from_area(this, options);
				if(area_options.alwaysOn) {
					if(!canvas_always && has_canvas) {
						canvas_always = create_canvas_for(img);
						$.css(canvas_always, canvas_style);
						canvas_always.width = img.width;
						canvas_always.height = img.height;
						$.before(canvas_always, img);
					}
					shape = shape_from_area(this);
					if (has_canvas) {
						add_shape_to(canvas_always, shape[0], shape[1], area_options, "");
					} else {
						add_shape_to(canvas, shape[0], shape[1], area_options, "");
					}
				}
			});
		}

		addAlwaysOn();

		$.each(scPaLib.findNodes("chi:area", map), function() {
			$.register(this, 'mouseover', mouseover);
			$.register(this, 'mouseout', mouseout);
		});

		$.before(canvas, img); // if we put this after, the mouseover events wouldn't fire.

		$.addClass(img, 'maphighlighted');
	};
	$.defaults = {
		fill: true,
		fillColor: '000000',
		fillOpacity: 0.2,
		stroke: true,
		strokeColor: 'ff0000',
		strokeOpacity: 1,
		strokeWidth: 1,
		alwaysOn: false,
		neverOn: false,
		groupBy: false,
		wrapClass: true,
		shadow: false,
		shadowX: 0,
		shadowY: 0,
		shadowRadius: 6,
		shadowColor: '000000',
		shadowOpacity: 0.8,
		shadowPosition: 'outside',
		shadowFrom: false
	};
})(scMapMgr);
