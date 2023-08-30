import ViewNonsupport from './ViewNonsupport.vue'

ViewNonsupport.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewNonsupport.name, ViewNonsupport)
}

export default ViewNonsupport