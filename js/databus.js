import gameData from './data/gameData'
import config from './config'
import tips from './tips/tips'
import createjs from './libs/tweenjs.min'

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
		this.level_now = 0
		this.window_w = canvas.width
		this.window_h = canvas.height
		this.playerCanvas = wx.createCanvas() //玩家区域画布
		this.answerCanvas = wx.createCanvas() //答案区域画布
		this.grid_w = Math.round((this.window_w - config.padding * 2) / config.grid_x) //每个栅格的宽度
		this.grid_x = config.grid_x //每行格数
		this.grid_y = config.grid_y //每列格数
		this.grid_r = config.grid_r //圆点的半径

		this.playerCanvas.width = this.playerCanvasWidth = this.grid_w * config.grid_x //玩家区域宽度
		this.playerCanvas.height = this.playerCanvasHeight = this.grid_w * config.grid_y //玩家区域高度
		this.answerCanvas.width = this.answerCanvasWidth = this.grid_w * config.grid_answer_x //答案区域宽度
		this.answerCanvas.height = this.answerCanvasHeight = this.grid_w * config.grid_answer_y //答案区域高度
		let margin = Math.ceil((this.window_h - this.playerCanvasHeight - this.answerCanvasHeight) / 3)

		this.playerCanvasOffset = {
			left: (this.window_w - this.playerCanvasWidth)/2,
			top: margin * 2 + this.answerCanvasHeight
		}
		this.answerCanvasOffset = {
			left: (this.window_w - this.answerCanvasWidth)/2,
			top: margin
		}
		
		this.ctx = this.playerCanvas.getContext('2d')
		this.ctx_bg = canvas.getContext('2d')
		this.ctx_answer = this.answerCanvas.getContext('2d')
		
		this.gameData = gameData[this.level_now]

		this.tweenParams = {
			maskOpacity: 0
		}
	}

	next() {
		if (this.level_now == gameData.length - 1) {
			tips.alert("已经是最后一关")
		} else {
			this.stop = true
			this.changeLevel()
		}
	}

	changeLevel() {
		this.level_now++
		createjs.Tween.get(this.tweenParams).to({maskOpacity: 1}, 1).call(() => {
			this.gameData.items = gameData[this.level_now].items
			this.gameData.answers = gameData[this.level_now].answers
		}).wait(1).to({maskOpacity: 0}, 1).call(() => {
			this.stop = false
		})
	}

	levelChanged() {
		
	}
}