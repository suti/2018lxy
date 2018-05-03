const common = {
  initVue (vue) {
    this.$vue = vue
  },
}

export default common

export function computeImageWidthHeight (url) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = url
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}