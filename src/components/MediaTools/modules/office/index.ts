import ViewOffice from './ViewOffice.vue'

ViewOffice.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewOffice.name, ViewOffice)
}

export default ViewOffice