<template>
	<el-drawer
		title="个性化设置"
		:visible.sync="flag"
		direction="rtl"
		:before-close="validateIsSave"
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
				maxlength="10"
				v-model.trim="model[item.model]"
				:class="[validateErr ? 'err' : '']"
				:placeholder="item.placeholder"
				:disabled="model[item.disabledKey]"
				:ref="item.refName"
				@change="validate(item['validateMethod'])"
				show-word-limit
				autofocus
				clearable
			>
			</el-input>
			<el-switch
				class="switch"
				v-if="item.type === 'switch'"
				v-model="model[item.model]"
				:disabled="item.disabled"
			>
			</el-switch>
			<transition name="fade" mode="out-in">
				<p class="errmsg" v-show="item.validateMethod && validateErr">
					{{ item.validatemsg }}
				</p>
			</transition>
			<!-- 快捷标签 -->
			<div class="hottags" v-if="item.tags && model.hotList.length">
				<span class="tag" v-for="(tag, index) in model[item.list]" :key="tag"
					>{{ tag }}
					<i class="el-icon-circle-close" @click="deleteTag(index)"></i
				></span>
			</div>
			<p class="tagmessage" v-else>您还没有添加任何快捷标签！</p>

			<p v-if="item.des" class="des">{{ item.des }}</p>
		</section>

		<el-button
			type="primary"
			class="save"
			@click="handleSave"
			:disabled="validateErr"
			>保存设置</el-button
		>
	</el-drawer>
</template>

<script>
import Storage from "../storage";
import { mapMutations } from "vuex";
import { stringify } from "qs";
const STORE_DAYS = 20;
const DEFAULT_ID = "变质的洋流";
function getLocal(name) {
	return Storage.get(name);
}
function setLocal(name, value) {
	Storage.set(name, value, STORE_DAYS);
}
export default {
	name: "Settings",
	props: ["flag", "changeHot"],
	data() {
		return {
			validateErr: false,
			model: {
				isDark: false,
				refresh: true,
				isLock: true,
				showHot: true,
				tagInput: "",
				isFull: false,
				hotList: [DEFAULT_ID, "是超可爱吖","lolm烟火"],
				defaultID: DEFAULT_ID,
			},
			list: [
				{
					title: `默认查询值`,
					type: "input",
					des: `📢 数据存储在本地${STORE_DAYS}天，清缓存会同时清除数据，望周知！`,
					placeholder: "请输入您需要设置的值",
					validatemsg: "输入不能为空。若想保持不变，请开启锁定",
					validateMethod: "validateDefaultID",
					model: "defaultID",
					refName: "defaultID",
					disabledKey: "isLock",
				},
				{ title: "锁定默认查询", type: "switch", model: "isLock" },
				{ title: "夜间模式开关", type: "switch", model: "isDark" },
				{
					title: "自动刷新数据",
					type: "switch",
					des: "开启后，将会每20s自动刷新一次数据，建议开启",
					model: "refresh",
					disabled: true,
				},
				{
					title: "快捷标签开关",
					type: "switch",
					model: "showHot",
				},
				{
					title: "快捷标签设置",
					type: "input",
					model: "tagInput",
					disabledKey: 'isFull',
					refName: "addTag",
					tags: true,
					list: "hotList",
					placeholder: '请输入标签，按回车确认',
					validateMethod: "validateHotTag",
				},
			],
		};
	},
	created() {
		let local = [
			"defaultID",
			"isLock",
			"refresh",
			"isDark",
			"showHot",
			"hotList",
		];

		for (let i of local) {
			getLocal(i) === undefined
				? setLocal(i, this.model[i])
				: (this.model[i] = getLocal(i));
		}

		this.$emit("changeHot", {
			key: getLocal("showHot"),
			list: getLocal("hotList"),
		});
	},
	mounted() {
		this.setTheme();
	},
	methods: {
		...mapMutations(["drawerControl"]),
		close() {
			this.drawerControl(["settings", "off"]);
		},
		validate(name) {
			this[name]();
		},
		validateDefaultID() {
			if (!this.model.defaultID) {
				this.validateErr = true;
				return false;
			} else {
				this.validateErr = false;
				return true;
			}
		},
		validateHotTag() {
			let val = this.$refs.addTag[0].value;
			if (this.model.hotList.indexOf(val) !== -1) {
				this.$message({
					type: "error",
					message: `${val} 已经存在了！无需重复添加。`,
				});
			} else {
				this.addTag(val);
			}
		},
		validateIsSave() {
			let target = [
				"defaultID",
				"isLock",
				"refresh",
				"isDark",
				"showHot",
				"hotList",
			];
			let res = target.every((item) => {
				let ret =
					JSON.stringify(this.model[item]) === JSON.stringify(getLocal(item));
				return ret;
			});
			if (!res) {
				this.$confirm(
					"你有未保存的数据，是否丢弃数据继续关闭？",
					"检测到未保存数据"
				)
					.then((_) => {
						for (let i of target) {
							this.model[i] = getLocal(i);
						}
						this.validateErr = false;
						
						this.drawerControl(["settings", "off"]);
						this.$message({
							message: "您取消了设置",
							type: "warning",
						});
					})
					.catch((_) => {});
			} else {
				this.drawerControl(["settings", "off"]);
			}
		},
		setTheme() {
			if (getLocal("isDark") === true) {
				window.document.documentElement.setAttribute("data-theme", "dark");
			} else {
				window.document.documentElement.setAttribute("data-theme", "light");
			}
		},
		addTag(tag) {
			let len = this.model.hotList.length;
			if (len < 5) {
				this.model.hotList.push(tag);
				this.model.tagInput = "";
			} else {
				this.model.isFull = true
				this.model.tagInput = '最多支持5个，请删除后再添加'
				this.$message({
					type: "error",
					message: "最多支持5个快捷标签！",
				});
			}
		},
		deleteTag(index) {
			this.model.hotList.splice(index, 1);
			this.model.isFull = false
			this.model.tagInput = ''
			this.$nextTick(()=>{
				this.$refs.addTag[0].focus()
			})
		},
		handleSave() {
			if (this.validateErr) {
				return;
			}
			const values = [
				{
					name: "defaultID",
					oldVal: getLocal("defaultID"),
					newVal: this.model.defaultID,
				},
				{
					name: "isLock",
					oldVal: getLocal("isLock"),
					newVal: this.model.isLock,
				},
				{
					name: "isDark",
					oldVal: getLocal("isDark"),
					newVal: this.model.isDark,
				},
				{
					name: "refresh",
					oldVal: getLocal("refresh"),
					newVal: this.model.refresh,
				},
				{
					name: "showHot",
					oldVal: getLocal("showHot"),
					newVal: this.model.showHot,
				},
				{
					name: "hotList",
					oldVal: getLocal("hotList"),
					newVal: this.model.hotList,
				},
			];
			values.forEach((item) => {
				let { name, oldVal, newVal } = item;

				if (oldVal !== newVal) {
					setLocal(name, newVal);
				}
			});
			this.setTheme();
			this.$emit("changeHot", {
				key: getLocal("showHot"),
				list: getLocal("hotList"),
			});
			this.drawerControl(["settings", "off"]);

			let res = values.every(({ name, oldVal, newVal }) => {
				return JSON.stringify(oldVal) === JSON.stringify(newVal);
			});
			if (res) {
				this.$message({
					message: "没有数据更改！",
					type: "warning",
				});
			} else {
				this.$message({
					message: "恭喜你，设置成功！",
					type: "success",
				});
			}
		},
	},
	watch: {
		"model.isLock": {
			handler() {
				if (!this.model.defaultID && this.model.isLock) {
					this.validateErr = false;
					this.model.defaultID = getLocal("defaultID");
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer.rtl {
	padding-bottom: 50px;
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
		@include themed() {
			color: t("text-color");
		}
		&:not(:last-of-type)::after {
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
				}
			}
			&.err .el-input__inner {
				border: 1px solid #f74444;
			}
		}

		.des {
			font-size: 14px;
			margin-top: 6px;
		}
		.errmsg {
			font-size: 14px;
			margin-top: 6px;
			color: #f74444;
		}

		.tagmessage {
			text-align: center;
			margin-top: 6px;
		}

		.hottags {
			display: flex;
			flex-flow: row wrap;
			justify-content: start;
			align-content: center;
			margin: 10px 0;

			.tag {
				border: 1px solid #00adeb;
				margin: 6px;
				padding: 6px 10px;
				border-radius: 4px;
				cursor: pointer;
				transition: 0.3s linear;

				&:hover {
					background: rgba($color: #00adeb, $alpha: 0.3);
				}
			}
		}
	}

	.save {
		width: 330px;
		height: 50px;
		border-radius: 0;
		color: #fff;
		font-size: 18px;
		letter-spacing: 2px;
		border: none;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.2s linear;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
		height: 0;
		opacity: 0;
	}
	.fade-leave, .fade-enter-to /* .fade-leave-active in <2.1.8 */ {
		height: 16px;
		opacity: 1;
	}
}
</style>