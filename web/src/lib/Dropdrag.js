/**
 * 拖拽组件
 */

export class Dropdrag {

  constructor (container) {
    this._container = container
    this.funcInit()
  }

  funcInit () {
    // 事件初始化
    this._handleFileDragEnter = function () {}
    this._handleFileDragLeave = function () {}
    this._handleFileDragOver = function () {}
    this._handleFileDrop = function () {}
    this._handleDragStart = function () {}
    this._handleDragEnd = function () {}

    // 事件触发器
    this._handle = (e, f) => f(e)

  }

  setFunc (obj) {

    // 事件方法注入
    for (let i in obj) {
      switch (i) {
        case 'dragenter' :
          this._handleFileDragEnter = obj.dragenter
          break
        case 'dragleave' :
          this._handleFileDragLeave = obj.dragleave
          break
        case 'dragover' :
          this._handleFileDragOver = obj.dragover
          break
        case 'drop' :
          this._handleFileDrop = obj.drop
          break
        case 'dragstart' :
          this._handleDragStart = obj.dragstart
          break
        case 'dragend' :
          this._handleDragEnd = obj.dragend
          break
      }
    }

    return this

  }

  start (arr) {

    let _this = this,
      handle = _this._handle

    // 绑定
    for (let i in arr) {
      switch (arr[i]) {
        case 'dragenter' :
          this._container.addEventListener('dragenter', e => {
            e.stopPropagation()
            e.preventDefault()
            handle(e, _this._handleFileDragEnter)
          }, false)
          break
        case 'dragleave' :
          this._container.addEventListener('dragleave', e => {
            e.stopPropagation()
            e.preventDefault()
            handle(e, _this._handleFileDragLeave)
          }, false)
          break
        case 'dragover' :
          this._container.addEventListener('dragover', e => {
            e.stopPropagation()
            e.preventDefault()
            handle(e, _this._handleFileDragOver)
          }, false)
          break
        case 'drop' :
          this._container.addEventListener('drop', e => {
            e.stopPropagation()
            e.preventDefault()
            handle(e, _this._handleFileDrop)
          }, false)
          break
        case 'dragstart' :
          this._container.addEventListener('dragstart', e => {
            handle(e, _this._handleDragStart)
          }, false)
          break
        case 'dragend' :
          this._container.addEventListener('dragend', e => {
            handle(e, _this._handleDragEnd)
          }, false)
          break
        default :
          console.log('传入方法错误')
      }
    }
    return this
  }

  toString () {
    return 'this container is ' + this._container
  }

}

export default Dropdrag