import gameData from './data/gameData'
import config from './config'
import util from './util'
import easeljs from './libs/easeljs.min'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  	constructor() {
		if ( instance )
		return instance

		instance = this
		
		this.stage = new easeljs.Stage(canvas) //主舞台
		easeljs.Touch.enable(this.stage)
		easeljs.Ticker.timingMode = easeljs.Ticker.RAF

		this.gameArea = new easeljs.Container() //游戏舞台
		this.menuArea = new easeljs.Container()	//菜单舞台
		this.createArea = new easeljs.Container() //出题舞台
		this.maskArea = new easeljs.Container() //遮罩层
		let g = new easeljs.Graphics().f("#fff").r(0, 0, canvas.width, canvas.height)
		let mask = new easeljs.Shape(g) //遮罩层
		let bg = new easeljs.Shape(g) //底色
		this.maskArea.addChild(mask)
		this.stage.addChild(bg, this.gameArea, this.menuArea, this.createArea, this.maskArea)
		this.stage.update()
		this.tweenParams = {
			maskOpacity: 0
		}
		this.maskArea.alpha = this.tweenParams.maskOpacity
		easeljs.Ticker.addEventListener("tick",() => {
			if (this.maskArea.alpha == 0 && this.tweenParams.maskOpacity == 0) {
				return
			}
			this.maskArea.alpha = this.tweenParams.maskOpacity
			this.stage.update()
		})

		this.init()
	}

	init() {
		this.state = "create" //当前游戏状态
		this.level_now = 0
		this.window_w = canvas.width
		this.window_h = canvas.height
		this.playerCanvas = {} //玩家区域画布
		this.answerCanvas = {} //答案区域画布
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
		
		this.ctx_bg = canvas.getContext('2d')
		
		this.gameData = {
			items: util.computeShapesLocation(gameData[this.level_now].items),
			answers: util.computeAnswer(gameData[this.level_now])
		}

	}
}