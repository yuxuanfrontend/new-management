<style lang="css">
</style>
<template lang="html">
  <div class="apply">
    <common-menu></common-menu>
    <div class="panel panel-primary">
      <div class="panel-heading">配货</div>
        <div class="panel-body">
          <div class="row">
            <div class="input-box col-xs-4">
              <div class="input-group">
                <label for="">开始日期</label>
                <input type="text" class="form-control bd-radius" style="width:50%" ref="startdate" v-model="startDate" @input="">
              </div>
            </div>
            <div class="input-box col-xs-4">
              <div class="input-group">
                <label for="">结束日期</label>
                <input type="text" class="form-control bd-radius" style="width:50%" ref="enddate" v-model="endDate" @input="">
              </div>
            </div>
            <div class="input-box col-xs-4">
              <div class="input-group">
                <button class="btn btn-primary bd-radius w30" type="button" @click="search_distribution">查询</button>&nbsp;
                <button class="btn btn-info bd-radius w30" type="button" @click="selectProduct">配货</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-box col-xs-4">
              <div class="input-group">
                <label for="">客户账号</label>
                <input type="text" class="form-control bd-radius" style="width:50%" placeholder="请输入客户账号">
              </div>
            </div>
            <div class="input-box col-xs-4">
              <div class="input-group">
                <label for="">产品代码</label>
                <input type="text" class="form-control bd-radius" style="width:50%" placeholder="请输入产品代码">
              </div>
            </div>
          </div>
        </div>
    </div>
    <table-editable :titles="tableTitles" ref="oneTable" :data="boxes" :selectDatas="dataArr" :keys="boxkeys" :is-calculate="true" :is-editable="true" :calculable-key="['出库数量']">
    </table-editable>
    <allocate-dialog ref="dialog"  :show="isShowDialog" :checkArrData="newCheckArr" @close-dialog="closeDialog"></allocate-dialog>
  </div>
</template>

<script>
import moment from 'moment'
/* eslint-disable no-new */
import Flatpickr from 'flatpickr'
import tableEditable from '../components/table-editable'
import allocateDialog from './allocate-dialog'

// import datePickerZh from 'flatpickr/dist/l10n/zh'

import commonMenu from '../components/menu'

export default {
  name: 'apply',
  data() {
    return {
      tableTitles: ['提货日期', '客户账号', '客户姓名', '产品代码', '产品名称', '提货申请数量', '状态'],
      boxkeys: ['inv_date', '用户ID', '用户名称', '商品标识', '商品名称', '出库数量', 'status'],
      boxes: [],
      isShowDialog: false,
      dataArr: [],
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      newCheckArr: [],
    }
  },
  components: {
    allocateDialog,
    commonMenu,
    tableEditable,
  },
  mounted() {
    /* eslint-disable no-new */
    new Flatpickr(this.$refs.startdate)

    /* eslint-disable no-new */
    new Flatpickr(this.$refs.enddate)
  },
  methods: {
    search_distribution() {
      this.$request('post', 'api/v1/sql-jsons/change/allocate')
      .send({
      })
      .then(
        (res) => {
          this.boxes = res.body
        },
      )
    },
    closeDialog() {
      this.isShowDialog = false
    },
    selectProduct() {
      this.isShowDialog = true
      this.newCheckArr = []
      const checkArr = this.$refs.oneTable.checkboxes
      for (let i = 0; i < checkArr.length; i += 1) {
        // const obj = {}
        // const box = this.boxes[checkArr[i]]
        // obj[this.boxkeys[0]] = box[this.boxkeys[0]]
        // obj[this.boxkeys[1]] = box[this.boxkeys[1]]
        // obj[this.boxkeys[3]] = box[this.boxkeys[3]]
        this.newCheckArr.push(this.boxes[checkArr[i]])
      }
    },
  },
}
</script>
