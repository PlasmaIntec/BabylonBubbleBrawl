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

// Particle System
var addParticleSystem = (mesh, scene) => {
	// Create a particle system
	var particleSystem = new BABYLON.ParticleSystem("particles", 200, scene);

	//Texture of each particle
	particleSystem.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/flare.png", scene);

	// Where the particles come from
	particleSystem.emitter = mesh; // the starting object, the emitter
	// particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
	// particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

	// Colors of all particles
	particleSystem.color1 = new BABYLON.Color4(0.06, 1, 1);
	particleSystem.color2 = new BABYLON.Color4(0.78, 0.04, 1);
	particleSystem.colorDead = new BABYLON.Color4(0.04, 0.03, 1);

	// Size of each particle (random between...
	particleSystem.minSize = 1;
	particleSystem.maxSize = 5;

	// Life time of each particle (random between...
	particleSystem.minLifeTime = 0.3;
	particleSystem.maxLifeTime = 1.5;

	// Emission rate
	particleSystem.emitRate = 1500;

	// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
	particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

	// Set the gravity of all particles
	particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

	// Direction of each particle after it has been emitted
	particleSystem.direction1 = new BABYLON.Vector3(-7, 0, 3);
	particleSystem.direction2 = new BABYLON.Vector3(7, 0, -3);

	// Angular speed, in radians
	particleSystem.minAngularSpeed = 0;
	particleSystem.maxAngularSpeed = Math.PI;

	// Speed
	particleSystem.minEmitPower = 1;
	particleSystem.maxEmitPower = 10;
	particleSystem.updateSpeed = 0.005;

	mesh.particleSystem = particleSystem;

	return mesh;
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

// Basic Enemy
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
			fireBullet(shooter, physicsHelper, player.position.subtract(shooter.position), false);
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
	
	shooter.health = 10;
	var takeDamage = damage => {
		shooter.health -= damage;
		if (shooter.health < 0) {
			shooter.cancelActions();
			shooter.dispose();
			return true;
		}
		return false;
	}
	shooter.takeDamage = takeDamage;

	shooter.passiveMove = (sphere) => {
		shooter.rotation = getAnglePointingAt(shooter.position, sphere.position)
	}

	return shooter;
}

var makeFosterCylinder = (scene, x, y, z, r, color) => {
	var canMaterial = new BABYLON.StandardMaterial("material", scene);
	canMaterial.diffuseTexture = new BABYLON.Texture("https://avatars1.githubusercontent.com/u/1577872?s=400&v=4", scene)
	
	var faceUV = [];
	faceUV[0] =	new BABYLON.Vector4(0, 0, 0, 0);
    faceUV[1] =	new BABYLON.Vector4(1, 0, 0.32, 1);

    var faceColors = [ ];
    faceColors[0] = new BABYLON.Color4(0.5, 0.5, 0.5, 1)
	
	var can = BABYLON.MeshBuilder.CreateCylinder("can", {diameter: r, height:1, faceUV: faceUV, faceColors: faceColors}, scene);
	can.material = canMaterial;
	can.position = new BABYLON.Vector3(x, y, z);

	return can;
}

// Foster Enemy
var makeFoster = (scene, x, y, z, r, color, player, physicsHelper) => {	
	var shooter = addPhysics(makeFosterCylinder(scene, x, y, z, r, color), r);

	shooter.actions = {};

	var fireAtWill = () => {
		var time = 5000*Math.random();
		var cancel = setTimeout(() => {
			fireHomework(shooter, physicsHelper, player.position.subtract(shooter.position), false);
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
	// moveAtWill();

	shooter.cancelActions = () => {
		for (action in shooter.actions) {
			clearTimeout(shooter.actions[action]);
		}
	}
	
	shooter.health = 10;
	var takeDamage = damage => {
		shooter.health -= damage;
		if (shooter.health < 0) {
			for (var i = 0; i < 2*Math.PI; i += Math.PI/4) {
				fireHomework(shooter, physicsHelper, new BABYLON.Vector3(Math.cos(i), 0, Math.sin(i)), false);
			}
			shooter.cancelActions();
			shooter.dispose();
			return true;
		}
		return false;
	}
	shooter.takeDamage = takeDamage;

	shooter.passiveMove = (sphere) => {
		var randomRotation = new BABYLON.Vector3(.1*Math.random(), .1*Math.random(), .1*Math.random());
		shooter.rotation = shooter.rotation.add(randomRotation)
	}

	return shooter;
}


// Bullet
var makeBullet = (scene, x, y, z, r, color, isFriendly) => {
	var bullet = addGlow(makeSphere(scene, x, y, z, r, color), color);
	bullet.isFriendly = isFriendly;

	return bullet;
}

var makeHomework = (scene, x, y, z, r, color, isFriendly) => {
	var homework = makeSphere(scene, x, y, z, r, color);
	homework.isFriendly = isFriendly;

	// Sprite
	var link = "https://i.imgur.com/27jBQDR.png";
	var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager",link, 100, 500, scene);
	var sprite = new BABYLON.Sprite("sprite", spriteManagerPlayer);
	sprite.position = homework.position;
	sprite.width = 12;
	sprite.height = 12;

	homework.isVisible = false;
	homework.update = (time, self) => sprite.position = self.position;
	homework.disposeSprite = () => sprite.dispose();

	return homework;
}