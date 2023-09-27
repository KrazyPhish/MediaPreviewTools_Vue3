<script setup lang="ts" name="AudioToolbar">
import type { Information } from '@/types/base'
import { type PropType } from 'vue'
import { useAudioToolbarConfig } from './AudioToolbar'
import CommonPopover from '@/components/MediaTools/common/popover'
import type { AudioBtnConfig, PlayDisplayProps, RepeatSettings } from '@/types/audio'
import CommonToolbar from '@/components/MediaTools/common/toolbar'
import PlayDisplay from '@/components/MediaTools/common/toolbar/display'
import MuteArea from '@/components/MediaTools/common/toolbar/mute'
import RepeatArea from '@/components/MediaTools/common/toolbar/repeat'
import { Icon } from '@iconify/vue'

const props = defineProps({
  btnOptions: {
    type: Object as PropType<AudioBtnConfig>,
    default: () => ({
      ifPlayRate: true,
      ifVolume: true,
      ifInfo: true,
      ifFullScreen: true,
      ifDisplay: true,
      ifMuteArea: true,
      ifMarker: true,
      ifRepeat: true,
    }),
    required: false
  },
  displayOptions: {
    type: Object as PropType<PlayDisplayProps>,
    default: () => ({
      spect: {
        spectrum: true,
        spectrogram: false
      },
      zoomOptions: {
        horizontalZoom: {
          init: 1,
          step: 3,
          max: 300,
          min: 1
        },
        verticalZoom: {
          init: 1,
          step: 0.01,
          max: 2,
          min: 1
        }
      }
    })
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
    default: () => [0.5, 1, 1.5, 2]
  }
})

const emits = defineEmits<{
  (evt: 'play'): void
  (evt: 'pause'): void
  (evt: 'stop'): void
  (evt: 'skip', time: number): void
  (evt: 'onFullScreen'): void
  (evt: 'offFullScreen'): void
  (evt: 'changeVolume', volume: number): void
  (evt: 'changePlayRate', rate: number): void
  (evt: 'skipMuteArea', value: boolean): void
  (evt: 'showMuteArea', value: boolean): void
  (evt: 'toggleRepeat', value: RepeatSettings): void
  (evt: 'onZoom', mode: 'horizontal' | 'vertical', zoom: number): void
  (evt: 'onSpect', mode: 'spectrum' | 'spectrogram', spect: boolean): void
}>()

const {
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
} = useAudioToolbarConfig(props, emits)
</script>

<template>
  <CommonToolbar
    :time="props.time"
    :options="commonOptions"
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
      <CommonPopover v-if="props.btnOptions.ifRepeat" v-model:visible="repeatVisible">
        <template #reference>
          <Icon icon="ic:round-repeat-on" color="lightblue" :width="28" :height="28" />
        </template>
        <RepeatArea :totalTime="props.totalTime" @toggleRepeat="toggleRepeat" />
      </CommonPopover>
      <CommonPopover v-if="props.btnOptions.ifMuteArea" v-model:visible="muteAreaVisible">
        <template #reference>
          <Icon icon="material-symbols:tab-close" color="lightblue" :width="28" :height="28" />
        </template>
        <MuteArea v-model:show="muteAreaOptions.showMuteArea" v-model:skip="muteAreaOptions.skipMuteArea"/>
      </CommonPopover>
      <CommonPopover v-if="props.btnOptions.ifDisplay" v-model:visible="displayVisible" :width="180">
        <template #reference>
          <Icon icon="material-symbols:display-settings" color="lightblue" :width="28" :height="28" />
        </template>
        <PlayDisplay
          :spect="displayOptions.spect"
          :zoomOptions="displayOptions.zoomOptions"
          @onZoom="onZoom"
          @onSpect="onSpect"
        />
      </CommonPopover>
    </template>
  </CommonToolbar>
</template>