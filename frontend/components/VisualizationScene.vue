<template>
    <div
    ref="visualizationScene"
    class="visualization-scene"
    @wheel="handleZoom"
    @mousedown="handleMouseDown"
    @mousemove="detectDrag"
    @mouseup="resetMove"
  >
    <div class="coordinates">
      <span><strong>X:</strong>{{ cameraPositionX }}</span>
      <span><strong>Y:</strong>{{ cameraPositionY }}</span>
      <span><strong>Z:</strong>{{ cameraPositionZ }}</span>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import galaxyStarfield from "../assets/galaxy_starfield.jpg";

export default {
  props: {
    width: {
      type: Number,
      default: 1000
    },
    height: {
      type: Number,
      default: 1500
    },
    lowerPlane: {
      type: Number,
      default: 0.1
    },
    xInit: {
      type: Number,
      default: 0
    },
    yInit: {
      type: Number,
      default: 0
    },
    zInit: {
      type: Number,
      default: 1000
    },
    upperPlane: {
      type: Number,
      default: 2000
    },
    scenes: {
      type: Array,
      default: () => [] // [ {layer: 0, object: threeObject}, ... ]
    },
    lights: {
      type: Array,
      default: () => [] // [ {layer: 0, object: lightObject}, ... ]
    },
    backgroundImage: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      cameraPositionX: this.xInit,
      cameraPositionY: this.yInit,
      cameraPositionZ: this.zInit,
      moved: false
    };
  },
  computed: {
    layers(){
      let scenes = this.scenes || [];
      let layers = [];
      scenes.forEach(scene => {
        if(layers.indexOf(scene.layer) === -1)
          layers.push(scene.layer);
      })
      return layers;
    },
    camera() {
      return new THREE.PerspectiveCamera(
        100,
        this.width / this.height,
        this.lowerPlane,
        this.upperPlane
      );
    },
  },
  methods: {
    handleZoom(event) {
      event.preventDefault();
      if (event.deltaY < 0 && this.cameraPositionZ > this.sunRadius / 25) {
        this.cameraPositionZ -= Math.round(this.cameraPositionZ / 10);
      } else if (event.deltaY > 0 && this.cameraPositionZ < upperPlane) {
        this.cameraPositionZ += Math.round(this.cameraPositionZ / 10);
      }
      if(this.cameraPositionZ <= this.sunRadius / 25)
        this.cameraPositionZ = Math.ceil(this.sunRadius / 25);

      if(this.cameraPositionZ >= upperPlane)
        this.cameraPositionZ = upperPlane;

      this.camera.position.z = Math.round(this.cameraPositionZ);
    },
    handleMouseDown(event) {
      this.moved = { x: event.x, y: event.y };
    },
    detectDrag(event) {
      let zCoord = this.cameraPositionZ;
      let zAdjuster = zCoord / 50;

      if (!!this.moved) {
        let moveX, moveY;
        moveX = event.x - this.moved.x;
        moveY = event.y - this.moved.y;

        this.cameraPositionX = Math.round(
          this.camera.position.x - zAdjuster * moveX
        );
        this.cameraPositionY = Math.round(
          this.camera.position.y + zAdjuster * moveY
        );

        this.camera.position.x = this.cameraPositionX;
        this.camera.position.y = this.cameraPositionY;
        this.moved = {
          x: event.x,
          y: event.y,
        };
      }
    },
    resetMove(event) {
      this.moved = false;
    },
    generateModel() {
      let scene = new THREE.Scene();
      let scenes = this.scenes;
      let layers = this.layers;
      let lights = this.lights;
      let camera = this.camera;

      scene.background = new THREE.TextureLoader().load(this.backgroundImage);;

      scene.background = new THREE.TextureLoader().load(this.backgroundImage);
      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.width, this.height);

      camera.position.z = this.cameraPositionZ;

      scenes.forEach(item => {
        scene.add(item.object);
      });

      lights.forEach(light => {
        scene.add(light.object);
      });

      let i = 0;
      const animate = () => {
        requestAnimationFrame(animate);

        renderer.autoClear = true;
        camera.layers.set(0);
        renderer.render(scene, camera);

        renderer.autoClear = false;

        layers.forEach(layer => {
          camera.layers.set(layer);
          renderer.render(scene, camera);
        })

        i++;
      };
      animate();
      renderer.render(scene, camera);
      let visualizationScene = this.$refs.visualizationScene;
      visualizationScene.append(renderer.domElement);
    },
  },
  mounted() {
    this.generateModel();
  },
};
</script>

<style scoped>
.solar-system {
  position: fixed;
  top: 0;
  left: 0;
}
.coordinates {
  position: absolute;
  top: 30px;
  left: 30px;
  color: white;
}
</style>
