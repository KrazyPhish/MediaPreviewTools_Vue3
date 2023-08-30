<script setup lang="ts" name="MediaTools">
import type { AudioBtnConfig, AudioRegion } from '@/types/audio'
import type { Information } from '@/types/base'
import type { VideoBtnConfig } from '@/types/video'
import { ref, type PropType } from 'vue'
import { useMediaToolsConfig } from './MediaTools'
import { ViewAudio, ViewVideo, ViewEmail, ViewOffice, ViewPdf, ViewPicture, ViewNonsupport } from '.'

const viewEmailRef = ref<InstanceType<typeof ViewEmail>>()
const viewOfficeRef = ref<InstanceType<typeof ViewOffice>>()

const props = defineProps({
  audioBtnConfig: {
    type: Object as PropType<AudioBtnConfig>,
    default: () => ({
      ifDisplay: true,
      ifMuteArea: true,
      ifMarker: true,
      ifRepeat: true,
      ifPlayRate: true,
      ifVolume: true,
      ifInfo: true,
      ifFullScreen: true
    }),
    required: false
  },
  videoBtnConfig: {
    type: Object as PropType<VideoBtnConfig>,
    default: () => ({
      ifPlayRate: true,
      ifCutter: true,
      ifInfo: true,
      ifVolume: true,
      ifFullScreen: true
    }),
    required: false
  },
  extension: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  vtt: {
    type: String,
    default: '',
    required: false
  },
  poster: {
    type: String,
    required: false
  },
  information: {
    type: Array as PropType<Array<Information>>,
    default: () => [],
    required: false
  },
  dataSources: {
    type: Array as PropType<Array<AudioRegion>>,
    default: () => [],
    required: false
  }
})

const emits = defineEmits<{
  (evt: 'saveCutter', param: any): void
}>()

const {
  format,
  zoomIn,
  zoomOut,
  saveCutter
} = useMediaToolsConfig(viewEmailRef, viewOfficeRef, props, emits)

defineExpose({ zoomIn, zoomOut })
</script>

<template>
  <div class="preview-container">
    <ViewAudio v-if="format == 'audio'"
      :url="props.url"
      :audioBtnConfig="props.audioBtnConfig"
      :information="props.information"
      :dataSources="props.dataSources"
    />
    <ViewVideo v-else-if="format == 'video'"
      :url="props.url"
      :videoBtnConfig="props.videoBtnConfig"
      :information="props.information"
      :vtt="props.vtt"
      :poster="props.poster"
      @saveCutter="saveCutter"
    />
    <ViewEmail v-else-if="format == 'email'" ref="viewEmailRef" :url="props.url" />
    <ViewOffice v-else-if="format == 'office'" ref="viewOfficeRef" :url="props.url" :extension="props.extension" />
    <ViewPdf v-else-if="format == 'pdf' || format == 'text'" :url="props.url" />
    <ViewPicture v-else-if="format == 'picture'" :url="props.url" />
    <ViewNonsupport v-else :extension="props.extension" />
  </div>
</template>

<style scoped>
.preview-container {
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>