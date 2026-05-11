import React from 'react';

interface Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
  draw: () => void;
  update: () => void;
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 200 };

    function makeParticle(x: number, y: number, directionX: number, directionY: number, size: number, color: string): Particle {
      return {
        x, y, directionX, directionY, size, color,
        draw() {
          ctx!.beginPath();
          ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
          ctx!.fillStyle = this.color;
          ctx!.fill();
        },
        update() {
          if (this.x > canvas!.width || this.x < 0) this.directionX = -this.directionX;
          if (this.y > canvas!.height || this.y < 0) this.directionY = -this.directionY;

          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
              const force = (mouse.radius - distance) / mouse.radius;
              this.x -= (dx / distance) * force * 5;
              this.y -= (dy / distance) * force * 5;
            }
          }

          this.x += this.directionX;
          this.y += this.directionY;
          this.draw();
        },
      };
    }

    function init() {
      particles = [];
      const count = (canvas!.height * canvas!.width) / 9000;
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas!.width - size * 4) + size * 2;
        const y = Math.random() * (canvas!.height - size * 4) + size * 2;
        const directionX = (Math.random() * 0.4) - 0.2;
        const directionY = (Math.random() * 0.4) - 0.2;
        particles.push(makeParticle(x, y, directionX, directionY, size, 'rgba(245, 158, 11, 0.8)'));
      }
    }

    function connect() {
      const thresholdX = canvas!.width / 7;
      const thresholdY = canvas!.height / 7;
      const threshold = thresholdX * thresholdY;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;

          if (distance < threshold) {
            const opacity = 1 - distance / 20000;

            let nearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              const dxA = particles[a].x - mouse.x;
              const dyA = particles[a].y - mouse.y;
              nearMouse = Math.sqrt(dxA * dxA + dyA * dyA) < mouse.radius;
            }

            ctx!.strokeStyle = nearMouse
              ? `rgba(255, 200, 80, ${opacity})`
              : `rgba(245, 158, 11, ${opacity * 0.5})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      // app background: hsl(24 10% 4%) ≈ rgb(11, 9, 7)
      ctx!.fillStyle = 'rgb(11, 9, 7)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) p.update();
      connect();
    }

    function resizeCanvas() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function handleMouseOut() {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;
