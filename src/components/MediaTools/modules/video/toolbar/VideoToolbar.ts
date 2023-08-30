import type { CommonBtnConfig, CutterInfo, Information } from "@/types/base"
import type { VideoBtnConfig } from "@/types/video"
import { ref, type Ref } from "vue"

export const useVideoToolbarConfig = (
  commonToolbarRef: Ref<{ init: () => void } | undefined>,
  props: {
    readonly totalTime: number,
    readonly information: Information[],
    readonly options: VideoBtnConfig,
    readonly rates: number[]
  },
  emits: {
    (evt: 'play'): void,
    (evt: 'pause'): void,
    (evt: 'stop'): void,
    (evt: 'onFullScreen'): void,
    (evt: 'offFullScreen'): void,
    (evt: 'changeVolume', volume: number): void,
    (evt: 'changePlayRate', rate: number): void,
    (evt: 'skip', time: number): void,
    (evt: 'saveCutter', cutterInfo: CutterInfo): void,
    (evt: 'toggleCutState'): void
  }
) => {
  const visible = ref<boolean>(false)

  const options = ref<CommonBtnConfig>({
    ifPlayRate: props.options.ifPlayRate,
    ifVolume: props.options.ifVolume,
    ifInfo: props.options.ifInfo,
    ifFullScreen: props.options.ifFullScreen
  }) 

  const changePlayRate = (rate: number) => {
    emits('changePlayRate', rate)
  }
  
  const changeVolume = (volume: number) => {
    emits('changeVolume', volume)
  }
  
  const onFullScreen = () => {
    emits('onFullScreen')
  }
  
  const offFullScreen = () => {
    emits('offFullScreen')
  }
  
  const play = () => {
    emits('play')
  }
  
  const pause = () => {
    emits('pause')
  }
  
  const stop = () => {
    emits('stop')
  }
  
  const skip = (time: number) => {
    emits('skip', time)
  }
  
  const saveCutter = (cutterInfo: CutterInfo) => {
    emits('saveCutter', cutterInfo)
  }

  const toggleCutState = () => {
    emits('toggleCutState')
  }

  const init = () => {
    commonToolbarRef.value?.init()
  }

  return {
    visible,
    options,
    changePlayRate,
    changeVolume,
    onFullScreen,
    offFullScreen,
    play,
    pause,
    stop,
    skip,
    saveCutter,
    toggleCutState,
    init
  }
}