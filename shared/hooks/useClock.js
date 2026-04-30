import { useState, useEffect } from 'react'


export function useClock() {
  const [time, setTime] = useState(null)

  useEffect(() => {
    setTime(getIST())
    const id = setInterval(() => setTime(getIST()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function getIST() {
  const n = new Date()
  const ist = new Date(n.getTime() + 5.5 * 60 * 60 * 1000)
  const h = String(ist.getUTCHours()).padStart(2, '0')
  const m = String(ist.getUTCMinutes()).padStart(2, '0')
  const s = String(ist.getUTCSeconds()).padStart(2, '0')
  return `IST ${h}:${m}:${s}`
}
