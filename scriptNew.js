const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle  = '#FFFFE0';
// ctx.shadowBlur = 10;
// ctx.shadowColor = 'rgba(0,0,0,0.5)';

let radius = 0.5*((canvas.width/70) * (canvas.height/70));
let thresh = 1.5*radius;
let load_radius = thresh; //Now load_radius is just threshold.
let proportion = 1.3*radius; //100;
console.log(proportion);


let particlesArray;

class lightP {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = -.5 + Math.random();
        this.directionY = -.5 + Math.random();
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 10) + 2;
    }
    //method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fill();
        ctx.arc(this.x, this.y, thresh, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.arc(this.x, this.y, load_radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = '#FFFFE0';
    }
    //check particle position, check mouse position,
    //move the particle, draw the particle
    update() {
        //check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0 ) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0 ) {
            this.directionY = -this.directionY;
        }
    //move the particle
    this.x += (this.directionX * 1);
    this.y += (this.directionY * 1);

    //draw particle
    this.draw();
    }
}


class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = -.5 + Math.random();
        this.directionY = -.5 + Math.random();
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 10) + 2;
    }
    //method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
    }
    //check particle position, check mouse position,
    //move the particle, draw the particle
    update() {
        //check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0 ) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0 ) {
            this.directionY = -this.directionY;
        }

        //move the particle
        this.x += this.directionX * 0.25;
        this.y += this.directionY * 0.25;
        //draw particle
        this.draw();
    }
}

//create particle array
function init(time) {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 2500;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random();
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#FFFFE0';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

//create lightfx array
function light() {
    lightArray = [];
    let numberLights = 10;
    for (let i = 0; i < numberLights; i++) {
        let size = 10;//Math.random();
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;


        lightArray.push(new lightP(x, y, directionX, directionY, size));

    }
}

//opacity should be measured from the distance between light source and furthest point.. if within boundary
//check if particles are close enough to draw line between them
function connect(){
    let opacityValue = 1;

    for (let i = 0; i < lightArray.length; i++) {
        let affectedParticles = [];
        let affectedLengths = [];
        for (let j = 0; j < particlesArray.length; j++) {
            let light_distance = Math.hypot((particlesArray[j].x - lightArray[i].x), (particlesArray[j].y - lightArray[i].y));
            if (light_distance < load_radius){
                affectedParticles.push(particlesArray[j]);
                affectedLengths.push(light_distance);
            }
        }
        for (let a = 0; a < affectedParticles.length; a++) {
            for (let b = a; b < affectedParticles.length; b++) {
                let particle_distance = Math.hypot((affectedParticles[a].x - affectedParticles[b].x), (affectedParticles[a].y - affectedParticles[b].y));
                if (affectedLengths[a] < radius) {
					if (affectedLengths[b] < radius) {
						opacityValue = 1 - (particle_distance/proportion);
						ctx.strokeStyle='rgba(255,255,224,' + opacityValue + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(affectedParticles[a].x, affectedParticles[a].y);
						ctx.lineTo(affectedParticles[b].x, affectedParticles[b].y);
						ctx.stroke();
					}
                    else if (affectedLengths[b] < thresh){
						opacityValue = ((thresh-affectedLengths[b])/(thresh-radius))*(1 - (particle_distance/proportion));
						ctx.strokeStyle='rgba(255,255,224,' + opacityValue + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(affectedParticles[a].x, affectedParticles[a].y);
						ctx.lineTo(affectedParticles[b].x, affectedParticles[b].y);
						ctx.stroke();
					}
                }
                else if (affectedLengths[a] < thresh) {
					if (affectedLengths[b] < radius) {
						opacityValue = ((thresh-affectedLengths[a])/(thresh-radius))*(1 - (particle_distance/proportion));
						ctx.strokeStyle='rgba(255,255,224,' + opacityValue + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(affectedParticles[a].x, affectedParticles[a].y);
						ctx.lineTo(affectedParticles[b].x, affectedParticles[b].y);
						ctx.stroke();
					}
					else {
						let furthest = Math.max(affectedLengths[a],affectedLengths[b]);
						opacityValue = ((thresh-furthest)/(thresh-radius))*(1 - (particle_distance/proportion));
						ctx.strokeStyle='rgba(255,255,224,' + opacityValue + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(affectedParticles[a].x, affectedParticles[a].y);
						ctx.lineTo(affectedParticles[b].x, affectedParticles[b].y);
						ctx.stroke();
					}
                }
            }
        }

    }
}

//animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    for (let i = 0; i < lightArray.length; i++) {
        lightArray[i].update();
    }
    connect();
}

window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        //mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    })

init();

light();

animate();
