<style lang="css">
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.5);
}

.is-active {
  display: block;
}
</style>

<template lang="html">
  <div class="modal" :class="{'is-active': show}">
    <div class="modal-background" @click="closeDialog"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="closeDialog">×</button>
          <h4 class="modal-title" id="myModalLabel">箱号清单</h4>
        </div>
        <div class="modal-body" style="overflow:hidden;">
          <div class="col-xs-6">
            <input type="text" class="form-control" style="width:70%" ref="startdate" v-model="startDate" @input="queryBoxes">
            <br>
          </div>
          <div class="col-xs-6">
            <input type="text" class="form-control" style="width:70%" ref="enddate" v-model="endDate" @input="queryBoxes">
            <br>
          </div>
          <div class="col-xs-12">
            <table-editable :titles="tableTitles" :keys="tableKeys" ref="innerTable" :data="boxes" :is-select="true"></table-editable>
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

import _ from 'lodash'
import moment from 'moment'
import Flatpickr from 'flatpickr'
import datePickerZh from 'flatpickr/dist/l10n/zh'

import tableEditable from '../components/table-editable'

Flatpickr.localize(datePickerZh.zh)

export default {
  name: 'storage-dialog',

  components: {
    tableEditable,
  },

  data() {
    return {
      boxes: [],

      tableTitles: ['箱号', '流转单号', '藏品代码', '藏品名称', '数量'],
      tableKeys: ['boxNo', 'checkNo', 'productNo', 'productName', 'invQty'],
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    }
  },

  props: {
    artwork: {
      required: true,
    },
    show: {
      required: true,
      type: Boolean,
    },
    invStore: {
      required: true,
    },
  },

  mounted() {
    /* eslint-disable no-new */
    new Flatpickr(this.$refs.startdate)
    new Flatpickr(this.$refs.enddate)

    // this.queryBoxes()
  },

  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },

    queryBoxes() {
      if (this.startDate === '' || this.endDate === '') {
        return false
      }

      this.ajaxBoxes()
    },

    ajaxBoxes() {
      this.$request('post', 'api/v1/sql-jsons/change/combin_box')
        .send({
          startDate: this.startDate,
          endDate: this.endDate,
          productNo: this.artwork,
          invStore: this.invStore,
        })
        .then((res) => {
          this.boxes = res.body
        })
    },

    tableSelect() {
      const selectedData = _.filter(this.boxes, (item, index) => {
        if (_.indexOf(this.$refs.innerTable.checkboxes, index) >= 0) {
          return true
        }
      })
      this.closeDialog()
      this.$emit('dialog-confirm', selectedData)
    },
  },

}
</script>
