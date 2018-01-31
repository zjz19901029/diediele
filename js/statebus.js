import databus from './databus'
import easeljs from './libs/easeljs.min'
import tips from './tips/tips'
import util from './util'

let stateChanged = function() {}

export const register = function(callback) { //注册状态切换事件
    let DATA = new databus()
    stateChanged = callback
    callback(DATA.state)
}

export const changeState = function(state, callback) { //切换状态
    let DATA = new databus()
    tips.showMask(() => {
        DATA.state = "playing"
        callback&&callback()
        stateChanged(state)
    })
}

export const next = function(callback, complete) { //下一关
    let DATA = new databus()
    if (DATA.level_now == DATA.data.length - 1) {
        tips.tip("已经是最后一关", () => {
            changeState("menu", () => {
                DATA.gameArea.removeAllChildren()
            })
        })
    } else {
        DATA.state = ""
        changeLevel(DATA.level_now + 1, callback, complete)
    }
}

export const changeLevel = function(level, callback, complete) { //切换关卡
    let DATA = new databus()
    DATA.level_now = level
    let levelNumContainer = new easeljs.Container()
    let levelNum_bg = new easeljs.Shape() //关数背景圆
    levelNum_bg.graphics.f("#000").a(DATA.window_w / 2, DATA.window_h / 2, 80, 0, 2*Math.PI)
    let levelNum = new easeljs.Text(DATA.level_now + 1, "50px Arial", "#fff")
    levelNum.x = DATA.window_w / 2
    levelNum.y = DATA.window_h / 2
    levelNum.textAlign = "center"
    levelNum.textBaseline = "middle"
    levelNumContainer.addChild(levelNum_bg, levelNum)
    tips.tip(levelNumContainer, () => {
        DATA.state = "playing"
        DATA.gameData.items = util.computeShapesLocation(DATA.data[DATA.level_now].items)
        DATA.gameData.answers = util.computeAnswer(DATA.data[DATA.level_now])
        callback&&callback()
    }, () => {
        complete&&complete()
    })
}

