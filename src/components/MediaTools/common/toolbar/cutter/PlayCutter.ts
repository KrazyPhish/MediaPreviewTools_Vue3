/* eslint-disable prefer-const */
import { ElMessage } from 'element-plus'
import { watch, reactive, ref, type Ref } from 'vue'
import { formatTime, regexTime, iso2Time } from '../../utils'
import type { CutterInfo, CutterForm } from '@/types/base'

export const usePlayCutterConfig = (
  props: { readonly totalTime: number },
  emits: ((evt: 'skip', time: number) => void) & ((evt: 'saveCutter', cutterInfo: CutterInfo) => void),
  startInputRef: Ref<HTMLInputElement | undefined>,
  endInputRef: Ref<HTMLInputElement | undefined>
) => {
  const state = reactive<CutterForm>({
    range: [0, 0],
    start: '',
    end: ''
  })
  
  /**
   * @description 剪辑时当前编辑的位置
   */
  const currentInput = ref<'start' | 'end' | null>(null)

  watch(() => props.totalTime, () => {
    state.range[0] = 0
    state.range[1] = 0
    state.start = '00:00:00'
    state.end = '00:00:00'
  })
  
  watch(() => state.range, (range: [number, number]) => {
    const [start, end] = range
    const startString: string = formatTime(start)
    const endString: string = formatTime(end)
    if (currentInput.value == 'start') emits('skip', start)
    else if (currentInput.value == 'end') emits('skip', end)
    else {
      if (startString != state.start) emits('skip', start)
      else if (endString != state.end) emits('skip', end)
      state.start = startString
      state.end = endString
    }
  })
  
  const formatTooltip = (time: number) => {
    return formatTime(time)
  }
  
  const onStartChange = (value: string) => {
    let [start, end] = state.range
    if (!(currentInput.value && regexTime.test(value))) return
    if (iso2Time(value) <= end) start = iso2Time(value)
    else {
      ElMessage.warning({ message: '开始时间不能大于结束时间！', grouping: true })
      start = end
      state.start = formatTime(start)
    }
    state.range[0] = start
    state.range[1] = end
  }
  
  const onEndChange = (value: string) => {
    let [start, end] = state.range
    if (!(currentInput.value && regexTime.test(value))) return
    if (iso2Time(value) >= start) end = iso2Time(value)
    else {
      ElMessage.warning({ message: '结束时间不能小于开始时间！', grouping: true })
      end = start
      state.end = formatTime(end)
    }
    state.range[0] = start
    state.range[1] = end
  }
  
  const onRangeChange = () => {
    const start = formatTime(state.range[0])
    const end = formatTime(state.range[1])
    if (currentInput.value == 'start') {
      state.start = start
      startInputRef.value?.blur()
    } else if (currentInput.value == 'end') {
      state.end = end
      endInputRef.value?.blur()
    } else return
  }
  
  const onFocus = (key: 'start' | 'end') => {
    currentInput.value = key
  }
  
  const onBlur = (key: 'start' | 'end') => {
    const [start, end] = state.range
    if (key == 'start' && !regexTime.test(state.start)) {
      state.start = formatTime(start)
    } else if (key == 'end' && !regexTime.test(state.end)) {
      state.end = formatTime(end)
    }
    currentInput.value = null
  }
  
  const onSubmit = () => {
    const [start, end] = state.range
    start != end && emits('saveCutter', { start, end, duration: end - start })
  }

  return {
    state,
    formatTooltip,
    onStartChange,
    onEndChange,
    onRangeChange,
    onFocus,
    onBlur,
    onSubmit
  }
}