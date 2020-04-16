<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.sc"
        placeholder="选择学校">
        <el-option
          v-for="(item,index) in scs"
          :key="index"
          :value="item"
          :label="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.major"
        placeholder="选择专业">
        <el-option
          v-for="(item,index) in majors"
          :key="index"
          :value="item"
          :label="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.edu"
        placeholder="选择学历">
        <el-option
          v-for="(item,index) in edus"
          :key="index"
          :value="item"
          :label="item"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:500px;">
      <el-table-column align="center" label="id" fixed="left" min-width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="毕业学校" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.sc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="专业" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学历" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.education }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="基本信息" min-width="250">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.base }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="刷新时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标记" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.status || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: center">
      <el-pagination
        :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { selectByPage, updateById, selectScs, selectEdus, selectMajors } from '@/api/talentPool'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'TalentPool',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {},
      columns: [],
      scs: [],
      edus: [],
      majors: []
    }
  },
  created() {
    this.getList()
    this.getEdus()
    this.getScs()
    this.getMajors()
  },
  methods: {
    getList() {
      this.listLoading = true
      selectByPage(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    getEdus() {
      selectEdus().then(response => {
        this.edus = response
      })
    },
    getScs() {
      selectScs().then(response => {
        this.scs = response
      })
    },
    getMajors() {
      selectMajors().then(response => {
        this.majors = response
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    resetTemp() {
      this.temp = {}
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          updateById(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
