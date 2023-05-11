<template>
  <div class="insimApp" style="display: flex;flex-direction: row;height: 100%" >
    <el-container>
      <el-aside width="10%">
        <aside-menu></aside-menu>
      </el-aside>
<!--ConnectModel-->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"  v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <component :is="Component"  v-if="!$route.meta.keepAlive"/>
      </router-view>


    </el-container>
  </div>

</template>

<script >
import AsideMenu from "@/components/AsideMenu";
import {defineComponent, nextTick, onMounted, reactive, ref, toRef} from "vue";
export default defineComponent({
  name: "InsimAppView",
  components: {AsideMenu}
})

</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>