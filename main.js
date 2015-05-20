function rgbToHex(r, g, b) {
	var rSafe = Math.min(Math.max(r * 255, 0), 255);
	var gSafe = Math.min(Math.max(g * 255, 0), 255);
	var bSafe = Math.min(Math.max(b * 255, 0), 255);

	var rhex = Math.floor(rSafe).toString(16);
	if (rhex.length == 1) {
		rhex = "0" + rhex;
	}
	var ghex = Math.floor(gSafe).toString(16);
	if (ghex.length == 1) {
		ghex = "0" + ghex;
	}
	var bhex = Math.floor(bSafe).toString(16);
	if (bhex.length == 1) {
		bhex = "0" + bhex;
	}
	return "#" + rhex + ghex + bhex;
}

function hexToRgb(hex) {
	var r = parseInt(hex.substring(1, 3), 16) / 255;
	var g = parseInt(hex.substring(3, 5), 16) / 255;
	var b = parseInt(hex.substring(5, 7), 16) / 255;
	return [r, g, b];
}

function rgbToHsv(r, g, b) {
	var v = Math.max(r, g, b);
	var c = v - Math.min(r, g, b);
	var h;
	if (c === 0) {
		h = 0;
	} else if (v === r) {
		h = (g - b)/c; 
	} else if (v === g) {
		h = (b - r)/c + 2;
	} else {
		h = (r - g)/c + 4;
	}
	h = (h + 6) % 6;
	h *= 60;
	var s;
	if (v === 0) {
		s = 0;
	} else {
		s = c/v;
	}
	return [h, s, v];
}

function hsvToRgb(h, s, v) {
	var c = s*v;
	var hr = h/60;
	var x = c*(1 - Math.abs(hr%2 - 1));
	var m = v - c;
	var rgb;
	if (v === 0) {
		rgb = [m, m, m];
	} else if (hr >= 5) {
		rgb = [c+m, m, x+m];
	} else if (hr >= 4) {
		rgb = [x+m, m, c+m];
	} else if (hr >= 3) {
		rgb = [m, x+m, c+m];
	} else if (hr >= 2) {
		rgb = [m, c+m, x+m];
	} else if (hr >= 1) {
		rgb = [x+m, c+m, m];
	} else {
		rgb = [c+m, x+m, m];
	}
	return rgb;	
}

function rgbToHsl(r, g, b) {
	var m = Math.max(r, g, b);
	var c = m - Math.min(r, g, b);
	var h;
	if (c === 0) {
		h = 0;
	} else if (m === r) {
		h = (g - b)/c; 
	} else if (m === g) {
		h = (b - r)/c + 2;
	} else {
		h = (r - g)/c + 4;
	}
	h = (h + 6) % 6;
	h *= 60;
	var l = (m + Math.min(r, g, b))/2;
	var s;
	if (l === 0 || l === 1) {
		s = 0;
	} else {
		s = c/(1 - Math.abs(2*l - 1));
	}
	return [h, s, l];
}

function hslToRgb(h, s, l) {
	var c = s*(1 - Math.abs(2*l - 1));
	var hr = h/60;
	var x = c*(1 - Math.abs(hr%2 - 1));
	var m = l - c/2;
	var rgb;
	if (l === 0 || l === 1) {
		rgb = [m, m, m];
	} else if (hr >= 5) {
		rgb = [c+m, m, x+m];
	} else if (hr >= 4) {
		rgb = [x+m, m, c+m];
	} else if (hr >= 3) {
		rgb = [m, x+m, c+m];
	} else if (hr >= 2) {
		rgb = [m, c+m, x+m];
	} else if (hr >= 1) {
		rgb = [x+m, c+m, m];
	} else {
		rgb = [c+m, x+m, m];
	}
	return rgb;	
}

function rgbToYuv(r, g, b) {
	var y = 0.299*r + 0.587*g + 0.114*b;
	var u = (-0.14713)*r + (-0.28886)*g + 0.436*b;
	var v = 0.615*r + (-0.51499)*g + (-0.10001)*b;
	return [y, u, v];
}

function yuvToRgb(y, u, v) {
	var r = y + 1.13983*v;
	var g = y + (-0.39465)*u + (-0.5806)*v;
	var b = y + 2.03211*u;
	return [r, g, b];
}

function polarToRect(a, r) {
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	return [x, y];
}

function rectToPolar(x, y) {
	var a = Math.atan2(y, x);
	if (a < 0) {
		a += 2*Math.PI;
	}
	var r = Math.sqrt(x*x + y*y);
	return [a, r];
}

function rScales(g, b, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		result.push(rgbToHex(i*step, g, b));
	}
	return result;
}

function gScales(r, b, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		result.push(rgbToHex(r, i*step, b));
	}
	return result;
}

function bScales(r, g, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		result.push(rgbToHex(r, g, i*step));
	}
	return result;
}

function hScalesHSV(s, v, n) {
	var step = 360/n;
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hsvToRgb(i*step, s, v);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function sScalesHSV(h, v, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hsvToRgb(h, i*step, v);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function vScalesHSV(h, s, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hsvToRgb(h, s, i*step);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function hScalesHSL(s, l, n) {
	var step = 360/n;
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hslToRgb(i*step, s, l);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function sScalesHSL(h, l, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hslToRgb(h, i*step, l);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function lScalesHSL(h, s, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hslToRgb(h, s, i*step);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function yScalesYUV(u, v, n) {
	var step = 1/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = yuvToRgb(i*step, u, v);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function uScalesYUV(y, v, n) {
	var step = 0.872/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = yuvToRgb(y, i*step - 0.436, v);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function vScalesYUV(y, u, n) {
	var step = 1.23/(n - 1);
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = yuvToRgb(y, u, i*step - 0.615);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function hsvHues(h, s, v, n) {
	var step = 360/n;
	var result = [];
	for (var i = 0; i < n; i++) {
		var rgb = hsvToRgb((i*step + h)%360, s, v);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}

function yuvHues(y, u, v, n) {
	var step = (2*Math.PI)/n;
	var result = [];
	var polar = rectToPolar(u, v);
	var startAngle = polar[0];
	var radius = polar[1];
	for (var i = 0; i < n; i++) {
		var angle = (startAngle + i*step) % (2*Math.PI);
		var rect = polarToRect(angle, radius);
		var rgb = yuvToRgb(y, rect[0], rect[1]);
		result.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
	}
	return result;
}