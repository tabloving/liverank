<template>
	<div id="app">
			<main-vue></main-vue>
	</div>
</template>

<script>
import mainVue from "./components/main.vue";
export default {
	name: "App",
	components: {
		mainVue,
	},
};
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: var(--black);
  height: 100vh;
  overflow: hidden;
}
</style>
