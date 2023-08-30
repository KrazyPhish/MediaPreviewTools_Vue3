import { useEventListener } from "@vueuse/core"
import { onBeforeUnmount, reactive, ref, watch, type RendererNode, type Ref, type ComponentInternalInstance, onMounted, type CSSProperties } from 'vue'
import { createPopper, type Placement, type Instance } from "./modules"

export const useCommonPopoverConfig = (
  referenceRef: Ref<HTMLDivElement | undefined>,
  popperRef: Ref<HTMLDivElement | undefined>,
  instance: ComponentInternalInstance | null,
  props: {
    readonly visible: boolean,
    readonly width?: string | number,
    readonly placement: Placement,
    readonly popperClass?: string | undefined
  },
  emits: (evt: 'update:visible', visible: boolean) => void
) => {
  const showPopper = ref<boolean>(false)

  const popperStyle = reactive<CSSProperties>({
    width: typeof props.width == 'string' ? props.width : props.width + 'px',
    backgroundColor: 'white',
    borderRadius: '5px',
    color: 'grey',
    padding: '5px'
  })

  const arrowStyle = reactive<CSSProperties>({
    width: '10px',
    height: '10px',
    zIndex: -1,
    boxSizing: 'border-box',
    backgroundColor: 'white',
    clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'
  })

  const listeners = reactive<{
    stopReference: Function | null,
    stopDocument: Function | null
  }>({
    stopReference: null,
    stopDocument: null
  })
  
  const instanceProxy = reactive<{
    referenceEl: RendererNode | null,
    reference: HTMLElement | undefined,
    popperEl: Instance | undefined,
    popper: HTMLDivElement | undefined
  }>({
    referenceEl: null,
    reference: undefined,
    popperEl: undefined,
    popper: undefined
  })

  watch(() => props.visible, (visible: boolean) => {
    showPopper.value = visible
  }, { immediate: true })
  
  watch(() => showPopper.value, (showPopper: boolean) => {
    showPopper ? updatePopper() :  destroyPopper()
    emits('update:visible', showPopper)
  })
  
  onMounted(() => {
    const refer = referenceRef.value
    const popper = instanceProxy.popper || popperRef.value
    if (!refer) return
    instanceProxy.reference = refer
    instanceProxy.popper = popper
    myCreatePopper()
  })
  
  onBeforeUnmount(() => {
    destroyPopper()
    listeners.stopReference?.()
  })
  
  const toggle = () => {
    showPopper.value = !showPopper.value
  }
  
  const show = () => {
    showPopper.value = true
  }
  
  const close = () => {
    showPopper.value = false
  }
  
  const onReferenceClick = () => {
    if (showPopper.value) {
      close()
      return
    }
    show()
    if (!instanceProxy.popperEl) {
      instanceProxy.popperEl = createPopper(instanceProxy.reference!, instanceProxy.popper!, {
        placement: props.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 6]
            }
          }
        ]
      })
    } else instanceProxy.popperEl.update()
  }
  
  const onDocumentClick = (e: MouseEvent) => {
    const refer: HTMLElement | undefined = instanceProxy.reference
    const popper: HTMLDivElement | undefined = instanceProxy.popper
    const root: HTMLDivElement | undefined = popperRef.value
    const target = e.target as Node
    if (!root || !refer || !popper || refer.contains(target) || root.contains(target) || popper.contains(target)) return
    close()
  }
  
  const myCreatePopper = () => {
    if (!(instance?.slots.reference && instance.slots.reference?.().length)) return
    listeners.stopReference = useEventListener(instanceProxy.reference, 'click', onReferenceClick)
    listeners.stopDocument = useEventListener(document, 'click', onDocumentClick)
  }
  
  const updatePopper = () => {
    if (instanceProxy.popperEl) {
      instanceProxy.popperEl.update()
    } else myCreatePopper()
  }
  
  const destroyPopper = () => {
    instanceProxy.popperEl && instanceProxy.popperEl.destroy()
    instanceProxy.popperEl = undefined
  }

  return {
    popperStyle,
    arrowStyle,
    showPopper,
    toggle
  }
}