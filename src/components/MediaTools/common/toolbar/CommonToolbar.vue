<script setup lang="ts" name="CommonToolbar">
import type { CommonBtnConfig, Information } from '@/types/base'
import type { PropType } from 'vue'
import { formatTime } from '../utils'
import { Icon } from '@iconify/vue'
import { ElSlider } from 'element-plus'
import { useCommonToolbarConfig } from './CommonToolbar'
import CommonPopover from '../popover'

const props = defineProps({
  options: {
    type: Object as PropType<CommonBtnConfig>,
    default: () => ({
      ifPlayRate: true,
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
}>()

const {
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
} = useCommonToolbarConfig(props, emits)

defineExpose({ init })
</script>

<template>
  <div  class="toolbar-container">
    <div class="controls">
      <div class="left">
        <div class="play-btns">
          <Icon icon="carbon:stop-filled" color="lightblue" :width="28" :height="28" @click="stop"/>
          <Icon v-if="!isPlaying" icon="carbon:play-filled" color="lightblue" :width="28" :height="28" @click="play"/>
          <Icon v-else-if="isPlaying" icon="zondicons:pause-solid" color="lightblue" :width="28" :height="28" @click="pause"/>
          <slot name="controls"></slot>
        </div>
        <div class="play-time">{{ formatTime(state.time) }} / {{ formatTime(totalTime) }}</div>
      </div>
      <div class="right">
        <slot name="settings"></slot>
        <CommonPopover
          v-if="props.options.ifPlayRate"
          v-model:visible="rateVisible"
          popper-class="toolbar-popper"
          placement="top"
        >
          <template #reference>
            <div class="play-rate"><span>{{ state.rate }}X</span></div>
          </template>
          <div class="play-rate-selection">
            <div
              class="selection-items"
              v-for="(item, index) in props.rates"
              :key="index"
              @click="state.rate = item"
            >
              {{ item }}X
            </div>
          </div>
        </CommonPopover>
        <CommonPopover
          v-if="props.options.ifVolume"
          v-model:visible="volumeVisible"
          popper-class="toolbar-popper"
          placement="top"
        >
          <template #reference>
            <Icon v-if="state.volume == 0" icon="lucide:volume-x" color="lightblue" :width="28" :height="28" />
            <Icon v-else-if="state.volume < 0.5" icon="lucide:volume-1" color="lightblue" :width="28" :height="28" />
            <Icon v-else-if="state.volume >= 0.5" icon="lucide:volume-2" color="lightblue" :width="28" :height="28" />
          </template>
          <div style="height: 120px">
            <ElSlider
              v-model="state.volume"
              :format-tooltip="formatVolume"
              :min="0"
              :max="1"
              :step="0.01"
              height="100px"
              vertical
            />
          </div>
        </CommonPopover>
        <Icon
          v-if="isFullScreen && props.options.ifFullScreen"
          icon="material-symbols:fullscreen-exit"
          color="lightblue"
          :width="28"
          :height="28"
          @click="offFullScreen"/>
        <Icon
          v-else-if="!isFullScreen && props.options.ifFullScreen"
          icon="material-symbols:fullscreen"
          color="lightblue"
          :width="28"
          :height="28"
          @click="onFullScreen"/>
        <CommonPopover
          v-if="props.options.ifInfo"
          v-model:visible="infoVisible"
          popper-class="toolbar-popper"
          placement="top-end"
        >
          <template #reference>
            <Icon icon="clarity:help-info-solid" color="lightblue" :width="28" :height="28" />
          </template>
          <div class="play-information" v-for="(item, index) in information" :key="index">
            <span>{{ item.label }}: </span>
            <span>{{ item.value }}</span>
          </div>
        </CommonPopover>
      </div>
    </div>
    <input
      type="range"
      v-model="state.time"
      :min="0"
      :max="props.totalTime"
      @mousedown="isSync = false"
      @mouseup="isSync = true" 
    />
  </div>
</template>

<style scoped>
:root {
  --range-height: 5px;
  --range-bar-height: calc(var(--range-height) + 2px);
}

.toolbar-container {
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;
  width: 100%;
  user-select: none;
  background-color: #fff;
  height: 64px;
  padding: 0 5px;
}

.toolbar-container:hover input[type='range']::-webkit-slider-thumb,
.toolbar-container:hover input[type='range']::-moz-range-thumb {
  width: calc(var(--range-bar-height) + 5px);
  height: calc(var(--range-bar-height) + 5px);
}

.toolbar-container input[type='range'] {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: var(--range-height);
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toolbar-container input[type='range']::-webkit-slider-thumb,
.toolbar-container input[type='range']::-moz-range-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--range-bar-height);
  height: var(--range-bar-height);
  border-radius: 50%;
  background: #00aeec;
  cursor: pointer;
}
.controls {
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .play-btns {
      display: flex;
      width: 60px;
      justify-content: space-between;
    }
    .play-time {
      color: #42424280;
      font-size: 12px;
      margin-left: 5px;
    }
    > span {
      margin: 0 5px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    > span {
      display: flex;
      align-items: center;
      margin: 0 5px;
    }
  }
}

.play-information {
  box-sizing: border-box;
  width: 120px;
  padding: 3px;
}
</style>

<style>
.play-rate {
  width: 28px;
  height: 28px;
  font-size: 18px;
  color: lightblue;
  justify-content: center;
  align-items: center;
}

.play-rate-selection {
  text-align: center;
  width: 40px;
  .selection-items:hover {
    background-color: #00aeec;
  }
}
</style>