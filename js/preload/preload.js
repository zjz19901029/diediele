let index = 0

function loadfile(files, callback) {
    index = 0
    loadSingleFile(files, callback)
}

function loadSingleFile(files, callback) {
    let img = new Image()
    img.src = files[index]
    img.onload = function() {
        if (index < files.length - 1) {
            index++
            loadSingleFile(files, callback)
        } else {
            callback()
        }
    }
}

export default loadfile
