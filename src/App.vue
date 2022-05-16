<template>
	<div id="app">
		<main-vue></main-vue>
	</div>
</template>

<script>
import mainVue from "./components/main.vue";
export default {
	name: "App",
	provide() {
		return {
			VERSION: this.VERSION,
		};
	},
	data() {
		return {
			VERSION: 2.1,
		};
	},
	components: {
		mainVue,
	},
};
</script>

<style lang="scss">
body {
	@include themed() {
		background: t("background-color");
	}
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	overflow: auto;
	padding-bottom: 30px;
}
@media screen and (max-width: 640px) {
	#app {
		padding-bottom: 0;
	}
	.el-message-box {
		width: 90%;
	}
}
</style>
