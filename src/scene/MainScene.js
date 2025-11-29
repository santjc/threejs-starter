import Experience from "../core/Experience.js";
import * as THREE from "three";

export default class MainScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // Setup
    this.setDummy();
    this.setLights();
  }

  setDummy() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.dummy = new THREE.Mesh(geometry, material);
    this.scene.add(this.dummy);
  }

  setLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  update() {
    this.dummy.rotation.y += 0.01;
    this.dummy.rotation.x += 0.01;
  }
}
