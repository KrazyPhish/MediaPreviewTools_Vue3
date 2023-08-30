import ViewEmail from './ViewEmail.vue'

ViewEmail.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewEmail.name, ViewEmail)
}

export default ViewEmail