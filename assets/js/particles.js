const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 12) this.x += 10;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 12) this.y += 10;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // Cap the number of particles to ensure high performance on large screens
    let baseAmount = (canvas.height * canvas.width) / 25000;
    let numberOfParticles = Math.min(baseAmount, 120); 
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 1;
        let x = Math.random() * (canvas.width - size * 1) + size;
        let y = Math.random() * (canvas.height - size * 1) + size;
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#888888';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) +
                ((particlesArray[a].y - particlesArray[b].y) ** 2);
            if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                opacityValue = 0.7 - (distance / 20000);
                ctx.strokeStyle = 'rgba(170, 170, 170,' + opacityValue + ')'; // cinza claro
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.width / 80));
    init();
});

window.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();
