import databus from '../databus'
import util from '../util'
import easeljs from '../libs/easeljs'
import playEvent from '../event/playEvent'

let DATA = new databus()

function drawShapes(shapes, drawArea) { //绘制当前的图形
    for (let i = 0; i < shapes.length; i++) {
        let shape
        switch (shapes[i].shape) {
            case "cube":
                shape = drawCube(shapes[i], drawArea)
                break;
            case "triangle":
                shape = drawTriangle(shapes[i], drawArea)
                break;
        }
        playEvent(shape)
        drawArea.addChild(shape)
    }
}

function drawCube(itemdata, drawArea) { //绘制矩形
    let s = new easeljs.Bitmap("images/cube.jpg")
    s.x = itemdata.x * DATA.grid_w
    s.y = itemdata.y * DATA.grid_w
    //s.graphics.f("#000").r(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width, itemdata.height)
    return s
}

function drawTriangle(itemdata, drawArea) { //绘制三角形
    let s = new easeljs.Bitmap("images/triangle.png")
    s.x = itemdata.x * DATA.grid_w
    s.y = itemdata.y * DATA.grid_w
    // let s = new easeljs.Shape()
    // let position = util.getTrianglePosition(itemdata)
    // s.graphics.f("#000").mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3)
    return s
}

export default drawShapes