export function colorTranform () {
  return {
    fixHSB (hsb) {
      return {
        h: Math.min(360, Math.max(0, hsb.h)),
        s: Math.min(100, Math.max(0, hsb.s)),
        b: Math.min(100, Math.max(0, hsb.b)),
      }
    },
    fixRGB (rgb) {
      return {
        r: Math.min(255, Math.max(0, rgb.r)),
        g: Math.min(255, Math.max(0, rgb.g)),
        b: Math.min(255, Math.max(0, rgb.b)),
      }
    },
    fixHex (hex) {
      let len = 6 - hex.length
      if (len > 0) {
        let o = []
        for (let i = 0; i < len; i++) {
          o.push('0')
        }
        o.push(hex)
        hex = o.join('')
      }
      return hex
    },
    Hex2RGB (hex) {
      hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16)
      return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)}
    },
    Hex2HSB (hex) {
      return this.RGB2HSB(this.Hex2RGB(hex))
    },
    RGB2HSB (rgb) {
      let hsb = {
        h: 0,
        s: 0,
        b: 0,
      }
      let min = Math.min(rgb.r, rgb.g, rgb.b)
      let max = Math.max(rgb.r, rgb.g, rgb.b)
      let delta = max - min
      hsb.b = max
      // if (max != 0) {
      //
      // }
      hsb.s = max != 0 ? 255 * delta / max : 0
      if (hsb.s != 0) {
        if (rgb.r == max) {
          hsb.h = (rgb.g - rgb.b) / delta
        } else if (rgb.g == max) {
          hsb.h = 2 + (rgb.b - rgb.r) / delta
        } else {
          hsb.h = 4 + (rgb.r - rgb.g) / delta
        }
      } else {
        hsb.h = -1
      }
      hsb.h *= 60
      if (hsb.h < 0) {
        hsb.h += 360
      }
      hsb.s *= 100 / 255
      hsb.b *= 100 / 255
      return hsb
    },
    HSB2RGB (hsb) {
      let rgb = {}
      let h = Math.round(hsb.h)
      let s = Math.round(hsb.s * 255 / 100)
      let v = Math.round(hsb.b * 255 / 100)
      if (s == 0) {
        rgb.r = rgb.g = rgb.b = v
      } else {
        let t1 = v
        let t2 = (255 - s) * v / 255
        let t3 = (t1 - t2) * (h % 60) / 60
        if (h == 360) h = 0
        if (h < 60) {
          rgb.r = t1
          rgb.b = t2
          rgb.g = t2 + t3
        }
        else if (h < 120) {
          rgb.g = t1
          rgb.b = t2
          rgb.r = t1 - t3
        }
        else if (h < 180) {
          rgb.g = t1
          rgb.r = t2
          rgb.b = t2 + t3
        }
        else if (h < 240) {
          rgb.b = t1
          rgb.r = t2
          rgb.g = t1 - t3
        }
        else if (h < 300) {
          rgb.b = t1
          rgb.g = t2
          rgb.r = t2 + t3
        }
        else if (h < 360) {
          rgb.r = t1
          rgb.g = t2
          rgb.b = t1 - t3
        }
        else {
          rgb.r = 0
          rgb.g = 0
          rgb.b = 0
        }
      }
      return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)}
    },
    RGB2Hex (rgb) {
      let hex = [
        rgb.r.toString(16),
        rgb.g.toString(16),
        rgb.b.toString(16),
      ]
      Array.prototype.map.call(hex, function (val, nr) {
        if (val.length == 1) {
          hex[nr] = '0' + val
        }
      })
      return hex.join('')
    },
    HSB2Hex (hsb) {
      return this.RGB2Hex(this.HSB2RGB(hsb))
    },
    HSL2Hex (hsl) {
      return this.RGB2Hex(hslToRgb(hsl))
    },
    HSL2RGB (hsl) {
      return hslToRgb(hsl)
    },
  }
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Object}           The RGB representation
 */
function hslToRgb ({h, s, l}) {
  let r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    let hue2rgb = function hue2rgb (p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s
    let p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}