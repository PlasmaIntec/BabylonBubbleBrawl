var evolveSniper = sphere => {
	var tailMeshes = [];
	var tailCount = 5;
	for (var i = 0; i < tailCount; i++) {
		var distance = i+tailCount;
		var tail = makeSphere(scene, 0, 0, distance, sphere.radius-.5*i, BABYLON.Color3.Purple());
		tail.index = i;
		tail.distance = distance;
		tail.update = (time, self) => {
			var d = self.distance;
			var logistic = x => Math.PI / (1 + 8*Math.exp(-x+tailCount));
			var maxAngle = logistic(d);
			var amplitude = d;
			var b = maxAngle * Math.sin(time);
			var x = amplitude * Math.sin(b);
			var z = amplitude * Math.cos(b);
			self.position = new BABYLON.Vector3(x, 0, z); // for the swaying tail effect
			var scalingFactor = .25*Math.cos(2*Math.PI*self.index/tailCount + time)+.75;
			self.scaling = new BABYLON.Vector3(scalingFactor, 1, scalingFactor); // for the feeling of pulsation
		}
		tailMeshes.push(tail);
	}
	tailMeshes.forEach(tail => tail.parent = sphere);
}