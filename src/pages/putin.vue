<style lang="css">
.table-box .table-center tr th,
.table-box .table-center tr td {
  text-align: center!important;
}
</style>
<template lang="html">
  <div class="apply">
    <common-menu></common-menu>
    <h4 class="title">装箱入库</h4>
    <div class="main-apply">
        <div class="row">
          <div class="input-box col-xs-4">
            <p>箱号</p>
            <div class="input-group w50">
              <input type="text" class="form-control" placeholder="箱号" v-model="invNo" id="boxId">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="boxNoSearch">查询</button>
              </span>
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>铅封号1</p>
            <div class="input-group w50">
              <input type="text" class="form-control bd-radius" placeholder="铅封号1" v-model="head.sealNo1">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>铅封号2</p>
            <div class="input-group w50">
              <input type="text" class="form-control bd-radius" placeholder="铅封号2" v-model="head.sealNo2">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-box col-xs-4">
            <p>登记日期&时间</p>
            <div class="input-group">
              <input type="text" name="" class="form-control w30" readonly :value="head.invDate">
              <input type="text" name="" class="form-control w30" readonly :value="head.invTime">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>鉴定流转单号</p>
            <div class="input-group w80">
              <input type="text" name="" class="form-control" v-model="checkNo" placeholder="请输入鉴定流转单号">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="putinSearch">查询</button>
                <button class="btn btn-default" type="button" @click="addList">增加到列表</button>
              </span>
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>入库仓库</p>
            <div class="input-group">
              <select v-model="selectWarehouse" class="form-control w50 bd-radius" readonly>
                <option v-for="warehouse in warehouses" :value="warehouse.code">{{warehouse.name}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-box col-xs-4">
            <p>艺术品名称&最小单位</p>
            <div class="input-group">
              <input type="text" class="form-control w30" v-model="putinCheck.productName">
              <input type="text" class="form-control w20" v-model="putinCheck.productUnit">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>艺术品代码</p>
            <div class="input-group">
              <input type="text" class="form-control w50 bd-radius" v-model="putinCheck.productNo">
            </div>
          </div>
          <div class="input-box col-xs-4">
            <p>合格数量&累计入库&本次入库</p>
            <div class="input-group">
              <input type="text" class="form-control w30" readonly :value="putinCheck.applyAqty">
              <input type="text" class="form-control w30" readonly :value="putinCheck.invSqty">
              <input type="text" class="form-control w30" v-model="putinCheck.invQty">
            </div>
          </div>
        </div>
        <table-editable :titles="tableTitles" ref="oneTable" :data="boxes" :keys="boxkeys" :is-calculate="true" :is-editable="true" :calculable-key="['inv_qty']">
        </table-editable>
        <div class="btn-box" role="group">
          <button type="button" class="btn btn-default" @click="putinNew">新单据</button>
          <button type="button" class="btn btn-default" @click="deleteBoxes">删除行</button>
          <button type="button" class="btn btn-default" @click="addBox">增加行</button>
          <button type="button" class="btn btn-default" @click="putinSave">保存</button>
          <a class="btn btn-default" target="_blank" :href="'packingListtag.jsp?invno=' + invNo">打印箱封单</a>
          <a class="btn btn-default" target="_blank" :href="'packingList.jsp?invno=' + invNo">打印装箱清单</a>
        </div>
    </div>
    <!-- <tabledialog></tabledialog> -->
  </div>
</template>

<script>
// import moment from 'moment'
// import testData from '../test-data.json'

import tableEditable from '../components/table-editable'
import commonMenu from '../components/menu'

export default {
  name: 'apply',
  data() {
    return {
      invNo: '',
      head: {
        sealNo1: '',
        sealNo2: '',
        invDate: '',
        invTime: '',
      },
      tableTitles: ['流转单号', '合格数量', '累计入库数量', '本次入库数量', '未入库数量', '备注'],
      boxes: [],
      boxkeys: ['checkNo', 'applyAqty', 'invSqty', 'invQty', 'invNqty', 'invRemark'],
      checkNo: '',
      putinCheck: {
        productNo: '',
        productName: '',
        productUnit: '',
        applyAqty: '',
        invSqty: '',
        invQty: '',
      },
      selectWarehouse: '01',
      warehouses: [],
    }
  },
  components: {
    tableEditable,
    commonMenu,
  },
  mounted() {
    this.$request('post', 'api/v1/sql-jsons/change/tb_store')
    .send({})
    .then((res) => {
      this.warehouses = res.body
    })
  },
  methods: {
    putinNew() {
      this.$request('get', 'api/v1/handovers/currentDateTime')
      .then(
        (res) => {
          const data = res.body

          this.invNo = ''
          this.head = {
            sealNo1: '',
            sealNo2: '',
            invDate: data.handoverDate,
            invTime: data.handoverTime,
          }
          this.checkNo = ''
          this.putinCheck = {
            productNo: '',
            productName: '',
            productUnit: '',
            applyAqty: '',
            invSqty: '',
            invQty: '',
          }
          this.boxes = []
        },
      )
    },
    boxNoSearch() {
      this.$request('post', 'api/v1/sql-jsons/change/putin')
      .send({
        invNo: this.invNo,
      })
      .then((res) => {
        if (res.body) {
          // const data = res.body[0]
          // this.sealNo1 = data.seal_no1
          // this.sealNo2 = data.seal_no2
          // this.invDate = data.inv_date
          // this.invTime = data.invTime
          this.head = res.body[0]
          this.head.invTime = this.head.invTime.substring(0, 8)
        }
      })

      this.$request('post', 'api/v1/sql-jsons/change/putin_detail')
      .send({
        boxNo: this.invNo,
      })
      .then((res) => {
        if (res.body) {
          const data = res.body
          this.boxes = data
        }
      })
    },
    putinSearch() {
      this.$request('post', 'api/v1/sql-jsons/change/putin_check')
      .send({
        checkNo: this.checkNo,
      })
      .then(
        (res) => {
          this.putinCheck = res.body[0]
        },
      )
    },
    addList() {
      const putinCheck = this.putinCheck
      if (putinCheck.applyAqty - putinCheck.invSqty < putinCheck.invQty) {
        alert('本次入库数量不能大于合格数量减去累计入库数量')
        return false
      }

      const boxItem = {}

      // 从putincheck中取出值到boxes中
      for (let i = 0; i < this.boxkeys.length; i += 1) {
        boxItem[this.boxkeys[i]] = putinCheck[this.boxkeys[i]]
      }

      boxItem[this.boxkeys[0]] = this.checkNo

      boxItem.productNo = this.putinCheck.productNo

      // 算出未入库数量
      boxItem[this.boxkeys[4]] = boxItem[this.boxkeys[1]] - boxItem[this.boxkeys[2]] - boxItem[this.boxkeys[3]]

      this.boxes.push(boxItem)
    },
    putinSave() {
      this.$request('post', 'api/v1/putin/putin')
      .send({
        checkNo: this.checkNo,
        sealNo1: this.head.sealNo1,
        sealNo2: this.head.sealNo2,
        invDate: this.head.invDate,
        invTimeStr: this.head.invTime,
        inventoryDetails: this.boxes,
        invStore: this.selectWarehouse,
      })
      .then(
        (res) => {
          console.log(res)
          this.invNo = res.text
        },
      )
    },
    deleteBoxes() {
      const indexes = this.$refs.oneTable.checkboxes
      for (let i = indexes.length - 1; i >= 0; i -= 1) {
        this.boxes.splice(indexes[i], 1)
      }
    },
    addBox() {
      const boxItem = {}
      for (let i = 0; i < this.boxkeys.length; i += 1) {
        boxItem[this.boxkeys[i]] = ''
      }
      this.boxes.push(boxItem)
    },
  },
}
</script>
