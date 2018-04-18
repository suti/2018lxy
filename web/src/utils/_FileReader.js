import CryptoJS from 'crypto-js'

class _FileReader {

  constructor () {
    this._blob = null
    this.md5 = null
    this._base64 = null
    this.sha256 = null
    this.sha512 = null
    this.aes = null
    this.type = ''
  }

  async blob (blob) {

    blob &&
    blob instanceof File &&
    (this._base64 = await this.readAsDataURL(blob))
    ||
    blob &&
    blob instanceof Blob &&
    (this._blob = blob)

    let _blob = this._blob
    return new Promise((resolve, reject) => {
      if (_blob && blob instanceof Blob)
        return resolve(_blob)
      if (this._base64 == null)
        return reject(new Error('base64 is null'))
      let mimeString = this._base64.split(',')[0].split(':')[1].split(';')[0]
      this.type = mimeString
      let dataBin = atob(this._base64.split(',')[1])
      let buffer = new Uint8Array(dataBin.length)
      for (let i = 0; i < dataBin.length; i++) {
        buffer[i] = dataBin.charCodeAt(i)
      }
      _blob = new Blob([buffer.buffer], {type: mimeString})
      this._blob = _blob
      return resolve(_blob)
    })
  }

  async base64 (base64) {
    base64 &&
    typeof base64 === 'string' &&
    (this._base64 = base64)

    base64 &&
    base64 instanceof File &&
    (this._base64 = await this.readAsDataURL(base64))

    this._base64 &&
    (this.type = this._base64.split(',')[0].split(':')[1].split(';')[0])

    return this._base64
  }

  async MD5 () {
    let md5Instance = CryptoJS.algo.MD5.create()
    let _blob = await this.blob()
    let binaryString = await this.readAsBinaryString(_blob)
    md5Instance.update(CryptoJS.enc.Latin1.parse(binaryString))
    return this.md5 = md5Instance.finalize().toString()
  }

  SHA256 () {

  }

  SHA512 () {

  }

  AES () {

  }

  readAsBinaryString (_blob) {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.readAsBinaryString(_blob)
      reader.onload = () => resolve(reader.result)
    })
  }

  readAsDataURL (_blob) {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.readAsDataURL(_blob)
      reader.onload = () => resolve(reader.result)
    })
  }

  readAsText (_blob, encoding = 'utf-8') {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.readAsText(_blob, encoding)
      reader.onload = () => resolve(reader.result)
    })
  }
}

export default _FileReader