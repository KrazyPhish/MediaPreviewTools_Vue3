import type { CommonBtnConfig, ControlInfo, Information } from "@/types/base"
import { useEventListener } from "@vueuse/core"
import { ref, reactive, onMounted, watch, nextTick } from "vue"

export const useCommonToolbarConfig = (
  props: {
    readonly information: Information[],
    readonly totalTime: number,
    readonly options: CommonBtnConfig,
    readonly rates: number[],
    readonly time: number
  },
  emits: {
    (evt: 'play'): void,
    (evt: 'pause'): void,
    (evt: 'stop'): void,
    (evt: 'skip', time: number): void,
    (evt: 'onFullScreen'): void,
    (evt: 'offFullScreen'): void,
    (evt: 'changeVolume', volume: number): void,
    (evt: 'changePlayRate', rate: number): void
  }
) => {
  const volumeVisible = ref<boolean>(false)
  const infoVisible = ref<boolean>(false)
  const rateVisible = ref<boolean>(false)

  const isFullScreen = ref<boolean>(false)
  const isPlaying =  ref<boolean>(false)
  
  /**
   * 是否在拖动进度条
   */
  const isSync = ref<boolean>(true)

  const state = reactive<ControlInfo>({
    rate: 1,
    time: 0,
    volume: 1
  })
  
  onMounted(() => {
    useEventListener(window, 'resize', listenResize)
  })
  
  watch(() => props.time, (time: number) => {
    if (time == props.totalTime) {
      isPlaying.value = false
      state.time = 0
    } else state.time = time
  })

  watch(() => state.volume, (value: number) => emits('changeVolume', value))
  
  watch(() => state.rate, (value: number) => {
    rateVisible.value = false
    emits('changePlayRate', value)
  })
  
  watch(() => state.time, (time: number) => !isSync.value && emits('skip', time))

  const listenResize = () => {
    nextTick(() => {
      isFullScreen.value = (window.innerHeight == screen.height)
    })
  }
  
  const onFullScreen = () => {
    emits('onFullScreen')
  }
  
  const offFullScreen = () => {
    emits('offFullScreen')
  }
  
  const play = () => {
    isPlaying.value = true
    emits('play')
  }
  
  const pause = () => {
    isPlaying.value = false
    emits('pause')
  }
  
  const stop = () => {
    isPlaying.value = false
    emits('stop')
  }

  const formatVolume = (volume: number) => {
    return (volume * 100).toFixed(0)
  }

  /**
   * 切换源时重置部分控制台状态
   */
  const init = () => {
    isPlaying.value = false
    state.time = 0
    state.rate = 1
  }

  return {
    volumeVisible,
    infoVisible,
    rateVisible,
    isFullScreen,
    isPlaying,
    isSync,
    state,
    onFullScreen,
    offFullScreen,
    play,
    pause,
    stop,
    formatVolume,
    init
  }
}