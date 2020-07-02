import { readable } from 'svelte/store'

let frame

const now = Date.now()

export default readable(Date.now() - now, function start(set) {
  frame = requestAnimationFrame(() => start(set))
  set(Date.now() - now)

  return () => cancelAnimationFrame(frame)
})
