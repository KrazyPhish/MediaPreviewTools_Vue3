import ViewPdf from './ViewPdf.vue'

ViewPdf.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(ViewPdf.name, ViewPdf)
}

export default ViewPdf