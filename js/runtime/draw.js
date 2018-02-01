import databus from '../databus'
import drawShapes from './drawShapes'
import easeljs from '../libs/easeljs.min'
import drawPlayerArea from './playerDrawArea'
import judge from '../judge/judge'
import {next, changeState} from '../statebus'
import util from '../util'

let playerStage
let DATA
let gameData
let timeInterval
let totalTime = 0

function drawMenuButton() { //绘制菜单按钮
    let button = new easeljs.Shape()
    button.graphics.s("#000").arc(25, 25, 25, 0, 2*Math.PI)
    button.graphics.f("#000").arc(25, 25, 15, 0, 2*Math.PI)
    button.x = 20
    button.y = 20
    button.on("click", () => {
        playerStage.stop()
        changeState("menu", () => {
            DATA.gameArea.removeAllChildren()
        })
    })
    DATA.gameArea.addChild(button)
}

function drawAnswerArea() { //绘制答案图形，使答案居中
    let answerCanvasData = drawShapes.drawAnswer(gameData)
    let answerImg = util.scaleImg(answerCanvasData, DATA.answerCanvas.width, DATA.answerCanvas.height)
    answerImg.x = (DATA.answerCanvas.width - answerImg.width) / 2
    answerImg.y = (DATA.answerCanvas.height - answerImg.height) / 2
    let answerArea = new easeljs.Container()
    answerArea.addChild(answerImg)
    answerArea.x = DATA.answerCanvasOffset.left
    answerArea.y = DATA.answerCanvasOffset.top
    DATA.gameArea.addChild(answerArea)
}

function drawPlayerShapes() { //绘制用户的图形
    let shapes = DATA.gameData.items
    playerStage = new drawPlayerArea(shapes, DATA.playerCanvasOffset.left, DATA.playerCanvasOffset.top, DATA.playerCanvasWidth, DATA.playerCanvasHeight, function(data) {
        if (judge.judgeSuccess(data, DATA.gameData.answers)) { //过关
            playerStage.stop()
            timeInterval && clearInterval(timeInterval)
            console.log("success")
            next(() => {
                DATA.gameArea.removeAllChildren()
            }, () => {
                draw()
            })
        }
    })
}

function countTime() { //计时
    let m = ("0" + Math.floor(totalTime / 60)).slice(-2)
    let s = ("0" + totalTime % 60).slice(-2)
    let timeText = new easeljs.Text(m + " : " + s, "20px Arial", "#000")
    timeText.y = 20
    timeText.x = canvas.width / 2
    timeText.textAlign = "center"
    timeText.textBaseline = "middle"
    DATA.gameArea.addChild(timeText)
    timeInterval = setInterval(() => {
        totalTime++
        let m = ("0" + Math.floor(totalTime / 60)).slice(-2)
        let s = ("0" + totalTime % 60).slice(-2)
        timeText.text = m + " : " + s
        DATA.stage.update()
    }, 1000)
}

function drawMissionUser() { //绘制当前出题用户
    let text = new easeljs.Text("本题由 “" + gameData.userinfo.nickName + "” 提供", "12px Arial", "#666")
    text.y = canvas.height - 20
    text.x = canvas.width / 2
    text.textAlign = "center"
    text.textBaseline = "middle"
    DATA.gameArea.addChild(text)
}

function draw(data) {
    DATA = new databus()
    gameData = data ? data : DATA.gameData
    if (DATA.state != "playing") {
        return
    }
    drawMenuButton()
    drawAnswerArea()
    drawPlayerShapes()
    countTime()
    drawMissionUser()
    DATA.stage.update()
}

module.exports = draw