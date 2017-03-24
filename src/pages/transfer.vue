<style lang="css">
</style>
<template lang="html">
  <div class="apply">
    <common-menu></common-menu>
    <h4 class="title">仓库调拨</h4>
    <div class="main-apply">
        <div class="row">
          <div class="input-box col-xs-4">
            <p>调拨单号</p>
            <div class="input-group w50">
              <input type="text" class="form-control" name="" placeholder="调拨入库单号" v-model="transferNo">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="transferSearch">查询</button>
              </span>
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>提货车牌号</p>
            <div class="input-group">
              <select class="form-control w50 bd-radius" v-model="vehicleNo">
                <option v-for="(vehicle,index) in vehicles" :value="vehicle.vehicleId">{{ vehicle.vehicleId }}</option>
              </select>
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>交接人&提货人</p>
            <div class="input-group">
              <select class="form-control w30 bd-radius" v-model="deliveryUser">
                <option v-for="carrier in carriers" :value="carrier.uid">
                  {{ carrier.uname }}
                </option>
              </select>
              <select class="form-control w30 bd-radius" v-model="receiveUser" >
                <option v-for="receiver in receivers" :value="receiver.uid">
                  {{ receiver.uname }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-box col-xs-4">
            <p>登记日期</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" value="" readonly v-model="invDate">
              <input type="text" name="" class="form-control w30" value="" readonly v-model="invTime">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>车辆后门&侧门铅封条</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30 bd-radius" placeholder="后门铅封号" v-model="sealNo1">
              <input type="text" name="" class="form-control w30 bd-radius" placeholder="侧门铅封号" v-model="sealNo2">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>出库仓库&入库仓库</p>
            <div class="input-group">
              <select class="form-control w30 bd-radius" v-model="invStore">
                <option v-for="store in stores" :value="store.code" >{{ store.name }}</option>
              </select>
              <select class="form-control w30 bd-radius" v-model="invInstore">
                <option v-for="store in stores" :value="store.code" >{{ store.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <table-editable :titles="tableTitles" ref="oneTable" :data="boxes" :keys="boxkeys" :is-calculate="true" :is-editable="true" :calculable-key="['invQty']">
        </table-editable>
        <div class="btn-box" role="group">
          <button type="button" class="btn btn-default" @click="transfer_new">新单据</button>
          <button type="button" class="btn btn-default" @click="deleteBoxes">删除行</button>
          <button type="button" class="btn btn-default" @click="addBox">增加行</button>
          <button type="button" class="btn btn-default" @click="selectBox">选择仓库箱号</button>
          <button type="button" class="btn btn-default" @click="transferSave">保存</button>
          <!-- <button type="button" class="btn btn-default"></button> -->
          <a class="btn btn-default" target="_blank" :href="'transfer.jsp?code='+ transferNo">打印调拨单</a>
        </div>
        <transferDialog :show="dialogShow" :inv-store="invStore" @close-Dialog="closeDialog" @dialog-confirm="dialogConfirm" ref="dialog"></transferDialog>
    </div>
  </div>
</template>

<script>

import tableEditable from '../components/table-editable'
import commonMenu from '../components/menu'
import transferDialog from '../components/transfer-dialog'


export default {
  name: 'apply',
  data() {
    return {
      tableTitles: ['箱号', '流转单号', '藏品代码', '藏品名称', '数量'],
      boxes: [],
      boxkeys: ['boxNo', 'checkNo', 'productNo', 'productName', 'invQty'],
      receivers: [],
      carriers: [],
      vehicles: [],
      stores: [],
      receiveUser: 1,
      deliveryUser: 1,
      vehicleNo: 1,
      invStore: '01',
      invInstore: '01',
      transferNo: '',
      invDate: '',
      invTime: '',
      sealNo1: '',
      sealNo2: '',
      dialogShow: false,
    }
  },
  components: {
    tableEditable,
    commonMenu,
    transferDialog,
  },
  mounted() {
    this.$request('get', 'api/v1/outbound/initialize')
    .then(
      (res) => {
        this.receivers = res.body.receivers
        this.carriers = res.body.carriers
        this.vehicles = res.body.vehicles
        this.stores = res.body.stores
      },
    )
  },
  methods: {
    selectBox() {
      this.dialogShow = true
    },
    closeDialog() {
      this.dialogShow = false
    },
    transfer_new() {
      this.$request('get', 'api/v1/handovers/currentDateTime')
      .then(
        (res) => {
          this.invDate = res.body.handoverDate
          this.invTime = res.body.handoverTime
          this.transferNo = ''
          this.sealNo1 = ''
          this.sealNo2 = ''
          this.trboxes = []
          this.boxes = []
          // 重置dialog中的数据
          this.$refs.dialog.boxes = []
        },
      )
    },

    transferSearch() {
      this.$request('post', 'api/v1/sql-jsons/change/transfer')
      .send({
        invNo: this.transferNo,
      })
      .then((res) => {
        const data = res.body[0]
        this.vehicleNo = data.vehicleNo
        this.deliveryUser = data.deliveryUser
        this.receiveUser = data.deliveryUser
        this.invDate = data.invDate
        this.invTime = data.invTime.substring(0, 8)
        this.sealNo1 = data.sealNo1
        this.sealNo2 = data.sealNo2
        this.invStore = data.invStore
        this.invInstore = data.invInstore
      })

      this.$request('post', 'api/v1/sql-jsons/change/transfer_detail')
      .send({
        invNo: this.transferNo,
      })
      .then((res) => {
        this.boxes = res.body
      })
    },

    transferSave() {
      this.$request('post', '/api/v1/transfer/transfer')
      .send({
        invNo: this.transferNo,
        vehicleNo: this.vehicleNo,
        receiveUser: this.receiveUser,
        deliveryUser: this.deliveryUser,
        sealNo1: this.sealNo1,
        sealNo2: this.sealNo2,
        invDate: this.invDate,
        invTimeStr: this.invTime,
        invStore: this.invStore,
        invInstore: this.invInstore,
        inventoryDetails: this.boxes,
      })
      .then(
        (res) => {
          this.transferNo = res.text
        },
      )
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
        productName: '',
        invQty: 0,
      })
    },
    dialogConfirm(selectedBoxes) {
      this.boxes = this.boxes.concat(selectedBoxes)
    },
  },
}
</script>
