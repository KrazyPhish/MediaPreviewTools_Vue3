import CommonPopover from './CommonPopover.vue'

CommonPopover.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(CommonPopover.name, CommonPopover)
}

export default CommonPopover