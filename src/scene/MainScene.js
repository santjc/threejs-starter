import Experience from "../core/Experience.js";
import * as THREE from "three";

export default class MainScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // Setup
    this.setDummy();
  }

  setDummy() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.dummy = new THREE.Mesh(geometry, material);
    this.scene.add(this.dummy);
  }

  update() {}
}
