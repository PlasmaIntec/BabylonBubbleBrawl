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

var moveLocation = (x, z, object, location, gridSize) => new Promise((resolve) => {							
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

	scene.beginDirectAnimation(object, [movein], 0, 5 * frameRate, false, 1, () => { 
		resolve();
	});
})

var generateNewGrid = (location, gridSize, gridElements, enemies, physicsHelper) => {
	var originX = location.x * gridSize;
	var originZ = location.z * gridSize;
	var ground = makeGround(scene, originX, 0, originZ);
	gridElements.push(ground);
	var enemy = makeNuisance(scene, originX + 50*Math.random(), 20, originZ + 50*Math.random(), 5, BABYLON.Color3.Blue(), sphere, physicsHelper);
	var enemyIndex = uniqueId++;
	enemy.enemyIndex = enemyIndex;
	enemies[enemyIndex] = enemy;
	gridElements.push(enemy);

	var enemy = makeFoster(scene, originX + 50*Math.random(), 20, originZ + 50*Math.random(), 10, BABYLON.Color3.Blue(), sphere, physicsHelper);
	var enemyIndex = uniqueId++;
	enemy.enemyIndex = enemyIndex;
	enemies[enemyIndex] = enemy;
	gridElements.push(enemy);
}