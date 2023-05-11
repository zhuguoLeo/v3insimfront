<template>
  <div style="width: 100%">
    <h1>修改1111</h1>
    <el-button @click="add" type="text" size="small" icon="CirclePlus">添加</el-button>
  </div>
  <el-table border :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="序号" width="50" type="index" align="center"
                     :index="index=>index+1"/>
    <el-table-column prop="name" label="姓名" align="center">
      <template #default="scope">
        <span v-show="!scope.row.editFlag">{{scope.row.name}}</span>
        <el-input v-show="scope.row.editFlag"
                  v-model="scope.row.name">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column prop="age" label="年龄" align="center">
      <template #default="scope">
        <span v-show="!scope.row.editFlag">{{scope.row.age}}</span>
        <el-input v-show="scope.row.editFlag"
                  v-model="scope.row.age">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="scope">
        <div style="display: flex;">
          <el-button size="small"
                     type="text"
                     icon="CircleCheck"
                     v-show="scope.row.editFlag"
                     @click="submit(scope.row)">确定
          </el-button>
          <el-button size="small"
                     type="text"
                     icon="CircleClose"
                     v-show="scope.row.editFlag"
                     @click="cancel(scope.row,scope.$index)">取消
          </el-button>
          <el-button size="small"
                     icon="Edit"
                     type="text"
                     v-show="!scope.row.editFlag"
                     @click="edit(scope.row)"> 编辑
          </el-button>
          <el-button size="small"
                     icon="Delete"
                     type="text"
                     v-show="!scope.row.editFlag"
                     @click="del(scope.row.$index)">删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  </template>

<script>
import {reactive, ref} from "vue";
import request from "@/utils/api";

export default {
  name: "historyL",
  setup(){

    let tableData=ref({List:[{
        'name': '',
        'age': '',
        'editFlag': true,  // 可编辑标识
        'isSubmit': false, // 是否点击确定标识
      }]})

    let cacheDatal= {currentPage:1}
    let total=1
    const add = () => {
      console.log(tableData.value.List)
      tableData.value.List.push(
          {
            'name': '1',
            'age': '1',
            'editFlag': true,  // 可编辑标识
            'isSubmit': false, // 是否点击确定标识
      })
    };
    // 确定
    const submit= (row) => {
      row.editFlag = false
      row.isSubmit = true
    };
    // 取消
    const cancel = (row, index) => {
      row.editFlag = false
      if (row.isSubmit) {
        tableData.value.List[index] = v.value
      } else {
        del(index);
      }
    }
    // 编辑
    const edit = (row) => {
      // v.value = JSON.parse(JSON.stringify(row));
      row.editFlag = true;
    };
    // 删除
    const del = (index) => {
      console.log(tableData.value.List)
      tableData.value.List.splice(index, 1)
    };

    // function loadPage(){
    //   request.get("/BaseData/WellInitParam?currentPage="+cacheDatal.currentPage).then((res) =>{
    //     console.log("loadPage")
    //
    //     let temp=[]
    //     res.data.forEach((ele)=>{
    //       ele.editFlag=false,ele.isSubmit=false
    //       temp.push(ele)
    //     })
    //     tableData.list=temp
    //
    //   }),
    //       request.get("/BaseData/WellInitParam/getTotal").then((res)=>{
    //         total=res})
    // }
    // loadPage()


  return {tableData,edit,cancel,submit,add,del}
  }
}
</script>

<style scoped>

</style>