import ViewAudio from './ViewAudio.vue'

ViewAudio.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewAudio.name, ViewAudio)
}

export default ViewAudio
