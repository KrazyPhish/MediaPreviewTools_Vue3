<script setup lang="ts" name="ViewPicture">
import './viewer/viewer.css'
import { ref } from 'vue'
import Viewer from './viewer/viewer.esm'
import { useViewPictureConfig } from './ViewPicture'

/**
 * 大图DIV容器
 */
const imgMainRef = ref<HTMLDivElement>()
/**
 * 大图图片
 */
const imageRef = ref<HTMLImageElement>()
/**
 * 鹰眼DIV容器
 */
const miniMapRef = ref<HTMLDivElement>()
/**
 * 鹰眼图片DIV容器
 */
const imgContainerRef = ref<HTMLDivElement>()
/**
 * 鹰眼图片
 */
const previewRef = ref<HTMLImageElement>()
/**
 * 图片在鹰眼DIV容器中移动时的实际容器DOM
 */
const imageDom = ref<HTMLDivElement>()
/**
* 鹰眼的实际容器DIV的DOM
*/
const imageContainerDom = ref<HTMLDivElement>()
/**
 * 鹰眼放大时的可视边框
 */
const previewBoxRef = ref<HTMLDivElement>()

/**
 * Viewer插件
 */
const viewer = ref<Viewer>()

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const { onPreviewBoxClick } = useViewPictureConfig(props, viewer, imgMainRef, imageRef, miniMapRef, imgContainerRef, previewRef, imageDom, imageContainerDom, previewBoxRef)

</script>

<template>
  <div class="container">
    <div ref="imgMainRef" class="img-main">
      <img 
        ref="imageRef"
        alt=""
        style="display: none"
        :src="props.url"
      />
    </div>
    <div ref="miniMapRef" class="mini-map">
      <div ref="imgContainerRef">
        <img
          ref="previewRef"
          alt=""
          style="display: none; -webkit-user-drag: none; height: auto; max-width: 100%; max-height: 100%;"
          :src="props.url"
          @click="onPreviewBoxClick"
        />
      </div>
      <div ref="previewBoxRef" class="preview-box" style="display: none; pointer-events: none;" ></div>
    </div>
  </div>
</template>

<style scoped>
:global(li.viewer-prev) {
  display: none;
}
:global(li.viewer-play) {
  display: none;
}
:global(li.viewer-next) {
  display: none;
}
.container {
  height: 100%;
  .img-main {
    height: 100%;
  }
  .mini-map {
    position: absolute;
    right: 10px;
    bottom: 50px;
    max-height: 200px;
    max-width: 200px;
    z-index: 2500;

    .preview-box {
      z-index: 99;
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      height: 50px;
      width: 50px;
      border: 1px solid #efefef;
    }
  }
}
</style>