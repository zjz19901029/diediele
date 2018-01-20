import databus from '../databus'
import easeljs from '../libs/easeljs'
import playEvent from '../event/playEvent'
import drawShapes from './drawShapes'

let DATA = new databus()

export default class playerDrawArea {
    constructor(data, onChangeCb) {
        let playerDrawCanvas = wx.createCanvas()
        this.stage = new easeljs.Stage(playerDrawCanvas)
        this.stage.compositeOperation = "xor"
        easeljs.Touch.enable(this.stage)
        this.data = data
        this.init(onChangeCb)
    }

    init(onChangeCb) {
        drawShapes(this.data, this.stage, playEvent, () => {
            onChangeCb&&onChangeCb(this.data)
        })
    }

    getData() {
        return this.data
    }
}