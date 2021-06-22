<template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-left: 0px; margin-bottom: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
      Add
    </el-button>
    <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
      Export
    </el-button>
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备名称" width="150">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
      <el-table-column align="center" prop="created_at" label="最后上报时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备ID" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getEquipmentInfo, createEquipment, updateEquipment, deleteEquipment } from '@/api/equipment'
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
          return item.id === value
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
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: 'device0006',
        name: 'GK8传感器',
        info: 'No data',
        value: 0,
        alert: 0,
        lng: 120.178562,
        lat: 30.146589,
        timestamp: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}')
      },
      oldTemp: {
        id: 'device0006',
        name: 'GK8传感器',
        info: 'No data',
        value: 0,
        alert: 0,
        lng: 120.178562,
        lat: 30.146589,
        timestamp: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}')
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改设备信息',
        create: '创建新设备'
      },
      rules: {
        id: [{ required: true, trigger: 'blur', validator: validateID }],
        name: [{ required: true, message: '该字段为必填！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getEquipmentInfo().then(response => {
        this.list = response.data.items
        this.total = this.list.length
        this.list.forEach((item, index, array) => {
          item.timestamp = parseTime(item.timestamp, '{y}-{m}-{d} {h}:{i}')
        })
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['设备ID', '经度', '纬度', '值', '是否告警', '设备信息', '上报时间']
        const filterVal = ['id', 'lng', 'lat', 'value', 'alert', 'info', 'timestamp']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: 'device0006',
        name: 'GK8传感器',
        info: 'No data',
        value: 0,
        alert: 0,
        lng: 120.178562,
        lat: 30.146589,
        timestamp: parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}')
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createEquipment(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建设备成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp()
      this.oldTemp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempID = this.temp.id
          const tempName = this.temp.name
          this.temp = Object.assign({}, this.oldTemp)
          this.temp.id = tempID
          this.temp.name = tempName
          const tempData = Object.assign({}, this.temp)
          const oldTempData = Object.assign({}, this.oldTemp)
          updateEquipment(oldTempData, tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.oldTemp.id)
            this.list.splice(index, 1, tempData)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteEquipment(row.id).then(() => {
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: '删除设备成功！',
          type: 'success',
          duration: 2000
        })
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
