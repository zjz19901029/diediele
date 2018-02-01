import Bmob from '../libs/bmob.js'

wx.showNavigationBarLoading = wx.hideNavigationBarLoading = function() {}
Bmob.initialize("6a573f6fd54fbb1a79a891371c67cf11", "01f70367729ab78188786f12f455e270")

export const queryData = function(start = 0, size = 20, callback) {
    let GameData = Bmob.Object.extend("gameData")
	let query = new Bmob.Query(GameData)
	query.skip(start)
	query.limit(size)
	query.equalTo("enable", true)
	query.find({
		success: function(result,res) {
			console.log(result)
			// The object was retrieved successfully.
			let data = []
            for (let i = 0; i < result.length; i++) {
                result[i].attributes.data.id = result[i].id
                data.push(result[i].attributes.data)
            }
            callback(data)
		},
		error: function(result, error) {
			wx.showToast({title:"加载失败"})
		}
	})
}

export const queryDataById = function(id, callback) {
    let GameData = Bmob.Object.extend("gameData")
	let query = new Bmob.Query(GameData)
	query.equalTo("objectId", id)
	query.find({
		success: function(result) {
            if (result && result[0]) {
                callback(result[0].attributes)
            } else {
                callback()
            }
		},
		error: function(result, error) {
            wx.showToast({title:"加载失败"})
            callback()
        }
    })
}