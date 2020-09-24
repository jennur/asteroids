<template>
  <div ref="solarSystem"></div>
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
  /* data() {
    let au = 5 / 0.01; // 5/relNum
    return {
      mercuryData: { theta: 0, r: 0.4 * this.au, x: 0.4 * this.au, y: 0 },
      venusData: { theta: 0, r: 0.7 * this.au, x: 0.7 * this.au, y: 0 },
      earthData: { theta: 0, r: this.au, x: this.au, y: 0 },
      marsData: { theta: 0, r: 1.5 * this.au, x: 1.5 * this.au, y: 0 },
      jupiterData: { theta: 0, r: 5.2 * this.au, x: 5.2 * this.au, y: 0 },
      saturnData: { theta: 0, r: 9.5 * this.au, x: 9.5 * this.au, y: 0 },
      uranusData: { theta: 0, r: 19.8 * this.au, x: 19.8 * this.au, y: 0 },
      neptuneData: { theta: 0, r: 30 * this.au, x: 30 * this.au, y: 0 },
    };
  }, */
  computed: {
    realSunRadius: () => 696340, //km
    realAU: () => 149597871, //km
    relNum: () => 0.01,
    sunRadius() {
      return 1 / this.relNum;
    },
    au() {
      return 5 / this.relNum;
    },
    sun() {
      let radius = this.sunRadius;
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
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
      let radius = this.sunRadius / Math.sqrt(277);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0xcc5555,
      });
      let mercury = new three.Mesh(SphereGeometry, material);
      mercury.position.set(0.4 * this.au, 0, 0);
      mercury.receiveShadow = true;
      mercury.castShadow = false;
      return {
        object: mercury,
        data: { theta: 0, r: 0.4 * this.au, x: 0.4 * this.au, y: 0 },
      };
    },
    venus() {
      let radius = this.sunRadius / Math.sqrt(115);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0x11ccff,
      });
      let venus = new three.Mesh(SphereGeometry, material);
      venus.position.set(0.7 * this.au, 0, 0);
      venus.receiveShadow = true;
      venus.castShadow = false;
      return {
        object: venus,
        data: { theta: 0, r: 0.7 * this.au, x: 0.7 * this.au, y: 0 },
      };
    },
    earth() {
      let radius = this.sunRadius / Math.sqrt(109);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0x1133ff,
      });
      let earth = new three.Mesh(SphereGeometry, material);
      earth.position.set(this.au, 0, 0);
      earth.receiveShadow = true;
      earth.castShadow = false;
      return {
        object: earth,
        data: { theta: 0, r: this.au, x: this.au, y: 0 },
      };
    },
    mars() {
      let radius = this.sunRadius / Math.sqrt(109 / 0.53);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0xff4444,
      });
      let mars = new three.Mesh(SphereGeometry, material);
      mars.position.set(1.5 * this.au, 0, 0);
      mars.receiveShadow = true;
      mars.castShadow = false;
      return {
        object: mars,
        data: { theta: 0, r: 1.5 * this.au, x: 1.5 * this.au, y: 0 },
      };
    },
    jupiter() {
      let radius = this.sunRadius / Math.sqrt(1392700 / 139820);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0xff4444,
      });
      let jupiter = new three.Mesh(SphereGeometry, material);
      jupiter.position.set(5.2 * this.au, 0, 0);
      jupiter.receiveShadow = true;
      jupiter.castShadow = false;
      return {
        object: jupiter,
        data: { theta: 0, r: 5.2 * this.au, x: 5.2 * this.au, y: 0 },
      };
    },
    saturn() {
      let radius = this.sunRadius / Math.sqrt(1392700 / 116460);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0xffffff,
      });
      let saturn = new three.Mesh(SphereGeometry, material);
      saturn.position.set(9.5 * this.au, 0, 0);
      saturn.receiveShadow = true;
      saturn.castShadow = false;
      return {
        object: saturn,
        data: { theta: 0, r: 9.5 * this.au, x: 9.5 * this.au, y: 0 },
      };
    },
    uranus() {
      let radius = this.sunRadius / Math.sqrt(1392700 / 50724);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0xddddff,
      });
      let uranus = new three.Mesh(SphereGeometry, material);
      uranus.position.set(19.8 * this.au, 0, 0);
      uranus.receiveShadow = true;
      uranus.castShadow = false;
      return {
        object: uranus,
        data: { theta: 0, r: 19.8 * this.au, x: 19.8 * this.au, y: 0 },
      };
    },
    neptune() {
      let radius = this.sunRadius / Math.sqrt(1392700 / 49244);
      let SphereGeometry = new three.SphereGeometry(radius, 100, 100);
      let material = new three.MeshPhongMaterial({
        color: 0xccccff,
      });
      let neptune = new three.Mesh(SphereGeometry, material);
      neptune.position.set(30 * this.au, 0, 0);
      neptune.receiveShadow = true;
      neptune.castShadow = false;
      return {
        object: neptune,
        data: { theta: 0, r: 30 * this.au, x: 30 * this.au, y: 0 },
      };
    },
  },
  methods: {
    generateModel() {
      let mercury = this.mercury;
      let venus = this.venus;
      let earth = this.earth;
      let mars = this.mars;
      let jupiter = this.jupiter;
      let saturn = this.saturn;
      let uranus = this.uranus;
      let neptune = this.neptune;

      let width = window.innerWidth;
      let height = window.innerHeight * 0.8;
      let scene = new three.Scene();
      let camera = new three.PerspectiveCamera(100, width / height, 1, 15000);
      //camera.lookAt(scene.position);

      let renderer = new three.WebGLRenderer();
      renderer.setSize(width, height);

      let ambientLight = new three.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      let pointLight = new three.PointLight(0xffff00, 1, 100, 2); //color, intensity, distance, decay
      pointLight.position.set(-0.9, 0.9, 0);
      pointLight.castShadow = true;
      camera.add(pointLight);

      camera.position.z = 1000;
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
        let mercuryData = this.getNewPos(mercury.data, mercury.data.theta);
        mercury.object.position.set(mercuryData.x, mercuryData.y, 0);

        let venusData = this.getNewPos(venus.data, venus.data.theta);
        venus.object.position.set(venusData.x, venusData.y, 0);

        let earthData = this.getNewPos(earth.data, earth.data.theta);
        earth.object.position.set(earthData.x, earthData.y, 0);

        let marsData = this.getNewPos(mars.data, mars.data.theta);
        mars.object.position.set(marsData.x, marsData.y, 0);

        let jupiterData = this.getNewPos(jupiter.data, jupiter.data.theta);
        jupiter.object.position.set(jupiterData.x, jupiterData.y, 0);

        let saturnData = this.getNewPos(saturn.data, saturn.data.theta);
        saturn.object.position.set(saturnData.x, saturnData.y, 0);

        let uranusData = this.getNewPos(uranus.data, uranus.data.theta);
        uranus.object.position.set(uranusData.x, uranusData.y, 0);

        let neptuneData = this.getNewPos(neptune.data, neptune.data.theta);
        neptune.object.position.set(neptuneData.x, neptuneData.y, 0);
        renderer.render(scene, camera);
      };
      animate();

      let solarSystem = this.$refs.solarSystem;
      solarSystem.append(renderer.domElement);
    },
    getNewPos(planetData, theta) {
      return {
        theta,
        x: getXPos(0, theta, planetData.r),
        y: getYPos(0, theta, planetData.r),
      };

      function getXPos(x, theta, radius) {
        return x + Math.cos((Math.PI / 180) * theta) * radius;
      }
      function getYPos(y, theta, radius) {
        return y + Math.sin((Math.PI / 180) * theta) * radius;
      }
    },
  },
  mounted() {
    this.generateModel();
  },
};
</script>
