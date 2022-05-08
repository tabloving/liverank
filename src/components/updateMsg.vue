<template>
	<el-drawer
		title="更新公告"
		:visible.sync="flag"
		direction="rtl"
		:before-close="close"
	>
		<div class="section" :key="item.date" v-for="item in list">
			<div class="title">{{ item.date }} 更新清单</div>
			<div class="des">{{ item.des }} 主要内容为：</div>
			<ul v-for="(detail, index) in item.main" :key="detail">
				<li>{{ index + 1 }}. {{ detail }}</li>
			</ul>
		</div>
	</el-drawer>
</template>

<script>
import { mapMutations } from "vuex";
export default {
	props: ["flag"],
	data() {
		return {
			list: [
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
            "支持房间号、UID、房间ID等查询条件",
						"能够查询B站取消显示的人气数",
						"自动定时刷新数据",
					],
				},
			],
		};
	},
	methods: {
		...mapMutations(["drawerControl"]),
		close(){
			this.drawerControl(['updatemsg','off'])
		}
	},
};
</script>

<style scoped lang="scss">
::v-deep .el-drawer.rtl {
	// overflow-x: visible;
	.section {
		width: 86%;
		border: 1px solid #f2f2f2;
    border-radius: 8px;
		padding: 14px 18px;
		text-align: left;
		font-size: 16px;
		margin: 20px 7%;
		box-shadow: 4px 4px 14px #ddd;
		color: #666;

		.title {
			font-size: 20px;
			color: #00adeb;
			margin: 0 0 8px;
		}

		.des {
			margin-bottom: 6px;
		}

		li {
			line-height: 1.6;
		}
	}
}
</style>