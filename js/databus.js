import gameData from './data/gameData'
import config from './config'
import tips from './tips/tips'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  	constructor() {
		if ( instance )
		return instance

		instance = this
		this.init()
	}

	init() {
		this.stop = false //是否禁止用户操作
		this.goNext = false //是否正在进入下一关
		this.window_w = canvas.width
		this.window_h = canvas.height
		this.playerCanvas = wx.createCanvas() //玩家区域画布
		this.answerCanvas = wx.createCanvas() //答案区域画布

		this.playerCanvas.width = this.playerCanvasWidth = config.playerCanvasWidth //玩家区域宽度
		this.playerCanvas.height = this.playerCanvasHeight = config.playerCanvasHeight //玩家区域高度
		this.answerCanvas.width = this.answerCanvasWidth = config.answerCanvasWidth //玩家区域宽度
		this.answerCanvas.height = this.answerCanvasHeight = config.answerCanvasHeight //玩家区域高度
		this.playerCanvasOffset = {
			left: (this.window_w - this.playerCanvasWidth)/2,
			top: config.playerCanvasTop
		}
		this.answerCanvasOffset = {
			left: (this.window_w - this.answerCanvasWidth)/2,
			top: config.answerCanvasTop
		}
		this.grid_w = config.grid_w //每个栅格的宽度
		this.grid_x = config.grid_x //每行格数
		this.grid_y = config.grid_y //每列格数
		this.grid_r = config.grid_r //圆点的半径

		this.level_now = 0
		
		this.ctx = this.playerCanvas.getContext('2d')
		this.ctx_bg = canvas.getContext('2d')
		this.ctx_answer = this.answerCanvas.getContext('2d')
		
		this.gameData = gameData[this.level_now]
	}

	next() {
		if (this.level_now == gameData.length - 1) {
			tips.alert("已经是最后一关")
		} else {
			this.stop = true
			this.goNext = true
			this.level_now++
			this.gameData.items = gameData[this.level_now].items
			this.gameData.answers = gameData[this.level_now].answers
			setTimeout(() => {
				this.stop = false
				this.goNext = false
			}, 1000)
		}
	}
}