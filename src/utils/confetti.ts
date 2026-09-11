// Pure Canvas Confetti System without external libraries

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRotation: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
  life: number;
  maxLife: number;
}

class ConfettiEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private isRunning: boolean = false;
  private animId: number = 0;

  private colors = [
    '#f43f5e', // rose
    '#ec4899', // pink
    '#a855f7', // purple
    '#6366f1', // indigo
    '#38bdf8', // sky
    '#34d399', // emerald
    '#fbbf24', // amber
    '#f97316', // orange
    '#ffffff', // white
  ];

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  public destroy() {
    window.removeEventListener('resize', this.resize);
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
    this.particles = [];
    this.isRunning = false;
  }

  private resize = () => {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  public burst(count: number = 100, originX?: number, originY?: number) {
    if (!this.canvas) return;
    const x = originX ?? this.canvas.width / 2;
    const y = originY ?? this.canvas.height * 0.6;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 6 + Math.random() * 16;
      const shapeType = Math.random() > 0.6 ? 'rect' : Math.random() > 0.3 ? 'circle' : 'star';

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.5),
        vy: (Math.sin(angle) * speed - 5) * (0.8 + Math.random() * 0.5),
        size: 5 + Math.random() * 9,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 12,
        shape: shapeType,
        opacity: 1,
        life: 0,
        maxLife: 100 + Math.random() * 60,
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  public grandFinale() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Launch from multiple points: left, center, right
    this.burst(70, w * 0.2, h * 0.7);
    this.burst(90, w * 0.5, h * 0.55);
    this.burst(70, w * 0.8, h * 0.7);

    setTimeout(() => {
      this.burst(60, w * 0.35, h * 0.6);
      this.burst(60, w * 0.65, h * 0.6);
    }, 400);

    setTimeout(() => {
      this.burst(80, w * 0.5, h * 0.5);
    }, 800);
  }

  private drawStar(ctx: CanvasRenderingContext2D, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
      ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2));
    }
    ctx.closePath();
    ctx.fill();
  }

  private loop = () => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.vRotation;

      if (p.life > p.maxLife * 0.7) {
        p.opacity = Math.max(0, 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3));
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.drawStar(this.ctx, p.size * 0.8);
      }

      this.ctx.restore();

      if (p.life >= p.maxLife || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.loop);
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };
}

export const confettiEngine = new ConfettiEngine();
