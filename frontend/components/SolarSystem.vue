<template>
  <div
    ref="solarSystem"
    class="solar-system"
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
import * as THREE from "THREE";
import earthPositions from "../json/earth.json";

import sunMap from "../assets/sun.jpg";
import earthClouds from "../assets/earth_clouds.jpg";
import earthElevBump from "../assets/earth_elev_bump.jpg";
import earthWater from "../assets/earth_water.png";
import earthMap from "../assets/earth.jpg";
import galaxyStarfield from "../assets/galaxy_starfield.jpg";

const lowerPlane = 0.1;
const upperPlane = 55000;

export default {
  name: "solar-system",
  props: {
    ateroidData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      cameraPositionX: 0,
      cameraPositionY: 0,
      cameraPositionZ: 15000,
      moved: false
    };
  },
  computed: {
    earthPos: () => earthPositions.position,
    viewWidth: () => window.innerWidth,
    viewHeight: () => window.innerHeight,
    realSunRadius: () => 696340, //km
    realAU: () => 149597871, //km
    relNum: () => 0.2,
    sunRadius() {
      return this.realSunRadius * this.relNum;
    },
    au() {
      return (this.realAU * this.relNum) / 300; // 1 AU reduced by 300
    },
    universe(){
      let radius = this.sunRadius;
      let SphereGeometry = new THREE.SphereGeometry(radius, 100,100);
      let material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(galaxyStarfield),
        side: THREE.BackSide
      })

      let universe = new THREE.Mesh(SphereGeometry, material);
      universe.position.set(0, 0, 0);
      universe.receiveShadow = false;
      return universe;
    },
    sun() {
      let radius = this.sunRadius / 25; // Sun radius reduced another 5 times (other planets are not)
      let SphereGeometry = new THREE.SphereGeometry(radius, 500, 500);
      let material = new THREE.MeshLambertMaterial({
          map: new THREE.TextureLoader().load(sunMap)
        })
      material.emissive = 0x000;
      let sun = new THREE.Mesh(SphereGeometry, material);
      sun.position.set(0, 0, 0);
      sun.receiveShadow = false;
      //sun.castShadow = true;
      return sun;
    },
    earth() {
      let portionOfSunRadius = 6371 / this.realSunRadius;
      let radius = this.sunRadius * portionOfSunRadius;
      let SphereGeometry = new THREE.SphereGeometry(radius, 100, 100);
      let material = new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load(earthMap),
          bumpMap: new THREE.TextureLoader().load(earthElevBump),
          specularMap: new THREE.TextureLoader().load(earthWater)
        })
      let earth = new THREE.Mesh(SphereGeometry, material);
      earth.position.set(this.au, 0, 0);
      earth.receiveShadow = true;
      earth.castShadow = false;
      return earth;
    },
    camera() {
      return new THREE.PerspectiveCamera(
        100,
        this.viewWidth / this.viewHeight,
        lowerPlane,
        upperPlane
      );
      camera.lookAt(scene.position);
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
      let zAdjuster = zCoord / 500;

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
    },/*
    generatePlanet(portionOfSunRadius, color, distanceFromSun) {
      let radius = this.sunRadius * portionOfSunRadius;
      let SphereGeometry = new THREE.SphereGeometry(radius, 100, 100);
      let material = new THREE.MeshLambertMaterial({
        color,
      });
      let planet = new THREE.Mesh(SphereGeometry, material);
      planet.position.set(distanceFromSun, 0, 0);
      planet.receiveShadow = true;
      planet.castShadow = false;
      return planet;
    }, */
    generateModel() {
      let earth = this.earth;

      let scene = new THREE.Scene();
      let camera = this.camera;

      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.viewWidth, this.viewHeight);

      let ambientLight1 = new THREE.AmbientLight(0xffffff, 1);
      ambientLight1.layers.set(1);
      scene.add(ambientLight1);

      /* let ambientLight2 = new THREE.AmbientLight(0xffffff, 0.3);
      ambientLight2.layers.set(2);
      scene.add(ambientLight2); */

      var sunLight = new THREE.PointLight(0xffffff);
      sunLight.position.set(0,0,0);
      sunLight.layers.set(2); // Add light to planet layer
      sunLight.intensity = 1;

      scene.add(sunLight);

      camera.position.z = this.cameraPositionZ;

      this.universe.layers.set(0);
      this.sun.layers.set(1)
      earth.layers.set(2)

      scene.add(this.universe);
      scene.add(this.sun);
      scene.add(earth);

      let theta = 0;
      let i = 0;
      const animate = () => {

        requestAnimationFrame(animate);
        this.getNewPos(earth, i, this.earthPos);

        renderer.autoClear = true;
        camera.layers.set(0);
        renderer.render(scene, camera);

        renderer.autoClear = false;

        camera.layers.set(1);
        renderer.render(scene, camera);

        camera.layers.set(2);
        renderer.render(scene, camera);

        i++;
        if(i >= this.earthPos.length) i = 0;
      };
      animate();
      renderer.render(scene, camera);
      let solarSystem = this.$refs.solarSystem;
      solarSystem.append(renderer.domElement);
    },
    getNewPos(planet, i, planetPos) {
      let planetData = {
        x: planetPos[i].x,
        y: planetPos[i].y,
        z: planetPos[i].z
      };
      planet.position.set(planetData.x, planetData.y, planetData.z);
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
