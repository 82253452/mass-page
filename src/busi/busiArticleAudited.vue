<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.title')"
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.column"
        placeholder="选择栏目">
        <el-option
          v-for="(item,index) in columns"
          :key="index"
          :value="item"
          :label="getColumnsLabel(item)"
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

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:500px;">
      <el-table-column align="center" label="id" fixed="left" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目" width="150">
        <template slot-scope="scope">
          <span>{{ getColumnsLabel(scope.row.columnId) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="缩略图" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.thumbnail }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="摘要" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.summary }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="视频ID" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.videoId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.auther }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.columnId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ctime" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ctime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态0 默认 1已采 2已发" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.mtime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否删除" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.delete }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: center">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item
          :rules="[{ required: true, message: '设为头条', trigger: 'blur' }]"
          label="头条"
          prop="isTop">
          <el-switch
            v-model="temp.isTop"
            active-color="#13ce66"
            inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="文章类型" prop="type">
          <el-input v-model="temp.type"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item label="缩略图" prop="thumbnail">
          <el-input v-model="temp.thumbnail"/>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="temp.summary"/>
        </el-form-item>
        <el-form-item label="视频ID" prop="videoId">
          <el-input v-model="temp.videoId"/>
        </el-form-item>
        <el-form-item label="作者" prop="auther">
          <el-input v-model="temp.auther"/>
        </el-form-item>
        <el-form-item label="栏目" prop="columnId">
          <el-input v-model="temp.columnId"/>
        </el-form-item>
        <el-form-item label="状态0 默认 1已采 2已发" prop="status">
          <el-input v-model="temp.status"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}
        </el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectByPage, insert, selectById, updateById, deleteById } from '@/api/wxmp'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getColumns } from '../api/busiApp'

export default {
  name: 'ComplexTable',
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
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        del: 0
      },
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
    this.getList()
    this.getColumn()
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
    getColumnsLabel(v) {
      if (v) {
        if (v == 1) {
          return '1电竞游戏中心'
        } else if (v == 2) {
          return '2生活健康小常识'
        } else if (v == 3) {
          return '3石雕奇石'
        } else if (v == 4) {
          return '4周易国学家'
        } else if (v == 5) {
          return '5电动汽车报价大全'
        } else if (v == 6) {
          return '6SUV汽车大全'
        } else if (v == 7) {
          return '7古玩收藏交易古董鉴定'
        } else if (v == 8) {
          return '8佛心慧语精选'
        } else if (v == 9) {
          return '9传奇故事会'
        } else if (v == 10) {
          return '10广场舞教学合集'
        } else if (v == 11) {
          return '11搞笑相声小品大全'
        } else if (v == 12) {
          return '12健身视频集锦'
        } else if (v == 13) {
          return '13古筝名曲欣赏'
        }
        return v
      }
      return ''
    },
    getColumn() {
      getColumns().then(resp => {
        this.columns = resp.list
      })
    },
    handleFilter() {
      this.listQuery.page = 1
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
