<template>
  <el-menu
      :default-active="cacheData.activeIndex"
      class="el-menu-vertical-demo"
      router
      style="height: 100%"
  >
    <el-menu-item index="home">
      <span>INSIM主页</span>
    </el-menu-item>
    <el-sub-menu index="">
      <template #title>
        <span>模型参数</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="baseData">
          <span>井点信息</span>
        </el-menu-item>
        <el-menu-item index="connectModel">
          <span>联通单元</span>
        </el-menu-item>
        <el-sub-menu index="">
          <template #title>
            <span>生产历史</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="historyL">
              <span>单井产液量</span>
            </el-menu-item>
            <el-menu-item index="">
              <span>单井含水率</span>
            </el-menu-item>
            <el-menu-item index="">
              <span>小层劈分</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

      </el-menu-item-group>
    </el-sub-menu>


    <el-sub-menu index="">
      <template #title>
        <span>历史拟合</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="4">
          <span>选项1</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script >
import {defineComponent, reactive} from "vue";

export default defineComponent({
  name: "AsideMenu",
  setup(){
    let cacheData=reactive({
      key: "value",
      activeIndex: "home"
    })
    return {cacheData}
  },
  created() {
    this.cacheData.activeIndex=window.location.pathname.split("/")[2] //获取当前网址所在位置，激活对应
    console.log("一级目录是"+window.location.pathname.split("/")[2])
  }

})

</script>

<style scoped>

</style>