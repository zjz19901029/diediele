import databus from '../databus'
import util from '../util'
import easeljs from '../libs/easeljs'

let DATA = new databus()

function drawShapes(shapes, drawArea, addEvent, onChangeCb) { //绘制当前的图形
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
        addEvent&&addEvent(shape, onChangeCb)
        drawArea.addChild(shape)
    }
}

function drawCube(itemdata, drawArea) { //绘制矩形
    //let s = new easeljs.Bitmap("images/cube.jpg")
    let s = new easeljs.Shape()
    s.localData = itemdata
    //s.setTransform(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w / 297, itemdata.height * DATA.grid_w / 297)
    s.graphics.f("#000").r(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width, itemdata.height)
    return s
}

function drawTriangle(itemdata, drawArea) { //绘制三角形
   // let s = new easeljs.Bitmap("images/triangle.png")
    let s = new easeljs.Shape()
    s.localData = itemdata
    let position = util.getTrianglePosition(itemdata)
    s.graphics.f("#000").mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3)
    s.x = itemdata.x * DATA.grid_w
    s.y = itemdata.y * DATA.grid_w
    //s.setTransform(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w / 297, itemdata.height * DATA.grid_w / 297)
    return s
}

export default drawShapes