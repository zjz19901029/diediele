
import databus from '../databus'
import drawShapes from './drawShapes'
import drawLevelChange from './drawLevelChange'

let DATA = new databus()

let ctx_bg = DATA.ctx_bg
let playerCanvasOffset = DATA.playerCanvasOffset
let playerCanvasWidth = DATA.playerCanvasWidth
let playerCanvasHeight = DATA.playerCanvasHeight
let gameData = DATA.gameData

function drawCanvasBg() { //绘制画布基础背景方格
    ctx_bg.fillStyle="#fff"
    ctx_bg.fillRect(0, 0, DATA.window_w, DATA.window_h)
    ctx_bg.fillStyle = "#ccc"
    ctx_bg.beginPath()
    ctx_bg.lineWidth = 1
    ctx_bg.strokeStyle = "#666"
    ctx_bg.moveTo(playerCanvasOffset.left, playerCanvasOffset.top)
    ctx_bg.lineTo(playerCanvasOffset.left, playerCanvasOffset.top + playerCanvasHeight)
    ctx_bg.lineTo(playerCanvasOffset.left + playerCanvasWidth, playerCanvasOffset.top + playerCanvasHeight)
    ctx_bg.lineTo(playerCanvasOffset.left + playerCanvasWidth, playerCanvasOffset.top)
    ctx_bg.lineTo(playerCanvasOffset.left, playerCanvasOffset.top)
    ctx_bg.stroke()
    for (let i = 1; i < DATA.grid_x; i++) {
        for (let j = 1; j < DATA.grid_y; j++) {
            let x = i * DATA.grid_w
            let y = j * DATA.grid_w
            ctx_bg.beginPath()
            ctx_bg.arc(x + playerCanvasOffset.left, y + playerCanvasOffset.top, DATA.grid_r, 0, 2*Math.PI)
            ctx_bg.closePath()
            ctx_bg.fill()
        }
    }
}

function drawAnswer() { //绘制答案图形
    let answer = gameData.answers[0].split(",")
    let shapes = []
    let minX, minY, maxX
    for (let i = 0; i < answer.length; i++) {
        shapes[i] = {...gameData.items[i]}
        let x = +answer[i].split("|")[0]
        let y = +answer[i].split("|")[1]
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
    drawShapes(shapes, DATA.answerCanvas)
    ctx_bg.drawImage(DATA.answerCanvas, DATA.answerCanvasOffset.left, DATA.answerCanvasOffset.top)
}

function drawPlayerShapes() { //绘制用户的图形
    let shapes = gameData.items
    drawShapes(shapes, DATA.playerCanvas)
    ctx_bg.drawImage(DATA.playerCanvas, playerCanvasOffset.left, playerCanvasOffset.top)
}

function draw() {
    drawCanvasBg()
    drawAnswer()
    drawPlayerShapes()
    drawLevelChange()
    window.requestAnimationFrame(draw)
}

module.exports = draw