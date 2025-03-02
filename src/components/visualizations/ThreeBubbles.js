import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import "./ThreeBubbles.css";

const ThreeBubbles = ({ totalBubbles, bubblesPopped, isTimeUp }) => {
  const containerRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [bubbles, setBubbles] = useState([]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xe8f4ff);

    // Setup camera
    const newCamera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    newCamera.position.z = 15;

    // Setup renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(newRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    newScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    newScene.add(directionalLight);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      newCamera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && newRenderer.domElement) {
        containerRef.current.removeChild(newRenderer.domElement);
      }
    };
  }, []);

  // Create bubbles when totalBubbles changes
  useEffect(() => {
    if (!scene || totalBubbles <= 0) return;

    // Clear existing bubbles
    bubbles.forEach((bubble) => {
      if (bubble.mesh) {
        scene.remove(bubble.mesh);
        bubble.mesh.geometry.dispose();
        bubble.mesh.material.dispose();
      }
    });

    // Create bubbles
    const newBubbles = [];
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    for (let i = 0; i < totalBubbles; i++) {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x8fb8de,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Position bubbles in a circle pattern
      const angle = (i / totalBubbles) * Math.PI * 2;
      const radius = Math.min(6, totalBubbles * 0.4);

      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;
      mesh.position.z = 0;

      scene.add(mesh);

      // Add text label (number)
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(i + 1, 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(0.5, 0.5, 0.5);
      mesh.add(label);

      newBubbles.push({
        mesh,
        label,
        index: i,
        popped: false,
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatPhase: Math.random() * Math.PI * 2,
      });
    }

    setBubbles(newBubbles);
  }, [scene, totalBubbles]);

  // Handle bubble popping
  useEffect(() => {
    bubbles.forEach((bubble, i) => {
      if (i >= totalBubbles - bubblesPopped && !bubble.popped) {
        bubble.popped = true;

        // Animate the bubble popping
        const popAnimation = { scale: 1 };
        const animate = () => {
          popAnimation.scale -= 0.05;

          if (popAnimation.scale <= 0) {
            bubble.mesh.scale.set(0, 0, 0);
            return;
          }

          bubble.mesh.scale.set(
            popAnimation.scale,
            popAnimation.scale,
            popAnimation.scale
          );

          requestAnimationFrame(animate);
        };

        // Start popping with a delay based on the bubble index
        setTimeout(() => {
          animate();
        }, 200 * i);
      }
    });
  }, [bubbles, bubblesPopped, totalBubbles]);

  // Animation loop
  useEffect(() => {
    if (!scene || !camera || !renderer) return;

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Animate bubbles
      bubbles.forEach((bubble) => {
        if (!bubble.popped) {
          // Floating animation
          bubble.mesh.position.y +=
            Math.sin(
              Date.now() * 0.001 * bubble.floatSpeed + bubble.floatPhase
            ) * 0.01;
          bubble.mesh.rotation.y += 0.005;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [scene, camera, renderer, bubbles]);

  return <div ref={containerRef} className="three-bubbles-container" />;
};

export default ThreeBubbles;
