// import styles from './index.module.less'

import Barrage from './index'
import { config } from './config'


import { useEffect, useRef, useState } from 'react'
import * as React from 'react'


const Home = () => {
  const ref = useRef<Barrage>()

  const index = useRef(5)



  const crateDiv = (params: typeof config[0]) => {
    const str = `<div style="padding: 7px 10px; border-radius: 741px; background: rgba(255, 255, 255, 0.53); display: flex; font-size: 14px; align-items: center;">
        <img style="width: 18px; height: 18px; border-radius: 50%; margin-right: 10px; " src="${params.avatar}" />
        <div style=" color: rgba(15, 34, 90, 1); ">${params.name}</div>
        <p style="color: rgba(0, 146, 255, 1); margin: 0 4px; ">${params.num}</p>
        <div style="">${params.type}</div>
        <img src="https://cdn.yupaowang.com/yp_family_business_mini/address-icon.png" style="width: 14px; height: 16px; margin: 0 4px; " />
        <div style="font-size: 12px; color: rgba(131, 142, 158, 1); ">${params.addr}</div>
      </div>`
    return str
  }

  const getRandomData = () => {
    const d = config.sort(() => Math.random() - Math.random())
    return d.map((item) => {
      return crateDiv(item)
    })
  }

  /** 初始化弹幕组建 */
  const initBarrage = () => {
    const value = getRandomData()
    const begin = value.slice(0, 6)
    const b = new Barrage('.container', {
      rowHeight: 50,
      speed: 100,
      space: 48,
    })
    ref.current = b

    setInterval(() => {
      ref.current.pushList(value.slice(index.current, index.current + 3))
      index.current += 3
      if (index.current > 50) {
        index.current = 0
      }
    }, 3000)

    b.initFull(begin)
  }

  // useEffect(() => {
  //   getData()
  // }, [])

  useEffect(() => {
    initBarrage()
  }, [])

  const hiddenCode = (code: string) => {
    return `${code.slice(0, 2)}***${code.slice(code.length - 2, code.length)}`
  }


  return (
    <div>
     <div className='container' style={{ width: '100%', height: '150px', border: '1px solid black' }}></div>
     <div onClick={() => ref.current?.pause()}>暂停</div>
    </div>
  )
}
export default Home
