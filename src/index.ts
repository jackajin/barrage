interface OptionType {
  /** 没一行弹幕的高度，默认60px */
  rowHeight?: number

  /** 滚动的速度， 默认120 */
  speed?: number

  /** 弹幕间距，默认90 */
  space?: number
}

type BarrageQueue = Array<{
  root: Element;
  left: number;
  value: string
}> | []

// 容器高度
let wrapHeight = 0
// 容器宽度
let wrapWidth = 0
// 容器元素
let wrapElement: Element | null = null
// 一行弹幕的高度
let rowHeight = 60

/** 弹幕的间距 */
let space = 90
/** 移动速度 */
let speed = 120

let rows = 0

/** 行 div 的集合 */
const lineNodeList: Element[] = []

/** 每个弹幕div 的集合 */
const itemNodeList: any[] = []

/** 该渲染那一行弹幕 */
let currentIndex = 0

/** 每一行最后一个div */
const lastElementList: Element[] = []

let index = 0
const createBarrage = (option: any) => {
  const { root, value, left } = option
  const div = document.createElement('div')
  const idName = `item${index}`

  div.innerHTML = value

  div.setAttribute(
    'style',
    'position: absolute;'.concat('left: ', left, 'px;')
  )
  div.id = idName
  index++

  // 判断当前弹幕，是否超出了父级的宽度，如果超过了，则放入队列
  root.appendChild(div)

  const { width } = div.getBoundingClientRect()
  // 运动时间
  const time = ((left + width) / speed).toFixed(2)
  // 运动距离
  const dis = left + width

  div.setAttribute(
    'style',
    'position: absolute;'.concat('left: ', left, 'px;')
      .concat('transform: translateX(', (`${-dis}`), 'px);')
      .concat('transition: transform ', time, 's', ' linear;')
  )

  lastElementList[currentIndex] = div
  itemNodeList.push(div)

  /** 动画结束，删除数组里面的div */
  div.addEventListener('transitionend', () => {
    for (let i = 0; i < itemNodeList.length; i++) {
      if (itemNodeList[i].id === idName) {
        itemNodeList.splice(i, 1)
      }
    }
    div.remove()
  })
}

class Barrage {
  /** 动画 的 状态 */
  state = 'beginning'
  /** 调用方法的 日志 */
  callLog = ''
  
  barrageQueue: BarrageQueue = []

  constructor(element: string, option: OptionType) {
    rowHeight = option?.rowHeight || 60
    speed = option?.speed || speed
    space = option?.space || space

    if (typeof element !== 'string') {
      throw Error('dom is not a dom element')
    }

    const dom = document.querySelector(element)

    if (dom === null) {
      throw Error('dom is not a dom element')
    }
    wrapElement = dom
    this.init()
    // this.visibilitychange()
  }

  init() {
    // 容器高度
    wrapHeight = wrapElement?.clientHeight || 0
    // 容器宽度
    wrapWidth = wrapElement?.clientWidth || 0
    // 计算有多少条弹幕
    rows = Math.floor(wrapHeight / rowHeight)
    Barrage.crateLine()
  }

  /** 页面隐藏，暂停 弹幕滚动 */
  visibilitychange() {
    const _this = this
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        _this.pause()
      } else if (document.visibilityState === 'visible') {
        _this.start()
      }
    })
  }

  /** 创建lien */
  private static crateLine() {
    for (let i = 0; i < rows; i++) {
      const div = document.createElement('div')
      div.className = 'item-line'
      div.setAttribute(
        'style',
        'width: 800%; height: '.concat(`${rowHeight}px;`).concat('position: relative;').concat('overflow: hidden')
      )
      lineNodeList.push(div)
      wrapElement!.appendChild(div)
    }
  }

  /** 添加一个弹幕 */
  push(value: string) {
    if (this.state === 'paused') { return }
    this.callLog = 'push'

    const node = lineNodeList[currentIndex]
    const lastDiv = lastElementList[currentIndex]
    const info = lastDiv?.getBoundingClientRect()

    /** 初始的，最小的left距离 */
    const initLeft = wrapWidth + space

    const op = { root: node, left: initLeft, value }

    if (info) {
      const dis = info.left + info.width + space
      op.left = dis > initLeft ? dis : initLeft
    }

    createBarrage(op)

    // 到临界点后，重制index的值
    currentIndex = currentIndex === (rows - 1) ? 0 : (currentIndex + 1)
  }

  /** 添加弹幕列表 */
  pushList(value: string[]) {
    if (this.state === 'paused') { return }
    this.callLog = 'pushList'

    if (typeof value === 'string') {
      this.push(value)
      return
    }
    if (Object.prototype.toString.call(value).includes('Array')) {
      for (let i = 0; i < value.length; i++) {
        this.push(value[i])
      }
      return
    }
    throw Error('value must be an array')
  }

  /** 暂停 */
  pause() {
    if (this.state === 'paused') { return }
    this.callLog = 'pause'

    let len = itemNodeList.length
    if (len < 0) { return }

    this.state = 'paused'
    while (len > 0) {
      len--
      const transform = window.getComputedStyle(itemNodeList[len]).getPropertyValue('transform')
      itemNodeList[len].style.transform = transform
      // 把时间设置为 0 暂停动画
      itemNodeList[len].style.transition = 'transition 0s linear'
    }
  }

  /** 重新开始 */
  start() {
    if (this.state !== 'paused') { return }
    this.callLog = 'start'

    let len = itemNodeList.length
    if (len < 0) { return }

    this.state = 'restart'

    while (len > 0) {
      len--
      const left = window.getComputedStyle(itemNodeList[len]).getPropertyValue('left')
      const info = itemNodeList[len].getBoundingClientRect()
      // 计算动画终点的距离，距离结束的距离还是 和 初始的一样
      const dis = info.width + parseFloat(left)

      // 开始的动画的时间，时间会变短，用元素的left + 自身宽度 / 速度
      const time = ((info.left + info.width) / speed).toFixed(2)
      itemNodeList[len].style.transform = `translateX(${-dis}px)`
      itemNodeList[len].style.transition = `transform ${time}s linear`
    }
  }

  /** 初始化，铺满屏幕，只在能调用一次, 在所有方法之前调用 */
  initFull(value: string[]) {
    if (this.callLog !== '') { return }
    this.callLog = 'initFull'

    let len = value.length

    while (len > 0) {
      len--
      const node = lineNodeList[currentIndex]
      const lastDiv = lastElementList[currentIndex]
      const { width, left } = lastDiv?.getBoundingClientRect() || {}

      createBarrage({
        root: node,
        left: width ? (left + width + space) : 20,
        value: value[len]
      })
      currentIndex = currentIndex === (rows - 1) ? 0 : (currentIndex + 1)
    }
  }
}

export default Barrage
