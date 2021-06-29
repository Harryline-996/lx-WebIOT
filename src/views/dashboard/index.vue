<template>
  <div class="dashboard-editor-container">
    <el-button type="primary" icon="el-icon-refresh" @click="fetchData">刷新数据</el-button>

    <panel-group :count1="count1" :count2="count2" :count3="count3" :count4="count4" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :chart-data="NowChartData" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="NowChartData" />
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import { getEquipmentStatistics } from '@/api/equipment'
import { parseTime } from '@/utils'

var ChartData = {
  total: {
    name: '设备总量',
    time: [],
    actualData: []
  },
  onlineTotal: {
    name: '在线总量',
    time: [],
    actualData: []
  },
  warningTotal: {
    name: '告警总量',
    time: [],
    actualData: []
  },
  dataTotal: {
    name: '总数据量',
    time: [],
    actualData: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    BarChart
  },
  data() {
    return {
      NowChartData: ChartData.total,
      timestamp: null,
      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0
    }
  },
  beforeCreate() {
    this.fetchData()
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getEquipmentStatistics().then(response => {
        this.timestamp = response.data.timestamp
        this.count1 = response.data.count1
        this.count2 = response.data.count2
        this.count3 = response.data.count3
        this.count4 = response.data.count4
        this.timestamp = parseTime(this.timestamp, '{h}:{i}:{s}')
        // this.list.forEach((item, index, array) => {
        //   item.time = parseTime(item.time, '{y}-{m}-{d} {h}:{i}:{s}')
        // })
        ChartData['total'].time.push(this.timestamp)
        ChartData['total'].actualData.push(this.count1)
        ChartData['onlineTotal'].time.push(this.timestamp)
        ChartData['onlineTotal'].actualData.push(this.count2)
        ChartData['warningTotal'].time.push(this.timestamp)
        ChartData['warningTotal'].actualData.push(this.count3)
        ChartData['dataTotal'].time.push(this.timestamp)
        ChartData['dataTotal'].actualData.push(this.count4)
      })
    },
    handleSetLineChartData(type) {
      this.NowChartData = ChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
