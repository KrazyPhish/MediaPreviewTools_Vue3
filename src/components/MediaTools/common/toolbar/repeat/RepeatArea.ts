import type { RepeatSettings } from "@/types/audio"
import { reactive, watch } from "vue"
import { iso2Time } from "../../utils"
import { ElMessage } from "element-plus"

export const useRepeatAreaConfig = (
  props: { readonly totalTime: number },
  emits: (evt: 'toggleRepeat', value: RepeatSettings) => void
) => {
  const state = reactive<RepeatSettings>({
    start: undefined,
    end: undefined,
    repeat: false
  })

  watch(() => state.repeat, () => {
    const start: number = iso2Time(state.start! as string)
    const end: number = iso2Time(state.end! as string)
    if (start >= end || start >= props.totalTime || end <= 0) {
      ElMessage.warning({ message: '起止时间有误，请检查你的参数！', grouping: true })
      state.repeat = false
    }
    emits('toggleRepeat', { start, end, repeat: state.repeat })
  })

  return {
    state
  }
}