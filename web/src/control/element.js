import common from './common'

let elements = () => common.$vue.$store.getters.getCanvasData.elements

const element = {
  addElement (elem, index = elements().length) {
    elements().splice(index, 0, elem)
  },
  delElement (index) {
    elements().splice(index, 1)
  },
  replaceElement (elem, index) {
    Object.assign(elements()[index], elem)
  },
}

class createElementJson {
  constructor ({type, hash, temp}) {
    let json = {
      type,
      data: {
        transform: {
          translate: [0, 0],
          rotate: [0, 0, 0],
        },
        viewBox: [],
      },
      hash,
      temp,
    }
    switch (json) {
      case 'image':

        break
      case 'svg':

        break
    }
  }

  setPosition () {

  }
}

export default element