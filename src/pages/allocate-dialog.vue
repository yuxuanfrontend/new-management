<style lang="css">
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.5);
}
.flatpickr-calendar{
  z-index:9999;
}
.is-active {
  display: block;
}
</style>

<template lang="html">
  <div class="modal" :class="{'is-active': show}">
    <div class="modal-background" @click="closeDialog"></div>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="closeDialog">×</button>
          <h4 class="modal-title">箱号清单</h4>
        </div>
        <div class="modal-body" style="overflow:hidden;">
          <div class="col-xs-12">
            <div class="input-group">
              <label for="">选择仓库</label>
              <select class="form-control w50 bd-radius" v-model="selected">
                <option v-for="store in stores" :value="store.code">{{ store.name }}</option>
              </select>
            </div>
          </div>
          <div class="col-xs-12">
            <table-editable :titles="tableTitles" ref="allocateTable" :data="boxes" :keys="boxkeys" :isEditable="true" :is-calculate="true" :calculable-key="['invAqty']"></table-editable>
          </div>

          <div style="text-align:right;">
            <button type="button" class="btn btn-default" @click="queryBoxes">查询</button>
            <button type="button" class="btn btn-default" @click="tableSelect">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import _ from 'lodash'

import tableEditable from '../components/table-editable'


export default {
  name: 'storage-dialog',

  components: {
    tableEditable,
  },

  data() {
    return {
      // tableTitles: ['箱号', '流转单号', '库存数量', '已分配数量', '本单分配数量'],
      tableTitles: ['箱号', '流转单号', '库存数量', '分配数量'],
      boxes: [],
      // boxkeys: ['boxNo', 'checkNo', 'invAqty', 'count', 'indexCount'],
      boxkeys: ['boxNo', 'checkNo', 'invQty', 'invAqty'],
      stores: [],
      selected: 0,
    }
  },

  props: {
    show: {
      required: true,
      type: Boolean,
    },
    checkArrData: {
      required: true,
      type: Array,
    },
  },

  mounted() {
    this.$request('post', 'api/v1/sql-jsons/change/tb_store')
    .send({})
    .then(
      (res) => {
        this.stores = res.body
      },
    )
  },

  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },
    queryBoxes() {
      this.$request('post', 'api/v1/sql-jsons/change/aloocate_process')
      .send({
        invStore: this.selected,
        notifyDate: this.checkArrData[0].inv_date,
        customNo: this.checkArrData[0]['用户ID'],
        productNo: this.checkArrData[0]['商品标识'],
      })
      .then((res) => {
        this.boxes = res.body
      })
    },
    tableSelect() {
      console.log(Number(this.$refs.allocateTable.sums.invAqty), Number(this.checkArrData[0]['出库数量']))
      if (Number(this.$refs.allocateTable.sums.invAqty) !== Number(this.checkArrData[0]['出库数量'])) {
        alert('分配数量与出库数量不一致')
        return false
      }
      for (let i = 0; i < this.boxes.length; i += 1) {
        this.boxes[i].invDate = this.checkArrData[0].inv_date
        this.boxes[i].invStore = this.selected.name
        this.boxes[i].productNo = this.checkArrData[0].商品标识
        this.boxes[i].customNo = this.checkArrData[0].用户ID
        this.boxes[i].invStore = this.selected
      }
      this.$request('post', 'api/v1/allocate/allocate')
      .send(this.boxes)
      .then((res) => {
        alert('配货成功')
        console.log(res)
      })
    },
  },

}
</script>
