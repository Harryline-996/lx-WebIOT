<template>
  <div class="app-container">
    <div class="filter-container" style="margin-left: 0px; margin-bottom: 20px;">
      <el-input v-model="listQuery.clientId" clearable placeholder="设备ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.deviceName" clearable placeholder="设备名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.info" clearable placeholder="设备信息" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.minVal" clearable placeholder="最小值" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.maxVal" clearable placeholder="最大值" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.alert" clearable placeholder="设备状态" style="width: 110px" class="filter-item">
        <el-option v-for="item in alertOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-date-picker
      v-model="listQuery.dateRange"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      style="margin-left: 0px; margin-bottom: 20px;"
    />

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="设备ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.clientId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备名称" width="120">
        <template slot-scope="scope">
          {{ scope.row.deviceName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="经度" width="120">
        <template slot-scope="scope">
          {{ scope.row.lng }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="纬度" width="120">
        <template slot-scope="scope">
          {{ scope.row.lat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="值">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.alert ? 'danger' : 'success'">{{ scope.row.alert ? '告警' : '正常' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备信息" width="280">
        <template slot-scope="scope">
          {{ scope.row.info }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="上报时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

  </div>
</template>

<script>
import { getEquipmentMessage } from '@/api/equipment'
import { parseTime } from '@/utils/index'
import { validDeviceID } from '@/utils/validate'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    const validateID = (rule, value, callback) => {
      if (!validDeviceID(value)) {
        callback(new Error('格式错误！正确示例：device0001'))
      } else {
        const findSameID = this.list.filter(item => {
          return item.clientId === value
        })
        if (findSameID.length !== 0) {
          callback(new Error('您输入的设备ID已经存在！'))
        } else {
          callback()
        }
      }
    }
    return {
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      alertOptions: ['正常', '告警'],
      listQuery: {
        clientId: undefined,
        deviceName: undefined,
        info: undefined,
        minVal: undefined,
        maxVal: undefined,
        alert: undefined,
        dateRange: undefined,
        page: 1,
        limit: 20
      },
      temp: {
        clientId: 'device0006',
        deviceName: 'GK8传感器',
        info: 'No data',
        value: 0,
        alert: 0,
        lng: 120.178562,
        lat: 30.146589,
        timestamp: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
      },
      oldTemp: {
        clientId: 'device0006',
        deviceName: 'GK8传感器',
        info: 'No data',
        value: 0,
        alert: 0,
        lng: 120.178562,
        lat: 30.146589,
        timestamp: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}{s}')
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改设备信息',
        create: '创建新设备'
      },
      rules: {
        clientId: [{ required: true, trigger: 'blur', validator: validateID }],
        deviceName: [{ required: true, message: '该字段为必填！', trigger: 'blur' }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近1分钟',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近10分钟',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 600 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近1小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近24小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getEquipmentMessage().then(response => {
        const { clientId, deviceName, info, minVal, maxVal, alert, dateRange, page = 1, limit = 20 } = this.listQuery
        const tempList = response.data.items.filter(item => {
          if (clientId && item.clientId.indexOf(clientId) < 0) return false
          if (deviceName && item.deviceName.indexOf(deviceName) < 0) return false
          if (info && item.info.indexOf(info) < 0) return false
          if (minVal && item.value < minVal) return false
          if (maxVal && item.value > maxVal) return false
          if (dateRange && item.timestamp < dateRange[0]) return false
          if (dateRange && item.timestamp > dateRange[1]) return false
          if (alert) {
            if (alert === '正常' && item.alert === 1) return false
            if (alert === '告警' && item.alert === 0) return false
          }
          return true
        })
        this.total = tempList.length
        this.list = tempList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        this.list.forEach((item, index, array) => {
          item.timestamp = parseTime(item.timestamp, '{y}-{m}-{d} {h}:{i}:{s}')
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['设备ID', '设备名称', '经度', '纬度', '值', '是否告警', '设备信息', '上报时间']
        const filterVal = ['clientId', 'deviceName', 'lng', 'lat', 'value', 'alert', 'info', 'timestamp']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
