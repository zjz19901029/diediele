import databus from '../databus'

let DATA = new databus()
let gameData = DATA.gameData

function judgeItem(shapeData, x, y) { //判断用户按在哪个图形上
    switch (shapeData.shape) {
        case "cube":
            return judgeCube(shapeData, x, y)
            break;
        case "triangle":
            return judgeTriangle(shapeData, x, y)
            break;
    }
}

function judgeCube(shapeData, x, y) { //判断是否在矩形内部
    if (x > shapeData.x * DATA.grid_w
        && x < (shapeData.x + shapeData.width) * DATA.grid_w
        && y > shapeData.y * DATA.grid_w
        && y < (shapeData.y + shapeData.height) * DATA.grid_w) {
        return true
    }
    return false
}

function computeTriangle(shapeData, x, y) { //计算三角形的坐标
    switch (shapeData.shape) {
        case "triangle":
            
    }
    let x1 = shapeData.x * DATA.grid_w
    let y1 = (shapeData.y + shapeData.height) * DATA.grid_w
    let x2 = (shapeData.x + shapeData.width) * DATA.grid_w
    let y2 = (shapeData.y + shapeData.height) * DATA.grid_w
    let x3 = (shapeData.x + shapeData.width) * DATA.grid_w  / 2
    let y3 = shapeData.y * DATA.grid_w
    return judgeTriangle(x1, y1, x2, y2, x3, y3)
}

function judgeTriangle(x1, y1, x2, y2, x3, y3) { //判断是否在三角形内部
    let divisor = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
    let a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / divisor
    let b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / divisor
    let c = 1 - a - b

    return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1
}

function getItemStay(item) { //让图形按照栅格排版
    item.x = Math.round(item.x)
    item.y = Math.round(item.y)
    if (item.x > DATA.grid_x - item.width) {
        item.x = DATA.grid_x - item.width
    } else if (item.x < 0) {
        item.x = 0
    }
    if (item.y > DATA.grid_y - item.height) {
        item.y = DATA.grid_y - item.height
    } else if (item.y < 0) {
        item.y = 0
    }
}

function judgeSuccess() { //判断是否通关
    let answers = gameData.answers
    let success = true
    for (let a = 0; a < answers.length; a++) { //可能有多个摆放方式
        success = true
        let answer = answers[a].split(",")
        let shapes = gameData.items
        for (let i = 0; i < shapes.length - 1; i++) {
            //判断各个图形的相对位置
            if (shapes[i + 1].x - shapes[i].x != answer[i + 1].split("|")[0] - answer[i].split("|")[0] || shapes[i + 1].y - shapes[i].y != answer[i + 1].split("|")[1] - answer[i].split("|")[1]) {
                success = false
                break
            }
        }
        if (success) {
            break
        }
    }
    return success
}

export default {
    judgeItem,
    getItemStay,
    judgeSuccess
}