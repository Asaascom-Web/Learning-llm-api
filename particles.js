/**
 * Particle Animation System
 * Creates an animated background with floating particles and connections
 * Educational: Demonstrates canvas API and animation loops
 */

class ParticleSystem {
    constructor(canvasId) {
        // Get canvas element and set up context
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Particle array
        this.particles = [];
        
        // Configuration
        this.config = {
            particleCount: 80,           // Number of particles
            particleSize: 2,             // Size of each particle
            particleSpeed: 0.5,          // Movement speed
            connectionDistance: 150,      // Max distance for connections
            particleColor: 'rgba(88, 166, 255, 0.8)',  // GitHub blue
            lineColor: 'rgba(88, 166, 255, 0.2)',
            glowColor: 'rgba(88, 166, 255, 0.4)'
        };
        
        // Set canvas size
        this.resize();
        
        // Initialize particles
        this.init();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }
    
    /**
     * Resize canvas to match window size
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    /**
     * Initialize particles with random positions and velocities
     */
    init() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                // Random position
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                
                // Random velocity
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                
                // Random size variation
                size: this.config.particleSize * (0.5 + Math.random() * 0.5)
            });
        }
    }
    
    /**
     * Update particle positions
     */
    updateParticles() {
        for (let particle of this.particles) {
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }
    }
    
    /**
     * Draw a single particle
     */
    drawParticle(particle) {
        this.ctx.beginPath();
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.config.glowColor;
        
        // Draw particle
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.particleColor;
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
    
    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Draw line if particles are close enough
                if (distance < this.config.connectionDistance) {
                    // Opacity based on distance
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.config.lineColor.replace('0.2', opacity * 0.2);
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    /**
     * Main animation loop
     */
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw
        this.updateParticles();
        this.drawConnections();
        
        for (let particle of this.particles) {
            this.drawParticle(particle);
        }
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Add interactive effect on mouse move
     */
    addMouseInteraction() {
        this.canvas.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Push particles away from mouse
            for (let particle of this.particles) {
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += (dx / distance) * force * 0.5;
                    particle.vy += (dy / distance) * force * 0.5;
                }
            }
        });
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem('particleCanvas');
    
    // Optional: Add mouse interaction
    particleSystem.addMouseInteraction();
});

