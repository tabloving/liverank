<template>
	<div id="container">
		<i class="el-icon-setting setting" @click="open('settings')"></i>
		<h2>{{ title }}</h2>
		<!-- search input -->
		<div class="search">
			<el-input
				clearable
				v-model.trim="keyword"
				:placeholder="placeholder"
				@keyup.enter.native.prevent="search"
			>
			</el-input>
			<div :class="[keyword ? '' : 'disabled', 'button']" @click="search">
				查询
			</div>
		</div>
		<!-- hot tags -->
		<div v-if="showHot" class="hotbox">
			<span
				class="hot"
				v-for="key in hotList"
				:key="key"
				@click="hotSearch(key)"
				>{{ key }}</span
			>
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
					<span class="cate">{{ liveInfo.cate }}</span>
				</div>
				<div class="user">
					<div class="userbox uname">
						<span class="label">UP</span>
						<span class="maincon" v-html="liveInfo.uname"></span>
					</div>
					<div class="userbox uid">
						<span class="label">UID</span>
						<span class="maincon">{{ liveInfo.uid }}</span>
					</div>
					<div class="userbox att">
						<span class="label">粉丝数</span>
						<span class="maincon">{{ liveInfo.fans }}</span>
					</div>
				</div>

				<div class="room">
					<div class="roombox rid">
						<span class="label">房间ID</span>
						<span class="maincon">{{ liveInfo.roomid }}</span>
					</div>
					<div class="roombox online">
						<span class="label">人气</span>
						<span class="maincon">{{ liveInfo.online }}</span>
					</div>
					<div class="roombox watched">
						<span class="label">看过</span>
						<span class="maincon">{{ liveInfo.watched }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="openMsg" @click="open('updatemsg')">更新公告</div>
		<update-msg :flag="updatemsg" ref="updatemsg"></update-msg>
		<settings
			:flag="settings"
			@changeHot="changeHot"
			ref="settings"
		></settings>
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
			title: "哔哩哔哩直播热度查询",
			placeholder: "请输入需要查询的主播、UID或房间号",
			keyword: "",
			key: defaultID,
			timer: null,
			showHot: true,
			hotList: [],
		};
	},
	created() {
		this.$store.commit("getData", this);
		// this.showHot = Storage.get("shwoHot");
		this.$nextTick(() => {
			if (this.$refs.settings.model.refresh) {
				this.doSearch(this);
			}
		});
	},
	mounted() {
		let dataInfo;
		this.$nextTick(() => {
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
					confirmButtonText: "知道啦",
					cancelButtonText: "不再提醒",
				})
					.then(() => {})
					.catch(() => {
						Storage.set("user", "vis", "20");
					});
			}
		});
	},
	computed: {
		...mapState(["liveInfo", "resData", "updatemsg", "settings"]),
		...mapGetters(["liveMsg", "toRoom", "liveTitle"]),
	},
	methods: {
		...mapMutations(["drawerControl"]),
		...mapActions(["doSearch"]),
		open(name) {
			this.drawerControl([name, "on"]);
		},
		search() {
			this.$Utils.clearTimer(this.timer);
			this.timer = setTimeout(() => {
				this.key = this.keyword;
				this.$store.commit("getData", this);
				this.$Utils.clearTimer(this.timer);
			}, 300);
		},
		hotSearch(key) {
			this.keyword = key;
			this.search();
		},
		changeHot({ key, list }) {
			this.showHot = key;
			this.hotList = list;
		},
	},
};
</script>

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
	width: 64%;
	min-width: 800px;
	box-sizing: border-box;
	// border: 1px solid red;
	margin: 60px auto 0;
	padding: 40px 60px 80px;
	position: relative;
	border-radius: 10px;
	@include themed() {
		background: t("sec-bg");
		box-shadow: t("box-shadow");
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

h2 {
	font-size: 26px;
	letter-spacing: 1px;
	text-align: center;
	margin-top: 30px;
	color: #00adeb;
}

.search {
	margin-top: 30px;
	height: 46px;
	text-align: center;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}

.search .el-input {
	width: 500px;
	height: 100%;
	font-size: 20px;
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
}

.search ::v-deep .el-input__inner:focus {
	border: 1px solid #00adeb;
	border-right: 1px solid transparent;
}

.search .button {
	width: 80px;
	line-height: 46px;
	font-size: 20px;
	background-color: #00adeb;
	color: #fff;
	font-weight: bold;
	letter-spacing: 2px;
	cursor: pointer;
	transition: all 0.4s linear;
}

.button.disabled {
	// pointer-events: none;
	cursor: not-allowed;
	background-color: #00adeb8f;
}

.mainInfo {
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-content: center;
	margin-top: 30px;
}

.uface {
	width: 86px;
	height: 86px;
	border-radius: 50%;
	background-color: #00adeb;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	background-image: url(@/assets/uface.svg);
	background-repeat: no-repeat;
	background-position: center center;
	margin-top: 20px;
	border: 4px solid gray;
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
	width: 74%;
	align-items: center;
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

.user,
.room {
	display: flex;
	flex-flow: row nowrap;
	align-content: center;
	height: 30px;
	line-height: 30px;
	font-size: 14px;
	margin-top: 8px;
}

.userbox {
	border: 1px solid #5c968e;
	margin: 0 6px;
	display: flex;
}

.roombox {
	border: 1px solid #8d7ca6;
	margin: 0 6px;
	display: flex;
}

.label {
	width: 60px;
	display: inline-block;
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

.userbox .label {
	background-color: #5c968e;
}

.roombox .label {
	background-color: #8d7ca6;
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
		margin: 0 6px;
		padding: 6px 10px;
		border-radius: 4px;
		cursor: pointer;
		transition: 0.3s linear;

		&:hover {
			background: rgba($color: #00adeb, $alpha: 0.3);
		}
	}
}
</style>
