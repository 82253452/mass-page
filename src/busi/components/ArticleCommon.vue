<template>
  <div>
    <el-button size="mini" type="primary" @click="showDia"><slot/></el-button>
    <el-dialog :visible.sync="dialogStatus" append-to-body width="1000px">
      <el-row :gutter="20">
        <el-col :span="8">
          <div style="width:100%;min-height:500px;border-radius: 10px;box-shadow: 1px 1px 3px rgba(0,0,0,.5);">
            <div style="width:100%;min-height:100px;border:1px solid #b3b3b3">
              <div v-if="top" v-html="value"/>
            </div>
            <div style="width:100%;height:300px;border:1px solid #b3b3b3;background: #e0e0e0;font-size:30px;line-height: 300px;text-align: center;">预览</div>
            <div style="width:100%;min-height:100px;border:1px solid #b3b3b3">
              <div v-if="!top" v-html="value"/>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <Tinymce v-if="dialogStatus" v-model="value" :height="400" menubar="" onchange=""/>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    Tinymce
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    top: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      temp: '',
      dialogStatus: false
    }
  },

  watch: {
    value(val) {
      console.log(val)
      this.$emit('input', val)
    }
  },
  methods: {
    showDia() {
      this.dialogStatus = !this.dialogStatus
    },
    confirm() {
      this.showDia()
      this.$emit('confirm', this.value)
    }
  }
}
</script>
<style>

</style>
