import databus from './databus'
import draw from './runtime/draw'
import menu from './runtime/menu'
import createMission from './runtime/createMission'
import bindEvent from './event/event'
import Bmob from './libs/bmob.js'
import {register} from './statebus'
import gameData from './data/gameData'
import util from './util'

let userInfo

function init() { //初始化
  wx.showNavigationBarLoading = wx.hideNavigationBarLoading = function() {}
  Bmob.initialize("6a573f6fd54fbb1a79a891371c67cf11", "01f70367729ab78188786f12f455e270")
  wx.login({
    success: function(res) {
      if (res.code) {
          Bmob.User.requestOpenId(res.code, {//获取userData(根据个人的需要，如果需要获取userData的需要在应用密钥中配置你的微信小程序AppId和AppSecret，且在你的项目中要填写你的appId)
            success: function(userData) {
                wx.getUserInfo({
                    success: function(result) {
                      var nickName = result.userInfo.nickName
  
                      var user = new Bmob.User();//开始注册用户
                      user.set("username", userData.openid);
                      user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
                      user.set("userData", userData);
                      user.set("nickname", nickName);
                      user.signUp(null, {
                          success: function(res) {
                            console.log("注册成功!");
                          },
                          error: function(userData, error) {
                            console.log(error)
                          }
                      });
                      userInfo = result
                      getData()
                    }
                })
            },
            error: function(error) {
                // Show the error message somewhere
                console.log("Error: " + error.code + " " + error.message);
            }
        });
  
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}

function getData() {
  let GameData = Bmob.Object.extend("gameData")
  let query = new Bmob.Query(GameData)
  query.limit(10)
  query.equalTo("enable", true)
  query.find({
    success: function(result,res) {
      console.log(result)
    // The object was retrieved successfully.
      let data = []
      if (result.length == 0) {
        data = gameData
      } else {
        for (let i = 0; i < result.length; i++) {
          result[i].attributes.data.id = result[i].id
          data.push(result[i].attributes.data)
        }
      }
      let DATA = new databus([...data])
      DATA.userInfo = userInfo
      register(stateChanged) //注册状态切换事件
      let shareId = wx.getLaunchOptionsSync().query.levelid //获取分享的levelid
      shareId = "0d5a7c9cbf"
      if (shareId) {
        getShareData(shareId)
      } else {
        draw()
      }
    },
    error: function(result, error) {
        console.log("查询失败")
    }
  })
}

function getShareData(id) {
  let GameData = Bmob.Object.extend("gameData")
  let query = new Bmob.Query(GameData)
  query.equalTo("objectId", id)
  query.find({
    success: function(result,res) {
      console.log(result)
    // The object was retrieved successfully.
      let data = {
        items: util.computeShapesLocation(result[0].attributes.data.items),
        answers: util.computeAnswer(result[0].attributes.data),
        userinfo: result[0].attributes.data.userinfo
      }
      draw(data)
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