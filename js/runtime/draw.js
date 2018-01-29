
import databus from '../databus'
import drawShapes from './drawShapes'
import easeljs from '../libs/easeljs.min'
import drawPlayerArea from './playerDrawArea'
import judge from '../judge/judge'
import {next, changeState} from '../statebus'

let DATA = new databus()

let playerCanvasOffset = DATA.playerCanvasOffset
let playerCanvasWidth = DATA.playerCanvasWidth
let playerCanvasHeight = DATA.playerCanvasHeight
let gameData = DATA.gameData

let gameArea = DATA.gameArea

let playerStage

function drawMenuButton() { //绘制菜单按钮
    let button = new easeljs.Shape()
    button.graphics.s("#000").arc(25, 25, 25, 0, 2*Math.PI)
    button.graphics.f("#000").arc(25, 25, 15, 0, 2*Math.PI)
    button.x = 20
    button.y = 20
    button.on("click", () => {
        playerStage.stop()
        changeState("menu", () => {
            gameArea.removeAllChildren()
        })
    })
    gameArea.addChild(button)
}

function drawAnswer() { //绘制答案图形，使答案居中
    let answer = gameData.answers[0].split("|")
    let shapes = []
    let minX, minY, maxX
    for (let i = 0; i < answer.length; i++) {
        shapes[i] = {...gameData.items[i]}
        let x = +answer[i].split(",")[0]
        let y = +answer[i].split(",")[1]
        shapes[i].x = x
        shapes[i].y = y
        if (!minX || x < minX) { //判断当前图形的左边X坐标是否是整体的最左边
            minX = x
        }
        if (!maxX || x + shapes[i].width > maxX) { //判断当前图形的右边X坐标是否是整体的最右边
            maxX = x + shapes[i].width
        }
        if (!minY || y < minY) { //判断当前图形的上边Y坐标是否是整体的最上边
            minY = y
        }
    }
    let finalX = Math.ceil((DATA.answerCanvasWidth / DATA.grid_w - (maxX - minX)) / 2) //计算最终位移的X坐标
    let finalY = 0 //计算最终位移的Y坐标
    let minusX = finalX - minX //根据最小X坐标计算应该整体位移的X值
    let minusY = finalY - minY //根据最小Y坐标计算应该整体位移的Y值
    shapes.map((shape) => { //所有图形整体位移
        shape.x += minusX
        shape.y += minusY
    })
    let answerArea = new easeljs.Bitmap(drawShapes(shapes))
    answerArea.x = DATA.answerCanvasOffset.left
    answerArea.y = DATA.answerCanvasOffset.top
    gameArea.addChild(answerArea)
}

function drawPlayerShapes() { //绘制用户的图形
    let shapes = gameData.items
    playerStage = new drawPlayerArea(shapes, DATA.playerCanvasOffset.left, DATA.playerCanvasOffset.top, playerCanvasWidth, playerCanvasHeight, function(data) {
        if (judge.judgeSuccess(data, gameData.answers)) { //过关
            playerStage.stop()
            console.log("success")
            next(() => {
                gameArea.removeAllChildren()
            }, () => {
                draw()
            })
        }
    })
}

function draw() {
    if (DATA.state != "playing") {
        return
    }
    drawMenuButton()
    drawAnswer()
    drawPlayerShapes()
    DATA.stage.update()
}

module.exports = draw