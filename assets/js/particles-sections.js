(function() {
    class ParticleNetwork {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particlesArray = [];
            this.mouse = {
                x: null,
                y: null,
                radius: 0
            };

            this.init();
            this.animate();
            this.addEventListeners();
        }

        addEventListeners() {
            window.addEventListener('mousemove', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = event.clientX - rect.left;
                this.mouse.y = event.clientY - rect.top;
            });

            window.addEventListener('resize', () => {
                this.resize();
            });

            window.addEventListener('mouseout', () => {
                this.mouse.x = undefined;
                this.mouse.y = undefined;
            });
        }

        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.mouse.radius = (this.canvas.height / 80) * (this.canvas.width / 80);
            this.init();
        }

        init() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.mouse.radius = (this.canvas.height / 80) * (this.canvas.width / 80);
            
            this.particlesArray = [];
            let numberOfParticles = (this.canvas.height * this.canvas.width) / 15000;
            numberOfParticles = Math.min(numberOfParticles, 100);

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 1.5) + 1;
                let x = Math.random() * (this.canvas.width - size * 2) + size;
                let y = Math.random() * (this.canvas.height - size * 2) + size;
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = '#888888';
                this.particlesArray.push(new Particle(x, y, directionX, directionY, size, color, this));
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.particlesArray.length; i++) {
                this.particlesArray[i].update();
            }
            this.connect();
        }

        connect() {
            let opacityValue = 1;
            for (let a = 0; a < this.particlesArray.length; a++) {
                for (let b = a; b < this.particlesArray.length; b++) {
                    let distance = ((this.particlesArray[a].x - this.particlesArray[b].x) ** 2) +
                        ((this.particlesArray[a].y - this.particlesArray[b].y) ** 2);
                    if (distance < (this.canvas.width / 4.8) * (this.canvas.height / 4.8)) {
                        opacityValue = 0.5 - (distance / 25000);
                        if (opacityValue > 0) {
                            this.ctx.strokeStyle = `rgba(170, 170, 170, ${opacityValue})`;
                            this.ctx.lineWidth = 1;
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.particlesArray[a].x, this.particlesArray[a].y);
                            this.ctx.lineTo(this.particlesArray[b].x, this.particlesArray[b].y);
                            this.ctx.stroke();
                        }
                    }
                }
            }
        }
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color, network) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.network = network;
        }

        draw() {
            this.network.ctx.beginPath();
            this.network.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            this.network.ctx.fillStyle = this.color;
            this.network.ctx.fill();
        }

        update() {
            if (this.x > this.network.canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > this.network.canvas.height || this.y < 0) this.directionY = -this.directionY;

            let dx = this.network.mouse.x - this.x;
            let dy = this.network.mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.network.mouse.radius + this.size) {
                if (this.network.mouse.x < this.x && this.x < this.network.canvas.width - this.size * 10) this.x += 3;
                if (this.network.mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                if (this.network.mouse.y < this.y && this.y < this.network.canvas.height - this.size * 10) this.y += 3;
                if (this.network.mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const canvases = document.querySelectorAll('.particles-canvas');
        canvases.forEach(canvas => {
            new ParticleNetwork(canvas);
        });
    });
})();