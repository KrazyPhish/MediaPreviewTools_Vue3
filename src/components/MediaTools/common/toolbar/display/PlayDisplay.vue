<script setup lang="ts" name="PlayDisPlay">
import { ElForm, ElFormItem, ElSlider, ElSwitch } from 'element-plus'
import type { PropType } from 'vue'
import type { SpectOption, ZoomOption } from '@/types/audio'
import { usePlayDisplayConfig } from './PlayDisplay'

const props = defineProps({
  spect: {
    type: Object as PropType<SpectOption>,
    default: () => ({
      spectrum: true,
      spectrogram: false
    }),
    required: false
  },
  zoomOptions: {
    type: Object as PropType<ZoomOption>,
    default: () => ({
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
    }),
    required: false
  }
})

const emits = defineEmits<{
  (evt: 'onZoom', mode: 'horizontal' | 'vertical', zoom: number): void
  (evt: 'onSpect', mode: 'spectrum' | 'spectrogram', spect: boolean): void
}>()

const { state } = usePlayDisplayConfig(props, emits)
</script>

<template>
  <div class="media-display">
    <ElForm :model="state" label-width="60px" size="small">
      <ElFormItem label="频谱图" prop="spectrum">
        <ElSwitch v-model="state.spectrum" :disabled="!state.spectrogram" />
      </ElFormItem>
      <ElFormItem label="语谱图" prop="spectrogram">
        <ElSwitch v-model="state.spectrogram" :disabled="!state.spectrum" />
      </ElFormItem>
      <ElFormItem label="水平缩放" prop="horizontalZoom">
        <ElSlider
          v-model="state.horizontalZoom"
          :min="props.zoomOptions.horizontalZoom.min"
          :max="props.zoomOptions.horizontalZoom.max"
          :step="props.zoomOptions.horizontalZoom.step"
          :showTooltip="false"
        />
      </ElFormItem>
      <ElFormItem label="垂直缩放" prop="verticalZoom">
        <ElSlider
          v-model="state.verticalZoom"
          :min="props.zoomOptions.verticalZoom.min"
          :max="props.zoomOptions.verticalZoom.max"
          :step="props.zoomOptions.verticalZoom.step"
          :showTooltip="false"
        />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style scoped>
.media-display {
  margin: 10px;
  text-align: initial;
}
</style>