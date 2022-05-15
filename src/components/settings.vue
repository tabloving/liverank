
<template>
	<el-drawer
		:title="$t('Settings.title')"
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
				{{ $t(item.title) }}
			</p>
			<el-input
				v-if="item.type === 'input'"
				:maxlength="item.maxlength"
				v-model.trim="model[item.model]"
				:class="[item.validate && validateErr ? 'err' : '']"
				:placeholder="$t(item.placeholder)"
				:disabled="model[item.disabledKey]"
				:ref="item.refName"
				@keyup.enter.native="validate(item['validateMethod'])"
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
					{{ $t(item.validatemsg) }}
				</p>
			</transition>
			<!-- 描述 -->
			<p v-if="item.des" class="des">{{ $t(item.des,{days: STORE_DAYS}) }}</p>
			<!-- 快捷标签 -->
			<div class="hottags" v-if="item.tags && model.hotList.length">
				<span
					class="tag"
					v-for="(tag, index) in model[item.list]"
					:key="tag.value"
				>
					<span class="label">
						{{ tag.label }}
					</span>
					<span class="value">
							{{ tag.value }}
					</span>
					<i class="el-icon-circle-close" @click="deleteTag(index)"></i
				></span>
			</div>
			<!-- empty placehodler -->
			<el-empty class="tagmessage" :image-size="80" v-if="item.tags && !model.hotList.length" :description="$t('Settings.validateMsg.addTag.noTags')"></el-empty>
		</section>

		<el-button
			type="primary"
			class="save"
			@click="handleSave"
			:disabled="validateErr"
			>{{$t('Settings.save')}}</el-button
		>
	</el-drawer>
</template>

<script>
import Storage from "../storage";
import { mapMutations } from "vuex";
const STORE_DAYS = 20;
const DEFAULT_ID = "变质的洋流";
const REG = /^(.+)[:：/](.+)$/;
function getLocal(name) {
	return Storage.get(name);
}
function setLocal(name, value) {
	Storage.set(name, value, STORE_DAYS);
}
export default {
	name: "Settings",
	props: ["flag", "changeHot"],
	inject: ["VERSION"],
	data() {
		return {
			validateErr: false,
			STORE_DAYS: 20,
			model: {
				isDark: false,
				refresh: true,
				isLock: true,
				showHot: true,
				tagInput: "",
				isFull: false,
				hotList: [
					{ value: "是超可爱吖", label: "可爱姐" },
					{ value: "lolm烟火", label: "烟火" },
					{ value: "哔哩哔哩英雄联盟赛事", label: "LOL赛事" },
					{ value: "谭乔", label: "谭Sir" },
					{ value: "远古时代装机猿", label: "装机猿" },
				],
				defaultID: DEFAULT_ID,
			},
			list: [
				{
					title: 'Settings.defaultSearch.title',
					type: "input",
					des: `Settings.defaultSearch.des`,
					placeholder: "Settings.defaultSearch.placeholder",
					validate: true,
					maxlength: 10,
					validatemsg: "Settings.defaultSearch.validatemsg",
					validateMethod: "validateDefaultID",
					model: "defaultID",
					refName: "defaultID",
					disabledKey: "isLock",
				},
				{ title: "Settings.lockDefault.title", type: "switch", model: "isLock" },
				{ title: "Settings.darkMode.title", type: "switch", model: "isDark" },
				{
					title: "Settings.autoRefresh.title",
					type: "switch",
					des: "Settings.autoRefresh.des",
					model: "refresh",
					disabled: true,
				},
				{
					title: "Settings.hotTags.title",
					type: "switch",
					model: "showHot",
				},
				{
					title: "Settings.setHotTags.title",
					type: "input",
					model: "tagInput",
					maxlength: 15,
					disabledKey: "isFull",
					refName: "addTag",
					tags: true,
					list: "hotList",
					placeholder: "Settings.setHotTags.placeholder",
					validateMethod: "validateHotTag",
					des: 'Settings.setHotTags.des'
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

		let V = getLocal('VERSION')
		V !== this.VERSION && localStorage.clear()
		V !== this.VERSION && setLocal('VERSION',this.VERSION)

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
			let str = this.$refs.addTag[0].value;
			let val = REG.exec(str) ? REG.exec(str)[2] : str;
			let label = REG.exec(str) ? REG.exec(str)[1] : str;
			let list = this.model.hotList;

			if (!list.length) {
				this.addTag(val, label);
			} else {
				let res = list.some((tag) => {
					return tag.label === label || tag.value === val;
				});
				if (res) {
					this.$message({
						type: "error",
						message: this.$t('Settings.validateMsg.isExist'),
					});
				} else {
					this.addTag(val, label);
				}
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
					this.$t('Settings.validateMsg.confirm.content'),
					this.$t('Settings.validateMsg.confirm.title')
				)
					.then((_) => {
						for (let i of target) {
							this.model[i] = getLocal(i);
						}
						this.validateErr = false;

						this.drawerControl(["settings", "off"]);
						this.$message({
							message: this.$t('Settings.validateMsg.cancel'),
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
				document.documentElement.setAttribute("data-theme", "dark");
			} else {
				window.document.documentElement.setAttribute("data-theme", "light");
			}
		},
		addTag(val, label) {
			if(!this.model.tagInput) return;
			let len = this.model.hotList.length;
			if (len < 5) {
				this.model.tagInput = "";
				this.model.hotList.push({ value: val, label: label });
			} else {
				this.model.isFull = true;
				this.model.tagInput = this.$t('Settings.validateMsg.addTag.input');
				this.$message({
					type: "error",
					message: this.$t('Settings.validateMsg.addTag.message'),
				});
			}
		},
		deleteTag(index) {
			this.model.hotList.splice(index, 1);
			this.model.isFull = false;
			this.model.tagInput = "";
			this.$nextTick(() => {
				this.$refs.addTag[0].focus();
			});
		},
		handleSave() {
			this.validateDefaultID();
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
					message: this.$t('Settings.validateMsg.save.noChange'),
					type: "warning",
				});
			} else {
				this.$message({
					message: this.$t('Settings.validateMsg.save.success'),
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
		"model.defaultID":{
			handler(){
				if(!this.model.isLock && !this.model.defaultID){
					this.validateErr = true;
				}else{
					this.validateErr = false;
				}
			}
		}
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
			// text-align: center;
			// margin-top: 6px;
			padding: 20px 0;
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
				word-break: break-word;
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
				align-content: center;

				&:hover {
					background: rgba($color: #00adeb, $alpha: 0.3);

					.label{
						background:rgba(#fff,0.8);
					}
				}

				.label {
					padding: 4px 6px;
					background: rgba(0, 173, 235, 0.3);
					font-size: 12px;
					border-radius: 4px;
					margin-right: 4px;
				
				}
				.label,
				.value,
				.el-icon-circle-close{
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.value{
					margin-right: 6px;
					flex:2
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