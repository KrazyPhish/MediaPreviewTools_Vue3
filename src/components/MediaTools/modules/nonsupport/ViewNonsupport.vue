<script setup lang="ts" name="ViewNonsupport">
import { ElEmpty } from 'element-plus'
import { ref } from 'vue'

const props = defineProps({
  extension: {
    type: String,
    required: true
  }
})

const description = ref<string>(`不支持的媒体格式: ${props.extension}`)
</script>

<template>
  <div class="container">
    <ElEmpty :description="description"/>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>