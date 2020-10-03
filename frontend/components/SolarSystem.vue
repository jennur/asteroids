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
import * as three from "three";
import earthPositions from "../json/earth.json";

import sunMap from "../assets/sun.jpg";
import earthClouds from "../assets/earth_clouds.jpg";
import earthElevBump from "../assets/earth_elev_bump.jpg";
import earthWater from "../assets/earth_water.png";
import earthMap from "../assets/earth.jpg";
import galaxyStarfield from "../assets/galaxy_starfield.png";

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
      moved: false,
      earthPos: []
    };
  },
  computed: {
    viewWidth: () => window.innerWidth,
    viewHeight: () => window.innerHeight,
    realSunRadius: () => 696340, //km
    realSunMass: () => 1.989 * Math.pow(10, 30), //kg
    realAU: () => 149597871, //km
    relNum: () => 0.2,
    sunRadius() {
      return this.realSunRadius * this.relNum;
    },
    sunMass() {
      return this.realSunMass * this.relNum; // Should be different relNum
    },
    au() {
      return (this.realAU * this.relNum) / 300; // 1 AU reduced by 300
    },
    sun() {
      let radius = this.sunRadius / 25; // Sun radius reduced another 5 times (other planets are not)
      let SphereGeometry = new three.SphereGeometry(radius, 500, 500);
      let material = new three.MeshLambertMaterial({
          map: three.ImageUtils.loadTexture(sunMap),
          bumpScale:   0.005,
          specular: new three.Color('grey')
        })
      material.emissive = 0x000;
      let sun = new three.Mesh(SphereGeometry, material);
      sun.position.set(0, 0, 0);
      sun.receiveShadow = false;
      //sun.castShadow = true;
      return sun;
    },
    earth() {
      let portionOfSunRadius = 6371 / this.realSunRadius;
      let radius = this.sunRadius * portionOfSunRadius;
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshLambertMaterial({
          map: three.ImageUtils.loadTexture(earthMap),
          bumpMap: three.ImageUtils.loadTexture(earthElevBump),
          bumpScale:   0.005,
          specularMap: three.ImageUtils.loadTexture(earthWater),
          specular: new three.Color('grey')
        })
      let earth = new three.Mesh(SphereGeometry, material);
      earth.position.set(this.au, 0, 0);
      earth.receiveShadow = true;
      earth.castShadow = false;
      //let earth = this.generatePlanet(portionOfSunRadius, "#1133ff", this.au);
      return {
        object: earth,
        data: { theta: 0, r: this.au, x: this.au, y: 0 },
      };
    },
    camera() {
      return new three.PerspectiveCamera(
        100,
        this.viewWidth / this.viewHeight,
        1000,
        55000
      );
      camera.lookAt(scene.position);
    },
  },
  methods: {
    handleZoom(event) {
      event.preventDefault();
      if (event.deltaY < 0 && this.cameraPositionZ > 4000) {
        this.cameraPositionZ -= Math.round(this.cameraPositionZ / 10);
      } else if (event.deltaY > 0 && this.cameraPositionZ < 50000) {
        this.cameraPositionZ += Math.round(this.cameraPositionZ / 10);
      }
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
    },
    generatePlanet(portionOfSunRadius, color, distanceFromSun) {
      let radius = this.sunRadius * portionOfSunRadius;
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshLambertMaterial({
        color,
      });
      let planet = new three.Mesh(SphereGeometry, material);
      planet.position.set(distanceFromSun, 0, 0);
      planet.receiveShadow = true;
      planet.castShadow = false;
      return planet;
    },
    generateModel() {
      let earth = this.earth;

      let scene = new three.Scene();
      let camera = this.camera;

      let renderer = new three.WebGLRenderer();
      renderer.setSize(this.viewWidth, this.viewHeight);

      let ambientLight0 = new three.AmbientLight(0xffffff, 1);
      ambientLight0.layers.set(0);
      scene.add(ambientLight0);

      let ambientLight1 = new three.AmbientLight(0xffffff, 0.3);
      ambientLight1.layers.set(1);
      scene.add(ambientLight1);

      var sunLight = new three.PointLight(0xffffff);
      sunLight.position.set(0,0,0);
      sunLight.layers.set(1);
      sunLight.intensity = 2;

      scene.add(sunLight);

      camera.position.z = this.cameraPositionZ;

      this.sun.layers.set(0)
      earth.object.layers.set(1)

      scene.add(this.sun);
      scene.add(earth.object);

      let theta = 0;
      let i = 0;
      const animate = () => {

        requestAnimationFrame(animate);
        this.getNewPos(earth, i);

        renderer.autoClear = true;
        camera.layers.set(0);
        renderer.render(scene, camera);

        renderer.autoClear = false;

        camera.layers.set(1);
        renderer.render(scene, camera);

        i++;
        if(i >= this.earthPos.length) i = 0;
      };
      animate();
      renderer.render(scene, camera);
      let solarSystem = this.$refs.solarSystem;
      solarSystem.append(renderer.domElement);
    },
    getNewPos(planet, i) {
      let planetData = {
        x: this.earthPos[i].x,
        y: this.earthPos[i].y,
        z: this.earthPos[i].z
      };
      planet.object.position.set(planetData.x, planetData.y, planetData.z);
    },
  },
  created(){
    this.earthPos = earthPositions.position;
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
