
import { ref, watch, type Ref } from 'vue'
import type { AudioBtnConfig, AudioRegion } from '@/types/audio'
import { getMediaType } from './common/media'
import type { ViewEmail, ViewOffice } from '.'
import type { Information } from '@/types/base'
import type { VideoBtnConfig } from '@/types/video'

export const useMediaToolsConfig = (
  viewEmailRef: Ref<InstanceType<typeof ViewEmail> | undefined>,
  viewOfficeRef: Ref<InstanceType<typeof ViewOffice> | undefined>,
  props: {
    readonly url: string,
    readonly extension: string,
    readonly audioBtnConfig: AudioBtnConfig,
    readonly videoBtnConfig: VideoBtnConfig,
    readonly information: Information[],
    readonly dataSources: AudioRegion[],
    readonly vtt?: string | undefined,
    readonly txt?: string | undefined
  },
  emits: ((evt: "saveCutter", param: any) => void)
) => {

  const format = ref<string>('audio')

  watch(() => props.extension, (val: string) => {
    if(val.startsWith('.')) {
      format.value = getMediaType(val.slice(1))
    } else {
      format.value = getMediaType(val)
    }
  }, { immediate: true })

  const zoomIn = () => {
    if (format.value == 'email') viewEmailRef.value?.zoomIn()
    else viewOfficeRef.value?.zoomIn()
  }

  const zoomOut = () => {
    if (format.value == 'email') viewEmailRef.value?.zoomOut()
    else viewOfficeRef.value?.zoomOut()
  }

  /**
   * @description 保存剪辑数据
   * @param param
   * @returns {void} void
   */
  const saveCutter = (param: any) => {
    emits('saveCutter', param)
  }

  return {
    format,
    zoomIn,
    zoomOut,
    saveCutter
  }
}
