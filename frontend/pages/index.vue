<template>
  <div class="container">
    <div>
      <h1 class="title">This is our home</h1>
      <h2 class="subtitle">Look at it!</h2>
      <SolarSystem :asteroidData="{}" />
    </div>
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
  justify-content: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 70px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
