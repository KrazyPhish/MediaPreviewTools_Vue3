import MediaTools from './MediaTools.vue'
export * from './modules'

MediaTools.install = (Vue: { component: (name: string, comp: any) => void }) => {
  Vue.component(MediaTools.name, MediaTools)
}

export { MediaTools }