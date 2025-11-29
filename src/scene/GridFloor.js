import Experience from "../core/Experience.js";
import * as THREE from "three";

export default class GridFloor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Parameters
    this.parameters = {
      size: 100,
      gridSize: 10.0,
      lineWidthX: 0.02,
      lineWidthY: 0.02,
      gridColor: "#ffffff",
      backgroundColor: "#000000",
      invert: false,
    };

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(
      this.parameters.size,
      this.parameters.size
    );
    this.geometry.rotateX(-Math.PI / 2);
  }

  setMaterial() {
    const vertexShader = `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uGridSize;
      uniform vec2 uLineWidth;
      uniform vec3 uGridColor;
      uniform vec3 uBackgroundColor;
      uniform bool uInvert;
      
      varying vec2 vUv;
      
      // Pristine grid function from Ben Golus
      // https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8
      float pristineGrid(in vec2 uv, in vec2 ddx, in vec2 ddy, vec2 lineWidth) {
        vec2 uvDeriv = vec2(length(vec2(ddx.x, ddy.x)), length(vec2(ddx.y, ddy.y)));
        bvec2 invertLine = bvec2(lineWidth.x > 0.5, lineWidth.y > 0.5);
        vec2 targetWidth = vec2(
          invertLine.x ? 1.0 - lineWidth.x : lineWidth.x,
          invertLine.y ? 1.0 - lineWidth.y : lineWidth.y
        );
        vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));
        vec2 lineAA = uvDeriv * 1.5;
        vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);
        gridUV.x = invertLine.x ? gridUV.x : 1.0 - gridUV.x;
        gridUV.y = invertLine.y ? gridUV.y : 1.0 - gridUV.y;
        vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
        
        grid2 *= clamp(targetWidth / drawWidth, 0.0, 1.0);
        grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - 1.0, 0.0, 1.0));
        grid2.x = invertLine.x ? 1.0 - grid2.x : grid2.x;
        grid2.y = invertLine.y ? 1.0 - grid2.y : grid2.y;
        return mix(grid2.x, 1.0, grid2.y);
      }
      
      void main() {
        vec2 uv = vUv * uGridSize;
        vec2 ddx_uv = dFdx(uv);
        vec2 ddy_uv = dFdy(uv);
        
        float grid = pristineGrid(uv, ddx_uv, ddy_uv, uLineWidth);
        
        if (uInvert) {
          grid = 1.0 - grid;
        }
        
        vec3 color = mix(uBackgroundColor, uGridColor, grid);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: this.parameters.gridSize },
        uLineWidth: {
          value: new THREE.Vector2(
            this.parameters.lineWidthX,
            this.parameters.lineWidthY
          ),
        },
        uGridColor: { value: new THREE.Color(this.parameters.gridColor) },
        uBackgroundColor: {
          value: new THREE.Color(this.parameters.backgroundColor),
        },
        uInvert: { value: this.parameters.invert },
      },
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  setDebug() {
    if (!this.debug.active) return;

    const folder = this.debug.ui.addFolder("Grid Floor");
    folder
      .add(this.parameters, "size")
      .min(10)
      .max(500)
      .step(1)
      .name("Size")
      .onChange(() => {
        this.geometry.dispose();
        this.setGeometry();
        this.mesh.geometry = this.geometry;
      });

    folder
      .add(this.parameters, "gridSize")
      .min(1)
      .max(500)
      .step(0.1)
      .name("Grid Size")
      .onChange(() => {
        this.material.uniforms.uGridSize.value = this.parameters.gridSize;
      });

    folder
      .add(this.parameters, "lineWidthX")
      .min(0.001)
      .max(0.5)
      .step(0.001)
      .name("Line Width X")
      .onChange(() => {
        this.material.uniforms.uLineWidth.value.x = this.parameters.lineWidthX;
      });

    folder
      .add(this.parameters, "lineWidthY")
      .min(0.001)
      .max(0.5)
      .step(0.001)
      .name("Line Width Y")
      .onChange(() => {
        this.material.uniforms.uLineWidth.value.y = this.parameters.lineWidthY;
      });

    folder
      .addColor(this.parameters, "gridColor")
      .name("Grid Color")
      .onChange(() => {
        this.material.uniforms.uGridColor.value.set(this.parameters.gridColor);
      });

    folder
      .addColor(this.parameters, "backgroundColor")
      .name("Background Color")
      .onChange(() => {
        this.material.uniforms.uBackgroundColor.value.set(
          this.parameters.backgroundColor
        );
      });

    folder
      .add(this.parameters, "invert")
      .name("Invert")
      .onChange(() => {
        this.material.uniforms.uInvert.value = this.parameters.invert;
      });
  }

  update() {
    // Grid floor doesn't need updates, but method exists for consistency
  }
}
