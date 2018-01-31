import easeljs from '../libs/easeljs.min'
import playEvent from '../event/playEvent'
import drawShapes from './drawShapes'
import databus from '../databus'


export default class playerDrawArea { //生成用户操作的区域
    constructor(data, x, y, width, height, onChangeCb) {
        this.stage = new easeljs.Container()
        this.data = data
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.init(onChangeCb, x, y)
    }

    init(onChangeCb) {
        let bgCanvas = this.drawBg()
        playEvent(this.data, this.x, this.y, () => {
        }, () => { //绑定操作区域的图形操作事件，以及每次操作之后的回调
            onChangeCb&&onChangeCb(this.data)
        })
        this.ticker = easeljs.Ticker.addEventListener("tick",() => {
            let shapeCanvas = drawShapes.drawShapes(this.data)
            canvas.getContext("2d").clearRect(this.x, this.y, this.width, this.height)
            canvas.getContext("2d").drawImage(bgCanvas, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
            canvas.getContext("2d").drawImage(shapeCanvas, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        })
    }

    drawBg() {
        let DATA = new databus()
        let bgCanvas = wx.createCanvas()
        bgCanvas.width = this.width
        bgCanvas.height = this.height
        let bg_ctx = bgCanvas.getContext("2d")
        bg_ctx.beginPath()
        bg_ctx.strokeStyle = "#666"
        bg_ctx.fillStyle = "#fff"
        bg_ctx.rect(0, 0, this.width, this.height)
        bg_ctx.fill()
        bg_ctx.closePath()
        bg_ctx.beginPath()
        bg_ctx.rect(0, 0, this.width, this.height)
        bg_ctx.stroke()
        bg_ctx.closePath()
        bg_ctx.fillStyle = "#ccc"
        for (let i = 1; i < DATA.grid_x; i++) {
            for (let j = 1; j < DATA.grid_y; j++) {
                let x = i * DATA.grid_w
                let y = j * DATA.grid_w
                bg_ctx.beginPath()
                bg_ctx.arc(x, y, DATA.grid_r, 0, 2*Math.PI)
                bg_ctx.fill()
                bg_ctx.closePath()
            }
        }
        return bgCanvas
    }

    setData(data) {
        this.data = data
    }

    clearData() {
        this.data.length = 0
    }

    getData() {
        return this.data
    }

    stop() {
        easeljs.Ticker.removeEventListener("tick", this.ticker)
    }
}