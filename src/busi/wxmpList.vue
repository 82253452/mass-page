<template>
  <div >
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.title')"
        v-model="listQuery.title"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.column"
        placeholder="选择栏目">
        <el-option
          v-for="(item,index) in columns"
          :key="index"
          :value="item.code"
          :label="item.title"
        />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="文章类型">
        <el-option
          :value="1"
          label="文章"/>
        <el-option
          :value="0"
          label="视频"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">{{ $t('table.add') }}
      </el-button>
    </div>
    <ul v-infinite-scroll="load" class="infinite-list" style="overflow:auto;height:800px;padding:0 30px;">
      <li v-for="i in Math.ceil(list.length/3)" :key="i" class="infinite-list-item" style="width:100%;list-style-type:none;">
        <el-row :gutter="50" style="margin-top:50px;">
          <el-col v-for="(o,index) in getfilterList(i)" :key="index" :span="8" >
            <el-badge :value="o.type===0?'视频':'文章'" :type="o.type===0?'warning':'primary'" class="item" style="width:100%;">
              <el-card :body-style="{ padding: '0px',width:'100%' }" >
                <img :src="o.thumbnail" style="width:100%;height: 300px;" @click="previewArticle(o)">
                <div style="padding: 14px;" >
                  <span style="font-weight: bold;" @click="previewArticle(o)">{{ o.title }}</span>
                  <div class="bottom" style="display: flex;justify-content: space-between;margin-top:12px;">
                    <div>
                      <span style="color:#333;font-size: 14px;font-weight: bold">{{ getColumnName(o.columnId) }}</span>
                      <time class="time" style="color:#999999;font-size: 12px;">{{ o.mtime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</time>
                    </div>
                    <el-switch
                      v-model="o.isTop"
                      :active-value="1"
                      :inactive-value="0"
                      active-color="#13ce66"
                      inactive-color="#999"
                      @change="changeTop(o)"/>
                  </div>
                </div>
              </el-card>
            </el-badge>
          </el-col>
        </el-row>
      </li>
    </ul>
    <el-dialog :visible.sync="dialogFormVisible">
      <iframe v-if="temp.type===0" :src="temp.content" frameborder="0" name="showHere" scrolling="auto" width="100%" height="600px"/>
      <div v-else v-html="temp.content"/>
    </el-dialog>
  </div>
</template>

<script>
import { selectByPage, insert, updateById, deleteById } from '@/api/wxmp'
import { selectAll as getColumnsAll } from '@/api/columns'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 0,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        del: 0,
        sort: '+id'
      },
      url: '',
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {},
      columns: []
    }
  },
  created() {
    this.getColumn()
  },
  methods: {
    load() {
      this.listQuery.page++
      this.getList()
    },
    previewArticle(o) {
      this.dialogFormVisible = true
      this.temp = o
    },
    getfilterList(i) {
      return this.list.filter((f, t) => (i - 1) * 3 <= t && t < (i * 3))
    },
    changeTop(row) {
      updateById(row).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getList() {
      this.listLoading = true
      selectByPage(this.listQuery).then(response => {
        this.list = [...this.list, ...response.list]
        this.total = response.total
        this.listLoading = false
      })
    },
    getColumnName(id) {
      if (!id) return ''
      const column = this.columns.find(c => c.code === id.toString())
      return column ? column.title : id
    },
    getColumn() {
      getColumnsAll().then(resp => {
        this.columns = resp
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.list = []
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete(row, status) {
      deleteById({ id: row.id }).then(response => {
        this.list.splice(this.list.indexOf(row), 1)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {}
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insert(this.temp).then((id) => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
