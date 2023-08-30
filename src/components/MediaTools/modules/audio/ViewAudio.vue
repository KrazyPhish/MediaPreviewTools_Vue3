<script setup lang="ts" name="ViewAudio">
import type { AudioBtnConfig, AudioRegion } from '@/types/audio'
import type { Information } from '@/types/base'
import { ref, type PropType } from 'vue'
import AudioToolbar from './toolbar'
import { useViewAudioConfig } from './ViewAudio'

const audioContainerRef = ref<HTMLDivElement>()
const wavesurferContainerRef = ref<HTMLDivElement>()
const waveSpectrumRef = ref<HTMLDivElement>()
const waveSpectrogramRef = ref<HTMLDivElement>()

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  audioBtnConfig: {
    type: Object as PropType<AudioBtnConfig>,
    default: () => ({
      ifDisplay: true,
      ifMuteArea: true,
      ifMarker: true,
      ifRepeat: true,
      ifPlayRate: true,
      ifVolume: true,
      ifInfo: true,
      ifFullScreen: true
    }),
    required: false
  },
  information: {
    type: Array as PropType<Array<Information>>,
    default: () => [],
    required: false
  },
  dataSources: {
    type: Array as PropType<Array<AudioRegion>>,
    default: () => [],
    required: false
  }
})

const {
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
} = useViewAudioConfig(audioContainerRef, wavesurferContainerRef, waveSpectrumRef, waveSpectrogramRef, props)
</script>

<template>
  <div class="audio-container" ref="audioContainerRef">
    <div class="content">
      <div class="wavesurfer-container" ref="wavesurferContainerRef">
        <div class="wave-spectrum" ref="waveSpectrumRef"></div>
        <div class="wave-spectrogram" ref="waveSpectrogramRef"></div>
      </div>
    </div>
    <AudioToolbar
      :btnOptions="props.audioBtnConfig"
      :information="props.information"
      :time="state.time"
      :totalTime="state.totalTime"
      @play="play"
      @pause="pause"
      @stop="stop"
      @skip="skip"
      @onFullScreen="onFullScreen"
      @offFullScreen="offFullScreen"
      @changeVolume="changeVolume"
      @changePlayRate="changePlayRate"
      @skipMuteArea="skipMuteArea"
      @showMuteArea="showMuteArea"
      @toggleRepeat="toggleRepeat"
      @onZoom="onZoom"
      @onSpect="onSpect"
    />
  </div>
</template>

<style scoped>
.audio-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 64px;
    display: flex;
    flex-direction: row;
    .wavesurfer-container {
      overflow: auto;
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1 auto;
      :deep(.wave-spectrum) {
        audio {
          position: absolute;
          bottom: 0;
        }
      }
      :deep(.wave-spectrogram) {
        .spec-labels {
          position: absolute;
        }
      }
    }
  }
}
</style>