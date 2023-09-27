<script setup lang="ts" name="CommonPopover">
import type { Placement } from './modules'
import { ref, getCurrentInstance, type ComponentInternalInstance, type PropType } from 'vue'
import { useCommonPopoverConfig } from './CommonPopover'

const popperRef = ref<HTMLDivElement>()

const referenceRef = ref<HTMLDivElement>()

const instance: ComponentInternalInstance | null = getCurrentInstance()

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  width: {
    type: [String, Number],
    required: false
  },
  popperClass: {
    type: String,
    required: false
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'top',
    required: false
  }
})

const emits = defineEmits<{
  (evt: 'update:visible', visible: boolean): void
}>()

const { popperStyle, showPopper, arrowStyle, toggle } = useCommonPopoverConfig(referenceRef, popperRef, instance, props, emits)

defineExpose({ toggle })
</script>

<template>
  <span class="popover-container" :style="{ zIndex: 5 }">
    <div
      ref="popperRef"
      v-show="showPopper"
      class="common-popover common-popper"
      :class="[popperClass]"
      :style="popperStyle"
    >
      <slot></slot>
      <div class="popper__arrow" :style="arrowStyle" data-popper-arrow></div>
    </div>
    <div ref="referenceRef"><slot name="reference"></slot></div>
  </span>
</template>
