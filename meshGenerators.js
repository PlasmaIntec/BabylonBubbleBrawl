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
var makeGround = (scene, x, y, z) => {
	var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
	ground.position = new BABYLON.Vector3(x, y, z);
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

var makeNuisance = (scene, x, y, z, r, color, player, physicsHelper) => {	
	var shooter = addPhysics(makeSphere(scene, x, y, z, r, color), r);
	var leftAngle = 4*Math.PI/3;
	var rightAngle = 5*Math.PI/3;
	var left = makeSphere(scene, 3*Math.cos(leftAngle), 0, 3*Math.sin(leftAngle), r/2, color);
	var right = makeSphere(scene, 3*Math.cos(rightAngle), 0, 3*Math.sin(rightAngle), r/2, color);
	left.parent = shooter;
	right.parent = shooter;

	shooter.actions = {};

	var fireAtWill = () => {
		var time = 5000*Math.random();
		var cancel = setTimeout(() => {
			fireBullet(shooter, physicsHelper, player.position.subtract(shooter.position));
			fireAtWill();
		}, time);
		shooter.actions.fire = cancel;
	}

	var moveAtWill = () => {
		var time = 1000*Math.random();
		var direction = new BABYLON.Vector3(20*Math.random()-10, 0, 20*Math.random()-10);
		var cancel = setTimeout(() => {
			pulse(shooter, direction);
			moveAtWill();
		}, time);
		shooter.actions.move = cancel;
	}

	fireAtWill();
	moveAtWill();

	shooter.cancelActions = () => {
		for (action in shooter.actions) {
			clearTimeout(shooter.actions[action]);
		}
	}

	return shooter;
}

// Bullet
var makeBullet = (scene, x, y, z, r, color) => {
	return addGlow(makeSphere(scene, x, y, z, r, color), color);
}