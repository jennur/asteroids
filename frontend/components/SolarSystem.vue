<template>
  <div
    ref="solarSystem"
    class="solar-system"
    @wheel="handleZoom"
    @mousedown="handleMouseDown"
    @mousemove="detectDrag"
    @mouseup="resetMove"
  ></div>
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
      cameraPositionZ: 700,
      cameraPositionX: 0,
      moved: false,
    };
  },
  computed: {
    viewWidth: () => window.innerWidth,
    viewHeight: () => window.innerHeight,
    camera() {
      return new three.PerspectiveCamera(
        100,
        this.viewWidth / this.viewHeight,
        1,
        15000
      );
      //camera.lookAt(scene.position);
    },
    realSunRadius: () => 696340, //km
    realAU: () => 149597871, //km
    relNum: () => 0.0001,
    sunRadius() {
      return this.realSunRadius * this.relNum;
    },
    au() {
      return 500; //this.realAU * this.relNum; //5 / this.relNum;
    },
    sun() {
      let radius = this.sunRadius;
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
        data: { theta: 0, r: 0.4 * this.au, x: 0.4 * this.au, y: 0 },
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
    gravityConst: () => 6.67 * Math.pow(10, -11),
  },
  methods: {
    handleZoom(event) {
      event.preventDefault();
      if (event.deltaY < 0 && this.cameraPositionZ > 100) {
        this.cameraPositionZ -= this.cameraPositionZ / 10;
      } else if (event.deltaY > 0 && this.cameraPositionZ < 15000) {
        this.cameraPositionZ += this.cameraPositionZ / 10;
      }
      this.camera.position.z = this.cameraPositionZ;
    },
    handleMouseDown(event) {
      console.log("Event down:", event);
      this.moved = { x: event.x, y: event.y };
    },
    detectDrag(event) {
      console.log("Moved:", this.moved);
      if (!!this.moved) {
        let moveX, moveY;
        moveX = event.x - this.moved.x;
        moveY = event.y - this.moved.y;

        console.log("Move:", moveX, moveY);
        this.camera.position.x = this.camera.position.x - moveX;
        this.camera.position.y = this.camera.position.y + moveY;

        this.moved = {
          x: event.x,
          y: event.y,
        };
      }
    },
    resetMove(event) {
      console.log("Event up:", event);
      this.moved = false;
    },
    generatePlanet(portionOfSunRadius, color, distanceFromSun) {
      let radius = this.sunRadius * portionOfSunRadius; //Math.sqrt(timesSunDiam);
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
        theta += 1;
        mercury.data.theta += 1.5;
        venus.data.theta += 1.2;
        earth.data.theta += 1;
        mars.data.theta += 0.7;
        jupiter.data.theta += 0.6;
        saturn.data.theta += 0.5;
        uranus.data.theta += 0.4;
        neptune.data.theta += 0.3;

        requestAnimationFrame(animate);

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

      let solarSystem = this.$refs.solarSystem;
      solarSystem.append(renderer.domElement);
    },
    getNewPos(planet) {
      let planetData = {
        theta: planet.data.theta,
        /*  x: this.getXPosFromGravity(planet.data.r, 1, planet.data.theta),
        y: this.getYPosFromGravity(planet.data.r, 1, planet.data.theta), */

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
    getXPosFromGravity(r, m1, theta) {
      let t1 = 0;
      let t2 = 0.5;
      return Math.sqrt(
        (t1 - t2) *
          ((this.gravityConst * m1 * (Math.cos(theta) + Math.sin(theta))) /
            Math.pow(r, 2)) -
          Math.pow(r, 2) * Math.sin(theta)
      );
    },
    getYPosFromGravity(r, m1, theta) {
      let t1 = 0;
      let t2 = 0.5;
      return Math.sqrt(
        (t1 - t2) *
          ((this.gravityConst * m1 * (Math.cos(theta) + Math.sin(theta))) /
            Math.pow(r, 2)) -
          Math.pow(r, 2) * Math.cos(theta)
      );
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
</style>
