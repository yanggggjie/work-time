import { useEffect, useRef, useState } from 'react'
import './App.css'

const App: React.FC = () => {
  const [time, setTime] = useState<number>(0) // 计时器时间（单位：秒）
  const intervalRef = useRef<NodeJS.Timeout | null>(null) // 保存计时器 ID

  useEffect(() => {
    // 启动计时器
    startTimer()

    // 监听主进程发送的鼠标不活跃消息
    const handleMouseInactive = (_event: any, data: boolean) => {
      if (data) {
        console.log('鼠标不活跃')
        resetTimer() // 重置计时器
      }
    }

    // 使用 ipcRenderer 监听消息
    window.ipcRenderer?.on('mouse-inactive', handleMouseInactive)

    // 清理函数，组件卸载时清除计时器和事件监听
    return () => {
      stopTimer()
      // window.ipcRenderer?.removeListener('mouse-inactive', handleMouseInactive)
    }
  }, [])

  // 启动计时器
  const startTimer = () => {
    if (intervalRef.current) return // 如果计时器已经启动，不重复启动
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
  }

  // 停止计时器
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // 重置计时器
  const resetTimer = () => {
    stopTimer()
    setTime(0)
    startTimer()
  }

  // 将秒数转换为 HH:mm:ss 格式
  const formatTime = (seconds: number): string => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const secs = String(seconds % 60).padStart(2, '0')
    return `${hours}:${minutes}:${secs}`
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-8xl">
      <div className="mb-8">{formatTime(time)}</div>
      <button
        className="bg-red-100 px-4 py-2 rounded-lg text-2xl"
        onClick={resetTimer}
      >
        重置计时
      </button>
    </div>
  )
}
export default App
