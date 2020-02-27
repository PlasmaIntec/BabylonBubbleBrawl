// Map Traversal Helpers

var getMovementDirection = (sphere, location, gridSize) => {
	var direction = { x: 0, z: 0 };
	if (sphere.position.x > location.x*gridSize + gridSize/2) {
		direction.x = 1;
	} else if (sphere.position.x < location.x*gridSize - gridSize/2) {
		direction.x = -1;
	} else if (sphere.position.z > location.z*gridSize + gridSize/2) {
		direction.z = 1;
	} else if (sphere.position.z < location.z*gridSize - gridSize/2) {
		direction.z = -1;
	}
	return direction;
}

var outOfGrid = (sphere, location, gridSize) => {
	return (sphere.position.x > location.x*gridSize + gridSize/2 || sphere.position.x < location.x*gridSize - gridSize/2 ||
	sphere.position.z > location.z*gridSize + gridSize/2 || sphere.position.z < location.z*gridSize - gridSize/2);
}

var moveLocation = (x, z, camera, location, gridSize) => new Promise((resolve) => {							
	var frameRate = 60;

	var movein = new BABYLON.Animation(
	"movein",
	"position",
	frameRate,
	BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
	BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
	);

	var movein_keys = [];

	movein_keys.push({
	frame: 0,
	value: new BABYLON.Vector3(location.x*gridSize, 200, location.z*gridSize)
	});

	movein_keys.push({
	frame: 1 * frameRate,
	value: new BABYLON.Vector3(location.x*gridSize + x, 200, location.z*gridSize + z)
	});

	movein.setKeys(movein_keys);

	scene.beginDirectAnimation(camera, [movein], 0, 5 * frameRate, false, 1, () => { 
		resolve();
	});
})