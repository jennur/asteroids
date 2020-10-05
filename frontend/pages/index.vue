<template>
  <div class="container">
    <VisualizationScene :width="width"
                        :height="height"
                        :scenes="scenes"
                        :backgroundImage="backgroundImage"
    />
  </div>
</template>

<script>
import * as THREE from "three";
import galaxyStarfield from "../assets/galaxy_starfield.jpg";
import VisualizationScene from "~/components/VisualizationScene.vue";

export default {
  components: {
    VisualizationScene,
  },
  computed: {
    width: () => process.client && window.innerWidth || 1500,
    height: () => process.client && window.innerHeight || 1000,
    backgroundImage: () => galaxyStarfield,
    scenes(){
      return []
    }
  }
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
  user-select: none;
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
