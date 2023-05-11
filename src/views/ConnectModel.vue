<template>
  <div class="viewPage">
    <div style="display: flex;flex-direction: row">
      <!--      eChart图像-->
      <div  id="conChart" ref="conChart" :style="{width:'1200px',height:'600px'}"></div>
      <!--      eChart图像-->
      <el-row :gutter="180" >
        <el-col :span="2"><div class="grid-content bg-purple"><el-button @click="option.label.show=!option.label.show;refeshEchart">井名标签</el-button></div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple"><el-button ref="resetBtn" id="resetBtn" @click="clearData();loadWellsFromDataBase(1);option.title.text=''">清除网格</el-button></div></el-col>
      </el-row>
    </div>
    <span>Delaunay网格</span>
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="3"><div class="grid-content bg-purple">最大三角形面积</div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple">最小角度</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="2"><div class="grid-content bg-purple"><el-input v-model="meshInitParam.areaConstraint"></el-input></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-input v-model="meshInitParam.angleConstraint"></el-input></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-button @click="clearData();loadWellsFromDataBase(1);initdataMesh('1',meshInitParam.areaConstraint,meshInitParam.angleConstraint)">初始化网格</el-button></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-button @click="deletePoint(1)">删除井点</el-button></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-button @click="deleteSeg(1)">删除连通</el-button></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-button @click="addSeg(1)">增加连通</el-button></div></el-col>
    </el-row>
    <span>全连接网格</span>
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="3"><div class="grid-content bg-purple">最长连接长度</div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple">最小角度</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="2"><div class="grid-content bg-purple"><el-input ></el-input></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-input ></el-input></div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple"><el-button @click="">初始化网格</el-button></div></el-col>

    </el-row>
  </div>
</template>

<script >
import request from "@/utils/api";


import * as echarts from "echarts/core";

// 这个部分还是vue2的写法，并不影响使用
export default {
  name: 'ConnectModel',
  data(){
    return{
      dataZoomSet:{
        strat:null,
        end:null
      },
      conChartWidth:"1200px",
      xmaxNum:null,
      ymaxNum:null,
      realWellCount:null,
      wells:[],
      option:{
        title:{
          text:"",
          textAlign:"auto"
        },
        xAxis: {
          type:'value',
          scale:true,
          max:  (value) =>{
            this.xmaxNum=value.max+0.2*value.max
            return value.max+0.2*value.max;
          },
        },
        yAxis: {
          type:'value',
          scale:true,
          max:  (value) =>{
            this.ymaxNum=value.max+0.2*value.max
            return value.max+0.2*value.max;
          },
        },
        label:{
          show:true,
          position:'top',
          color:'#000',
          formatter:(params)=>{

            return params.name
          }
        },

        dataZoom:[
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none'
          }
        ],
        tooltip:{
          formatter : (params)=>{
            console.log(params)
            if (params.componentType=='series' && params.seriesName!="img"){return params.name+':'+this.wells[params.name].wellName+' <br/>'+params.value}
            else if(params.componentType=='markLine'){return null}
            return null
          }
//这里设置的是鼠标悬停的提示
        },
        series: [
          {
            color:'red',
            name:'producer',
            type: 'scatter',
            symbolSize:10,
            yAxisIndex: 0,
            xAxisIndex: 0,
            data:[
              {name:null,value:[null,null]}
            ],
          },
          {
            color:'blue',
            name:'injector',
            type: 'scatter',
            symbolSize:10,
            yAxisIndex: 0,
            xAxisIndex: 0,
            data:[
              {name:null,value:[null,null]}
            ],
          },
          {
            color:'black',
            name:'img',
            type: 'scatter',
            symbolSize:10,
            yAxisIndex: 0,
            xAxisIndex: 0,
            data:[
              {name:null,value:[null,null]}
            ],
          },
          {
            type: 'line',
            yAxisIndex: 0,
            xAxisIndex: 0,
            markLine:
                {
                  silent:true,//这个属性决定了线段能不能相应鼠标事件
                  symbol:"none",
                  yAxisIndex: 0,
                  xAxisIndex: 0,
                  data: [
                    [
                      {xAxis: null, yAxis: null},
                      {xAxis: null, yAxis: null},
                    ]
                  ],
                  lineStyle:{
                    type:'solid'
                  }
                }
          }
        ]
      },
      meshInitParam:{
        LayerNum:1,
        areaConstraint:-1,
        angleConstraint:-1
      }
    }
  },
  computed:{
    echaProPoint(){return this.option.series[0].data},
    echaInjPoint(){return this.option.series[1].data},
    echaImgPoint(){return this.option.series[2].data},
    echalinks(){return this.option.series[3].markLine.data},
    echaTitle(){return this.option.title.text},
    myChart(){return echarts.init(this.$refs.conChart,null)},
    // ============================================
    refeshEchart:function () {
      this.option.dataZoom[0].start=this.dataZoomSet.strat
      this.option.dataZoom[0].end=this.dataZoomSet.end
      this.myChart.setOption(this.option,false,true)
    },
    clearData(){return function(){
      // this.echaInjPoint.splice(0,this.echaInjPoint.length)//清空epoint数组
      this.echaImgPoint.splice(0,this.echaImgPoint.length)//清空epoint数组
      // this.echaProPoint.splice(0,this.echaProPoint.length)//清空epoint数组
      this.echalinks.splice(0,this.echalinks.length)//清空links数组
    }},
    optScatterWells:function () {
      this.clearData()
      let polyIndex=1
      this.wells.forEach((item)=>{
        //这里的item是一个井的 Jason类实例对象
        if (item.wellType==0){this.echaProPoint.push({name:polyIndex,value:[item.x,item.y]})}
        else if(item.wellType==1){this.echaInjPoint.push({name:polyIndex,value:[item.x,item.y]})}
        polyIndex=polyIndex+1
      })//将wells的坐标push到echart模块的option对象中去
    },
    initdataMesh(){return function (layerNum,areaConstraint,angleConstraint) {

      request.post("ConnectModel/mesnInit",{"layerNum":layerNum,"areaConstraint":areaConstraint,"angleConstraint":angleConstraint}).then(res=>{
            if (res.data){//为0或者为null都会更新失败
              console.log("初始化网格成功"+res.data)
              // this.option.title.text="最大面积为"+areaConstraint+"最小角度为"+angleConstraint
              this.initMeshFromEleFile(layerNum)
            }
            else {
              console.log("初始化网格失败"+res.message)}
          }
      )
    }},
    //加载Delaunay网格，会有虚拟井自动生成,这个函数只会加载Poly文件中的虚拟井坐标显示在画面上
    initMeshFromEleFile(){return function (layerNum) {
      request.post("ConnectModel/turnEleToPoly",{"layerNum":layerNum}).then(
          (res)=>
              // {name:item[0],value:item.slice(1)}
          {
            res.data.nodeCoordList.forEach((item)=>{
              if (item[0]>this.realWellCount){this.echaImgPoint.push({name:item[0],value:item.slice(1)})}
            })//这里耦合了
            res.data.segList.forEach(
                (item)=>{
                  const coord_1=res.data.nodeCoordList[item[1]-1].slice(1)
                  const coord_2=res.data.nodeCoordList[item[2]-1].slice(1)
                  this.echalinks.push([{xAxis: coord_1[0], yAxis: coord_1[1]},{xAxis: coord_2[0], yAxis: coord_2[1]}])
                })
            this.refeshEchart
          }
      )
    }},
    loadPoly(){return function (layerNum) {
      this.echaImgPoint.splice(0,this.echaImgPoint.length)//清空epoint数组
      this.echalinks.splice(0,this.echalinks.length)//清空links数组
      request.post("ConnectModel/loadPoly",{"layerNum":layerNum}).then(

          (res)=>
              // {
              //   this.echalinks.push(                    [
              //     {xAxis: 2000, yAxis: 2000},
              //     {xAxis: 3000, yAxis: 3000},
              //   ])
              //   this.refeshEchart
              // }
              // {name:item[0],value:item.slice(1)}
          {
            res.data.nodeCoordList.forEach((item)=>{
              if (item[0]>this.realWellCount){this.echaImgPoint.push({name:item[0],value:item.slice(1)})}
            })//这里耦合了
            res.data.segList.forEach(
                (item)=>{
                  const coord_1=res.data.nodeCoordList[item[1]-1].slice(1)
                  const coord_2=res.data.nodeCoordList[item[2]-1].slice(1)
                  this.echalinks.push([{xAxis: coord_1[0], yAxis: coord_1[1]},{xAxis: coord_2[0], yAxis: coord_2[1]}])
                })
            // debugger
            this.refeshEchart
          }
      )

    }},
    loadWellsFromDataBase(){return function (layer) {
      request.get("BaseData/WellInitParam/getWellsByLayer/"+layer).then(
          (res) =>{
            if (res.data){
              this.realWellCount=res.data.length
              this.wells=res.data
              this.optScatterWells
              this.refeshEchart
            }
            else {
              alert(res.message)
            }
          }
      )
    }},
    deletePoint(){return function (layerNum) {
      this.myChart.on('click',(point)=>{
        if (point.name>this.realWellCount){
          request.post("/ConnectModel/editPoly",
              {
                "layerNum":layerNum,
                "edit":"p.deletePoint("+point.name+")"
              }
          ).then((param)=>{
            console.log(param)
            this.myChart.off('click')
            this.loadPoly(layerNum)
          })
        }
        else {
          console.log("点击位置错误，且不能使用此按钮删除真实井点")
        }
      })


    }},
    deleteSeg(){return function (layerNum) {
      let segEndPointIndex=[]
      this.myChart.on('click',(point)=>{
        segEndPointIndex.push(point.name)
        console.log(segEndPointIndex)
        console.log("segEndPointIndex.length is"+segEndPointIndex.length)
        if (segEndPointIndex.length>=2){
          console.log("two Point!")
          this.myChart.off('click')
          request.post("/ConnectModel/editPoly",
              {
                "layerNum":layerNum,
                "edit":"p.deleteSeg("+"["+segEndPointIndex+"]"+")"
              }
          ).then((param)=>{
            this.loadPoly(layerNum)
          })
        }
      })
    }},
    addSeg(){return function (layerNum) {
      let segEndPointIndex=[]
      this.myChart.on('click',(point)=>{
        segEndPointIndex.push(point.name)
        console.log(segEndPointIndex)
        console.log("segEndPointIndex.length is"+segEndPointIndex.length)
        if (segEndPointIndex.length>=2){
          console.log("two Point!")
          this.myChart.off('click')
          request.post("/ConnectModel/editPoly",
              {
                "layerNum":layerNum,
                "edit":"p.addSeg("+"["+segEndPointIndex+"]"+")"
              }
          ).then((param)=>{
            this.loadPoly(layerNum)
          })
        }
      })
    }}
  },
  methods:{

  },
  mounted () {
    this.loadWellsFromDataBase(1)
    this.loadPoly(1)
    this.$refs.conChart.style["height"]=((this.ymaxNum/this.xmaxNum)*1200)+'px'
    this.myChart.on('dataZoom',(event)=>{
      if(event.batch){
        this.dataZoomSet.strat=event.batch[0].start;
        this.dataZoomSet.end=event.batch[0].end;
      }else{
        this.dataZoomSet.stra=event.start;
        this.dataZoomSet.end=event.end;
      };
    });
    // this.$refs.conChart.style["height"]=(600)+'px'
  }


}
</script>

<style scoped>

</style>