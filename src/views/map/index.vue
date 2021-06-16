<template>
  <baidu-map class="map" center="杭州" :scroll-wheel-zoom="true" :zoom="10">
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT" />
    <bm-marker v-for="device in items" :key="device.id" :icon="device.alert === 1 ? {url:require('@/icons/png/warning.png'),size: {width: 48, height: 48}} : {url:require('@/icons/png/normal.png'),size: {width: 32, height: 32}}" :position="{lng: device.lng, lat: device.lat}" :title="device.id" @click="lookDetail(device)" />
    <bm-info-window :position="position" :show="show" @close="infoWindowClose" @open="infoWindowOpen">
      <p> 设备ID: {{ device.id }} </p>
      <p> 是否告警: {{ device.alert ? '是' : '否' }} </p>
      <p> 经度: {{ device.lng }} </p>
      <p> 纬度: {{ device.lat }} </p>
      <p> 值: {{ device.value }} </p>
      <p> 设备信息: {{ device.info }} </p>
      <p> 上报时间: {{ device.timestamp }} </p>
      <el-button> 查看历史轨迹 </el-button>
    </bm-info-window>
  </baidu-map>
</template>

<script>
import { getEquipmentInfo } from '@/api/equipment'
import { parseTime } from '@/utils/index'

export default {
  name: 'Map',
  data() {
    return {
      items: null,
      device: {},
      show: false,
      position: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    infoWindowClose() {
      this.show = false
    },
    infoWindowOpen() {
      this.show = true
    },
    lookDetail(device) {
      this.position = { lng: device.lng, lat: device.lat }
      this.device = device
      device.timestamp = parseTime(device.timestamp)
      this.show = true
    },
    fetchData() {
      getEquipmentInfo().then(response => {
        this.items = response.data.items
      })
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
