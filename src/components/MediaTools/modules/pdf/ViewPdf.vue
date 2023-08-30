<script setup lang="ts" name="ViewPdf">
import { CommonIframe } from '../../common'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="container">
    <CommonIframe :url="props.url" />
  </div>
</template>

<style scoped>
.container {
  height: 100%;
}
</style>
