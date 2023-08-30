<script setup lang="ts" name="CommonIframe">
import { ref } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const style = ref({
  width: '100%',
  height: '100%',
  border: 'none',
})

const iframeRef = ref<HTMLIFrameElement>()
/**
 * @description 放大方法通过postMessage解决一些时候的跨域问题，具体缩放逻辑需在源HTML文件中自行书写
 * @returns {void} void
 */
const zoomIn = () => {
  iframeRef.value?.contentWindow?.postMessage('zoomIn', '*')
}
/**
 * @description 缩小方法通过postMessage解决一些时候的跨域问题，具体缩放逻辑需在源HTML文件中自行书写
 * @returns {void} void
 */
const zoomOut = () => {
  iframeRef.value?.contentWindow?.postMessage('zoomOut', '*')
}

defineExpose({ zoomIn, zoomOut })

</script>

<template>
  <iframe ref="iframeRef" :src="props.url" :style="style" />
</template>