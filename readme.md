# Barrage
弹幕代码库
# 安装

```bash
 npm i yp-barrage
```

# 参考事例
```js
import { useEffect, useRef } from 'react'
import Barrage from 'barrage'

export default () => {
  const ref = useRef<Barrage>()
  useEffect(() => {
    const b = new Barrage('.wrap', {
      rowHeight: 60, // 每一行弹幕的高度，默认60px
      speed: 120, // 滚动的速度， 默认120
      space: 90, //  弹幕间距，默认90
    })
    ref.current = b
    // 初次渲染，视口里面的弹幕
    b.initFull([ 'aaaaa', 'bbbbb' ])
  }, [])
  return (
    <>
      <div className='wrap' style={{ width: '100%', height: '200px', border: '1px solid black' }}></div>
      <div onClick={() =>  ref.current.pushList(['<a>tedddddttss</a>','tettss', 'tsssssssettss', '888888888888888'])}>add</div>
      <div onClick={() =>  ref.current.pause()}>暂停</div>
      <div onClick={() =>  ref.current.start()}>开始</div>
    </>
  )
}
```

# 使用原生节点
```js
ref.current.push(
  `<div class="display: flex">
    <div>ajin</div>
    <div>0000</div>
    <div>1111</div>
  </div>`
  )
```

# 使用react 节点
```js
const App = () => <div>1111</div>
ref.current.push(<App />)
```