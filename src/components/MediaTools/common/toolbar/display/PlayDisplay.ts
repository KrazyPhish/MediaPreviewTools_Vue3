import type { DisplaySettings, SpectOption, ZoomOption } from "@/types/audio"
import { reactive, watch } from "vue"
import { debounce } from "../../utils"

export const usePlayDisplayConfig = (
  props: {
    readonly spect: SpectOption,
    readonly zoomOptions: ZoomOption
  },
  emits: {
    (evt: 'onZoom', mode: 'horizontal' | 'vertical', zoom: number): void,
    (evt: 'onSpect', mode: 'spectrum' | 'spectrogram', spect: boolean): void
  }
) => {
  const state = reactive<DisplaySettings>({
    spectrum: props.spect.spectrum,
    spectrogram: props.spect.spectrogram,
    horizontalZoom: props.zoomOptions.horizontalZoom.init,
    verticalZoom: props.zoomOptions.verticalZoom.init
  })

  const spectHandler = debounce((mode: 'spectrogram' | 'spectrum', value: boolean) => emits('onSpect', mode, value))
  
  const zoomHandler = debounce((mode: 'horizontal' | 'vertical', zoom: number) => emits('onZoom', mode, zoom))

  watch(() => state.spectrogram, (val: boolean) => {
    spectHandler('spectrogram', val)
  }, { immediate: true })
  
  watch(() => state.spectrum, (val: boolean) => {
    spectHandler('spectrum', val)
  }, { immediate: true })
  
  watch(() => state.horizontalZoom, (zoom: number) => {
    zoomHandler('horizontal', zoom)
  }, { immediate: true })
  
  watch(() => state.verticalZoom, (zoom: number) => {
    zoomHandler('vertical', zoom)
  }, { immediate: true })

  return {
    state
  }
}