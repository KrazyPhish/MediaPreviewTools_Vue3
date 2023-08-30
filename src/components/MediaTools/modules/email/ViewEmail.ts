import type { Ref } from "vue"
import type { CommonIframe } from "../../common"

export const useViewEmailConfig = (viewIframeRef: Ref<InstanceType<typeof CommonIframe> | undefined>) => {
  const zoomIn = () => {
    viewIframeRef.value?.zoomIn()
  }

  const zoomOut = () => {
    viewIframeRef.value?.zoomOut()
  }

  return {
    zoomIn,
    zoomOut
  }
}