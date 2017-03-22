<style lang="scss" scoped>
.vm-table-wrap {
  max-height: 500px;
  overflow-y: auto;
}
.vm-table {
  text-align: center;

  td, th {
    text-align: center;
  }

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background-color: transparent;
    text-align: center;
  }

  .vm-checkbox {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
}
</style>

<template lang="html">
  <div>
    <div class="vm-table-wrap" style="clear:both;">
      <table class="table table-striped" style="font-size:16px;border:1px solid rgb(102, 102, 102);">
        <thead>
          <tr>
            <th style="width: 50px;" class="control">
              <input type="checkbox" class="checkbox vm-checkbox" v-model="checkboxAll">
            </th>
            <th v-for="title in titles">{{title}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in data">
            <td class="control"><input type="checkbox" class="checkbox vm-checkbox" :value="index" v-model="checkboxes"></td>
            <td v-if="isEditable" v-for="key in keys" class="control"><input type="text" v-model="data[key]" @focus="focus"></td>
            <td v-if="!isEditable" v-for="key in keys">{{data[key]}}</td>
          </tr>
        </tbody>
        <tfoot v-if="isCalculate">
          <tr>
            <td>合计</td>
            <td v-if="isCalculate" v-for="key in keys">{{sums[key] === undefined ? '--' : sums[key]}}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>

import _ from 'lodash'

export default {
  data() {
    return {
      testCheck: false,
      checkboxes: [],
    }
  },

  props: {
    data: {
      type: Array,
      required: true,
    },
    titles: {
      type: Array,
      required: true,
    },
    keys: {
      type: Array,
      required: true,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    isCalculate: {
      type: Boolean,
      default: false,
    },
    calculableKey: {
      type: Array,
    },
    caculatedPrecision: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    checkboxAll: {
      get() {
        return this.checkboxes.length === this.data.length
      },
      set(allChecked) {
        if (allChecked) {
          this.checkboxes = this.data.map((item, index) => index)
        } else {
          this.checkboxes = []
        }
      },
    },

    sums() {
      const result = {}

      // 计算出需要合计的列
      _.each(this.calculableKey, (key) => {
        _.each(this.data, (item) => {
          if (result[key] === undefined) {
            result[key] = Number(item[key])
          } else {
            result[key] += Number(item[key])
          }
        })
      })

      // 设置计算精度
      _.each(result, (value, key) => {
        result[key] = value.toFixed(this.caculatedPrecision)
      })

      return result
    },
  },

  watch: {
    data() {
      this.checkboxes = []
    },
  },

  methods: {
    focus(event) {
      event.target.select()
    },

    deleteLine() {
      this.checkboxes = []
    },
  },
}
</script>
