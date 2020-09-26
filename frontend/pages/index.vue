<template>
  <div class="container">
    <h1 class="title">This is our home</h1>
    <h2 class="subtitle">Look at it!</h2>
    <SolarSystem :asteroidData="{}" />
  </div>
</template>

<script>
import SolarSystem from "~/components/SolarSystem.vue";

export default {
  components: {
    SolarSystem,
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 70px;
  color: hsl(187, 64%, 74%);
  letter-spacing: 1px;
  z-index: 2;
  margin-top: 30px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #8eb0f3;
  word-spacing: 5px;
  padding-bottom: 15px;
  z-index: 2;
}
</style>
