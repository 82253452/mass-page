<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.title')"
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
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
      <el-table-column align="center" label="id" min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.gender ===1?'男':'女' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" @click="resetPass(scope.row)">重置密码</el-button>
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="temp.roleId"
            placeholder="角色">
            <el-option
              :value="1"
              label="管理员"/>
            <el-option
              :value="2"
              label="普通用户"/>
            <el-option
              :value="5"
              label="文章审核"/>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="temp.gender"
            placeholder="性别">
            <el-option
              :value="2"
              label="男"/>
            <el-option
              :value="1"
              label="女"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectByPage, addUser, updateById, deleteById, resetPassword } from '@/api/sysUser'
import waves from '@/directive/waves' // 水波纹指令
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
        sort: '+id'
      },
      temp: {
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetPass(row) {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        resetPassword({ id: row.id, password: value }).then(res =>
          this.$message({
            type: 'success',
            message: '密码修改成功'
          }))
      })
    },
    getList() {
      this.listLoading = true
      selectByPage(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
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
      this.temp = {
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.temp).then((id) => {
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
