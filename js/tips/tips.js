import easeljs from '../libs/easeljs.min'
import tweenjs from '../libs/tweenjs.min'
import databus from '../databus'

let DATA = new databus()

function alert(txt) {
    let levelNum = new easeljs.Text(txt, "50px Arial", "#000")
    levelNum.x = this.window_w / 2
    levelNum.y = this.window_h / 2
    levelNum.textAlign = "center"
    levelNum.textBaseline = "middle"
    DATA.maskArea.addChild(levelNum)
    showMask(() => {
        callback&&callback()
    }, () => {
        DATA.maskArea.removeChild(levelNum)
    })
}

function tip(txt, callback) {
    let child
    if (typeof txt == "string") {
        child = new easeljs.Text(txt, "20px Arial", "#000")
        child.x = DATA.window_w / 2
        child.y = DATA.window_h / 2
        child.textAlign = "center"
        child.textBaseline = "middle"
    } else {
        child = txt
    }
    DATA.maskArea.addChild(child)
    showMask(() => {
        callback&&callback()
    }, () => {
        DATA.maskArea.removeChild(child)
    })
}

function showMask(callback, complete) {
    tweenjs.Tween.get(DATA.tweenParams).to({maskOpacity: 1}, 1).call(callback).wait(1).to({maskOpacity: 0}, 1).call(complete)
}

export default {
    alert,
    tip,
    showMask
}