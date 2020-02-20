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