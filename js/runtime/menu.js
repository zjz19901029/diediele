import databus from '../databus'
import easeljs from '../libs/easeljs.min'
import util from '../util'
import {changeState} from '../statebus'

let DATA

function menu() {
    DATA = new databus()
    drawMissions()
    createAnswerButton()
    DATA.stage.update()
}

function drawMissions() { //绘制关卡选择
    
}

function createAnswerButton() { //绘制出题按钮
    let button_w = 100
    let button_h = 40
    let y = 400
    let button = util.drawButton("我来出题", button_w, button_h)
    button.x = (DATA.window_w - button_w) / 2
    button.y = y
    button.on("click", () => {
        changeState("create", () => {
            DATA.menuArea.removeAllChildren()
        })
    })
    DATA.menuArea.addChild(button)
}

export default menu