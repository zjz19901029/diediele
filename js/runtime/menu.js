import databus from '../databus'
import easeljs from '../libs/easeljs.min'
import util from '../util'
import {changeState} from '../statebus'
import drawShapes from '../runtime/drawShapes'
import { bindEvent, unbindEvent } from '../event/menuEvent'
import tweenjs from '../libs/tweenjs.min'

let DATA
let missionData //关数数据
let selectedMission //当前选择的关卡
let totalMission //当前已加载的总关数
let missionsArea
let mission_w, mission_h, perWidth
let missionsAreaPosition = {
    x: 0
}
let selectEvent
let isSelecting = false

function menu() {
    DATA = new databus()
    missionData = DATA.data
    selectedMission = DATA.level_now //默认是上一次的关卡
    mission_w = DATA.grid_w * 4 //每个答案图形占据的最大宽度
    mission_h = DATA.grid_w * 4 //每个答案图形占据的最大高度
    perWidth = mission_w + 20 //每个答案加上间隔的总宽度
    missionsArea = new easeljs.Container()
    missionsArea.y = 100
    DATA.menuArea.addChild(missionsArea)

    drawMissions()
    selectMissionEvent()
    createAnswerButton()
    DATA.stage.update()
}

function drawMissions(start = 0) { //绘制关卡选择
    for (let i = start; i < missionData.length; i++) {
        missionData[i].answers = [missionData[i].answer]
        let missionCanvasData = drawShapes.drawAnswer(missionData[i]) //生成答案图形
        let missionImg = util.scaleImg(missionCanvasData, mission_w, mission_h) //根据容器尺寸进行缩放，使得可以完整显示
        missionImg.x = i * perWidth + (mission_w - missionImg.width) / 2 //计算图形摆放的位置
        missionImg.y = (mission_h - missionImg.height) / 2
        missionsArea.addChild(missionImg)
        
    }
}

function selectMissionEvent() { //选择关卡操作事件
    selectEvent = easeljs.Ticker.addEventListener("tick", () => {
        missionsArea.x = (canvas.width - mission_w) / 2 + missionsAreaPosition.x
        DATA.stage.update()
    })
    bindEvent(missionsAreaPosition, () => {
        isSelecting = true
    }, () => {
        let finalX = Math.round(missionsAreaPosition.x / perWidth) * perWidth
        finalX = finalX > 0 ? 0 : finalX
        tweenjs.Tween.get(missionsAreaPosition).to({x: finalX}, 0.1).call(() => {
            isSelecting = false
        })
    })
}

function createAnswerButton() { //绘制出题按钮
    let button_w = 100
    let button_h = 40
    let y = 400
    let button = util.drawButton("我来出题", button_w, button_h)
    button.x = (DATA.window_w - button_w) / 2
    button.y = y
    button.on("click", () => { //跳转出题界面
        changeState("create", destory)
    })
    DATA.menuArea.addChild(button)
}

function destory() { //销毁菜单页
    DATA.menuArea.removeAllChildren()
    easeljs.Ticker.removeEventListener(selectEvent)
    unbindEvent()
}

export default menu