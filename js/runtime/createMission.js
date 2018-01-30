import databus from '../databus'
import easeljs from '../libs/easeljs.min'
import {changeState} from '../statebus'
import drawPlayerArea from './playerDrawArea'
import baseShape from '../data/baseShape'
import util from '../util'
import Bmob from '../libs/bmob.js'

let DATA = new databus()
let createArea = DATA.createArea
let playerOffset = {
    left: DATA.playerCanvasOffset.left,
    top: DATA.playerCanvasOffset.top - 30
}
let gameData = []
let playerStage
let tips
let loading = false

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
    selectArea.y = playerOffset.top - 40 - 4 * DATA.grid_w
    let shapesArea = new easeljs.Container()
    let page = 1
    let pageSize = 3
    let total = Math.ceil(baseShape.length / pageSize)
    
    shapesArea.addChild(...drawSelectShapes(page, pageSize))
    shapesArea.width = 3 * 4 * DATA.grid_w
    shapesArea.x = (canvas.width - shapesArea.width) / 2

    let button_area = drawSwipeBtn(() => {
        if (page == 1) {
            return false
        }
        page--
        shapesArea.removeAllChildren()
        shapesArea.addChild(...drawSelectShapes(page, pageSize))
        DATA.stage.update()
    }, () => {
        if (page == total) {
            return false
        }
        page++
        shapesArea.removeAllChildren()
        shapesArea.addChild(...drawSelectShapes(page, pageSize))
        DATA.stage.update()
    })
    selectArea.addChild(shapesArea, button_area)
    createArea.addChild(selectArea)
}

function drawSelectShapes(page, pageSize = 3) { //绘制可选择的图形
    let shapes = []
    for (let i = (page - 1) * pageSize, index = 0; i < page * pageSize; i++, index++) {
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
        shape.y = (4 - baseShape[i].height) * DATA.grid_w //以底部对齐
        shape.x = (index * 4 + (4 - baseShape[i].width) / 2) * DATA.grid_w //每个图形占据4个宽度的位置，并居中
        shapes.push(shape)
    }
    return shapes
}

function drawSwipeBtn(prePage, nextPage) { //绘制切换图形的按钮
    let button_area = new easeljs.Container()

    let left_btn = drawTriangle({
        width: 1.5,
        height: 1.5,
        shape: "triangle",
        direction: "l"
    }, "#fff", "#000")
    left_btn.x = 10
    left_btn.y = 1.75 * DATA.grid_w
    left_btn.on("click", prePage)
    let right_btn = drawTriangle({
        width: 1.5,
        height: 1.5,
        shape: "triangle",
        direction: "r"
    }, "#fff", "#000")
    right_btn.x = canvas.width - 10 - 1.75 * DATA.grid_w
    right_btn.y = 1.75 * DATA.grid_w
    right_btn.on("click", nextPage)
    button_area.addChild(left_btn, right_btn)
    return button_area
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
    let button = util.drawButton("提交", 100, 40)
    button.x = (canvas.width / 2 - 100) / 2 + canvas.width / 2
    button.y = canvas.height - 40 - 20
    button.on("click", () => {
        if (loading) { return false }
        let data = playerStage.getData()
        if (data.length < 4 && data.length >6) {
            showTips("请选择4-6个图形")
            return false
        }
        let answer = []
        for (let i = 0; i < data.length; i++) { //拼出答案数据
            answer.push(data[i].x + "," + data[i].y)
        }
        answer = answer.join("|")
        let GameData = Bmob.Object.extend("gameData")
        let gameData = new GameData()
        gameData.set("data", {
            items: data,
            answer,
            userinfo: DATA.userInfo.userInfo
        })
        loading = true
        //添加数据，第一个入口参数是null
        gameData.save(null, {
            success: function(result) {
                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                console.log("创建成功, objectId:" + result.id)
                loading = false
            },
            error: function(result, error) {
                // 添加失败
                loading = false
            }
        });

    })
    createArea.addChild(button)
}

function addShape(shape) { //添加图形
    if (gameData.length >= 8) {
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

function drawTriangle(itemdata, f = "#000", s) { //绘制三角形
    let shape = new easeljs.Shape()
    let position = util.getTrianglePosition(itemdata, DATA.grid_w)
    if (s) {
        shape.graphics.s(s)
    }
    shape.graphics.f(f).mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3).lt(position.x1, position.y1)
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