import type { AudioBtnConfig, AudioControls, AudioRegion, RepeatSettings } from "@/types/audio"
import type { Information } from "@/types/base"
import { gotoFullScreen, exitFullScreen } from '../../common/utils'
import { colorMap } from "../../common"
import { type Ref, reactive, ref, onMounted, watch, nextTick } from 'vue'
import WaveSurfer from "./wavesurfer/wavesurfer"
import HoverPlugin from "./wavesurfer/plugins/hover"
import type { GenericPlugin } from "./wavesurfer/base-plugin"
import SpectrogramPlugin from "./wavesurfer/plugins/spectrogram"
import { ElLoading } from "element-plus"
import type { LoadingInstance } from "element-plus/lib/components/loading/src/loading.js"
import { useEventListener } from "@vueuse/core"
import RegionsPlugin, { type Region } from "./wavesurfer/plugins/regions"

export const useViewAudioConfig = (
  audioContainerRef:  Ref<HTMLDivElement | undefined>,
  wavesurferContainerRef: Ref<HTMLDivElement | undefined>,
  waveSpectrumRef: Ref<HTMLDivElement | undefined>,
  waveSpectrogramRef: Ref<HTMLDivElement | undefined>,
  props: {
    readonly url: string,
    readonly audioBtnConfig: AudioBtnConfig,
    readonly information: Information[],
    readonly dataSources: AudioRegion[]
  }
) => {
  const state = reactive<AudioControls>({
    totalTime: 0,
    time: 0,
    volume: 1,
    spectrum: true,
    spectrogram: false,
    verticalZoom: 1,
    horizontalZoom: 1
  })

  const wavesurfer = ref<WaveSurfer>()

  const region = RegionsPlugin.create()

  const muteAreas = props.dataSources.filter((d: AudioRegion) => {
    return d.mute
  })

  onMounted(() => {
    initWave()
    listenResize()
    loadWave(props.url)
  })

  watch(() => props.url, (url: string) => {
    stop()
    loadWave(url)
  })

  const loadWave = (url: string) => {
    wavesurfer.value?.load(url)
  }

  const initWave = () => {
    if (!state.spectrogram && !state.spectrum) return

    let pluginCount: number = 0
    state.spectrogram && pluginCount++
    state.spectrum && pluginCount++

    const height: number = wavesurferContainerRef.value!.clientHeight / pluginCount

    const hover: HoverPlugin = HoverPlugin.create()

    const spectrogram: SpectrogramPlugin = SpectrogramPlugin.create({
      container: waveSpectrogramRef.value as HTMLElement,
      labels: true,
      height: height * state.verticalZoom,
      splitChannels: false,
      colorMap
    })

    region.clearRegions()
    nextTick(() => props.dataSources.forEach((r: AudioRegion) => !r.mute && region.addRegion(r as Region)))

    const plugins: GenericPlugin[] = []
    plugins.push(hover)
    state.spectrogram && plugins.push(spectrogram)
    plugins.push(region)

    wavesurfer.value && wavesurfer.value.destroy()
    wavesurfer.value = WaveSurfer.create({
      container: waveSpectrumRef.value as HTMLElement,
      barWidth: 4,
      waveColor: 'lightgreen',
      progressColor: '#409EFF',
      height: state.spectrum ? height * state.verticalZoom : 0,
      mediaControls: false,
      autoCenter: true,
      minPxPerSec: state.horizontalZoom,
      plugins
    })

    bindEvent()
    changeVolume(state.volume)
  }

  const listenResize = () => {
    useEventListener(audioContainerRef.value, 'resize', () => {
      nextTick(() => reload())
    })
  }

  const reload = () => {
    initWave()
    loadWave(props.url)
  }

  const bindEvent = () => {
    let loading: LoadingInstance
    wavesurfer.value?.on('ready', (duration: number) => {
      state.totalTime = duration * 1000
      wavesurfer.value?.seekTo(0)
    })
    wavesurfer.value?.on('audioprocess', (time: number) => {
      state.time = time * 1000
    })
    wavesurfer.value?.on('seeking', (time: number) => {
      state.time = time * 1000
    })
    wavesurfer.value?.on('loading', (percentage: number) => {
      if (!loading) {
        loading = ElLoading.service({
          lock: true,
          text: `加载中...${percentage}%`,
          background: 'rgba(0, 0, 0, 0.3)',
          target: wavesurferContainerRef.value
        })
      }
      if (percentage == 100) {
        nextTick(() => loading.close())
      } else {
        loading.setText(`加载中...${percentage}%`)
      }
    })
  }

  const play = () => {
    wavesurfer.value?.play()
  }

  const pause = () => {
    wavesurfer.value?.pause()
  }

  const stop = () => {
    wavesurfer.value?.stop()
  }

  const skip = (time: number) => {
    wavesurfer.value?.seekTo(time / state.totalTime)
  }

  const onFullScreen = () => {
    gotoFullScreen(audioContainerRef.value)
  }

  const offFullScreen = () => {
    exitFullScreen()
  }

  const changeVolume = (volume: number) => {
    state.volume = volume
    wavesurfer.value?.setVolume(volume)
  }

  const changePlayRate = (rate: number) => {
    wavesurfer.value?.setPlaybackRate(rate)
  }

  let skipTimer: number 
  const skipMuteArea = (value: boolean) => {
    if (value) {
      skipTimer = setInterval(() => {
        const now: number = wavesurfer.value!.getCurrentTime()
        const mute: AudioRegion | undefined = muteAreas.find((m: AudioRegion) => {
          return (now >= m.start!) && (now <= m.end!)
        })
        mute && wavesurfer.value?.seekTo(mute.end! * 1000 / state.totalTime)
      }, 500)
    } else skipTimer && clearInterval(skipTimer)
  }

  const showMuteArea = (value: boolean) => {
    region.clearRegions()
    props.dataSources.forEach((d: AudioRegion) => {
      if (value) region.addRegion(d as Region)
      else if (!d.mute) region.addRegion(d as Region)
    })
  }

  let repeatRegion: Region | undefined
  let repeatTimer: number | undefined
  const toggleRepeat = (value: RepeatSettings) => {
    if (!value.repeat && repeatRegion) {
      repeatTimer && clearInterval(repeatTimer)
      repeatRegion.remove()
      wavesurfer.value?.pause()
    } else {
      region.addRegion({
        id: '__RepeatArea__',
        start: value.start as number / 1000,
        end: value.end as number /1000,
        drag: false,
        resize: false,
        color: 'rgba(0, 0, 0, 0)',
      })
      repeatRegion = region.getRegions().find((r: Region) => r.id == '__RepeatArea__')
      repeatTimer = setInterval(() => {
        const now = wavesurfer.value!.getCurrentTime()
        if (now >= repeatRegion!.end) repeatRegion?.play()
      }, 500)
      repeatRegion?.play()
    }
  }

  const onZoom = (mode: 'horizontal' | 'vertical', zoom: number) => {
    switch(mode) {
      case 'horizontal':
        state.horizontalZoom = zoom
        reload()
        break
      case 'vertical':
        state.verticalZoom = zoom
        reload()
        break
    }
  }

  const onSpect = (mode: 'spectrum' | 'spectrogram', spect: boolean) => {
    switch(mode) {
      case 'spectrum':
        state.spectrum = spect
        reload()
        break
      case 'spectrogram':
        state.spectrogram = spect
        reload()
        break
    }
  }

  return {
    state,
    play,
    pause,
    stop,
    skip,
    onFullScreen,
    offFullScreen,
    changeVolume,
    changePlayRate,
    skipMuteArea,
    showMuteArea,
    toggleRepeat,
    onZoom,
    onSpect
  }
}