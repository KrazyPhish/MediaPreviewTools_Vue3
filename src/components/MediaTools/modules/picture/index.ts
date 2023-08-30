import ViewPicture from './ViewPicture.vue'

ViewPicture.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewPicture.name, ViewPicture)
}

export default ViewPicture
