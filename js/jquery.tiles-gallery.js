/**
 * jQuery Tiles Gallery v2.0 - artistic javascript gallery
 * http://tiles-gallery.com
 *
 * Copyright 2013, GreenTreeLabs
 * 
 */

;(function($){
	
	var options = {};
	var galleries = {};
	var elementCounter = 0;	
	var images = {};
	var resizeTO = {};

	function _jquerytg_insertImageInTile(k, img, node) {
		var source = galleries["jquery-tg" + k].source;

		var search = img.width / img.height > 1 ? 
			".tile-horizontal" : ".tile-vertical";

		var tile = source.find(search + ":empty").first();
		if(tile.length == 0)
			tile = source.find(".tiles-item:empty").first();		

		var dataAlign = $(img).data("jtg-align");
		var dataValign = $(img).data("jtg-valign");

		if(dataAlign == undefined)
			dataAlign = options.horizontalAlign;
		if(dataValign == undefined)
			dataValign = options.verticalAlign;

		var i_w = img.width;
		var i_h = img.height;
		var e_w = tile.width();
		var e_h = tile.height();	

		var i_ratio = i_w / i_h; 
		var e_ratio = e_w/ e_h;

		var imgNode = node.find("img");

		tile.append(node);

		if(i_ratio <= e_ratio) {
			var h = Math.round(e_w / i_ratio);
			var mTop = 0;

			switch(dataValign) {
				default:
				case 'middle':
					mTop = Math.round((h - e_h) / -2);
					break;
				case 'top':
					mTop = 0;
					break;
				case 'bottom':
					mTop = (h - e_h) * (-1);
			}
			imgNode.css({
				height: h,
				width: e_w,
				marginTop: mTop,
				marginLeft: 0
			});	
		} else {
			var w = Math.round(e_h * i_ratio);
			var mLeft = Math.round((w - e_w) / -2);

			switch(dataAlign) {
				default:
				case 'center':
					mLeft = Math.round((w - e_w) / -2);
					break;
				case 'left':
					mLeft = 0;
					break;
				case 'right':
					mLeft = (w - e_w) * (-1);
			}
			imgNode.css({
				height: e_h,
				width: w,
				marginLeft: mLeft,
				marginTop: 0
			});						
		}
		imgNode.css({
			position: "absolute",
			zIndex: 1,
			top: 0,
			left: 0
		});
		imgNode.hide().fadeTo(options.fadeInDuration, 1);
		
		_jquerytg_addCaption(node);
	}

	function _jquerytg_addCaption(node) {		
		var caption = node.find(".caption");
		if(caption.length > 0) {
			if(options.captionOnMouseOver) {
				caption.hide();
				node.parents(".tiles-content").hover(
					function () {
						var to = setTimeout(function () {
							switch(options.captionAnimationType)
							{
								case "slide":
								default:
									caption.slideDown(options.captionAnimationDuration);
									break;
								case "fade":
									caption.fadeTo(options.captionAnimationDuration, 1);
							}
						}, 200);					
						caption.data("to", to);	
					},
					function () {
						if(caption.data("to"))
							clearTimeout(caption.data("to"));
						switch(options.captionAnimationType)
						{
							case "slide":
							default:
								caption.slideUp(options.captionAnimationDuration);
								break;
							case "fade":
								caption.fadeTo(options.captionAnimationDuration, 0);
						}
					}
				)
				caption.css({
					bottom:0,
					left:0,
					zIndex:2,
					position: "absolute",
					width: "100%",
					height: options.captionHeight,
					margin: 0
				});
				if(options.fullCaption)
					caption.css({
						height: "100%"
					});
			}
			//node.parents(".tiles-content").append(caption);
		}			
	}

	function _jquery_grow_children(amount, parent) {
		$(parent).children().each(function () {
			$(this).height($(this).height() + amount).addClass('grown-child');
			if($(this).children().length > 0)
				_jquery_grow_children(amount, this);
		});
	}

	function resize(e) {
		var new_h = $(this).children().eq(0).height();
		if($(this).hasClass("sliced-v")) {
			new_h += $(this).children().eq(1).height();
		}	
	
		$(this).height(new_h);
		if($(this).parent().hasClass("sliced-h")) {
			$(this).siblings().eq(0)
				.height(new_h)
				.trigger("jtg.parentgrown");
		}
		grown = true;
	}

	function parentGrown(e) {
		e.stopPropagation();
		var h = $(this).height();
		if($(this).hasClass("sliced-v")) {
			var h1 = $(this).children().eq(0).height();
			var h2 = $(this).children().eq(1).height();			

			$(this).children().eq(0)
				.height(h - h2)
				.trigger("jtg.parentgrown");
		} else {
			$(this).children().height(h).trigger("jtg.parentgrown");
		}
	}

	var grown = false;
	var loops = 0;
	function _jquerytg_makeTiles(k) {
		grown = false;
		var source = galleries["jquery-tg" + k].source;
		source.find(".jquery-tiles").remove();

		var tiles_cnt = $("<div class='jquery-tiles' />");
		source.empty().append(tiles_cnt);

		var w = source.width();
		var h = source.height();
		
		var anchorV = options.verticalAlign;
		var anchorH = options.horizontalAlign;

		var first = $("<div class='tiles-item' />");
		first.width(w);
		first.height(h);
		
		tiles_cnt.append(first);

		source.delegate(tiles_cnt, "jtg.resize", resize);
		tiles_cnt.delegate(first, "jtg.resize", resize);

		var depth = 0;
		while(depth < galleries["jquery-tg" + k].totalImages - 1) {

			var items = tiles_cnt.find(".tiles-item:empty");
			var index = 0;
			var biggerArea = 0;
			for(var i=0; i < items.size(); i++) {
				var _el = items.eq(i);
				var area = _el.width() * _el.height();
				if(area > biggerArea) {
					biggerArea = area;
					index = i;
				}
			}
			
			var item = items.eq(index);
			var itemWidth = item.width();
			var itemHeight = item.height();
			
			//if(i == 0)
			//	tiles_cnt.delegate(item, "jtg.resize", resize);

			var w1,  h1 = 0;
			var w2,  h2 = 0;
			
			if(itemHeight > itemWidth) {
				w1 = itemWidth;
				w2 = itemWidth;

				var t = itemHeight * .5;
				h1 = Math.round(t + (Math.random() * t - (t/2)));
				h2 = itemHeight - h1;

				item.addClass("sliced-v");
			} else {
				h1 = itemHeight;
				h2 = itemHeight;

				var t = itemWidth * .5;
				w1 = Math.round(t + (Math.random() * t - (t/2)));
				w2 = itemWidth - w1;

				item.addClass("sliced-h");
			}

			var child1 = $("<div class='tiles-item' />");
			child1.width(w1);
			child1.height(h1);
			child1.addClass(w1 > h1 ? "tile-horizontal" : "tile-vertical");
			child1.css({
				"float": "left",
				"overflow": "hidden"
			});
			
			var child2 = $("<div class='tiles-item' />");
			child2.width(w2);
			child2.height(h2);
			child2.addClass(w2 > h2 ? "tile-horizontal" : "tile-vertical");
			child2.css({
				"float": "left",
				"overflow": "hidden"
			});

			item
				.append(child1)
				.append(child2);

			item.delegate(child1, "jtg.resize", resize);

			child1.delegate(item, "jtg.parentgrown", parentGrown);
			child2.delegate(item, "jtg.parentgrown", parentGrown);

			if(options.tileMinHeight > 0) {
				if(h1 < options.tileMinHeight) {
					var add = options.tileMinHeight - h1;
					h1 = options.tileMinHeight;
					child1.height(h1).trigger("jtg.resize");
				}
				if(h2 < options.tileMinHeight) {
					var add = options.tileMinHeight - h2;
					h2 = options.tileMinHeight;
					child2.height(h2).trigger("jtg.resize");
				}		
			}						
			depth++;
		}
		var _empty = source.find(".tiles-item:empty");
	    for (var i = 0; i < _empty.size(); i++) {
		    var _el = _empty.eq(i);
		    _el.addClass("tiles-content");
		    _el.addClass(options.contentClass).css({
		        marginRight: options.margin,
		        marginBottom: options.margin,
		        width: _el.width() - options.margin,
		        height: _el.height() - options.margin,
		        position: "relative"
		    });
	    }

	    source.data("width", source.width());
	    if(grown)
	    	_jquerytg_makeTiles(k);
	    else
	    	loops = 0;
	}

	function _jquerytg_imgLoaded(img, node) {		
		var k = $(img).data('k');
		var counter = galleries["jquery-tg" + k];
		
		images[img.src] = {
			width: img.width,
			height: img.height
		};

		_jquerytg_insertImageInTile(k, img, node);
		if(++counter.loadedImages == counter.totalImages) {

			$(".jquerytg-preload" + k).remove();
			galleries["jquery-tg" + k].source.find(".loading").remove();

			if($.isFunction(options.callback)) {
				var source = galleries["jquery-tg" + k].source;
				options.callback.call(source);
			}
		}
	}

	$.fn.tilesGallery = function(user_options) {
		var defaults = {
			margin:3,
			responsive: true,
			captionOnMouseOver: true,
			captionAnimationDuration: 500,
			captionAnimationType: "fade",
			captionHeight: "100%",
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			tileMinHeight:0,
			reloadOnResize: true,
			fadeInDuration: 2000,
			width:'auto',
			height: 'auto',
			tileMinHeight: 0
		};
		options = $.extend(defaults, user_options); 

		this.css({
			position: 'relative',
			overflow: 'hidden',				
			paddingTop: options.margin,
			paddingLeft: options.margin
		});

		return this.each(function() {
			var matchedElement = $(this);
			var k = ++elementCounter + Math.random();
			galleries["jquery-tg" + k] = {
				totalImages : $("img", this).size(),
				loadedImages : 0,
				lastItem : 0,
				placedItems: [],
				source : matchedElement,
				tilesItems : matchedElement.children().clone()
			};

			var ie = /MSIE (\d+\.\d+);/.test(navigator.userAgent);

			if(options.width) {
				matchedElement.css({
					width: options.width - (ie ? 0 : options.margin)
				});
			}
			if(options.height) {
				matchedElement.css({
					height: options.height - (ie ? 0 : options.margin)
				});
			}

			matchedElement.addClass("tiles-node");
			matchedElement.append("<span class='loading' />");
			matchedElement.find(".loading").css({
				position: "absolute",
				top: options.height / 2,
				left: "50%"
			});

			var element = this;

			_jquerytg_makeTiles(k);

			if(options.responsive) {
				$(window).resize(function () {
					clearTimeout(resizeTO[k]);
					resizeTO[k] = setTimeout(function () {
						var last_w = galleries["jquery-tg" + k].source.data("width");
						var w = galleries["jquery-tg" + k].source.width();

						if(last_w != w) {
							galleries["jquery-tg" + k].source.height(options.height);
							galleries["jquery-tg" + k].source.empty();
							galleries["jquery-tg" + k].source.append(galleries["jquery-tg" + k].tilesItems);
							$(galleries["jquery-tg" + k].source).tilesGallery(user_options);							
						}
					}, 150);
				});
			}

			$(".jquerytg-preload"+k).remove();
				
			var element = this;
			for (var i=0; i < galleries["jquery-tg" + k].tilesItems.size(); i++) {
				var imgEl = galleries["jquery-tg" + k].tilesItems.eq(i).find("img");		

				var image = new Image();

				var img = $(image)
					.attr("data-k", k)
					.attr("alt", imgEl.attr("alt"))
					.data("index", i)						
					.data("jtg-align", imgEl.data("jtg-align"))
					.data("jtg-valign", imgEl.data("jtg-valign"))
					.data("node", galleries["jquery-tg" + k].tilesItems.eq(i))
				    .addClass("jquerytg-preload"+k).hide();

				image.onload = function () {
					var index = $(this).data("index");					
				    _jquerytg_imgLoaded(this, $(this).data("node"));
				}
				image.src = imgEl.attr("src");

				$("body").append(img);
			}
		});
	}

})(jQuery);
