INSTALLATION
============

Put jquery.tilesgallery.js in the js/ folder and jquery-tilesgallery.css in the css/ folder of your website. Include these files in the head of your page, be sure to include also an updated version of jQuery:

<html>
	<head>
	....
	<script src="http://code.jquery.com/jquery-1.7.2.min.js" type="text/javascript"></script>
	<script src="/js/jquery.tilesgallery.js"  type="text/javascript"></script>
	<link href="/css/jquery-tilesgallery.css" rel="Stylesheet" />
	...
	</head>
...
</html>



HTML SETUP
==========

What you need is:

	- a container;
	- a list of tag, each one containing an image;

example:

	<div id="example">
		<p><img src="/images/image-1.jpg" /></p>
		<p><img src="/images/image-2.jpg" /></p>
		<p><img src="/images/image-3.jpg" /></p>		
	</div>

the script to apply jQuery Tiles Gallery can be anywhere in the page:

	<script type="text/javascript">
	$(function () {
		$(".tiles").tilesGallery();
	})
	</script>

...and you have done!

Note: you can set up a custom alignment for each image using the attributes  
data-jtg-align="left|center|right" and data-jtg-valign="top|middle|bottom", 
example:

	<img src="example.jpg" data-jtg-align="right" data-jtg-valign="bottom" />


The previous example is a minimal setup, but you could have something sexier, 
for example you could add a caption! To add a caption you have to use a tag with
the "caption" class, like this:

<div id="example">
	<div>
	    <p class='caption'><span>Lorem ipsum dolor sit amet.</span></p>
	    <img src='image1.jpg' />
	</div>
	<div>
	    <p class='caption'><span>Lorem ipsum dolor sit amet.</span></p>
	    <img src='image2.jpg' />
	</div>
	<div>
	    <p class='caption'><span>Lorem ipsum dolor sit amet.</span></p>
	    <img src='image3.jpg' />
	</div>
</div>



OPTIONS
=======

°	width
		An int value. Width of the container in pixels. This option can be 
		omitted and inherited by CSS.

°	height
		An int value. Height of the container in pixels. Omitting this option 
		will inherit height by CSS. You can also avoid to define any height but 
		you have to set the 'tileMinHeight' option and the plugin will 
		automatically set the minimun needed height.

°	tileMinHeight
		An int value.

	
°	margin
		An int value. Margin thickness in pixels between the images.

°	captionOnMouseOver
		A boolean value. If true it will hide all captions to show them only 
		when the mouse is over the image.

°	captionAnimationDuration
		An int value. The duration of the caption fade in milliseconds.

°	captionAnimationType
		A string values, possible values: fade, slide.

°	fadeInDuration
		an int value. Duration of image fade in in milliseconds.

°	verticalAlign
		Default vertical alignment of the image inside the tile, possible 
		values: 'top', 'middle', 'bottom'.

°	horizontalAlign
		Default horizontal alignment of the image inside the tile, possible 
		values: 'left', 'center', 'right'.

°	reloadOnResize
		A boolean values, if false it will disable the responsiveness.

°	callback
		A function value. After jQuery Tiles Gallery has done its job you can 
		run custom code within the callback. For example, the following code:
		
		$("#example").tilesGallery({
			callback: function () {
				alert("jQuery Tiles Gallery has done with its job!");
			}
		});

		will open an alert containing the text: "jQuery Tiles Gallery has done
		with its job!".
	


HOW TO...
=========

°	...set a custom alignment of the images?
	Set the attributes data-jtg-align="left|center|right" and 
	data-jtg-valign="top|middle|bottom" of the image, example:

		<img src="test.jpg" data-jtg-align="right" data-jtg-valign="bottom" />

	every image can have its own alignment!


°	...change the color of the borders? 
	The borders are transparent, so you just have to set the background color of
	 the whole container (the div with "example" ID in our example).

°	...change the preload image?
	Change the image "loading.gif" with the one you prefer inside the file 
	jquery-tilesgallery.css and adjust the css rule for the selector .loading 
	(if needed).

°	...show a lightbox popup when I click on images?
	Choose your favourite popup plugin and activate it in the callback. For 
	example, if you use jQuery Lightbox, you should write this:

	$("#example").tilesGallery({
		callback: function () {
			$(".tiles a").lightBox();
		}
	});

	the jQuery Lightbox can be downloaded from 
	http://leandrovieira.com/projects/jquery/lightbox/ 
	
	

CHANGELOG
=========
	
	v1.5 Solved jQuery 1.9 issue

	v1.4 New features: responsive layout, progressive image loading, better 
		 captions;

	v1.3 Improvement: images are chosen based on their orientation;

	v1.2 New feature: custom per-image vertical and horizontal alignment;

	v1.1 New feature: default vertical and horizontal alignment;

	v1.0 First release. 

