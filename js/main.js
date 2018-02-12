import databus from './databus'
import draw from './runtime/draw'
import menu from './runtime/menu'
import createMission from './runtime/createMission'
import Bmob from './libs/bmob.js'
import {register} from './statebus'
import {queryDataById, queryData} from './data/gameData'
import util from './util'

let userInfo
let userData
let DATA
let lastLevel //上一次关卡位置
let fileManager = wx.getFileSystemManager()
let path = `${wx.env.USER_DATA_PATH}/userData.txt` //用户数据保存文件路径

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

function getData() { //获取关卡数据
	userData = {
		gameData: [],
		userMission: {}
	}
	getServerData()
	console.log()
	try {
		userData = JSON.parse(fileManager.readFileSync(path, "utf8"))
	} catch(e) {
		fileManager.writeFileSync(path, JSON.stringify({
			gameData: [],
			userMission: {}
		}), "utf8")
	}
	lastLevel = wx.getStorageSync("lastLevel") ? wx.getStorageSync("lastLevel") : 0 //获取用户上次的游戏关卡
	if (!userData || userData.gameData.length == 0) { //如果没有本地数据,则从服务器请求
		userData = {
			gameData: [],
			userMission: {}
		}
		getServerData()
	} else {
		start()
	}
	return
	fileManager.readFile({ //读取本地文件
		filePath: path,
		encoding: "utf8",
		success(data) { //成功读取
			userData =  JSON.parse(data.data)
			console.log(userData)
		},
		fail() { //读取失败，文件不存在则新建
			fileManager.writeFileSync(path, JSON.stringify({
				gameData: [],
				userMission: {}
			}), "utf8") 
		},
		complete() {
			lastLevel = wx.getStorageSync("lastLevel") ? wx.getStorageSync("lastLevel") : 0 //获取用户上次的游戏关卡
			if (!userData || userData.gameData.length == 0) { //如果没有本地数据,则从服务器请求
				userData = {
					gameData: [],
					userMission: {}
				}
				getServerData()
			} else {
				start()
			}
		}
	})
	
	wx.exitMiniProgram({ // 退出游戏的时候，保存游戏数据
		success() {
			if (!DATA || !DATA.userData) {
				return false
			}
			fileManager.writeFileSync(path, JSON.stringify(DATA.userData), "utf8") //写入文件
		}
	})
}

function getServerData(startOffset = 0, size = 20) { //从服务器获取关卡数据
	queryData(startOffset, size, (res) => {
		if (res) {
			userData.gameData = userData.gameData.concat(res) //将新的数据拼接在本地数据后
			fileManager.writeFileSync(path, JSON.stringify(userData), "utf8") //写入文件
			start()
		}
	})
}

function getShareData(id) {
	queryDataById(id, (res) => {
		if (res) {
			let data = {
				items: util.computeShapesLocation(res.data.items),
				answers: util.computeAnswer(res.data),
				userinfo: res.data.userinfo
			}
			draw(data)
		}
	})
}

function start() { //开始游戏
	DATA = new databus([...userData.gameData], lastLevel)
	DATA.userData = userData
	DATA.userInfo = userInfo
	register(stateChanged) //注册状态切换事件
	let shareId = wx.getLaunchOptionsSync().query.levelid //获取分享的levelid
	if (shareId) { //判断是否通过分享关卡进入
		getShareData(shareId)
	} else {
		draw()
	}
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