<script setup lang="ts" name="ViewVideo">
import type { CutterInfo, Information } from '@/types/base'
import type { VideoBtnConfig } from '@/types/video'
import { type PropType, ref } from 'vue'
import VideoToolbar from './toolbar'
import { useViewVideoConfig } from './ViewVideo'

const videoContainerRef = ref<HTMLDivElement>()
const videoPlayerRef = ref<HTMLVideoElement>()
const videoToolbarRef = ref<{ init: () => void }>()

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  vtt: {
    type: String,
    default: '',
    required: false
  },
  poster: {
    type: String,
    required: false
  },
  information: {
    type: Array as PropType<Array<Information>>,
    default: () => [],
    required: false
  },
  videoBtnConfig: {
    type: Object as PropType<VideoBtnConfig>,
    default: () => ({
      ifPlayRate: true,
      ifCutter: true,
      ifInfo: true,
      ifVolume: true,
      ifFullScreen: true
    }),
    required: false
  }
})

const emits = defineEmits<{
  (evt: 'saveCutter', cutterInfo: CutterInfo): void
}>()

const {
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
  saveCutter,
} = useViewVideoConfig(videoContainerRef, videoPlayerRef, videoToolbarRef, props, emits)
</script>

<template>
  <div class="video-container" ref="videoContainerRef">
    <div class="player">
      <video ref="videoPlayerRef" :src="props.url" :poster="props.poster">
        您的浏览器不支持 video 标签。
        <track :src="props.vtt" kind="subtitles" srclang="zh-CN" default>
      </video>
    </div>
    <div class="toolbar">
      <VideoToolbar
        ref="videoToolbarRef"
        :time="state.time"
        :options="props.videoBtnConfig"
        :totalTime="state.totalTime"
        :information="props.information"
        @play="play"
        @pause="pause"
        @skip="skip"
        @stop="stop"
        @changeVolume="changeVolume"
        @changePlayRate="changePlayRate"
        @onFullScreen="onFullScreen"
        @offFullScreen="offFullScreen"
        @saveCutter="saveCutter"
        @toggleCutState="toggleCutState"
      />
    </div>
  </div>
</template>

<style scoped>
.video-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .player {
    position: absolute;
    bottom: 64px;
    flex: 1 auto;
    background: #000;
    width: 100%;
    height: 100%;
  }
}

video {
  width: 100%;
  height: 100%;
}
</style>