<script setup lang="ts" name="ViewEmail">
import { ref } from 'vue'
import { CommonIframe } from '../../common'
import { useViewEmailConfig } from './ViewEmail'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const viewIframeRef = ref<InstanceType<typeof CommonIframe>>()

const {
  zoomIn,
  zoomOut
} = useViewEmailConfig(viewIframeRef)

defineExpose({ zoomIn, zoomOut })
</script>

<template>
  <div class="container">
    <CommonIframe ref="viewIframeRef" :url="props.url" />
  </div>
</template>

<style scoped>
.container {
  height: 100%;
}
</style>
