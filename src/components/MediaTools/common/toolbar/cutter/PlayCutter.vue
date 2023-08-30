<script setup lang="ts" name="PlayCutter">
import type { CutterInfo } from '@/types/base'
import { ref } from 'vue'
import { ElSlider, ElForm, ElFormItem, ElButton, ElInput } from 'element-plus'
import { usePlayCutterConfig } from './PlayCutter'

const startInputRef = ref<HTMLInputElement>()
const endInputRef = ref<HTMLInputElement>()

const props = defineProps({
  totalTime: {
    type: Number,
    required: true
  }
})

const emits = defineEmits<{
  (evt: 'skip', time: number): void
  (evt: 'saveCutter', cutterInfo: CutterInfo): void
}>()

const {
  state,
  formatTooltip,
  onStartChange,
  onEndChange,
  onRangeChange,
  onFocus,
  onBlur,
  onSubmit
} = usePlayCutterConfig(props, emits, startInputRef, endInputRef)
</script>

<template>
  <div class="media-editor">
    <ElSlider v-model="state.range" :max="totalTime" :formatTooltip="formatTooltip" @change="onRangeChange" range />
    <ElForm :model="state" :inline="true">
      <ElFormItem>
        <ElInput
          ref="startInputRef"
          v-model="state.start"
          @focus="() => onFocus('start')"
          @blur="() => onBlur('start')"
          @change="onStartChange"
        >
          <template #prepend>
            <span>开始时间</span>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElInput
          ref="endInputRef"
          v-model="state.end"
          @focus="() => onFocus('end')"
          @blur="() => onBlur('end')"
          @change="onEndChange"
        >
          <template #prepend>
            <span>结束时间</span>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="onSubmit">剪辑</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style scoped>
.media-editor {
  height: 100%;
  position: relative;
  overflow: auto;
  padding: 0 20px;
}
</style>