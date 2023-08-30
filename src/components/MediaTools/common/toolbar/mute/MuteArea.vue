<script setup lang="ts" name="MuteArea">
import { useMuteAreaConfig } from './MuteArea'
import { ElSwitch } from 'element-plus'

const props = defineProps({
  skip: {
    type: Boolean,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits<{
  (evt: 'update:skip', value: boolean): void
  (evt: 'update:show', value: boolean): void
}>()

const { state } = useMuteAreaConfig(props, emits)
</script>

<template>
  <div class="switch-container">
    跳过静音区
    <ElSwitch v-model="state.skipMuteArea" />
  </div>
  <div class="switch-container">
    显示静音区
    <ElSwitch v-model="state.showMuteArea" />
  </div>
</template>

<style scoped>
.switch-container {
  height: 35px;
}
</style>