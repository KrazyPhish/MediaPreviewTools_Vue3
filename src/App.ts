import { ref, type Ref } from 'vue'
import type { AudioBtnConfig } from '@/types/audio'
import type { VideoBtnConfig } from '@/types/video'
import type { AudioRegion } from './types/audio'
import type { Information } from './types/base'
import type { MediaTools } from './components/MediaTools'

export interface AppConfig {
  videoBtnConfig: Ref<VideoBtnConfig>,
  audioBtnConfig: Ref<AudioBtnConfig>,
  extension: Ref<string>,
  url: Ref<string>,
  vtt: Ref<string>,
  poster: Ref<string>,
  information: Ref<Information[]>,
  formState: Ref<{ extension: string, url: string, poster: string }>,
  formOption: Ref<{ options: Information[] }>,
  dataSources: Ref<AudioRegion[]>,
  zoomIn: () => void,
  zoomOut: () => void,
  onSubmit: () => void,
  saveCutter: (param: any) => void
}

export const useAppConfig = (MediaToolsRef: Ref<InstanceType<typeof MediaTools> | undefined>): AppConfig => {
  const videoBtnConfig = ref<VideoBtnConfig>({
    ifPlayRate: true,
    ifCutter: true,
    ifVolume: true,
    ifInfo: true,
    ifFullScreen: true
  })
  
  const audioBtnConfig = ref<AudioBtnConfig>({
    ifDisplay: true,
    ifMuteArea: true,
    ifMarker: true,
    ifRepeat: true,
    ifPlayRate: true,
    ifVolume: true,
    ifInfo: true,
    ifFullScreen: true
  })
  
  /**
   * @description 文件扩展名
   */
  const extension = ref<string>('')
  
  /**
   * @description 媒体文件地址Url
   */
  const url = ref<string>('')
  
  /**
   * @description 媒体对应的字幕文件地址Url
   */
  const vtt = ref<string>('')
  
  /**
   * @description 视频封面地址Url
   */
  const poster = ref<string>('')
  
  /**
   * @description 音视频详细信息数据
   */
  const information = ref<Information[]>([
    { label: '通道数', value: '2' },
    { label: '采样率', value: '240000' },
    { label: '帧数', value: '60' }]
  )
  
  const formState = ref({
    extension: '.mp3',
    url: '/demo.wav'
  })
  
  const formOption = ref<{ options: Information[] }>({
    options: [
      {
        value: '/demo.wav',
        label: '/demo.wav'
      },
      {
        value: '/456.mp4',
        label: '/456.mp4'
      },
      {
        value: '/demo.pdf',
        label: '/demo.pdf'
      },
      {
        value: '/tibet-1.jpg',
        label: '/图片1.jpg'
      },
      {
        value: '/ppt.html',
        label: 'ppt文档'
      },
      {
        value: 'email_test.html',
        label: 'email_test'
      }
    ]
  })
  
  const dataSources = ref<AudioRegion[]>([
    { id: '1', name: 'test1', start: 6.666, end: 8.888, drag: false, resize: false, mute: false },
    { id: '2', name: 'test2', start: 1.111, end: 3.888, drag: false, resize: false, mute: false },
    { id: '5', name: 'test3', start: 5.000, end: 9.000, drag: false, resize: false, mute: false },
    { id: '10', name: 'test4', start: 9.000, end: 9.000, drag: false, resize: false, mute: false },
    { id: '11', name: 'mute2', start: 14.000, end: 18.000, drag: false, resize: false, mute: true, color: 'rgba(230, 200, 60, 0.1)' },
    { id: '12', name: 'mute3', start: 1.000, end: 3.000, drag: false, resize: false, mute: true, color: 'rgba(230, 200, 60, 0.1)' },
  ])
  
  const zoomIn = () => {
    MediaToolsRef.value?.zoomIn()
  }
  
  const zoomOut = () => {
    MediaToolsRef.value?.zoomOut()
  }
  
  const onSubmit = () => {
    extension.value = formState.value.extension
    url.value = formState.value.url
  }
  
  const saveCutter = (param: any) => {
    console.log('save cutter operation', param)
  }
  
  return {
    videoBtnConfig,
    audioBtnConfig,
    extension,
    url,
    vtt,
    poster,
    information,
    formState,
    formOption,
    dataSources,
    zoomIn,
    zoomOut,
    onSubmit,
    saveCutter
  }
}