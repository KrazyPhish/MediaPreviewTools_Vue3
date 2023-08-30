<script setup lang="ts" name="RepeatArea">
import type { RepeatSettings } from '@/types/audio'
import { useRepeatAreaConfig } from './RepeatArea'

const props = defineProps({
  totalTime: {
    type: Number,
    required: true
  }
})

const emits = defineEmits<{
  (evt: 'toggleRepeat', value: RepeatSettings): void
}>()

const { state } = useRepeatAreaConfig(props, emits)
</script>

<template>
  <ElForm :model="state" :inline="false">
    <ElFormItem>
      <ElInput v-model="state.start" placeholder="00:00:00">
        <template #prepend>开始时间</template>
      </ElInput>
    </ElFormItem>
    <ElFormItem>
      <ElInput v-model="state.end" placeholder="00:00:00">
        <template #prepend>结束时间</template>
      </ElInput>
    </ElFormItem>
    <ElFormItem>
      <ElSwitch v-model="state.repeat" active-text="开始复播" inactive-text="停止复播" />
    </ElFormItem>
  </ElForm>
</template>