import * as THREE from 'three';

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.scrollY = 0;
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0f, 1, 15);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particle system
        this.createParticles();

        // Create geometric shapes
        this.createGeometry();

        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));

        // Start animation loop
        this.animate();
    }

    createParticles() {
        // Create canvas textures for "1" and "0"
        const canvas1 = document.createElement('canvas');
        canvas1.width = 64;
        canvas1.height = 64;
        const ctx1 = canvas1.getContext('2d');
        ctx1.fillStyle = '#00ff00';
        ctx1.font = 'bold 48px monospace';
        ctx1.textAlign = 'center';
        ctx1.textBaseline = 'middle';
        ctx1.fillText('1', 32, 32);
        const texture1 = new THREE.CanvasTexture(canvas1);

        const canvas0 = document.createElement('canvas');
        canvas0.width = 64;
        canvas0.height = 64;
        const ctx0 = canvas0.getContext('2d');
        ctx0.fillStyle = '#00ff00';
        ctx0.font = 'bold 48px monospace';
        ctx0.textAlign = 'center';
        ctx0.textBaseline = 'middle';
        ctx0.fillText('0', 32, 32);
        const texture0 = new THREE.CanvasTexture(canvas0);

        // Create sprite materials
        const material1 = new THREE.SpriteMaterial({
            map: texture1,
            transparent: true,
            opacity: 0.7,
        });

        const material0 = new THREE.SpriteMaterial({
            map: texture0,
            transparent: true,
            opacity: 0.7,
        });

        // Create binary digit sprites
        this.binarySprites = [];
        const spriteCount = 1000;

        for (let i = 0; i < spriteCount; i++) {
            const material = i % 2 === 0 ? material1.clone() : material0.clone();
            const sprite = new THREE.Sprite(material);

            // Random position
            sprite.position.x = (Math.random() - 0.5) * 20;
            sprite.position.y = (Math.random() - 0.5) * 20;
            sprite.position.z = (Math.random() - 0.5) * 20;

            // Random scale
            const scale = Math.random() * 0.3 + 0.2;
            sprite.scale.set(scale, scale, 1);

            // Store rotation speed
            sprite.userData.rotationSpeed = (Math.random() - 0.5) * 0.05;

            this.binarySprites.push(sprite);
            this.scene.add(sprite);
        }
    }

    createGeometry() {
        // Create glowing sun/star
        const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00, // Green to match robot eyes
            emissive: 0x00ff00,
            emissiveIntensity: 1,
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(0, 0, -5);
        this.scene.add(this.sun);

        // Add sun rays/corona effect
        const raysGeometry = new THREE.SphereGeometry(2.5, 32, 32);
        const raysMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            wireframe: true,
        });
        this.sunRays = new THREE.Mesh(raysGeometry, raysMaterial);
        this.sunRays.position.copy(this.sun.position);
        this.scene.add(this.sunRays);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add point light from sun
        const pointLight = new THREE.PointLight(0x00ff00, 2, 100);
        pointLight.position.copy(this.sun.position);
        this.scene.add(pointLight);
    }

    onMouseMove(event) {
        this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onScroll() {
        this.scrollY = window.scrollY;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Smooth mouse following
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Animate binary sprites
        if (this.binarySprites) {
            this.binarySprites.forEach((sprite, i) => {
                // Rotate sprites
                sprite.material.rotation += sprite.userData.rotationSpeed;

                // Floating effect
                sprite.position.y += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.001;
                sprite.position.x += Math.cos(Date.now() * 0.0008 + i * 0.1) * 0.001;

                // Mouse interaction - subtle movement
                sprite.position.x += this.mouseX * 0.1 * (i % 5) * 0.01;
                sprite.position.y += this.mouseY * 0.1 * (i % 5) * 0.01;
            });
        }

        // Animate sun/star
        if (this.sun) {
            this.sun.rotation.y += 0.005;
            // Pulsing effect
            const pulse = Math.sin(Date.now() * 0.001) * 0.1;
            this.sun.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        }

        // Animate sun rays
        if (this.sunRays) {
            this.sunRays.rotation.y -= 0.003;
            this.sunRays.rotation.x += 0.002;
        }

        // Camera movement based on scroll
        this.camera.position.y = -(this.scrollY * 0.001);

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('scroll', this.onScroll.bind(this));

        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize when DOM is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const threeScene = new ThreeScene();
        threeScene.init();
    });
}
