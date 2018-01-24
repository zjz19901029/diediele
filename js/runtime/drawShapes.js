import databus from '../databus'
import util from '../util'
import easeljs from '../libs/easeljs.min'

let DATA = new databus()

//绘制当前的图形, 因为小游戏中只有一个canvas的原因，直接使用XOR模式绘制，会导致背景和游戏图片重叠，所以这里在离屏canvas上绘制出图形，然后生成图片绘制到主舞台
function drawShapes(shapes, drawArea, addEvent, onChangeCb) { 
    let cloneCanvas = wx.createCanvas()
    let cloneStage = new easeljs.Stage(cloneCanvas) //绘制图形
    cloneStage.compositeOperation = "xor"
    let image
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
        cloneStage.addChild(shape)
    }
    addEvent&&addEvent(cloneStage.children, drawArea, () => {
        cloneStage.update()
        drawArea.removeChild(image)
        image = new easeljs.Bitmap(cloneCanvas)
        image.mouseEnabled = false
        drawArea.addChild(image)
    }, onChangeCb)
    cloneStage.update()
    image = new easeljs.Bitmap(cloneCanvas)
    image.mouseEnabled = false
    drawArea.addChild(image)
}

function drawCube(itemdata, drawArea) { //绘制矩形
    //let s = new easeljs.Bitmap("images/cube.jpg")
    let s = new easeljs.Shape()
    s.localData = itemdata
    //s.setTransform(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w / 297, itemdata.height * DATA.grid_w / 297)
    s.graphics.f("#000").r(0, 0, itemdata.width * DATA.grid_w, itemdata.height * DATA.grid_w)
    s.x = itemdata.x * DATA.grid_w
    s.y = itemdata.y * DATA.grid_w
    return s
}

function drawTriangle(itemdata, drawArea) { //绘制三角形
   // let s = new easeljs.Bitmap("images/triangle.png")
    let s = new easeljs.Shape()
    s.localData = itemdata
    let position = util.getTrianglePosition(itemdata, DATA.grid_w)
    s.graphics.f("#000").mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3)
    s.x = itemdata.x * DATA.grid_w
    s.y = itemdata.y * DATA.grid_w
    s.setBounds(s.x, s.y, 200, 200)
    //s.setTransform(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w / 297, itemdata.height * DATA.grid_w / 297)
    return s
}

export default drawShapes