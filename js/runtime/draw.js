
import databus from '../databus'
import drawShapes from './drawShapes'
import easeljs from '../libs/easeljs.min'
import drawPlayerArea from './playerDrawArea'
import judge from '../judge/judge'
import {next} from '../statebus'

let DATA = new databus()

let playerCanvasOffset = DATA.playerCanvasOffset
let playerCanvasWidth = DATA.playerCanvasWidth
let playerCanvasHeight = DATA.playerCanvasHeight
let gameData = DATA.gameData

let gameArea = DATA.gameArea
let bgArea = new easeljs.Container()
let answerArea = new easeljs.Container()
answerArea.x = DATA.answerCanvasOffset.left
answerArea.y = DATA.answerCanvasOffset.top
//answerArea.compositeOperation = "xor"

function drawCanvasBg() { //绘制画布基础背景方格
    let s = new easeljs.Shape()
    s.graphics.s("#666").rect(playerCanvasOffset.left, playerCanvasOffset.top, playerCanvasHeight, playerCanvasHeight)
    bgArea.addChild(s)
    for (let i = 1; i < DATA.grid_x; i++) {
        for (let j = 1; j < DATA.grid_y; j++) {
            let x = i * DATA.grid_w
            let y = j * DATA.grid_w
            s = new easeljs.Shape()
            s.graphics.f("#ccc").arc(x + playerCanvasOffset.left, y + playerCanvasOffset.top, DATA.grid_r, 0, 2*Math.PI)
            bgArea.addChild(s)
        }
    }
    gameArea.addChild(bgArea)
}

function drawAnswer() { //绘制答案图形
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
    drawShapes(shapes, answerArea)
    gameArea.addChild(answerArea)
}

function drawPlayerShapes() { //绘制用户的图形
    let shapes = gameData.items
    let playerStage = new drawPlayerArea(shapes, function(data) {
        if (judge.judgeSuccess(data, gameData.answers)) { //过关
            console.log("success")
            next(() => {
                answerArea.removeAllChildren()
                playerStage.removeAllChildren()
                draw()
            })
        }
    }).stage
    playerStage.x = DATA.playerCanvasOffset.left
    playerStage.y = DATA.playerCanvasOffset.top
    gameArea.addChild(playerStage)
}

function draw() {
    if (DATA.state != "playing") {
        return
    }
    drawCanvasBg()
    drawAnswer()
    drawPlayerShapes()
    DATA.stage.update()
}

module.exports = draw