var addPhysics = (mesh, radius) => {
	mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: radius, restitution: 0, friction: 1 }, scene);
	mesh.physicsImpostor.friction = 100;
	return mesh;
}

var addGlow = (mesh, color) => {
	mesh.material.emissiveColor = color;
	return mesh;
}

// Ground
var makeGround = (scene) => {
	var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.specularColor = BABYLON.Color3.Black();
	ground.material = groundMaterial;
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
	return ground;
}

// Sphere
var makeSphere = (scene, x, y, z, r, color) => {
	var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, r, scene);
	var sphereMat = new BABYLON.StandardMaterial("sphere", scene);
	sphereMat.diffuseColor = color;
	sphereMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
	sphere.material = sphereMat;
	sphere.radius = r/2;
	sphere.position = new BABYLON.Vector3(x, y, z);
	sphere.isPickable = false;
	return sphere;
}

// Box
var makeBox = (scene, x, y, z, r, color) => {
	var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
	var boxMat = new BABYLON.StandardMaterial("box", scene);
	boxMat.diffuseColor = color;
	boxMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
	box.material = boxMat;
	box.position = new BABYLON.Vector3(x, y, z);
	return box;
}

// Sphere With Physics
var makeSphereWithPhysics = (scene, x, y, z, r, color) => {	
	return addPhysics(makeSphere(scene, x, y, z, r, color), r);
}

var makeBasicShooter = (scene, x, y, z, r, color) => {	
	var shooter = addPhysics(makeSphere(scene, x, y, z, r, color), r);
	var left = makeSphere(scene, 0, 0, 3, r/2, new BABYLON.Color3(1, 1, 0));
	var right = makeSphere(scene, 0, 0, -3, r/2, new BABYLON.Color3(1, 1, 0));
	left.parent = shooter;
	right.parent = shooter;

	return shooter;
}

var makeShooter = (scene, x, y, z, r, color) => {	
	return addPhysics(makeSphere(scene, x, y, z, r, color), r);
}

// Bullet
var makeBullet = (scene, x, y, z, r, color) => {
	return addGlow(makeSphere(scene, x, y, z, r, color), color);
}