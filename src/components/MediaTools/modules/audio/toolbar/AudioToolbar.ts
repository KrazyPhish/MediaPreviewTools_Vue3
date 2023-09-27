import type { AudioBtnConfig, PlayDisplayProps, RepeatSettings } from "@/types/audio"
import type { Information, CommonBtnConfig, DeepRequired } from "@/types/base"
import { reactive, ref, watch } from "vue"

export const useAudioToolbarConfig = (
  props: {
    readonly totalTime: number,
    readonly information: Information[],
    readonly btnOptions: AudioBtnConfig,
    readonly displayOptions: PlayDisplayProps,
    readonly rates: number[]
  },
  emits: {
    (evt: 'play'): void,
    (evt: 'pause'): void,
    (evt: 'stop'): void,
    (evt: 'skip', time: number): void,
    (evt: 'onFullScreen'): void,
    (evt: 'offFullScreen'): void,
    (evt: 'changeVolume', volume: number): void,
    (evt: 'changePlayRate', rate: number): void,
    (evt: 'skipMuteArea', value: boolean): void,
    (evt: 'showMuteArea', value: boolean): void,
    (evt: 'toggleRepeat', value: RepeatSettings): void,
    (evt: 'onZoom', mode: 'horizontal' | 'vertical', zoom: number): void,
    (evt: 'onSpect', mode: 'spectrum' | 'spectrogram', spect: boolean): void
  }
) => {
  const repeatVisible = ref<boolean>(false)
  const displayVisible = ref<boolean>(false)
  const muteAreaVisible = ref<boolean>(false)

  const commonOptions = reactive<CommonBtnConfig>({
    ifPlayRate: props.btnOptions.ifPlayRate,
    ifVolume: props.btnOptions.ifVolume,
    ifInfo: props.btnOptions.ifInfo,
    ifFullScreen: props.btnOptions.ifFullScreen
  }) 

  const displayOptions = reactive<DeepRequired<PlayDisplayProps>>({
    spect: {
      spectrum: props.displayOptions.spect?.spectrum || true,
      spectrogram: props.displayOptions.spect?.spectrogram || false
    },
    zoomOptions: {
      verticalZoom: {
        init: props.displayOptions.zoomOptions?.verticalZoom?.init ? props.displayOptions.zoomOptions.verticalZoom.init : 1,
        max: props.displayOptions.zoomOptions?.verticalZoom?.max ? props.displayOptions.zoomOptions.verticalZoom.max : 2,
        min: props.displayOptions.zoomOptions?.verticalZoom?.min ? props.displayOptions.zoomOptions.verticalZoom.min : 1,
        step: props.displayOptions.zoomOptions?.verticalZoom?.step ? props.displayOptions.zoomOptions.verticalZoom.step : 3
      },
      horizontalZoom: {
        init: props.displayOptions.zoomOptions?.horizontalZoom?.init ? props.displayOptions.zoomOptions.horizontalZoom.init : 1,
        max: props.displayOptions.zoomOptions?.horizontalZoom?.max ? props.displayOptions.zoomOptions.horizontalZoom.max : 2,
        min: props.displayOptions.zoomOptions?.horizontalZoom?.min ? props.displayOptions.zoomOptions.horizontalZoom.min : 1,
        step: props.displayOptions.zoomOptions?.horizontalZoom?.step ? props.displayOptions.zoomOptions.horizontalZoom.step : 0.01
      }
    }
  })

  const muteAreaOptions = reactive({
    skipMuteArea: false,
    showMuteArea: false
  })

  watch(() => muteAreaOptions.showMuteArea, (value: boolean) => emits('showMuteArea', value))

  watch(() => muteAreaOptions.skipMuteArea, (value: boolean) => emits('skipMuteArea', value))

  const toggleRepeat = (state: RepeatSettings) => {
    emits('toggleRepeat', state)
  }

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

  const onZoom = (mode: 'horizontal' | 'vertical', zoom: number) => {
    emits('onZoom', mode, zoom)
  }

  const onSpect = (mode: 'spectrum' | 'spectrogram', spect: boolean) => {
    emits('onSpect', mode, spect)
  }

  return {
    repeatVisible,
    displayVisible,
    muteAreaVisible,
    commonOptions,
    displayOptions,
    muteAreaOptions,
    toggleRepeat,
    changePlayRate,
    changeVolume,
    onFullScreen,
    offFullScreen,
    play,
    pause,
    stop,
    skip,
    onZoom,
    onSpect
  }
}