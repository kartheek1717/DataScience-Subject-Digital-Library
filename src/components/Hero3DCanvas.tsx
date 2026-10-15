import React, { useEffect, useRef } from 'react';

interface Hero3DCanvasProps {
  className?: string;
  mousePos: { x: number; y: number };
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ className = '', mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate 3D Vertices for a Geodesic Data Sphere / Neural Cluster
    const radius = Math.min(width, height) * 0.32;
    const nodeCount = 32;
    const nodes: Point3D[] = [];

    // Golden spiral on sphere (Fibonacci sphere distribution)
    const phi = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 radians
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      nodes.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        origX: x * radius,
        origY: y * radius,
        origZ: z * radius,
      });
    }

    // Floating background particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: (Math.random() - 0.5) * 400,
      size: Math.random() * 2 + 1,
      speedZ: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.4 ? '#38bdf8' : '#22d3ee',
    }));

    // Orbiting satellites
    const satellites = [
      { angle: 0, speed: 0.022, ringRadius: radius * 1.35, tilt: 0.45, color: '#38bdf8', size: 3.5 },
      { angle: Math.PI, speed: 0.018, ringRadius: radius * 1.5, tilt: -0.6, color: '#67e8f9', size: 4 },
      { angle: Math.PI / 2, speed: 0.025, ringRadius: radius * 1.2, tilt: 1.1, color: '#ffffff', size: 3 },
    ];

    let rotX = 0.2;
    let rotY = 0;
    let targetRotX = 0.2;
    let targetRotY = 0;

    const fov = 480;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interaction
      targetRotY += 0.007 + mousePos.x * 0.0004;
      targetRotX = 0.25 + mousePos.y * 0.0006;
      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Center of 3D projection on the left/center canvas
      const centerX = width * 0.58;
      const centerY = height * 0.5;

      // 1. Draw subtle 3D background drifting particles
      particles.forEach((p) => {
        p.z -= p.speedZ;
        if (p.z < -200) p.z = 200;

        const scale = fov / (fov + p.z);
        const px = centerX + p.x * scale;
        const py = centerY + p.y * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.max(0.08, Math.min(0.5, (p.z + 200) / 400));
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      // 2. Rotate & Project Spherical Nodes
      const projectedNodes: { x: number; y: number; z: number; scale: number; alpha: number }[] = [];

      nodes.forEach((node) => {
        // Rotate around Y
        const x1 = node.origX * cosY - node.origZ * sinY;
        const z1 = node.origZ * cosY + node.origX * sinY;

        // Rotate around X
        const y2 = node.origY * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.origY * sinX;

        // Save position
        node.x = x1;
        node.y = y2;
        node.z = z2;

        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const alpha = Math.max(0.15, Math.min(0.9, (z2 + radius) / (radius * 2)));

        projectedNodes.push({ x: projX, y: projY, z: z2, scale, alpha });
      });

      // 3. Connect nearest vertices with 3D glowing edges
      const maxDist = radius * 0.72;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDist) {
            const avgZ = (nodes[i].z + nodes[j].z) / 2;
            const lineAlpha = (1 - dist / maxDist) * Math.max(0.08, Math.min(0.45, (avgZ + radius) / (radius * 2)));

            ctx.beginPath();
            ctx.moveTo(projectedNodes[i].x, projectedNodes[i].y);
            ctx.lineTo(projectedNodes[j].x, projectedNodes[j].y);
            ctx.strokeStyle = avgZ > 0 ? 'rgba(56, 189, 248, ' + lineAlpha + ')' : 'rgba(34, 211, 238, ' + lineAlpha * 0.6 + ')';
            ctx.lineWidth = avgZ > 0 ? 1.2 : 0.7;
            ctx.stroke();
          }
        }
      }

      // 4. Draw Orbiting 3D Rings & Satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        const ringSteps = 48;

        // Draw orbital trail
        ctx.beginPath();
        for (let s = 0; s <= ringSteps; s++) {
          const stepAngle = (s / ringSteps) * Math.PI * 2;
          const rx = Math.cos(stepAngle) * sat.ringRadius;
          const ry = Math.sin(stepAngle) * sat.ringRadius * Math.sin(sat.tilt);
          const rz = Math.sin(stepAngle) * sat.ringRadius * Math.cos(sat.tilt);

          // Rotate with scene
          const x1 = rx * cosY - rz * sinY;
          const z1 = rz * cosY + rx * sinY;
          const y2 = ry * cosX - z1 * sinX;
          const z2 = z1 * cosX + ry * sinX;

          const scale = fov / (fov + z2);
          const px = centerX + x1 * scale;
          const py = centerY + y2 * scale;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.16)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw active satellite on ring
        const satX = Math.cos(sat.angle) * sat.ringRadius;
        const satY = Math.sin(sat.angle) * sat.ringRadius * Math.sin(sat.tilt);
        const satZ = Math.sin(sat.angle) * sat.ringRadius * Math.cos(sat.tilt);

        const sx1 = satX * cosY - satZ * sinY;
        const sz1 = satZ * cosY + satX * sinY;
        const sy2 = satY * cosX - sz1 * sinX;
        const sz2 = sz1 * cosX + satY * sinX;

        const satScale = fov / (fov + sz2);
        const satPx = centerX + sx1 * satScale;
        const satPy = centerY + sy2 * satScale;

        // Glowing satellite core
        const satGlow = ctx.createRadialGradient(satPx, satPy, 0, satPx, satPy, sat.size * 3 * satScale);
        satGlow.addColorStop(0, sat.color);
        satGlow.addColorStop(0.4, 'rgba(56, 189, 248, 0.8)');
        satGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.beginPath();
        ctx.arc(satPx, satPy, sat.size * 3 * satScale, 0, Math.PI * 2);
        ctx.fillStyle = satGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(satPx, satPy, sat.size * satScale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // 5. Draw Vertices / Nodes
      projectedNodes.forEach((node) => {
        const glowRadius = Math.max(2, 6 * node.scale);
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, 'rgba(56, 189, 248, ' + node.alpha + ')');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Solid crisp center point
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1.2, 2 * node.scale), 0, Math.PI * 2);
        ctx.fillStyle = node.z > 0 ? '#e0f2fe' : '#38bdf8';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.25))' }}
    />
  );
};
