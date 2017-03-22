<style lang="css" scoped>
.dropdown-menu {
  display: block;
}

.dropdown {
  cursor: pointer;
}
</style>

<template lang="html">
  <div>
    <nav class="navbar navbar-default" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/"><b>上文引立托管鉴定管理系统</b></a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

          <ul class="nav navbar-nav navbar-right">
            <li style="padding:15px"><span id="uname">{{userName}}</span></li>

            <li class="dropdown">
              <a @click.stop="loginDropdown" class="dropdown-toggle" data-toggle="dropdown">登陆<span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu" v-show="isShowLogin">
                <li><a @click.stop="openLoginDialog" data-toggle="modal" data-target="#mySign">登陆</a></li>
                <li><a href="#" data-toggle="modal" data-target="#modifypwd">修改密码</a></li>
              </ul>
            </li>

          </ul>

          <ul class="nav navbar-nav">

            <li class="dropdown" v-for="menu in menus" :class="{open: menu.isShow}">
              <a @click.stop="dropdownToggle(menu)" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{{menu.name}}<span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu" v-show="menu.isShow">

                <template v-for="menuItem in menu.menus">
                  <li><a :href="menuItem.url">{{menuItem.name}}</a></li>
                  <li class="divider" v-if="menuItem.divider"></li>
                </template>

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <template v-if="isShowLoginDialog">
      <div class="modal-dialog modal-sm" style="z-index:1050;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click="closeLoginDialog">×</button>
            <h4 class="modal-title" id="myModalLabel">登陆系统</h4>
          </div>
          <div class="modal-body">
            <input type="text" id="username" class="form-control" placeholder="用户名" v-model="loginName"><br>
            <input type="password" id="password" class="form-control" placeholder="密码" v-model="loginPass">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="login">提交</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop in" @click="closeLoginDialog"></div>
    </template>

  </div>
</template>

<script>

// import menuObj from '../assets/menu.json'
import superagent from 'superagent'

export default {
  data() {
    return {
      userName: '',
      menus: [],
      isShowLogin: false,
      isShowLoginDialog: false,
      loginName: '',
      loginPass: '',
    }
  },

  mounted() {
    this.getName()
    this.getMenus()
    window.addEventListener('click', this.closeAllDropdown)
  },

  methods: {
    closeAllDropdown() {
      this.menus.forEach((item) => {
        item.isShow = false
      })
      this.isShowLogin = false
    },

    dropdownToggle(menu) {
      if (!menu.isShow) {
        this.closeAllDropdown()
      }
      menu.isShow = !menu.isShow
    },

    loginDropdown() {
      if (!this.isShowLogin) {
        this.closeAllDropdown()
      }
      this.isShowLogin = !this.isShowLogin
    },

    getName() {
      superagent.get('getname.jsp')
      .then((res) => {
        const data = JSON.parse(res.text)
        if (data.responseCode === '000') {
          this.userName = data.name
        } else if (data.responseCode === '400') {
          alert('登录超时，请重新登录')
        }
      })
    },

    getMenus() {
      superagent.get('menu.jsp')
      .then((res) => {
        const menuObj = JSON.parse(res.text)

        menuObj.menus.forEach((item, index) => {
          menuObj.menus[index].isShow = false
        })
        this.menus = menuObj.menus
      })
    },

    openLoginDialog() {
      this.isShowLoginDialog = true
    },

    closeLoginDialog() {
      this.isShowLoginDialog = false
    },

    login() {
      superagent.get('login_check.jsp')
      .query({
        username: this.loginName,
        password: this.loginPass,
        temp: new Date().valueOf(),
      })
      .then((res) => {
        if (res.text === 'false') {
          alert('账号或密码错误')
        } else {
          this.userName = res.text
          this.loginName = ''
          this.loginPass = ''
          this.closeLoginDialog()

          this.getMenus()
        }
      })
    },
  },
}
</script>
