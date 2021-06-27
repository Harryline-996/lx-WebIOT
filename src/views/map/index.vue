<template>
  <div>
    <baidu-map v-show="showHistory === false" class="map" center="杭州" :scroll-wheel-zoom="true" :zoom="10">
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <bm-marker v-for="deviceItem in items" :key="deviceItem.deviceId" :icon="deviceItem.alert === 1 ? {url:require('@/icons/png/warning.png'),size: {width: 48, height: 48}} : {url:require('@/icons/png/normal.png'),size: {width: 32, height: 32}}" :position="{lng: deviceItem.lng, lat: deviceItem.lat}" :title="deviceItem.deviceId" @click="lookDetail(deviceItem)" />
      <bm-info-window :position="position" :show="show" @close="infoWindowClose" @open="infoWindowOpen">
        <p> 设备ID: {{ deviceItem.deviceId }} </p>
        <p> 设备名称: {{ deviceItem.deviceName }} </p>
        <p> 是否告警: {{ deviceItem.alert ? '是' : '否' }} </p>
        <p> 经度: {{ deviceItem.lng }} </p>
        <p> 纬度: {{ deviceItem.lat }} </p>
        <p> 值: {{ deviceItem.value }} </p>
        <p> 上报时间: {{ deviceItem.time }} </p>
        <el-button type="primary" plain icon="el-icon-map-location" @click="handleTrack">
          查看历史轨迹
        </el-button>
      </bm-info-window>
    </baidu-map>
    <baidu-map v-show="showHistory === true" class="map" :scroll-wheel-zoom="true" center="杭州" :zoom="10">
      <bm-control>
        <el-button type="primary" @click="handleBack">返回</el-button>
        <el-button type="primary" @click="handleBegin">开始</el-button>
      </bm-control>
      <bm-polyline :editing="true" :path="path" stroke-color="blue" :stroke-style="dotted" :stroke-opacity="0.8" :stroke-weight="3" />
      <bml-lushu
        :path="path"
        :play="play"
        :auto-view="true"
        :speed="15000"
        :rotation="true"
        @stop="reset"
      />
    </baidu-map>
  </div>

</template>

<script>
import { BmlLushu } from 'vue-baidu-map'
import { getEquipmentInfo, getEquipmentTrack } from '@/api/equipment'
import { parseTime } from '@/utils/index'

export default {
  name: 'Map',
  components: {
    BmlLushu
  },
  data() {
    return {
      items: null,
      deviceItem: {},
      showHistory: false,
      show: false,
      position: {},
      play: false,
      path: [],
      speed: 4000
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.play = false
    },
    infoWindowClose() {
      this.show = false
    },
    infoWindowOpen() {
      this.show = true
    },
    lookDetail(deviceItem) {
      this.position = { lng: deviceItem.lng, lat: deviceItem.lat }
      this.deviceItem = deviceItem
      deviceItem.time = parseTime(deviceItem.time)
      this.show = true
    },
    fetchData() {
      getEquipmentInfo().then(response => {
        this.items = response.data.items
      })
    },
    handleTrack() {
      getEquipmentTrack({ clientId: this.deviceItem.deviceId }).then(response => {
        this.path = response.data.items
      })
      this.showHistory = true
    },
    handleBack() {
      this.showHistory = false
      this.play = false
    },
    handleBegin() {
      this.play = true
    }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 527px;
}
</style>
