import databus from '../databus'
import easeljs from '../libs/easeljs'
import playEvent from '../event/playEvent'
import drawShapes from './drawShapes'

let DATA = new databus()

export default class playerDrawArea { //生成用户操作的区域
    constructor(data, onChangeCb) {
        let playerDrawCanvas = wx.createCanvas()
        this.stage = new easeljs.Stage(playerDrawCanvas)
        this.stage.compositeOperation = "xor"
        easeljs.Touch.enable(this.stage)
        this.data = data
        this.init(onChangeCb)
    }

    init(onChangeCb) {
        drawShapes(this.data, this.stage, playEvent, () => { //绑定操作区域的图形操作事件，以及每次操作之后的回调
            onChangeCb&&onChangeCb(this.data)
        })
    }

    getData() {
        return this.data
    }
}