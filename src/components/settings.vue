<template>
	<el-drawer
		title="个性化设置"
		:visible.sync="flag"
		direction="rtl"
		:before-close="close"
	>
		<section
			:class="['setting-sec', item.type === 'switch' ? 'flex-section' : '']"
			v-for="item in list"
			:key="item.title"
		>
			<p :class="['title', item.type === 'switch' ? 'inline-title' : '']">
				{{ item.title }}
			</p>
			<el-input
				v-if="item.type === 'input'"
				v-model.trim="model[item.model]"
				:placeholder="item.placeholder"
			></el-input>
			<el-switch
				class="switch"
				v-if="item.type === 'switch'"
				v-model="model[item.model]"
			>
			</el-switch>

			<p v-if="item.des" class="des">{{ item.des }}</p>
		</section>
	</el-drawer>
</template>

<script>
import Storage from "../storage";
import { mapMutations } from "vuex";

let defaultID = Storage.get("roomid") || "变质的洋流";
export default {
	props: ["flag"],
	data() {
		return {
			model: {
				isDark: true,
				refresh: true,
				defaultVal: "",
			},
			list: [
				{
					title: "默认查询值",
					type: "input",
					des: "📢 数据存储在本地20天，清缓存会同时清除数据，望周知！",
					placeholder: `当前默认值 --> ${defaultID}`,
					model: "defaultVal",
				},
				{ title: "夜间模式开关", type: "switch", model: "isDark" },
				{
					title: "自动刷新数据",
					type: "switch",
					des: "开启后，将会每20s自动刷新一次数据，建议开启",
					model: "refresh",
				},
			],
		};
	},

	methods: {
		...mapMutations(["drawerControl"]),
		close() {
			this.drawerControl(["settings", "off"]);
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer.rtl {
  width: 24% !important;
  min-width: 300px;
	#el-drawer__title {
		font-size: 24px;
		font-weight: bold;
		color: #00adeb;
	}
	.flex-section {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
	}
	.setting-sec {
		text-align: left;
		padding: 14px 20px 20px;
		position: relative;
		margin: 10px 0;
		color: var(--black);
		&:not(:last-child)::after {
			content: "";
			width: 90%;
			height: 2px;
			background: rgba(0, 173, 235, 0.1);
			position: absolute;
			bottom: 0;
			left: 5%;
		}

		.title {
			font-size: 20px;
			color: #00adeb;
			margin: 0 0 8px;
		}

		.inline-title {
			display: inline;
		}
		.el-input {
			// width: 100%;
			height: 42px;
			font-size: 16px;

			.el-input__inner {
				padding: 0;
				height: 100%;
				border: 1px solid #57d59a;
				outline: none;
				text-indent: 1em;
				border-radius: 0;
				color: #00adeb;
				transition: 0.4s linear;
				&:focus {
					border: 1px solid #00adeb;
					border-right: 1px solid transparent;
				}
			}
		}

		.des {
			font-size: 14px;
			margin-top: 6px;
		}
	}
}
</style>