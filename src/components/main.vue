<template>
	<div id="container">
		<i class="el-icon-setting setting" @click="open('settings')"></i>
		<!-- 语言设置 -->
		<el-dropdown trigger="click" @command="changeLang">
			<span class="el-dropdown-link">
				{{ LANG }}
				<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item
					v-for="lang in languages"
					:key="lang.flag"
					:command="lang.flag"
					:disabled="lang.flag === $i18n.locale"
					>{{ lang.label }}</el-dropdown-item
				>
			</el-dropdown-menu>
		</el-dropdown>
		<h2>
			<a href="/">{{ $t(title) }}</a>
		</h2>

		<!-- search input -->
		<div :class="['search', keyword ? 'actived' : '']">
			<!-- 搜索主体 -->
			<el-input
				v-if="showHot"
				clearable
				ref="input"
				v-model.trim="keyword"
				:placeholder="$t(placeholder)"
				@keyup.enter.native.prevent="search"
			>
			</el-input>
			<el-autocomplete
				v-else
				clearable
				ref="input"
				popper-class="suggest-autocomplement"
				v-model.trim="keyword"
				:placeholder="$t(placeholder)"
				:trigger-on-focus="false"
				:fetch-suggestions="suggest"
				@keyup.enter.native.prevent="search"
				@select="search"
			>
				<template slot-scope="{ item }">
					<div class="value">{{ item.value }}</div>
					<span class="label">{{ item.label }}</span>
				</template>
			</el-autocomplete>
			<el-button type="primary" :icon="$i18n.locale === 'zh' ? '' : 'el-icon-search'" :disabled="!keyword" @click="search">
				{{$t('Main.search')}}
			</el-button>
		</div>

		<!-- hot tags -->
		<div v-if="showHot" class="hotbox">
			<el-tooltip
				v-for="key in hotList"
				:key="key.value"
				placement="top"
				:content="key.value"
			>
				<span
					:class="[
						'hot',
						key.label === keyword || key.value === keyword ? 'active' : '',
					]"
					@click="hotSearch(key.value)"
					>{{ key.label }}</span
				>
			</el-tooltip>
		</div>
		<!-- main info -->
		<div class="mainInfo">
			<div :class="[liveInfo.status ? 'live' : '', 'uface']">
				<img v-if="resData" class="ufacecover" :src="liveInfo.uface" />
				<div :class="[liveInfo.status ? 'live' : 'off', 'status']">
					<span class="liveicon" v-if="liveInfo.status"></span>
					<span>{{ liveMsg }}</span>
				</div>
			</div>

			<div class="livedata">
				<div class="livetit">
					<a v-if="resData" :href="toRoom" target="_blank"
						><span class="tit" v-html="liveTitle"></span
					></a>
					<a v-else href="javascript:void(0)"
						><span class="tit" v-html="liveTitle"></span
					></a>
					<span class="cate">{{ $t(liveInfo.cate) }}</span>
				</div>

				<div class="info-card">
					<div class="card userbox uname">
						<span class="label">{{$t('Main.liveInfo.label.up')}}</span>
						<span class="maincon" v-html="$t(liveInfo.uname)"></span>
					</div>
					<div class="card userbox uid">
						<span class="label">{{$t('Main.liveInfo.label.uid')}}</span>
						<span class="maincon">{{ $t(liveInfo.uid) }}</span>
					</div>
					<div class="card userbox att">
						<span class="label">{{$t('Main.liveInfo.label.fans')}}</span>
						<span class="maincon">{{ $t(liveInfo.fans) }}</span>
					</div>

					<div class="card roombox rid">
						<span class="label">{{$t('Main.liveInfo.label.roomid')}}</span>
						<span class="maincon">{{ $t(liveInfo.roomid) }}</span>
					</div>
					<div class="card roombox online">
						<span class="label">{{$t('Main.liveInfo.label.online')}}</span>
						<span class="maincon">{{ $t(liveInfo.online) }}</span>
					</div>
					<div class="card roombox watched">
						<span class="label">{{$t('Main.liveInfo.label.watched')}}</span>
						<span class="maincon">{{ $t(liveInfo.watched) }}</span>
					</div>

					<div class="livetime" v-if="liveInfo.status">
						<div class="card timebox starttime">
							<span class="label">{{$t('Main.liveInfo.label.start')}}</span>
							<span class="maincon">{{ liveInfo.live_time }}</span>
						</div>

						<div class="card timebox liveduring">
							<span class="label">{{$t('Main.liveInfo.label.during')}}</span>
							<span class="maincon">{{ liveduring }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="openMsg" @click="open('updatemsg')">{{$t('Main.changelog')}}</div>
		<update-msg :flag="updatemsg" ref="updatemsg"></update-msg>
		<settings :flag="settings" @changeHot="changeHot" ref="settings"></settings>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import updateMsg from "./updateMsg.vue";
import Storage from "../storage";
import Settings from "./settings.vue";

let defaultID = Storage.get("defaultID") || "变质的洋流";
export default {
	name: "Main",
	components: {
		updateMsg,
		Settings,
	},
	data() {
		return {
			title: "Main.title",
			placeholder: "Main.placeholder",
			keyword: "",
			key: defaultID,
			timer: null,
			showHot: true,
			hotList: [],
			languages: [
				{ flag: "zh", label: "简体中文" },
				{ flag: "en", label: "English" },
			],
		};
	},
	created() {
		let session = window.sessionStorage.getItem("keyword");
		this.key = session ?? this.key;
		this.keyword = session;
		this.$store.commit("getData", this);
		this.$nextTick(() => {
			if (this.$refs.settings.model.refresh) {
				this.doSearch(this);
			}
		});
	},
	mounted() {
		let dataInfo;
		this.$nextTick(() => {
			this.$refs.input.focus();
			dataInfo = this.$refs.updatemsg.list[0];
			let title = `${dataInfo.date} 更新公告`;
			let str = dataInfo.main
				.map((item, index) => {
					return index === 0
						? `<ol style="margin-top:8px"> ${index + 1}. ${item} </ol>`
						: `<ol> ${index + 1}. ${item} </ol>`;
				})
				.join("");
			let content = `${dataInfo.des}主要内容为：${str}`;
			if (!Storage.get("user")) {
				this.$confirm(content, title, {
					closeOnPressEscape: false,
					closeOnClickModal: false,
					showClose: false,
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.$t('Main.message.confirm'),
					cancelButtonText: this.$t('Main.message.cancel'),
				})
					.then(() => {})
					.catch(() => {
						Storage.set("user", "vis", "20");
					});
			}
		});
	},
	computed: {
		...mapState(["liveInfo", "resData", "updatemsg", "settings",'lang']),
		...mapGetters(["liveMsg", "toRoom", "liveTitle"]),
		LANG(){
			return this.lang === 'en' ? 'English' : '简体中文'
		},
		liveduring() {
			return this.calcLiveDuring(this.liveInfo["live_time"]);
		},
	},
	methods: {
		...mapMutations(["drawerControl",'changeLang']),
		...mapActions(["doSearch"]),
		open(name) {
			this.drawerControl([name, "on"]);
		},
		suggest(query, cb) {
			let list = this.hotList.map((item) => {
				return { value: item.value, label: item.label };
			});
			const result = query ? list.filter(this.createFilter(query)) : list;
			cb(result);
		},
		createFilter(queryString) {
			return (item) => {
				return (
					item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 ||
					item.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
				);
			};
		},
		search() {
			this.timer = this.$Utils.clearTimer(this.timer);
			let activedTag = this.hotList.find((tag) => {
				return this.keyword === tag.label;
			});
			this.keyword = (activedTag && activedTag.value) ?? this.keyword;
			this.timer = setTimeout(() => {
				this.key = this.keyword;
				this.$store.commit("getData", this);
				this.timer = this.$Utils.clearTimer(this.timer);
			}, 300);

			window.sessionStorage.setItem("keyword", this.keyword);
		},
		hotSearch(key) {
			this.keyword = key;
			this.search();
		},
		changeHot({ key, list }) {
			this.showHot = key;
			this.hotList = list;
		},
		calcLiveDuring(date) {
			date = date.replace(/-/g, "/"); // 兼容IOS上显示 NaN
			let startTime = new Date(date).getTime(); // 开始时间
			let endTime = Date.now(); // 结束时间
			let usedTime = endTime - startTime; // 相差的毫秒数
			let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
			let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
			let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
			let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
			let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
			let leavel3 = leavel2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
			let seconds = Math.floor(leavel3 / 1000);
			let d = days ? this.$t('Main.liveInfo.time.day',{days: days}) : "";
			let h = hours ? this.$t('Main.liveInfo.time.hour',{hours: hours}) : (d ? this.$t('Main.liveInfo.time.hour',{hours: 0}) : "");
			let diff = `${d} ${h} ${this.$t('Main.liveInfo.time.min',{mins: minutes})}`;
			return diff.trim();
		},
	},
};
</script>
<style lang="scss">
.suggest-autocomplement {
	li[id*="el-autocomplete-"] {
		line-height: normal;
		padding: 7px 10px;
		display: flex !important;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: start;
		.value {
			text-overflow: ellipsis;
			overflow: hidden;
			margin-right: 6px;
		}
		.label {
			font-size: 12px;
			color: #b4b4b4;
			border: 1px solid #ddd;
			width: auto;
			padding: 2px 6px;
			border-radius: 4px;
			text-align: center;
		}
	}
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@keyframes SettingAni {
	0% {
		transform: rotate(0deg);
	}

	25% {
		transform: rotate(90deg);
	}

	50% {
		transform: rotate(180deg);
	}

	75% {
		transform: rotate(270deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

#container {
	width: 56%;
	min-width: 750px;
	max-width: 800px;
	box-sizing: border-box;
	margin: 60px auto 0px;
	padding: 40px 60px 80px;
	position: relative;
	border-radius: 10px;
	@include themed() {
		background: t("sec-bg");
		box-shadow: t("box-shadow");
	}
}

.el-dropdown {
	font-size: 16px;
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	cursor: pointer;
	@include themed() {
		color: t("text-color");
	}
}

.setting {
	font-size: 28px;
	position: absolute;
	top: 20px;
	right: 20px;
	cursor: pointer;
	@include themed() {
		color: t("text-color");
	}
	animation: SettingAni 5s infinite;

	&:hover {
		color: #00adeb;
	}
}

h2 a {
	font-size: 26px;
	letter-spacing: 1px;
	text-align: center;
	margin-top: 30px;
	color: #00adeb;
	transition: all 0.6s linear;
	text-decoration: underline wavy rgba($color: #00adeb, $alpha: 0) 2px;
	text-underline-offset: 6px;
	&:hover {
		text-decoration: underline wavy rgba($color: #00adeb, $alpha: 1) 2px;
	}
}

.search {
	max-width: 500px;
	margin: 30px auto 0;
	height: 46px;
	text-align: center;
	position: relative;
	transform: translateX(-8.5px);
	border-radius: 6px;

	&::before,
	&::after {
		@include themed() {
			background-image: t("bg-top");
		}
		$height: 10px;
		content: "";
		box-sizing: border-box;
		width: 100%;
		height: $height;
		border: 1px solid #fff;
		position: absolute;
		top: -$height;
		left: 0;
		transform: skew(-60deg);
		transform-origin: bottom left;
		transition: all 0.4s linear;
	}

	&::after {
		content: "X";
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		text-align: center;
		line-height: 46px;
		width: 17px;
		height: 100%;
		top: 0;
		left: 100%;
		transform: skew(0, -30deg);
		transform-origin: top left;
		@include themed() {
			background: t("bg-side");
		}
	}

	&.actived {
		&::before {
			@include themed() {
				background-image: t("bg-top-active");
			}
		}
		&::after {
			content: "❤";
			font-size: 8px;
			color: #f74444;
			font-weight: bold;
			@include themed() {
				background: t("bg-side-active");
			}
		}
	}

	.el-input {
		width: calc(100% - 80px);
		height: 100%;
		font-size: 20px;
	}

	.el-autocomplete ::v-deep {
		height: 100%;
		width: calc(100% - 80px);
		.el-input {
			@extend .el-input;
			width: 100%;
		}
	}
}

::v-deep .el-input__inner {
	padding: 0;
	height: 100%;
	border: 1px solid #57d59a;
	border-right: 1px solid transparent;
	outline: none;
	text-indent: 1em;
	border-radius: 0;
	color: #00adeb;
	transition: 0.4s linear;
	border-radius: 4px 0 0 4px;
}

.search ::v-deep .el-input__inner:focus {
	border: 1px solid #00adeb;
	border-right: 1px solid transparent;
}

.search .el-button {
	width: 80px;
	font-size: 20px;
	background-color: #00adeb;
	color: #fff;
	font-weight: bold;
	letter-spacing: 2px;
	border-radius: 0 4px 4px 0;
	transition: all 0.4s linear;
	vertical-align: bottom;
}

.el-button.is-disabled {
	background-color: #00adeb8f;
}

.mainInfo {
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
}

.uface {
	width: 86px;
	height: 86px;
	border-radius: 50%;
	background-color: #00adeb;
	display: flex;
	flex-shrink: 0; // 解决当未查找到直播用户时的缩放问题
	justify-content: center;
	align-items: center;
	position: relative;
	background-image: url(@/assets/uface.svg);
	background-repeat: no-repeat;
	background-position: center center;
	margin-top: 20px;
	border: 4px solid gray;
	margin-right: 8px;
}

.uface.live {
	border: 4px solid #ff6699;
}

.ufacecover {
	width: 82px;
	height: 82px;
	border-radius: 50%;
}

.uface .status {
	position: absolute;
	width: 80px;
	height: 32px;
	border: 4px solid white;
	border-radius: 12px;
	bottom: -10px;
	font-size: 14px;
	text-align: center;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
}

.liveicon {
	display: inline-block;
	margin-right: 4px;
	width: 16px;
	height: 16px;
	background-image: url(@/assets/live.gif);
	background-size: cover;
}

.status.live {
	background-color: #ff6699;
}

.status.off {
	background-color: #999;
}

.livedata {
	display: flex;
	flex-flow: column wrap;
	align-items: center;
	overflow: hidden;
}

.livetit {
	font-size: 22px;
	color: #00adeb;
	font-weight: bold;
	margin-bottom: 6px;
}

.livetit a:after {
	content: "";
	width: 0;
	height: 2px;
	background: #57d59a;
	position: absolute;
	bottom: -6px;
	left: 0;
	transition: all 0.5s linear;
}

.livetit:hover a:after {
	width: 100%;
	background: #00adeb;
}

.livetit .cate {
	display: inline-block;
	border: 1px solid #00adeb;
	font-size: 14px;
	padding: 2px 6px;
	border-radius: 4px;
	margin-left: 8px;
	position: relative;
	top: -1px;
}

.info-card {
	display: flex;
	flex-flow: row wrap;
	align-content: center;
	justify-content: center;

	.livetime {
		display: flex;
		flex-flow: row wrap;
	}

	.card {
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		margin: 6px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
	}
	.userbox {
		border: 1px solid #5c968e;
	}

	.roombox {
		border: 1px solid #8d7ca6;
	}

	.timebox {
		border: 1px solid #fb8bab;
	}

	.label {
		width: 60px;
		color: white;
	}

	.maincon {
		width: 100px;
		display: inline-block;
		@include themed() {
			color: t("text-color");
		}
	}

	.uname .maincon {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.timebox .maincon {
		width: 168px;
	}

	.userbox .label {
		background-color: #5c968e;
	}

	.roombox .label {
		background-color: #8d7ca6;
	}

	.timebox .label {
		background-color: #fb8bab;
		width: 80px;
	}
}

.openMsg {
	position: absolute;
	bottom: 14px;
	right: 30px;
	color: #999;
	cursor: pointer;
	transition: color 0.3s linear;

	&:hover {
		color: #00adeb;
	}
}

.hotbox {
	@include themed() {
		color: t("text-color");
	}
	text-align: left;
	// color:#00adeb;
	margin: 10px 0;
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: center;

	.hot {
		border: 1px solid #00adeb;
		margin: 6px;
		padding: 6px 10px;
		border-radius: 4px;
		cursor: pointer;
		transition: 0.3s linear;

		&:hover,
		&.active {
			background: rgba($color: #00adeb, $alpha: 0.3);
		}
	}
}

@media screen and (max-width: 640px) {
	#container {
		width: 96%;
		min-width: 90%;
		max-width: 98%;
		padding: 20px 20px 60px;
		margin: 20px auto;

		h2 a {
			margin-top: 50px;
		}

		::v-deep .search .el-input {
			font-size: 14px;
		}

		.mainInfo {
			flex-flow: column wrap;
			align-items: center;
			justify-content: center;

			.livedata {
				width: 100%;
				margin-top: 20px;
				flex-flow: column wrap;
				align-items: center;
				justify-content: center;

				.info-card {
					.card {
						flex: 1;
					}
				}

				.livetime {
					justify-content: center;
				}

				.livetit {
					margin-bottom: 16px;
				}

				.maincon {
					width: 92px;
				}

				.timebox {
					.maincon {
						width: 168px;
					}
				}
			}
		}
	}
}
</style>
