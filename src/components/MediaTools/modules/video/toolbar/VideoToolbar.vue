<script setup lang="ts" name="VideoToolbar">
import CommonToolbar from '@/components/MediaTools/common/toolbar'
import PlayCutter from '@/components/MediaTools/common/toolbar/cutter'
import type { CutterInfo, Information } from '@/types/base'
import type { VideoBtnConfig } from '@/types/video'
import { ref, type PropType } from 'vue'
import { useVideoToolbarConfig } from './VideoToolbar'
import { Icon } from '@iconify/vue'
import CommonPopover from '@/components/MediaTools/common/popover'

const commonToolbarRef = ref<{ init: () => void }>()

const props = defineProps({
  options: {
    type: Object as PropType<VideoBtnConfig>,
    default: () => ({
      ifPlayRate: true,
      ifCutter: true,
      ifVolume: true,
      ifInfo: true,
      ifFullScreen: true
    }),
    required: false
  },
  time: {
    type: Number,
    required: true
  },
  totalTime: {
    type: Number,
    required: true
  },
  information: {
    type: Array as PropType<Array<Information>>,
    default: () => [],
    required: false
  },
  rates: {
    type: Array as PropType<Array<number>>,
    default: () => [0.5, 1, 1.5, 2],
    required: false
  }
})

const emits = defineEmits<{
  (evt: 'play'): void
  (evt: 'pause'): void
  (evt: 'stop'): void
  (evt: 'onFullScreen'): void
  (evt: 'offFullScreen'): void
  (evt: 'changeVolume', volume: number): void
  (evt: 'changePlayRate', rate: number): void
  (evt: 'skip', time: number): void
  (evt: 'saveCutter', cutterInfo: CutterInfo): void
  (evt: 'toggleCutState'): void
}>()

const {
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
} = useVideoToolbarConfig(commonToolbarRef, props, emits)

defineExpose({ init })
</script>

<template>
  <CommonToolbar
    ref="commonToolbarRef"
    :time="props.time"
    :options="options"
    :totalTime="props.totalTime"
    :information="props.information"
    :rates="props.rates"
    @play="play"
    @pause="pause"
    @stop="stop"
    @skip="skip"
    @changePlayRate="changePlayRate"
    @changeVolume="changeVolume"
    @onFullScreen="onFullScreen"
    @offFullScreen="offFullScreen"
  >
    <template #settings>
      <CommonPopover v-if="props.options.ifCutter" v-model:visible="visible" placement="top" width="100%">
        <template #reference>
          <Icon icon="fluent:screen-cut-20-filled" color="lightblue" :width="28" :height="28" @click="toggleCutState" />
        </template>
        <PlayCutter :totalTime="props.totalTime" @skip="skip" @saveCutter="saveCutter"/>
      </CommonPopover>
    </template>
  </CommonToolbar>
</template>