<script setup lang="ts" name="ViewOffice">
import { ref } from 'vue'
import { CommonIframe } from '../../common'
import { useViewOfficeConfig } from './ViewOffice'

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
} = useViewOfficeConfig(viewIframeRef)

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
