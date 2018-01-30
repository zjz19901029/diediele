import databus from './databus'
import draw from './runtime/draw'
import menu from './runtime/menu'
import createMission from './runtime/createMission'
import bindEvent from './event/event'
import Bmob from './libs/bmob.js'
import {register} from './statebus'
import gameData from './data/gameData'

function init() { //初始化
  let DATA = new databus()
  wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            DATA.userInfo = res
          }
        })
      }
  })
  register(stateChanged)
}

function stateChanged(state) {
  switch (state) {
    case "playing":
      draw()
      break
    case "menu":
      menu()
      break
    case "create":
      createMission()
      break
  }
}

export default init