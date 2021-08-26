var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var person_image = new Image();
var bg = new Image();

person_image.src = "img/Person.png";
bg.src = "img/bg.jpg";

person_proporties = {
	speedHer		: 	2,
	speedPre		: 	2.5, 
	bgColorHer		: 	'rgba(10, 255, 15, 1)',
	bgColorPre		: 	'rgba(255, 19, 15, 1)',
	radius			: 	10,
	radiusEating	: 	2,
	radiusViewHer	: 	500,
	radiusViewPre	: 	70
}

eating_proporties = {
	bgColor 		: 	'rgba(9, 0, 130, 1)',
	radius			: 	5,
	count 			: 	100,
	eatSize			: 	5

};

var eating = [];
var animal = [];
var predator = [];
var count = 0;
var countanimal = 0;
var countpredator = 0;
var countdeadher = 0;
var countdeadpre = 0;
var px = Math.random()*cvs.width;
var py = Math.random()*cvs.height;

class Particle{
	constructor(){
		this.x = Math.random()*cvs.width;
		this.y = Math.random()*cvs.height;
	}

	Draw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, eating_proporties.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = eating_proporties.bgColor;
		ctx.fill();
	}

	Eating(){
		this.x = Math.random()*cvs.width;
		this.y = Math.random()*cvs.height;
	}
};

class Animal{
	constructor(x, y){
		this.hungry = 100;
		this.Padx = x;
		this.Pady = y;
		this.xx = 0;
		this.yy = 0;
	};

	MoveTo(speed){
		if (this.Padx > this.xx){
			this.Padx -= Math.random() * speed;
		}else{
			this.Padx += Math.random() * speed;
		}

		if (this.Pady > this.yy){
			this.Pady -= Math.random() * speed;
		}else{
			this.Pady += Math.random() * speed;
		}
	};

	Hungry(){
		this.hungry -= Math.random() / 10;
	};

	Eating(){
		this.hungry += eating_proporties.eatSize;
	};

	NeiroNet(){

	};
}

class Herbivore extends Animal{
	Draw(){
		ctx.beginPath();
		ctx.arc(this.Padx, this.Pady, person_proporties.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = person_proporties.bgColorHer;
		ctx.fill();
	};
	Hunter(){
		var size;
		var min_size = person_proporties.radiusViewHer;
		for (var i = 0; i < eating_proporties.count; i++){
			size = Math.sqrt(Math.pow(eating[i].x-this.Padx,2)+Math.pow(eating[i].y-this.Pady,2));
			if (min_size > size){
				min_size = size;
				this.xx = eating[i].x;
				this.yy = eating[i].y;
			}
		}

		//if (min_size = person_proporties.radiusViewPre){
		//	this.xx = Math.random() * cvs.width;
		//	this.yy = Math.random() * cvs.height;
		//}
	};

	Del(){
		if(this.hungry > 200){
			this.hungry -= 100;
			animal.push(new Herbivore(this.Padx, this.Pady))
		}
	};

	Life(){
		this.Draw();
		this.Hunter();
		this.MoveTo(person_proporties.speedHer);
		this.Del();
		this.Hungry();
	};

	Dead(){
		countdeadher++;
	};
};

class Predator extends Animal{
	Draw(){
		ctx.beginPath();
		ctx.arc(this.Padx, this.Pady, person_proporties.radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = person_proporties.bgColorPre;
		ctx.fill();
	};

	Hunter(){
		var size;
		var min_size = person_proporties.radiusViewPre;
		for (var i = 0; i < eating_proporties.count; i++){
			size = Math.sqrt(Math.pow(eating[i].x-this.Padx,2)+Math.pow(eating[i].y-this.Pady,2));
			if (min_size > size){
				min_size = size;
				this.xx = eating[i].x;
				this.yy = eating[i].y;
			}
		}

		if (min_size == person_proporties.radiusViewPre){
			this.xx = Math.random() * cvs.width;
			this.yy = Math.random() * cvs.height;
		}
	};

	Del(){
		if(this.hungry > 200){
			this.hungry -= 100;
			predator.push(new Predator(this.Padx, this.Pady))
		}
	};

	Life(){
		this.Draw();
		this.Hunter();
		this.MoveTo(person_proporties.speedPre);
		this.Del();
		this.Hungry();
	};

	Dead(){
		countdeadpre++;
	};
}

for (var i = 0; i < 3; i++){
	predator[i] = new Predator(Math.random()*cvs.width, Math.random()*cvs.height);
	animal[i] = new Herbivore(Math.random()*cvs.width, Math.random()*cvs.height);
}

for(var i = 0; i < eating_proporties.count; i++){
	eating[i] = new Particle();
}

function draw(){
	ctx.drawImage(bg, 0, 0);
	for(var i = 0; i < eating_proporties.count; i++){
		eating[i].Draw();
	}
	countanimal = 0;
	countpredator = 0;
	for (var i in animal){
		countanimal++;
		animal[i].Life();
		if (animal[i].Pady>cvs.height){
			animal[i].Pady-=10; 
		}
		if (animal[i].Padx>cvs.width){
			animal[i].Padx-=10; 
		}
		if (animal[i].Pady<0){
			animal[i].Pady+=10; 
		}
		if (animal[i].Padx<0){
			animal[i].Padx+=10; 
		}
		for (var j = 0; j < eating_proporties.count; j++){
			if (Math.sqrt(Math.pow(animal[i].Padx - eating[j].x, 2) + Math.pow(animal[i].Pady - eating[j].y, 2)) < person_proporties.radiusEating){
				animal[i].Eating();
				eating[j].Eating();
				count++;
			}
		}
		if (animal[i].hungry < 0){
			animal[i].Dead();
			delete animal[i];
		}
	}

	for (var i in predator){
		countpredator++;
		predator[i].Life();
		if (predator[i].Pady>cvs.height){
			predator[i].Pady-=10; 
		}
		if (predator[i].Padx>cvs.width){
			predator[i].Padx-=10; 
		}
		if (predator[i].Pady<0){
			predator[i].Pady+=10; 
		}
		if (predator[i].Padx<0){
			predator[i].Padx+=10; 
		}
		for (var j = 0; j < eating_proporties.count; j++){
			if (Math.sqrt(Math.pow(predator[i].Padx - eating[j].x, 2) + Math.pow(predator[i].Pady - eating[j].y, 2)) < person_proporties.radiusEating){
				predator[i].Eating();
				eating[j].Eating();
				count++;
			}
		}
		if (predator[i].hungry < 0){
			predator[i].Dead();
			delete predator[i];
		}
	}
	hungry.textContent = countpredator;
	eat.textContent = count;
	info.textContent = countanimal;
	dead.textContent = countdeadher;
	deadpre.textContent = countdeadpre;
	requestAnimationFrame(draw);
}
draw();