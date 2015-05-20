/*
	Public functions:

	- getColorsFromHex:
		Parameters:
			- color: String of the form "#rrggbb", the hex value for the basis of the color scheme
			- num: Positive integer, the number of colors to generate 
		Returns a color scheme based on the given color, represted as an array of 'num' strings in the form "#rrggbb"

	- getColorsFromRgb:
		Parameters:
			- r: Integer in the range [0, 255], the red value for the basis color
			- g: Integer in the range [0, 255], the green value for the basis color
			- b: Integer in the range [0, 255], the blue value for the basis color
			- num: Positive integer, the number of colors to generate
		Returns a color scheme based on the given color, represented as an array of 'num' arrays, each with 3 integer elements in the range [0, 255]

	- differenceHex:
		Parameters:
			- c1: String of the form "#rrggbb", the hex value for the first color to compare
			- c2: String of the form "#rrggbb", the hex value for the second color to compare
		Returns a number approximately between 0 and 1.8, representing the Euclidean distance between the two given colors in the YUV color space

	- differenceRgb:
		Parameters:
			- r1: Integer in the range [0, 255], the red value for the first color to compare
			- g1: Integer in the range [0, 255], the green value for the first color to compare
			- b1: Integer in the range [0, 255], the blue value for the first color to compare
			- r2: Integer in the range [0, 255], the red value for the second color to compare
			- g2: Integer in the range [0, 255], the green value for the second color to compare
			- b2: Integer in the range [0, 255], the blue value for the second color to compare
		Returns a number approximately between 0 and 1.8, representing the Euclidean distance between the two colors ([r1, g1, b1] and [r2, g2, b2]) in the YUV color space

	- areSimilarHex:
		Parameters:
			- c1: String of the form "#rrggbb", the hex value for the first color to compare
			- c2: String of the form "#rrggbb", the hex value for the second color to compare
			- threshold: Number representing how close two colors should be to be considered 'similar' (approximately 0.2 is recommended)
		Returns true if the given colors are within 'threshold' units of each other in the YUV color space, and returns false otherwise

	- areSimilarRgb:
		Parameters:
			- r1: Integer in the range [0, 255], the red value for the first color to compare
			- g1: Integer in the range [0, 255], the green value for the first color to compare
			- b1: Integer in the range [0, 255], the blue value for the first color to compare
			- r2: Integer in the range [0, 255], the red value for the second color to compare
			- g2: Integer in the range [0, 255], the green value for the second color to compare
			- b2: Integer in the range [0, 255], the blue value for the second color to compare
			- threshold: Number representing how close two colors should be to be considered 'similar' (approximately 0.2 is recommended)
		Returns true if the given colors ([r1, g1, b1] and [r2, g2, b2]) are within 'threshold' units of each other in the YUV color space, and returns false otherwise
*/

function getColorsFromHex(color, num) {
	var r = parseInt(color.substring(1, 3), 16);
	var g = parseInt(color.substring(3, 5), 16);
	var b = parseInt(color.substring(5, 7), 16);

	return getColorsFromRgb(r, g, b, num).map(function(c) {
		var rhex = c[0].toString(16);
		if (rhex.length == 1) {
			rhex = "0" + rhex;
		}
		var ghex = c[1].toString(16);
		if (ghex.length == 1) {
			ghex = "0" + ghex;
		}
		var bhex = c[2].toString(16);
		if (bhex.length == 1) {
			bhex = "0" + bhex;
		}
		return "#" + rhex + ghex + bhex;
	});
}

function getColorsFromRgb(r, g, b, num) {
	var yuv = __rgbToYuv(r/255, g/255, b/255);
	var newColors = __generateColors(yuv[0], yuv[1], yuv[2], num);

	return newColors.map(function(col) {
		var c = __yuvToRgb(col[0], col[1], col[2]).map(function(v) {
			if (v < 0) {
				return 0;
			} else if (v > 1) {
				return 1;
			} else {
				return v;
			}
		});

		return c.map(function(x){ return Math.floor(x * 255); });
	});
}

function differenceHex(c1, c2) {
	var r1 = parseInt(c1.substring(1, 3), 16);
	var g1 = parseInt(c1.substring(3, 5), 16);
	var b1 = parseInt(c1.substring(5, 7), 16);

	var r2 = parseInt(c2.substring(1, 3), 16);
	var g2 = parseInt(c2.substring(3, 5), 16);
	var b2 = parseInt(c2.substring(5, 7), 16);

	return differenceRgb(r1, g1, b1, r2, g2, b2);
}

function differenceRgb(r1, g1, b1, r2, g2, b2) {
	var a = __rgbToYuv(r1/255, g1/255, b1/255);
	var b = __rgbToYuv(r2/255, g2/255, b2/255);

	return __distance(a, b);
}

function areSimilarHex(c1, c2, threshold) {
	return differenceHex(c1, c2) <= threshold;
}

function areSimilarRgb(r1, g1, b1, r2, g2, b2, threshold) {
	return differenceRgb(r1, g1, b1, r2, g2, b2) <= threshold;
}

function __rgbToYuv(r, g, b) {
	var y = 0.299*r + 0.587*g + 0.114*b;
	var u = (-0.14713)*r + (-0.28886)*g + 0.436*b;
	var v = 0.615*r + (-0.51499)*g + (-0.10001)*b;
	return [y, u, v];
}

function __yuvToRgb(y, u, v) {
	var r = y + 1.13983*v;
	var g = y + (-0.39465)*u + (-0.5806)*v;
	var b = y + 2.03211*u;
	return [r, g, b];
}

function __polarToRect(a, r) {
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	return [x, y];
}

function __rectToPolar(x, y) {
	var a = Math.atan2(y, x);
	if (a < 0) {
		a += 2*Math.PI;
	}
	var r = Math.sqrt(x*x + y*y);
	return [a, r];
}

function __distance(arr1, arr2) {
	if (arr1.length != arr2.length) {
		return -1;
	} else {
		var sum = 0;
		var i;
		for (i = 0; i < arr1.length; i++) {
			sum += Math.pow(arr1[i]-arr2[i], 2);
		}
		return Math.sqrt(sum);
	}
}

function __generateColors(y, u, v, n) {
	var result = [];
	var polar = __rectToPolar(u, v);
	var startAngle = polar[0];
	var radius = polar[1];

	var i;

	var values = Math.ceil(n/6);
	var modifiers = [];
	if (y <= 0.5) {
		for (i = 0; i < values; i++) {
			if (i % 2 == 0) {
				modifiers.push(-0.15*i/2);
			} else {
				modifiers.push(0.15*(i+1)/2);
			}
		}
	} else {
		for (i = 0; i < values; i++) {
			if (i % 2 == 0) {
				modifiers.push(0.15*i/2);
			} else {
				modifiers.push(-0.15*(i+1)/2);
			}
		}
	}

	for (i = 0; i < n; i++) {
		var angle = (2*Math.PI*i/n + startAngle) % (2*Math.PI);
		var coordinates = __polarToRect(angle, radius);
		result.push([y + modifiers[i%values], coordinates[0], coordinates[1]]);
	}
	return result;
}