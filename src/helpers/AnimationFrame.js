
const reqAnimFrame = requestAnimationFrame ||
      ((fn) => setTimeout(fn, 1000 / 60))

export default class AnimationFrame {
  constructor() {
    this.counter = 0

    this.incCounter = () => {
      this.counter += 1
      this.id = reqAnimFrame(this.incCounter)
    }

    this.stop = () => {
      if (requestAnimationFrame) {
        cancelAnimationFrame(this.id)
      } else {
        clearTimeout(this.id)
      }
    }

    this.throttle = (fn) => {
      let lastCall = this.counter
      return (e) => {
        if (this.counter !== lastCall) {
          fn(e)
          lastCall = this.counter
        }
      }
    }

    this.incCounter()
  }
}

