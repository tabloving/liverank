<template>
	<el-drawer
		:title="$t('Main.changelog')"
		:visible.sync="flag"
		direction="rtl"
		:before-close="close"
	>
		<div class="section notice" v-if="notice.show">
			<span class="pin">📌</span>
			<span class="watermark">{{ notice.watermark }}</span>
			<div class="title">{{ $t(notice.title) }}</div>
			<div class="content">{{ $t(notice.content) }}</div>
			<div class="sign">{{ notice.sign }}</div>
		</div>

		<el-timeline>
			<el-timeline-item
				:timestamp="item.date"
				type="success"
				icon="el-icon-circle-check"
				placement="top"
				:key="item.date"
				v-for="item in list"
			>
				<div class="section">
					<div class="title">{{ `${item.date} ${$t('Main.updateList.title')}`}} </div>
					<div class="des">{{ `${item.des} ${$t('Main.updateList.main')}` }}</div>
					<ul v-for="(detail, index) in item.main" :key="detail">
						<li>{{ index + 1 }}. {{ detail }}</li>
					</ul>
				</div>
			</el-timeline-item>
		</el-timeline>

		<div class="bottom-line">
			<div class="bottom-text">{{$t('Main.isBottom')}}</div>
		</div>
	</el-drawer>
</template>

<script>
import { mapMutations } from "vuex";
export default {
	props: ["flag"],
	data() {
		return {
			notice: {
				show: true,
				title: 'Main.letter.title',
				content: 'Main.letter.content',
				sign: "2022-5-14 变质的洋流",
				watermark: "Bye",
			},
			list: [
				{
					date: "2022.5.14",
					des: "快捷搜索功能完善与优化，完成移动端适配。",
					main: [
						"新增直播时间显示",
						"新增移动端样式适配",
						"关闭快捷标签，输入时新增联想提示",
						"开启快捷标签，新增点击后的标签样式区分",
						"优化请求处理逻辑",
						"修复校验时未区分组件的样式问题",
					],
				},
				{
					date: "2022.5.10",
					des: "新增快捷搜索、BUG FIXED。",
					main: [
						"新增快捷搜索入口",
						"自定义快捷开关",
						"自定义快捷搜索关键字",
						"修复部分按钮不起作用的问题",
						"其它问题修正，样式优化",
					],
				},
				{
					date: "2022.5.8",
					des: "版本2.0发布。功能迁移，修复BUG。",
					main: [
						"设置界面全新优化",
						"新增夜间模式开关",
						"修复自动更新数据引起的频闪问题",
					],
				},
				{
					date: "2022.4.20",
					des: "本次更新主要新增部分功能，修复BUG。",
					main: [
						"修复了特殊响应不兼容等问题",
						"新增输入框回车搜索",
						"修复请求频繁触发的问题",
					],
				},
				{
					date: "2022.4.12",
					des: "本次更新对代码进行全面重构，优化计算逻辑。",
					main: [
						"修复定时器错误运行等问题",
						"新增信息提示，释放冗余内存",
						"新增自定义默认搜索房间",
					],
				},
				{
					date: "2022.4.8",
					des: "UI优化，视觉区分明显。",
					main: [
						"UI美化，在线与离线有颜色提示",
						"新增点击标题跳转到直播间",
						"对未知数据进行定义默认值",
						"其它问题修复",
					],
				},
				{
					date: "2022.4.6",
					des: "初版发布，能实现基本查询。",
					main: [
						"实现基本查询功能",
						"支持UP名、UID、房间ID等查询条件",
						"能够查询B站取消显示的人气数",
						"自动定时刷新数据",
					],
				},
			],
		};
	},
	methods: {
		...mapMutations(["drawerControl"]),
		close() {
			this.drawerControl(["updatemsg", "off"]);
		},
	},
};
</script>

<style scoped lang="scss">
::v-deep .el-drawer.rtl {
	// overflow-x: visible;
	.el-timeline-item {
		.el-timeline-item__tail {
			left: 10px;
		}
		.el-timeline-item__node {
			left: 5px;
		}
		.el-timeline-item__wrapper {
			padding: 0;
			.el-timeline-item__timestamp {
				text-align: left;
				text-indent: 2em;
			}
		}
	}

	.section {
		width: 86%;
		border: 1px solid #f2f2f2;
		border-radius: 8px;
		padding: 14px 18px;
		text-align: left;
		font-size: 16px;
		margin: 0px 7%;
		box-shadow: 4px 4px 14px #ddd;
		color: #666;
		user-select: none;

		&.notice {
			position: relative;
			transform: rotate(-2deg);
			margin-top: 20px;
			margin-bottom: 30px;
			transform-origin: top right;

			&:hover {
				animation: NoticeShake 1s ease-in-out 10 alternate;
			}

			@keyframes NoticeShake {
				0%,
				100% {
					transform: rotate(-2deg);
				}
				50% {
					transform: rotate(0deg);
				}
			}
			.pin {
				position: absolute;
				font-size: 20px;
				top: -10px;
				right: -6px;
			}
			.watermark {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #eaeaea;
				font-size: 100px;
				z-index: -1;
				letter-spacing: 10px;
				filter: blur(1.2px);
			}
			.title {
				text-align: center;
				letter-spacing: 1px;
				position: relative;
				&::after {
					$width: 40%;
					content: "";
					width: $width;
					height: 12px;
					background-color: rgba(#f03a17, 0.4);
					position: absolute;
					bottom: 2px;
					left: calc((100% - $width) / 2);
					z-index: -1;
				}
			}
			.content {
				line-height: 1.6;
				text-indent: 2em;
				text-align: justify;
				text-decoration: underline rgba(#f03a17, 0.5);
				text-underline-offset: 4px;
			}
			.sign {
				margin-top: 4px;
				text-align: right;
			}
		}

		.title {
			font-size: 20px;
			color: #00adeb;
			margin: 0 0 8px;
		}

		.des {
			margin-bottom: 6px;
			@include themed() {
				color: t("text-color");
			}
		}

		li {
			line-height: 1.6;
		}
	}

	.bottom-line {
		background-color: #dcdfe6;
		position: relative;
		height: 1px;
		width: 94%;
		margin: 24px 0;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);

		.bottom-text {
			position: absolute;
			background-color: #fff;
			padding: 0 10px;
			font-weight: 500;
			color: #ccc;
			font-size: 14px;
			left: 50%;
			transform: translateX(-50%) translateY(-50%);
		}
	}
}
</style>