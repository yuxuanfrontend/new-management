<style lang="css">
</style>
<template lang="html">
  <div class="apply">
    <common-menu></common-menu>
    <h4 class="title">客户提货</h4>
    <div class="main-apply">
        <div class="row">
          <div class="input-box col-xs-4">
            <p>提货单号</p>
            <div class="input-group w50">
              <input type="text" class="form-control" name="" placeholder="提货单号" v-model="handover_no">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="handover_search">查询</button>
              </span>
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>客户帐号&姓名</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w50" placeholder="客户帐号" v-model="custom_no">
              <input type="text" name="" class="form-control w50" placeholder="姓名" readonly v-model="custom_name">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="custom_search">查询</button>
              </span>
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>客户证件号&电话号码</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" placeholder="客户证件号" readonly v-model="custom_identify">
              <input type="text" name="" class="form-control w30" placeholder="电话号码" readonly v-model="custom_tel">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-box col-xs-4">
            <p>登记日期</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" placeholder="日期" readonly v-model="handover_date">
              <input type="text" name="" class="form-control w30" placeholder="时间" readonly v-model="handover_time">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>提货日期</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" placeholder="日期" ref="notify_date" readonly v-model="notify_date">
              <!-- <input type="text" name="" class="form-control w30" placeholder="时间" ref="notify_time" readonly v-model="notify_time"> -->
            </div>
          </div>
        </div>
        <!-- <tablelist :titles="tableTitles" :tddatas="trDataArr" :suns="sunResult" ref="oneTable" ></tablelist> -->
        <table-editable :titles="tableTitles" ref="oneTable" :data="boxes" :keys="boxkeys" :is-calculate="true" :is-editable="true" :calculable-key="['handoverQty']" @delete-line="deleteBoxes" @add-line="addBox">
        </table-editable>
        <div class="btn-box" role="group">
          <button type="button" class="btn btn-default" @click="handover_new">新单据</button>
          <button type="button" class="btn btn-default" @click="$refs.oneTable.deleteLine()">删除行</button>
          <button type="button" class="btn btn-default" @click="$refs.oneTable.addLine()">增加行</button>
          <!-- <button type="button" class="btn btn-default">选择产品</button> -->
          <button type="button" class="btn btn-default" @click="handover_save">保存</button>
          <!-- <button type="button" class="btn btn-default"></button> -->
          <a class="btn btn-default" target="_blank" :href="'handover_print.jsp?code='+ handover_no">打印提货单</a>
        </div>
    </div>
  </div>
</template>

<script>
// import tablelist from '../components/table-List'
import Flatpickr from 'flatpickr'
// import datePickerZh from 'flatpickr/dist/l10n/zh'
import commonMenu from '../components/menu'
import tableEditable from '../components/table-editable'


export default {
  name: 'apply',
  data() {
    return {
      tableTitles: ['产品代码', '产品名称', '单位', '提货数量', '产品备注'],
      boxes: [],
      handover_no: '',
      custom_no: '',
      custom_name: '',
      custom_identify: '',
      custom_tel: '',
      handover_date: '',
      handover_time: '',
      notify_date: '',
      notify_time: '',
      boxkeys: ['productNo', 'productName', 'productUnit', 'handoverQty', 'handoverRemark'],
    }
  },
  components: {
    // tablelist
    tableEditable,
    commonMenu,
  },
  mounted() {
    /* eslint-disable no-new */
    new Flatpickr(this.$refs.notify_date)
    // new Flatpickr(this.$refs.notify_time, {
    //   enableTime: true,
    //   enableSeconds: true,
    //   noCalendar: true,
    //   time_24hr: true,
    //   dateFormat: 'H:i:S',
    //   minuteIncrement: 1
    // })
  },
  methods: {
    handover_search() {
      console.log(this.handover_no)
      this.$request('get', `api/v1/handovers/handover/${this.handover_no}`)
      .then(
        (res) => {
          // console.log(res.body)
          this.boxes = res.body.handoverDetails
          this.custom_no = res.body.customNo
          this.custom_name = res.body.customName
          this.custom_identify = res.body.customIdentify
          this.custom_tel = res.body.customTel
          this.handover_date = res.body.handoverDate
          this.handover_time = res.body.handoverTime
          this.notify_date = res.body.notifyData
          this.notify_time = res.body.notifyTime
        },
      )
    },
    custom_search() {
      this.$request('get', `api/v1/handovers/handoverInfo/${this.custom_no}`)
      .then(
        (res) => {
          console.log(res)
          this.custom_name = res.body[0].customName
          this.custom_tel = res.body[0].customTel
          this.notify_date = res.body[0].receiveDate
          this.boxes = res.body
        },
      )
    },
    handover_save() {
      this.$request('post', '/api/v1/handovers/handover')
      .send({
        handoverNo: this.handover_no,
        customNo: this.custom_no,
        customName: this.custom_name,
        customTel: this.custom_tel,
        handoverDate: this.handover_date,
        handoverTimeStr: this.handover_time,
        notifyData: this.notify_date,
        // notifyTimeStr : this.notify_time ,
        handoverDetails: this.boxes,
      })
      .then(
        (res) => {
          this.handover_no = res.body
        },
      )
    },
    handover_new() {
      this.$request('get', 'api/v1/handovers/currentDateTime')
      .then(
        (res) => {
          // console.log(res.body.handoverDate)
          this.handover_no = ''
          this.custom_no = ''
          this.custom_name = ''
          this.custom_identify = ''
          this.custom_tel = ''
          this.notify_date = ''
          this.notify_time = ''
          this.handover_date = res.body.handoverDate
          this.handover_time = res.body.handoverTime
          this.boxes.splice(0, this.boxes.length)
        },
      )
    },
    deleteBoxes(indexes) {
      for (let i = 0; i < indexes.length; i += 1) {
        this.boxes.splice(indexes[i], 1)
      }
    },
    addBox() {
      this.boxes.push({
        productCode: '',
        productName: '',
        productUnit: '',
        handoverQty: 0,
        handoverRemark: '',
      })
    },
  },
}
</script>
