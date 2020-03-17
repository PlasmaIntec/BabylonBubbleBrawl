// Helpers
function addMaterialToMesh(sphere) {
	var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
	sphereMaterial.alpha = 0.5;
	sphere.material = sphereMaterial;
}

function showExplosionDebug(data) {
	addMaterialToMesh(data.sphere);
	data.sphere.isVisible = true;

	return {
		sphere: data.sphere,
	};
}

function hideExplosionDebug(debugData) {
	debugData.sphere.isVisible = false;
}

var getAnglePointingAt = (from, to) => {
	var diffX = to.x - from.x;
	var diffY = to.z - from.z;
	return new BABYLON.Vector3(0, Math.atan2(diffX,diffY), 0);
}

var getVectorTo = (from, to) => {
	var diffX = to.x - from.x;
	var diffZ = to.z - from.z;
	return new BABYLON.Vector3(diffX, 0, diffZ);
}