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
    };
  },
  computed: {
    viewWidth: () => window.innerWidth,
    viewHeight: () => window.innerHeight,
    realSunRadius: () => 696340, //km
    realSunMass: () => 1.989 * Math.pow(10, 30), //kg
    realAU: () => 149597871, //km
    relNum: () => 0.01,
    sunRadius() {
      return this.realSunRadius * this.relNum;
    },
    sunMass() {
      return this.realSunMass * this.relNum; // Should be different relNum
    },
    au() {
      return (this.realAU * this.relNum) / 300; // Distance reduced by 300
    },
    gravityConst: () => 6.67 * Math.pow(10, -11),
    sun() {
      let radius = this.sunRadius / 5; // Size (but not mass) of sun reduced another 5 times (other planets are not)
      let SphereGeometry = new three.SphereGeometry(radius, 150, 150);
      let material = new three.MeshPhongMaterial({
        color: 0xffcc00,
      });
      let sun = new three.Mesh(SphereGeometry, material);
      sun.position.set(0, 0, 0);
      sun.receiveShadow = false;
      sun.castShadow = true;
      return sun;
    },
    mercury() {
      let portionOfSunRadius = 2439.7 / this.realSunRadius;
      let mercury = this.generatePlanet(
        portionOfSunRadius,
        "#cc5555",
        0.4 * this.au
      );
      return {
        object: mercury,
        data: {
          theta: 0,
          m: 3.285 * Math.pow(10, 23) * this.relNum,
          r: 0.4 * this.au,
          x: 0.1,
          y: 0.1,
          z: 0.1,
        },
      };
    },
    venus() {
      let portionOfSunRadius = 6051.8 / this.realSunRadius;
      let venus = this.generatePlanet(
        portionOfSunRadius,
        "#11ccff",
        0.7 * this.au
      );
      return {
        object: venus,
        data: { theta: 0, r: 0.7 * this.au, x: 0.7 * this.au, y: 0 },
      };
    },
    earth() {
      let portionOfSunRadius = 6371 / this.realSunRadius;
      let earth = this.generatePlanet(portionOfSunRadius, "#1133ff", this.au);
      return {
        object: earth,
        data: { theta: 0, r: this.au, x: this.au, y: 0 },
      };
    },
    mars() {
      let portionOfSunRadius = 3389.5 / this.realSunRadius;
      let mars = this.generatePlanet(
        portionOfSunRadius,
        "#ff4444",
        1.5 * this.au
      );
      return {
        object: mars,
        data: { theta: 0, r: 1.5 * this.au, x: 1.5 * this.au, y: 0 },
      };
    },
    jupiter() {
      let portionOfSunRadius = 69911 / this.realSunRadius;
      let jupiter = this.generatePlanet(
        portionOfSunRadius,
        "#ff4444",
        5.2 * this.au
      );
      return {
        object: jupiter,
        data: { theta: 0, r: 5.2 * this.au, x: 5.2 * this.au, y: 0 },
      };
    },
    saturn() {
      let portionOfSunRadius = 58232 / this.realSunRadius;
      let saturn = this.generatePlanet(
        portionOfSunRadius,
        "#ffffff",
        9.5 * this.au
      );
      return {
        object: saturn,
        data: { theta: 0, r: 9.5 * this.au, x: 9.5 * this.au, y: 0 },
      };
    },
    uranus() {
      let portionOfSunRadius = 25362 / this.realSunRadius;
      let uranus = this.generatePlanet(
        portionOfSunRadius,
        "#ddddff",
        19.8 * this.au
      );
      return {
        object: uranus,
        data: { theta: 0, r: 19.8 * this.au, x: 19.8 * this.au, y: 0 },
      };
    },
    neptune() {
      let portionOfSunRadius = 24622 / this.realSunRadius;
      let neptune = this.generatePlanet(
        portionOfSunRadius,
        "#ccccff",
        30 * this.au
      );
      return {
        object: neptune,
        data: { theta: 0, r: 30 * this.au, x: 30 * this.au, y: 0 },
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
      let material = new three.MeshPhongMaterial({
        color,
      });
      let planet = new three.Mesh(SphereGeometry, material);
      planet.position.set(distanceFromSun, 0, 0);
      planet.receiveShadow = true;
      planet.castShadow = false;
      return planet;
    },
    generateModel() {
      let mercury = this.mercury;
      let venus = this.venus;
      let earth = this.earth;
      let mars = this.mars;
      let jupiter = this.jupiter;
      let saturn = this.saturn;
      let uranus = this.uranus;
      let neptune = this.neptune;

      let scene = new three.Scene();
      let camera = this.camera;

      let renderer = new three.WebGLRenderer();
      renderer.setSize(this.viewWidth, this.viewHeight);

      let ambientLight = new three.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      let pointLight = new three.PointLight(0xffff00, 1, 100, 2); //color, intensity, distance, decay
      pointLight.position.set(-0.9, 0.9, 0);
      pointLight.castShadow = true;
      camera.add(pointLight);

      camera.position.z = this.cameraPositionZ;
      scene.add(this.sun);
      scene.add(mercury.object);
      scene.add(venus.object);
      scene.add(earth.object);
      scene.add(mars.object);
      scene.add(jupiter.object);
      scene.add(saturn.object);
      scene.add(uranus.object);
      scene.add(neptune.object);
      let theta = 0;

      const animate = () => {
        mercury.data.theta += 0.3;
        venus.data.theta += 0.2;
        earth.data.theta += 0.3;
        mars.data.theta += 0.25;
        jupiter.data.theta += 0.13;
        saturn.data.theta += 0.1;
        uranus.data.theta += 0.12;
        neptune.data.theta += 0.05;

        requestAnimationFrame(animate);
        mercury.data.theta += 0.5;
        this.getNewPos(mercury);
        this.getNewPos(venus);
        this.getNewPos(earth);
        this.getNewPos(mars);
        this.getNewPos(jupiter);
        this.getNewPos(saturn);
        this.getNewPos(uranus);
        this.getNewPos(neptune);

        renderer.render(scene, camera);
      };
      animate();
      renderer.render(scene, camera);
      let solarSystem = this.$refs.solarSystem;
      solarSystem.append(renderer.domElement);
    },
    getNewPos(planet) {
      let planetData = {
        /* x: this.xVector(0.5, planet.data.x, this.sunMass, planet.data.m),
        y: this.yVector(0.5, planet.data.y, this.sunMass, planet.data.m),
        z: this.zVector(0.5, planet.data.z, this.sunMass, planet.data.m), */
        x: getXPos(0, planet.data.theta, planet.data.r),
        y: getYPos(0, planet.data.theta, planet.data.r),
      };
      planet.object.position.set(planetData.x, planetData.y, 0);

      function getXPos(x, theta, radius) {
        return x + Math.cos((Math.PI / 180) * theta) * radius;
      }
      function getYPos(y, theta, radius) {
        return y + Math.sin((Math.PI / 180) * theta) * radius;
      }
    },
    distance(x, y, z) {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(y, 2));
    },
    xVector(x, m1, m2) {
      return (this.gravityConst * (m1 * m2)) / Math.pow(x, 2);
    },
    yVector(y, m1, m2) {
      return (this.gravityConst * (m1 * m2)) / Math.pow(y, 2);
    },
    zVector(y, m1, m2) {
      return (this.gravityConst * (m1 * m2)) / Math.pow(y, 2);
    },
    orbitalPeriod(r, m) {
      // r = distance from central body, m = mass of central body
      return 2 * Math.PI * r * Math.sqrt(r / (this.gravityConst * m));
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
