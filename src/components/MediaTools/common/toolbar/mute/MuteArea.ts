import { reactive, watch } from "vue"

export const useMuteAreaConfig = (
  props: {
    readonly skip: boolean,
    readonly show: boolean
  },
  emits: {
    (evt: 'update:skip', value: boolean): void,
    (evt: 'update:show', value: boolean): void
  }
) => {
  const state = reactive({
    skipMuteArea: props.skip,
    showMuteArea: props.show
  })
  
  watch(() => props.show, (value: boolean) => {
    state.showMuteArea = value
    emits('update:show', value)
  }, { immediate: true })
  
  watch(() => props.skip, (value: boolean) => {
    state.skipMuteArea = value
    emits('update:skip', value)
  }, { immediate: true })

  watch(() => state.showMuteArea, (value: boolean) => emits('update:show', value))

  watch(() => state.skipMuteArea, (value: boolean) => emits('update:skip', value))

  return {
    state
  }
}