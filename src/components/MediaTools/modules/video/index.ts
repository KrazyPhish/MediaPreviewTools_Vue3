import ViewVideo from './ViewVideo.vue'

ViewVideo.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewVideo.name, ViewVideo)
}

export default ViewVideo
