import './js/libs/weapp-adapter'
import init from './js/main'
import loadfile from './js/preload/preload'
import Bmob from './js/libs/bmob.js'
import gameData from './js/data/gameData'
import databus from './js/databus'

loadfile([
    'images/cube.jpg',
    'images/menu_btn.png'
], () => {
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
					data.push(result[i].data)
				}
            }
            new databus(data)
            init()
        },
        error: function(result, error) {
            console.log("查询失败")
        }	
    })
})