const clearTimer = (timer) => {
  if (timer) clearTimeout(timer)
  return null
}

const Debounce = function(cb, wait, immediate) {
  // init params
  if (typeof cb !== 'function') throw new TypeError('cb is not a function')
  if (typeof wait === 'boolean') {
      immediate = wait
      wait = undefined
  }
  wait = +wait
  if (isNaN(wait)) wait = 300
  if (typeof immediate !== 'boolean') immediate = false;

  // handler
  let timer = null
  return function (...params) {
      let runNow = !timer && immediate;
      timer = clearTimer(timer);
      timer = setTimeout(() => {
          if (!immediate) cb.call(this, ...params)
          timer = clearTimer(timer)
      }, wait)
      if (runNow) cb.call(this, ...params)
  }
}

const Utils = {
  clearTimer,
  Debounce
}
export default Utils