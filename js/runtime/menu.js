import databus from '../databus'
import easeljs from '../libs/easeljs.min'
import util from '../util'
import {changeState} from '../statebus'
import drawShapes from '../runtime/drawShapes'

let DATA
let selectMission
let missionsArea
let mission_w, mission_h

function menu() {
    DATA = new databus()
    mission_w = DATA.grid_w * 4
    mission_h = DATA.grid_w * 4
    drawMissions()
    createAnswerButton()
    DATA.stage.update()
}

function drawMissions() { //绘制关卡选择
    selectMission = DATA.level_now
    missionsArea = new easeljs.Container()
    let missionData = DATA.data
    for (let i = 0; i < missionData.length; i++) {
        missionData[i].answers = [missionData[i].answer]
        let missionCanvasData = drawShapes.drawAnswer(missionData[i])
        let missionImg = util.scaleImg(missionCanvasData, mission_w, mission_h)
        missionImg.x = i * mission_w + 20
        missionImg.y = (mission_h - missionImg.height) / 2
        missionsArea.addChild(missionImg)
    }
    missionsArea.x = (canvas.width - mission_w) / 2
    missionsArea.y = 100
    DATA.menuArea.addChild(missionsArea)
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