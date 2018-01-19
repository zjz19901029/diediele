import gameData from './data/gameData'
import config from './config'
import tips from './tips/tips'
import createjs from './libs/tweenjs.min'
import easeljs from './libs/easeljs'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  	constructor() {
		if ( instance )
		return instance

		instance = this
		this.stage = new easeljs.Stage(canvas)
		easeljs.Touch.enable(this.stage)
		easeljs.Ticker.timingMode = easeljs.Ticker.RAF
		this.init()
	}

	init() {
		this.state = "playing" //当前游戏状态
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
		
		this.gameData = {
			items: gameData[this.level_now].items,
			answers: this.computeAnswer(gameData[this.level_now])
		}

		this.tweenParams = {
			maskOpacity: 0
		}
	}

	next() { //下一关
		if (this.level_now == gameData.length - 1) {
			tips.alert("已经是最后一关")
		} else {
			this.state = ""
			this.changeLevel()
		}
	}

	changeLevel() { //切换关卡
		this.level_now++
		createjs.Tween.get(this.tweenParams).to({maskOpacity: 1}, 1).call(() => {
			this.gameData.items = gameData[this.level_now].items
			this.gameData.answers = this.computeAnswer(gameData[this.level_now])
		}).wait(1).to({maskOpacity: 0}, 1).call(() => {
			this.state = "playing"
		})
	}

	computeAnswer(data) { //计算答案的所有摆放形式，因为会有相同的图形，所以存在多种摆放形式
		let items = data.items
		let answer = data.answer.split("|")
		let sameRecord = this.findSameRecord(items)
		let newAnswer = this.changeLocation(answer, sameRecord)
		let answers = []
		for (let i = 0; i < newAnswer.length; i++) {
			answers.push(newAnswer[i].join("|"))
		}
		return answers
	}

	findSameRecord(items) { //找出相同的图形生成数组,[[0,1],[2,3,4]]
		let repeatRecord = {} //用来记录已经计算过的重复项
		let computeRecord = [] //记录需要计算的重复项
		for (let i = 0; i < items.length; i++) { //遍历所有图形，并且没有被计算过
			if (repeatRecord[i]) {
				continue
			}
			let temp = [i]
			for (let j = 1; j < items.length; j++) {
				if (repeatRecord[j] || j == i) {
					continue
				}
				if (this.isSame(items[i], items[j])) { //2个图形相同
					temp.push(j) //记录相同的图形
					repeatRecord[j] = true //标识改图形已被选取，不需要再遍历
					repeatRecord[i] = true //标识改图形已被选取，不需要再遍历
				}
			}
			if (temp.length > 1) { //有2个以上相同的图形
				computeRecord.push(temp)
			}
		}
		return computeRecord
	}

	changeLocation(answer, sameRecord) { //根据找出的相同图形数据，进行位置替换，生成所有可能的答案分布
		let answers = [answer]
		for (let i = 0; i < sameRecord.length; i++) {
			let newAnswer = []
			for (let k = 0; k < answers.length; k++) { //在之前已得到的答案基础上，进行全排列
				for (let m = 0; m < sameRecord[i].length; m++) {
					for (let n = m + 1; n < sameRecord[i].length; n++) { //将相同图形进行全排列，生成对应的图形坐标数据
						let nowAnswer = [...answers[k]] //使用析构，防止更改到原始数据
						let temp = nowAnswer[sameRecord[i][m]]
						nowAnswer[sameRecord[i][m]] = nowAnswer[sameRecord[i][n]]
						nowAnswer[sameRecord[i][n]] = temp
						newAnswer.push(nowAnswer)
					}
				}
			}
			answers = answers.concat(newAnswer)
		}
		return answers
	}

	isSame(item1, item2) { //判断2个图形是否完全一致
		return (item1.width == item2.width && item1.height == item2.height && item1.shape == item2.shape && item1.direction == item2.direction)
	}
}