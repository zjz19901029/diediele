import databus from './databus'
import draw from './runtime/draw'
import menu from './runtime/menu'
import createMission from './runtime/createMission'
import bindEvent from './event/event'
import Bmob from './libs/bmob.js'
import {register} from './statebus'

let DATA = new databus()

function init() { //初始化
    wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              DATA.userInfo = res
            }
          })
        }
    })
    wx.showNavigationBarLoading = wx.hideNavigationBarLoading = function() {}
    Bmob.initialize("6a573f6fd54fbb1a79a891371c67cf11", "01f70367729ab78188786f12f455e270")
    var gameData = Bmob.Object.extend("gameData");
    var query = new Bmob.Query(gameData);
    query.limit(10);
    query.find({
      success: function(result) {
        // The object was retrieved successfully.
        console.log(result);
      },
      error: function(result, error) {
        console.log("查询失败");
      }
    });
    register(stateChanged)
    bindEvent()
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