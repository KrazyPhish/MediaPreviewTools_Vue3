import type { CutterInfo, Information } from "@/types/base"
import type { VideoBtnConfig, VideoControls } from "@/types/video"
import { useEventListener } from "@vueuse/core"
import { watch, onMounted, ref, reactive, type Ref } from "vue"
import { gotoFullScreen, exitFullScreen } from "../../common/utils"

export const useViewVideoConfig = (
  videoContainerRef: Ref<HTMLDivElement | undefined>,
  videoPlayerRef: Ref<HTMLVideoElement | undefined>,
  videoToolbarRef: Ref<{ init: () => void } | undefined>,
  props: {
    readonly url: string,
    readonly vtt: string,
    readonly information: Information[],
    readonly videoBtnConfig: VideoBtnConfig,
    readonly poster?: string | undefined
  },
  emits: (evt: 'saveCutter', cutterInfo: CutterInfo) => void
) => {
  watch(() => props.url, () => initPlayer())

  onMounted(() => initPlayer())

  /**
   * 是否正在剪辑操作
   */
  const isCut = ref<boolean>(false)

  const state = reactive<VideoControls>({
    time: 0,
    totalTime: 0,
    volume: 1
  })

  let stopLoadListener: Function | undefined, stopTimeListener: Function | undefined

  const initPlayer = () => {
    isCut.value = false
    stopLoadListener?.()
    stopTimeListener?.()
    videoToolbarRef.value?.init()
    stopLoadListener = useEventListener(videoPlayerRef.value, 'loadedmetadata', (ev: any) => {
      state.totalTime = ev.target.duration * 1000
    })
    stopTimeListener = useEventListener(videoPlayerRef.value, 'timeupdate', (ev: any) => {
      state.time = ev.target.currentTime * 1000
    })
  }

  const play = () => {
    videoPlayerRef.value?.play()
  }

  const pause = () => {
    videoPlayerRef.value?.pause()
  }

  const skip = (time: number) => {
    if (isCut.value) return
    state.time = time
    videoPlayerRef.value!.currentTime = time / 1000
  }

  const stop = () => {
    videoPlayerRef.value?.pause()
    videoPlayerRef.value!.currentTime = 0
  }

  const changePlayRate = (rate: number) => {
    videoPlayerRef.value!.playbackRate = rate
  }

  const changeVolume = (volume: number) => {
    videoPlayerRef.value!.volume = volume
  }

  const onFullScreen = () => {
    gotoFullScreen(videoContainerRef.value)
  }

  const offFullScreen = () => {
    exitFullScreen()
  }

  const toggleCutState = () => {
    isCut.value = !isCut.value
  }

  const saveCutter = (cutterInfo: CutterInfo) => {
    emits('saveCutter', cutterInfo)
  }

  return {
    state,
    play,
    pause,
    skip,
    stop,
    changePlayRate,
    changeVolume,
    onFullScreen,
    offFullScreen,
    toggleCutState,
    saveCutter
  }
}