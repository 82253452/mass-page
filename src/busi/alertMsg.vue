<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style = "font-weight: bold">
          <el-avatar :size="15" :src="appData.headImg" style="papdding-top:20px"/>
          {{ appData.nickName }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="reSend">重新发送</el-button>
      </div>
      <div class="text item" style="margin-top:20px">
        <span style="font-weight: bold">状态：</span>
        <span style="font-size: 14px;color:#999;font-weight: bold">发送失败 </span>
      </div>
      <div class="text item" style="margin-top:20px">
        <span style="font-weight: bold">时间：</span>
        <span style="font-size: 14px;color:#999;font-weight: bold">{{ appData.messageParam| getTime }} </span>
      </div>
      <!--      <div class="text item" style="margin-top:20px">-->
      <!--        <spapn style="font-weight: bold">原因：</spapn>-->
      <!--        <span style="font-size: 14px;color:#999;font-weight: bold">发送失败 </span>-->
      <!--      </div>-->
    </el-card>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getAppInfo } from '@/api/alert'
import { parseTime } from '@/utils'
import { sendMsg } from '@/api/alert'

export default {
  name: 'AlertMsg',
  directives: {
    waves
  },
  filters: {
    getTime(param) {
      if (!param) {
        return ''
      }
      const jsonP = JSON.parse(param)
      return parseTime(new Date(jsonP.time), '{h}:{i}:{s}')
    }
  },
  data() {
    return {
      appId: '',
      appData: {}
    }
  },
  created() {
    const { appId } = this.$route.params
    this.appId = appId
    this.appInfo()
  },
  methods: {
    appInfo() {
      getAppInfo(this.appId).then(data => {
        this.appData = data
      })
    },
    reSend() {
      sendMsg(this.appId).then(res => {
        this.$message.success('执行成功')
      })
    }
  }
}
</script>
