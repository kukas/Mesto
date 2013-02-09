function Door(position, dimension,levelName,visible,destination){
	/*
		position - THREE.Vector3
		dimension - {
			type: "circle"/"rect",
			(width: number, height: number)/radius: number
		}
		String levelName
		Boolean visible
	*/
	this.position = position;
	this.destination = destination;
	if(dimension.type == "circle"){
		this.type = "circle";
		this.to = levelName;
		if(visible){
			var geometrie = new THREE.CircleGeometry(dimension.radius,32,0,Math.PI*2);
			var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
			this.mesh = new THREE.Mesh(geometrie,material);
			this.mesh.position = this.position;
		}
		this.radius = dimension.radius;
		var condition = function (dvere,hrac){
			var y = dvere.position.y - hrac.mesh.position.y;
			var x = dvere.position.x - hrac.mesh.position.x;
			var pod = x*x+y*y < dvere.radius*dvere.radius;
			if(pod){ console.log("lze spustit");
				return true;
			}
			else{ console.log("nelze spustit");
				return false;
			}
		};
	}
	if(dimension.type == "rect"){
		this.type = "rect";
		this.to = levelName;
		if(visible){
			var geometrie = new THREE.PlaneGeometry(dimension.width,dimension.height,1,1);
			var material = new THREE.MeshBasicMaterial({wireframe: true,color: 0xff0000});
			this.mesh = new THREE.Mesh(geometrie,material);
			this.mesh.position = position;
		}
		this.width = dimension.widht;
		this.height = dimension.height;
		this.odchX = dimension.width/2;
		this.odchY = dimension.height/2;
		var condition = function (dvere,hrac){
			var y = dvere.position.y-dvere.odchY < hrac.mesh.position.y && dvere.position.y + dvere.odchY > hrac.mesh.position.y;
			var x = dvere.position.x-dvere.odchX < hrac.mesh.position.x && dvere.position.x + dvere.odchX > hrac.mesh.position.x;
			if(x && y){console.log("lze spustit");
				return true;
			}
			else{console.log("nelze spustit");
				return false;
			}
		};
	}
	var action = function (dvere){
			game.scene = new THREE.Scene();
			console.log("entering "+dvere.to);
			game.load(dvere.to,dvere.destination);
		};
	this.actions = {
		onActionKeyDown : [[condition,action]],
	};
	this.tick = function (){
		
	};
};