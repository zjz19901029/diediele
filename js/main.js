import databus from './databus'
import draw from './runtime/draw'
import menu from './runtime/menu'
import createMission from './runtime/createMission'
import bindEvent from './event/event'
import Bmob from './libs/bmob.js'
import {register} from './statebus'
import gameData from './data/gameData'

let userInfo

function init() { //初始化
  wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            userInfo = res
            getData()
          }
        })
      }
  })
}

function getData() {
  wx.showNavigationBarLoading = wx.hideNavigationBarLoading = function() {}
  Bmob.initialize("6a573f6fd54fbb1a79a891371c67cf11", "01f70367729ab78188786f12f455e270")
  let GameData = Bmob.Object.extend("gameData")
  let query = new Bmob.Query(GameData)
  query.limit(10)
  query.find({
    success: function(result) {
      console.log(result)
    // The object was retrieved successfully.
      let data = []
      if (result.length == 0) {
        data = gameData
      } else {
        for (let i = 0; i < result.length; i++) {
          data.push(result[i].attributes.data)
        }
      }
      let DATA = new databus([...data])
      DATA.userInfo = userInfo
      register(stateChanged)
    },
    error: function(result, error) {
        console.log("查询失败")
    }
  })
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