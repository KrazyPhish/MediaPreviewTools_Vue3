import CommonToolbar from './CommonToolbar.vue'

CommonToolbar.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(CommonToolbar.name, CommonToolbar)
}

export default CommonToolbar