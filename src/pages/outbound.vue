<style lang="css">
.table-box .table-center tr th,
.table-box .table-center tr td {
  text-align: center!important;
}
</style>
<template lang="html">
  <div class="apply">
    <common-menu></common-menu>
    <h4 class="title">提货出库</h4>
    <div class="main-apply">
        <div class="row">
          <div class="input-box col-xs-4">
            <p>出库单号</p>
            <div class="input-group w50">
              <input type="text" class="form-control" name="" placeholder="出库单号" v-model="outbound_no">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="outbound_search">查询</button>
              </span>
            </div>
          </div>
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
              <input type="text" name="" class="form-control w50" placeholder="客户帐号" readonly v-model="custom_no">
              <input type="text" name="" class="form-control w50" placeholder="姓名" readonly v-model="custom_name">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-box col-xs-4">
            <p>登记日期</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" value="" readonly v-model="outbound_date">
              <input type="text" name="" class="form-control w30" value="" readonly v-model="outbound_time">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>提货日期</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30 bd-radius" value="" readonly v-model="notify_date">
              <!-- <input type="text" name="" class="form-control w30" value="" readonly v-model="notify_time"> -->
            </div>
          </div>
          <div class="input-box col-xs-4">
            <div class="input-group">
              <p>仓库</p>
              <select class="form-control w50 bd-radius" v-model="selectedWarehouse">
                <option v-for="store in stores" :value="store.code">{{ store.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="table-box">
          <table class="table table-striped table-center">
            <thead>
              <tr>
                <th v-for='titleBox in tableBoxTitles'>{{ titleBox }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trbox in trboxes">
                <td v-for="tdbox in tdboxes">{{ trbox[tdbox] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
          <table-editable :titles="tableTitles" ref="oneTable" :data="boxes" :keys="boxkeys" :is-calculate="true" :is-editable="true" :calculable-key="['invAqty']">
        </table-editable>
        <div class="btn-box" role="group">
          <button type="button" class="btn btn-default" @click="outbound_new">新单据</button>
          <button type="button" class="btn btn-default" @click="deleteBoxes">删除行</button>
          <button type="button" class="btn btn-default" @click="addBox">增加行</button>
          <!-- <button type="button" class="btn btn-default" @click="selectProduct">选择产品</button> -->
          <button type="button" class="btn btn-default" @click="outbound_save">保存</button>
          <a class="btn btn-default" target="_blank" :href="'outbound_print.jsp?code='+ outbound_no">打印出库单</a>
        </div>
    </div>
    <!-- <tabledialog></tabledialog> -->
  </div>
</template>

<script>
// import moment from 'moment'
import tableEditable from '../components/table-editable'
import commonMenu from '../components/menu'

export default {
  name: 'apply',
  data() {
    return {
      tableBoxTitles: ['产品代码', '产品名称', '单位', '提货数量', '备注'],
      trboxes: [],
      tdboxes: ['productNo', 'productName', 'productUnit', 'handoverQty', 'handoverRemark'],
      tableTitles: ['箱号', '流转单号', '产品代码', '提货数量'],
      boxes: [],
      boxkeys: ['boxNo', 'checkNo', 'productNo', 'invAqty'],
      outbound_no: '',
      handover_no: '',
      custom_no: '',
      custom_name: '',
      outbound_date: '',
      outbound_time: '',
      notify_date: '',
      selectedWarehouse: '01',
    }
  },
  components: {
    tableEditable,
    commonMenu,
  },
  mounted() {
    this.$request('get', 'api/v1/outbound/initialize')
    .then(
      (res) => {
        this.stores = res.body.stores
      },
    )
  },
  methods: {
    outbound_new() {
      this.$request('get', 'api/v1/handovers/currentDateTime')
      .then(
        (res) => {
          this.outbound_no = ''
          this.handover_no = ''
          this.custom_no = ''
          this.custom_name = ''
          this.notify_date = ''
          this.outbound_date = res.body.handoverDate
          this.outbound_time = res.body.handoverTime
          this.trboxes.splice(0, this.trboxes.length)
          this.boxes.splice(0, this.boxes.length)
        },
      )
    },
    outbound_search() {
      this.$request('post', 'api/v1/sql-jsons/change/outbound')
      .send({
        boxNo: this.outbound_no,
      })
      .then((res) => {
        const data = res.body[0]
        this.outbound_date = data.invDate
        this.outbound_time = data.invTime.substring(0, 8)
        this.selectedWarehouse = data.invStore
        this.handover_no = data.handoverNo

        this.handoverOne()
        this.handoverTwo()
      })

      this.$request('post', 'api/v1/sql-jsons/change/outbound_detail')
      .send({
        boxNo: this.outbound_no,
      })
      .then((res) => {
        this.boxes = res.body
        this.boxes.forEach((item) => {
          item.invAqty = item.invQty
        })
      })
      // this.$request('get', `api/v1/inventories/inventory/${this.outbound_no}`)
      // .then(
      //   (res) => {
      //     this.outbound_date = res.body.invDate
      //     this.outbound_time = res.body.invTime
      //     this.handover_no = res.body.handoverNo
      //     this.boxes = res.body.inventoryDetails
      //     this.handover_search()
      //   },
      // )
    },
    outbound_save() {
      this.boxes.forEach((item) => {
        item.invQty = item.invQty || item.invAqty
      })
      this.$request('post', 'api/v1/outbound/outbound')
      .send({
        invNo: this.outbound_no,
        handoverNo: `${this.handover_no}`,
        deliveryUser: this.custom_name,
        invDate: this.outbound_date,
        invTimeStr: this.outbound_time,
        inventoryDetails: this.boxes,
        invStore: this.selectedWarehouse,
      })
      .then(
        (res) => {
          this.outbound_no = res.text
        },
      )
    },
    handoverOne(isHandoverSearch) {
      this.$request('post', 'api/v1/sql-jsons/change/outbound_handover1')
      .send({
        handoverNo: `${this.handover_no}`,
      })
      .then((res) => {
        const data = res.body[0]
        this.custom_no = data.customNo
        this.custom_name = data.customName
        this.notify_date = data.notifyDate

        if (isHandoverSearch) {
          this.handoverThree()
        }
      })
    },
    handoverTwo() {
      this.$request('post', 'api/v1/sql-jsons/change/outbound_handover2')
      .send({
        handoverNo: `${this.handover_no}`,
      })
      .then((res) => {
        this.trboxes = res.body
      })
    },
    handoverThree() {
      this.$request('post', 'api/v1/sql-jsons/change/outbound_handover3')
      .send({
        notifyDate: this.notify_date,
        customNo: this.custom_no,
      })
      .then((res) => {
        this.boxes = res.body
      })
    },
    handover_search() {
      this.handoverOne(true)

      this.handoverTwo()
    },
    deleteBoxes() {
      const indexes = this.$refs.oneTable.checkboxes

      for (let i = 0; i < indexes.length; i += 1) {
        this.boxes.splice(indexes[i], 1)
      }
    },
    addBox() {
      this.boxes.push({
        boxNo: '',
        checkNo: '',
        productNo: '',
        invAqty: '',
      })
    },
  },
}
</script>
