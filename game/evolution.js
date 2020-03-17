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

	// TODO: increase bullet potency + range
}

var evolveBerserker = sphere => {
	var blade = addGlow(makeSphere(scene, 0, 0, -5, sphere.radius, BABYLON.Color3.Red()), BABYLON.Color3.Red());
	
	blade.isFriendly = true;
	blade.direction = new BABYLON.Vector3(0, 0, 0);
	blade.cancel = () => {}; // blade does not die
	
	var bulletIndex = uniqueId++;
	blade.bulletIndex = bulletIndex;
	bullets[bulletIndex] = blade;

	blade.parent = sphere;

	sphere.fireWeapon = () => {
		blade.isGrowing = true;
		blade.update = (time, self) => {
			var zScalingFactor = self.isGrowing ? self.scaling.z + .1 : self.scaling.z - .1;
			if (zScalingFactor > 10) {
				self.isGrowing = false;
			}
			if (!self.isGrowing && zScalingFactor < 1) {
				self.update = () => {};
				self.isGrowing = true;
			}
			var xScalingFactor = .25*Math.cos(time)+.75;
			self.scaling = new BABYLON.Vector3(xScalingFactor, 1, zScalingFactor);
		}
	}; // blade is weapon
}

var evolveManipulator = sphere => {
	var missiles = [];
	setInterval(() => { // regenerate missiles
		var missile = addGlow(makeSphere(scene, 0, 0, 10, sphere.radius, BABYLON.Color3.Teal()), BABYLON.Color3.Teal());
		missile.update = (time, self) => {
			var magnitude = 10;
			var offset = 2*Math.PI*missiles.indexOf(self)/missiles.length;
			self.position = new BABYLON.Vector3(magnitude*Math.cos(time+offset), 0, magnitude*Math.sin(time+offset));
		}
		missiles.push(missile);
		missile.parent = sphere;
	}, 1000)

	sphere.fireWeapon = () => {
		var activeMissile = missiles.shift();	
		
		if (!activeMissile) return;
	
		var bulletIndex = uniqueId++;
		activeMissile.bulletIndex = bulletIndex;
		bullets[bulletIndex] = activeMissile;

		activeMissile.direction = sphere.aimDirection;
		activeMissile.isFriendly = true;

		activeMissile.update = (time, self) => {
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			if (pickResult.hit && pickResult.pickedMesh.id == "ground") {
				var cursorX = pickResult.pickedPoint.x;
				var cursorZ = pickResult.pickedPoint.z;
				var positionIncrement = new BABYLON.Vector3(cursorX, 0, cursorZ);
				positionIncrement = BABYLON.Vector3.Normalize(getVectorTo(self.position, positionIncrement));
				self.direction = positionIncrement;
			}
			self.position = self.position.add(self.direction);
		}

		var cancel = setTimeout(() => {
			activeMissile.dispose();
		}, 1000)
		activeMissile.cancel = (bullets) => {
			delete bullets[activeMissile.bulletIndex];
			activeMissile.dispose();
			clearTimeout(cancel);
		}
	}
}