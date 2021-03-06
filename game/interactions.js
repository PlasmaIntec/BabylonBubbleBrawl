// Keyboard Interactions
var addKeyboardInteractions = (scene, sphere, physicsHelper, map) => {
	var interactions = [
		[' ', () => {
			sphere.fireWeapon();
		}]
	]
	interactions.forEach(interaction => {
		var [key, action] = interaction;
		scene.actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(
				{
					trigger: BABYLON.ActionManager.OnKeyUpTrigger,
					parameter: key
				},
				action
			)
		)
	})

	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));

	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));
	
	window.addEventListener("click", () => {
		sphere.fireWeapon();
	})
}

// Impulse
var pulse = (object, direction) => {
	object.physicsImpostor.applyImpulse(direction, object.getAbsolutePosition());
}

// Bullet Mechanics
var bullets = {};
var fireBullet = (parentMesh, physicsHelper, direction, isFriendly, bulletSize) => {
	var mesh = parentMesh.source || parentMesh;
	var bulletColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
	var bulletPos = mesh.position.clone();
	var bullet = makeBullet(scene, bulletPos.x, bulletPos.y, bulletPos.z, bulletSize, bulletColor, isFriendly);
	bullet.direction = direction;
	var bulletIndex = uniqueId++;
	bullet.bulletIndex = bulletIndex;
	bullets[bulletIndex] = bullet;
	var cancel = setTimeout(() => {
		bullet.dispose();
		var event = physicsHelper.applyRadialExplosionForce( // or .applyRadialExplosionForce
			bullet.position,
			{
				radius: bullet.radius,
				strength: 100,
				falloff: BABYLON.PhysicsRadialImpulseFalloff.Linear, // or BABYLON.PhysicsRadialImpulseFalloff.Constant
			}
		);
		// Debug
		var eventData = event.getData();
		var debugData = showExplosionDebug(eventData);
		setTimeout(function (debugData) {
			hideExplosionDebug(debugData);
			event.dispose(); // we need to cleanup/dispose, after we don't use the data anymore
		}, 1500, debugData);
	}, 2000)
	bullet.cancel = (bullets) => {
		delete bullets[bullet.bulletIndex];
		bullet.dispose();
		clearTimeout(cancel);
	}
}

var fireHomework = (parentMesh, physicsHelper, direction, isFriendly) => {
	var mesh = parentMesh.source || parentMesh;
	var homeworkPos = mesh.position.clone();
	var homework = makeHomework(scene, homeworkPos.x, homeworkPos.y, homeworkPos.z, 10, new BABYLON.Color3.White(), isFriendly);
	homework.direction = direction;
	var bulletIndex = uniqueId++;
	homework.bulletIndex = bulletIndex;
	bullets[bulletIndex] = homework;
	var cancel = setTimeout(() => {
		homework.dispose();
	}, 2000)
	homework.cancel = (bullets) => {
		delete bullets[homework.bulletIndex];
		homework.disposeSprite();
		homework.dispose();
		clearTimeout(cancel);
	}
}