import databus from '../databus'
import easeljs from '../libs/easeljs.min'
import {changeState} from '../statebus'
import drawPlayerArea from './playerDrawArea'
import baseShape from '../data/baseShape'
import util from '../util'

let DATA = new databus()
let createArea = DATA.createArea
let playerOffset = {
    left: DATA.playerCanvasOffset.left,
    top: DATA.playerCanvasOffset.top - 30
}
let gameData = []
let playerStage
let tips

function createMission() {
    drawMenuButton()
    drawSelectArea()
    drawPlayerShapes()
    showTips("点击选择上方图形，并在下方拼出最终图案")
    drawResetButton()
    drawSubmitButton()
    DATA.stage.update()
}

function drawMenuButton() { //绘制菜单按钮
    let button = new easeljs.Shape()
    button.graphics.s("#000").arc(25, 25, 25, 0, 2*Math.PI)
    button.graphics.f("#000").arc(25, 25, 15, 0, 2*Math.PI)
    button.x = 20
    button.y = 20
    button.on("click", () => {
        playerStage.stop()
        changeState("menu", () => {
            createArea.removeAllChildren()
        })
    })
    createArea.addChild(button)
}

function drawPlayerShapes() { //绘制用户的图形
    playerStage = new drawPlayerArea(gameData, playerOffset.left, playerOffset.top, DATA.playerCanvasWidth, DATA.playerCanvasHeight, function(data) {
        
    })
}

function drawSelectArea() { //绘制选择图形的区域
    let selectArea = new easeljs.Container()

    for (let i = 0; i < baseShape.length; i++) {
        let shape
        switch (baseShape[i].shape) {
            case "cube":
                shape = drawCube(baseShape[i])
                break;
            case "triangle":
                shape = drawTriangle(baseShape[i])
                break;
        }
        shape.localData = baseShape[i]
        shape.on("click", () => { //选择图形
            addShape(shape)
        })
        shape.y = (4 - baseShape[i].height) * DATA.grid_w //以顶部对齐
        shape.x = i == 0 ? 0 : baseShape[i - 1].x + (baseShape[i - 1].width + 1) * DATA.grid_w
        baseShape[i].x = shape.x
        selectArea.addChild(shape)
    }
    let bg = new easeljs.Shape()
    let width_bg = baseShape.pop().x + baseShape.pop().width * DATA.grid_w
    bg.graphics.f("#fff").r(0, 0, width_bg, 4 * DATA.grid_w)
    selectArea.addChildAt(bg, 0)
    selectArea.x = 0
    selectArea.y = playerOffset.top - 40 - 4 * DATA.grid_w
    let startX, startY, canMove
    selectArea.on("mousedown", (e) => {
        startX = e.stageX
        canMove = true
    })
    selectArea.on("pressmove", (e) => { //拖动
        if (!canMove) {
            return false
        }
        selectArea.x += e.stageX - startX
        startX = e.stageX
        DATA.stage.update()
    })
    selectArea.on("pressup", (e) => {
        canMove = false
    })
    createArea.addChild(selectArea)
}

function drawResetButton() { //绘制重置按钮
    let button = util.drawButton("重置", 100, 40)
    button.x = (canvas.width / 2 - 100) / 2
    button.y = canvas.height - 40 - 20
    button.on("click", () => {
        gameData = []
        playerStage.setData(gameData)
    })
    createArea.addChild(button)
}

function drawSubmitButton() { //绘制提交按钮
    let button = util.drawButton("确认", 100, 40)
    button.x = (canvas.width / 2 - 100) / 2 + canvas.width / 2
    button.y = canvas.height - 40 - 20
    createArea.addChild(button)
}

function addShape(shape) { //添加图形
    if (gameData.length >= 6) {
        showTips("最多只能选择6个图形")
        DATA.stage.update()
        return false
    }
    shape.localData.x = shape.localData.y = 1
    gameData.push({...shape.localData})
    playerStage.setData(gameData)
}

function drawCube(itemdata) { //绘制矩形
    let shape = new easeljs.Shape()
    shape.graphics.f("#000").r(0, 0, itemdata.width * DATA.grid_w, itemdata.height * DATA.grid_w)
    return shape
}

function drawTriangle(itemdata) { //绘制三角形
    let shape = new easeljs.Shape()
    let position = util.getTrianglePosition(itemdata, DATA.grid_w)
    shape.graphics.f("#000").mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3)
    return shape
}

function showTips(text) { //提示文字
    if (!tips) {
        tips = new easeljs.Text(text, "14px Arial", "#000")
        tips.textAlign = "center"
        tips.textBaseline = "middle"
        tips.mouseEnabled = false
        tips.x = DATA.window_w / 2
        tips.y = playerOffset.top - 20
        createArea.addChild(tips)
    } else {
        tips.text = text
    }
}

export default createMission