import databus from '../databus'
import util from '../util'

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
        && x < shapeData.x * DATA.grid_w + shapeData.width * DATA.grid_w
        && y > shapeData.y * DATA.grid_w
        && y < shapeData.y * DATA.grid_w + shapeData.height * DATA.grid_w){
        return true
    }
    return false
}

function judgeTriangle(shapeData, x0, y0) { //判断是否在三角形内部
    let position = util.getTrianglePosition(shapeData, DATA.grid_w, shapeData.x * DATA.grid_w, shapeData.y * DATA.grid_w)//传入平移坐标
    let divisor = (position.y2 - position.y3)*(position.x1 - position.x3) + (position.x3 - position.x2)*(position.y1 - position.y3)
    let a = ((position.y2 - position.y3)*(x0 - position.x3) + (position.x3 - position.x2)*(y0 - position.y3)) / divisor
    let b = ((position.y3 - position.y1)*(x0 - position.x3) + (position.x1 - position.x3)*(y0 - position.y3)) / divisor
    let c = 1 - a - b;
  
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
    DATA.stage.update()
}

function judgeSuccess(items, answers) { //判断是否通关
    let success = true
    for (let a = 0; a < answers.length; a++) { //可能有多个摆放方式
        success = true
        let answer = answers[a].split("|")
        let shapes = items
        for (let i = 0; i < shapes.length - 1; i++) {
            //判断各个图形的相对位置
            if (shapes[i + 1].x - shapes[i].x != answer[i + 1].split(",")[0] - answer[i].split(",")[0] || shapes[i + 1].y - shapes[i].y != answer[i + 1].split(",")[1] - answer[i].split(",")[1]) {
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