<style lang="scss">
.input,
.select select, {
  width: 70%;
}

.input-group .form-control{
  width: 70%;
}

.form-control.w20 {
  width: 20%;
}

.form-control.w50 {
  width: 50%;
}

.form-control.w70 {
  width: 70%;
}

label {
  font-weight: normal;
  margin-bottom: 0;
}

.control.has-addons .input.is-expanded {
  flex-grow: 0;
}
</style>

<template lang="html">
  <div class="content">
    <common-menu></common-menu>
    <div class="row">
      <div class="col-sm-12"></div>
      <div class="col-sm-12">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title"><strong>拼箱操作登记</strong></h3>
        </div>
        <div class="panel-body">
          <div class="col-xs-4">
            <label>箱号</label>
            <div class="input-group">
              <input type="text" class="form-control w50" placeholder="查询拼箱号" v-model="lclId">
              <button class="btn btn-default" @click="queryForm">查询</button>
            </div>
          </div>
          <div class="column col-xs-4">
            <label>铅封号1</label>
            <input type="text" class="form-control w70" v-model="sealId1">
          </div>
          <div class="column col-xs-4">
            <label>铅封号2</label>
            <input type="text" class="form-control w70" v-model="sealId2">
            <br>
          </div>
          <div class="col-xs-4">
            <label>登记日期&时间</label>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" readonly :value="newDate">
              <input type="text" name="" class="form-control w30" readonly :value="newTime">
            </div>
          </div>
          <div class="col-xs-4">
            <label>拼箱仓库</label>
            <select v-model="selectWarehouse" class="form-control w70" readonly>
              <option v-for="warehouse in warehouses" :value="warehouse.code">{{warehouse.name}}</option>
            </select>
          </div>
          <div class="col-xs-4">
            <label>合计数量</label>
            <input type="text" class="form-control w70" readonly :value="qualifiedAmount">
            <br>
          </div>
          <div class="col-xs-4">
            <label>艺术品代码</label>
            <div class="input-group">
              <input type="text" class="form-control w50" placeholder="查询艺术品" v-model="artworkCode">
              <button class="btn btn-default" @click="queryArtwork">查询</button>
            </div>
          </div>
          <div class="col-xs-4">
            <label>艺术品名称&最小单位</label>
            <div class="input-group">
              <input type="text" class="form-control w50" readonly v-model="artworkName">
              <input type="text" class="form-control w20" readonly v-model="artworkUnit">
            </div>
            <br>
          </div>
          <table-editable ref="mainTable" :titles="tableTitles" :keys="tableKeys" :data="boxes"></table-editable>

          <div class="vm-vertical-block">
            <button type="button" class="btn btn-default" @click="newForm">新单据</button>
            <button type="button" class="btn btn-default" @click="deleteBoxes">删除行</button>
            <button type="button" class="btn btn-default" @click="selectBoxes">选择仓库箱号</button>
            <button type="button" class="btn btn-default" @click="save">保存</button>
            <!-- <a class="button is-primary" :href="'http://192.168.228.239/delivery_print.jsp?invno=' + outWareId">打印提货单</a> -->
            <a class="btn btn-default" target="_blank" :href="'packingListtag.jsp?invno=' + lclId">打印箱贴</a>
            <a class="btn btn-default" target="_blank" :href="'packingList.jsp?invno=' + lclId">打印装箱清单</a>
          </div>
        </div>

      </div>
    </div>
    </div>


    <div class="row is-multiline" v-if="">
      <!-- <div class="control column is-1">
        <label class="label">入库单号</label>
        <input type="text" class="form-control is-disabled" readonly :value="inWareId">
      </div> -->
    </div>



    <storage-lcl-dialog ref="dialog" :artwork="artworkCode" :inv-store="selectWarehouse" :show="isShowDialog" @close-dialog="closeDialog" @dialog-confirm="getSelectedBoxes"></storage-lcl-dialog>
  </div>
</template>

<script>

import _ from 'lodash'
// import moment from 'moment'

import commonMenu from '../components/menu'
import tableEditable from '../components/table-editable'
import storageLclDialog from './storage-lcl-dialog'

export default {
  name: 'storage-lcl',
  data() {
    return {
      formId: null,
      lclId: '',
      inWareId: '',
      outWareId: '',

      sealId1: '',
      sealId2: '',
      // registerTime: '',
      newDate: '',
      newTime: '',

      isModify: true,


      tableTitles: ['箱号', '流转单号', '藏品代码', '藏品名称', '数量'],

      warehouses: [],
      selectWarehouse: '01',
      artworkCode: '',
      artworkName: '',
      artworkUnit: '',

      boxes: [],
      tableKeys: ['boxNo', 'checkNo', 'productNo', 'productName', 'invQty'],
      isShowDialog: false,
    }
  },

  computed: {
    qualifiedAmount() {
      return _.reduce(this.boxes, (sum, value) => sum + Number(value.invQty), 0)
    },
  },

  mounted() {
    this.$request('post', 'api/v1/sql-jsons/change/tb_store')
    .send({})
    .then((res) => {
      this.warehouses = res.body
    })
  },

  methods: {
    newForm() {
      this.$request('get', 'api/v1/handovers/currentDateTime')
      .then((res) => {
        this.lclId = ''
        this.isModify = false
        this.formId = null
        this.sealId1 = ''
        this.sealId2 = ''
        this.selectWarehouse = 1
        // this.qualifiedAmount = '',
        this.newDate = res.body.handoverDate
        this.newTime = res.body.handoverTime
        this.artworkCode = ''
        this.artworkName = ''
        this.artworkUnit = ''

        this.boxes = []
      })

      // this.$store.commit('clearSelectedBoxTable')
    },

    selectBoxes() {
      if (this.artworkCode === '') {
        alert('需要先填写艺术品代码')
      } else {
        this.$refs.dialog.queryBoxes()
        this.isShowDialog = true
      }
      // this.$store.commit('toggleSelectBoxesDialog')
    },

    queryArtwork: _.debounce(function artworkDebounce() {
      if (this.artworkCode === '') {
        return false
      }
      this.ajaxArtwork()
    }, 500),

    queryForm: _.debounce(function formDebounce() {
      if (this.lclId === '') {
        return false
      }
      this.ajaxForm()
    }, 500),

    save() {
      this.ajaxSave()
    },

    ajaxArtwork() {
      this.$request('post', 'api/v1/sql-jsons/change/product')
      .send({
        productNo: this.artworkCode,
      })
      .then((res) => {
        const data = res.body[0]
        this.artworkName = data.productName
        this.artworkUnit = data.productUnit
      })
    },

    ajaxForm() {
      this.$request('post', 'api/v1/sql-jsons/change/combin')
      .send({
        boxNo: this.lclId,
      })
      .then((res) => {
        const data = res.body[0]
        this.formId = data.id
        this.inWareId = data.inInvNo
        this.outWareId = data.outInvNo
        this.sealId1 = data.sealNo1
        this.sealId2 = data.sealNo2
        this.selectWarehouse = data.storeCode
        // this.registerTime = `${moment(res.body.dto.invDate).format('YYYY-MM-DD')} ${res.body.dto.invTime}`
        this.newDate = data.invDate
        this.newTime = data.invTime.substring(0, 8)
        this.artworkCode = data.productNo
        this.artworkName = data.productName
        this.artworkUnit = data.productUnit
      })

      this.$request('post', 'api/v1/sql-jsons/change/combin_detail')
      .send({
        boxNo: this.lclId,
      })
      .then((res) => {
        this.boxes = res.body
      })
    },

    ajaxSave() {
      const boxDetails = _.map(this.boxes, item => ({
        boxNo: item.boxNo,
        checkNo: item.checkNo,
        // checkAqty: item.checkAqty,
        invQty: item.invQty,
      }))

      // const date = moment(this.registerTime).format('YYYY-MM-DD')
      // const time = moment(this.registerTime).format('HH:mm:ss')

      this.$request('post', 'api/v1/box/box')
        .send({
          id: this.formId,
          sealNo1: this.sealId1,
          sealNo2: this.sealId2,
          invDate: this.newDate,
          invTime: this.newTime,
          invQty: this.qualifiedAmount,
          productNo: this.artworkCode,
          storeCode: this.selectWarehouse,
          boxDetails,
        })
        .then((res) => {
          const data = res.body
          this.lclId = data.boxNo
          this.inWareId = data.inInvNo
          this.outWareId = data.outInvNo
          this.isModify = true
          this.formId = data.id
          // if (res.body.responseCode === '000') {
          // } else {
          //   alert(res.body.responseMessage)
          // }
        })
    },

    deleteBoxes() {
      _.eachRight(this.$refs.mainTable.checkboxes, (index) => {
        this.boxes.splice(index, 1)
      })
    },

    closeDialog() {
      this.isShowDialog = false
    },

    getSelectedBoxes(selectedBoxes) {
      this.boxes = this.boxes.concat(selectedBoxes)
    },
  },

  components: {
    storageLclDialog,
    tableEditable,
    commonMenu,
  },
}
</script>
