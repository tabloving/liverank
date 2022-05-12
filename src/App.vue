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
	@include themed() {
    background: t('background-color');
  };
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
  height: 100vh;
  overflow: hidden;
}
@media screen and (max-width:640px){
	#app{
		overflow: scroll;
	}
	.el-message-box{
		width:90%
	}
}
</style>
