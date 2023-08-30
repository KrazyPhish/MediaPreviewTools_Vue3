import CommonIframe from './CommonIframe.vue'

CommonIframe.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(CommonIframe.name, CommonIframe)
}

export default CommonIframe