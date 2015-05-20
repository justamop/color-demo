function crossProduct(u, v) {
	return {
		x: u.y*v.z - u.z*v.y,
		y: u.z*v.x - u.x*v.z,
		z: u.x*v.y - u.y*v.x,
	}
}

function addVectors(u, v) {
	return {
		x: u.x + v.x,
		y: u.y + v.y,
		z: u.z + v.z
	}
}

function scalarMult(c, v) {
	return {
		x: c*v.x,
		y: c*v.y,
		z: c*v.z
	}
}

function magnitude(v) {
	return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}

function makeUnit(v) {
	return scalarMult(1/magnitude(v), v);
}

function colorCircle(ca, cb, cp, n) {
	var va = {
		x: cp.r - ca.r,
		y: cp.g - ca.g,
		z: cp.b - ca.b
	}

	var vb = {
		x: cp.r - cb.r,
		y: cp.g - cb.g,
		z: cp.b - cb.b
	}

	var normal = makeUnit(crossProduct(va, vb));
	var center = {
		x: (ca.r + cb.r)/2,
		y: (ca.g + cb.g)/2,
		z: (ca.b + cb.b)/2
	}
	var u = makeUnit(va);
	var r = magnitude({x: (cb.r - ca.r), y: (cb.g - ca.g), z: (cb.b - ca.b)})/2;

	var result = [];
	for (var i = 0; i < n; i++) {
		var t = 2*i*Math.PI/n;
		var adjU = scalarMult(r*Math.cos(t), u);
		var adjV = scalarMult(r*Math.sin(t), crossProduct(normal, u));
		var offset = addVectors(adjU, adjV);
		result.push(addVectors(offset, center));
	}
	return result;
}