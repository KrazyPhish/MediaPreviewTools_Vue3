import { useEventListener } from '@vueuse/core'
import { watch, onMounted, type Ref, ref } from "vue"
import { px2Int } from "../../common/utils"
import Viewer from "./viewer/viewer.esm"

/**
 * 构建图片阅览器组件
 * @param {*} props 
 * @param {Ref<Viewer>} viewer Viewer插件
 * @param {Ref<HTMLDivElement>} imgMainRef 大图DIV容器
 * @param {Ref<HTMLImageElement>} imageRef 大图图片
 * @param {Ref<HTMLDivElement>} miniMapRef 鹰眼DIV容器
 * @param {Ref<HTMLDivElement>} imgContainerRef 鹰眼图片DIV容器
 * @param {Ref<HTMLImageElement>} previewRef 鹰眼图片
 * @param {Ref<HTMLDivElement>} imageDom 图片在鹰眼DIV容器中移动时的实际容器DOM
 * @param {Ref<HTMLDivElement>} imageContainerDom 鹰眼的实际容器DIV的DOM
 * @param {Ref<HTMLDivElement>} previewBoxRef 鹰眼放大时的可视边框
 */
export const useViewPictureConfig = (
  props: { readonly url: string },
  viewer: Ref<Viewer | undefined>,
  imgMainRef: Ref<HTMLDivElement | undefined>,
  imageRef: Ref<HTMLImageElement | undefined>,
  miniMapRef: Ref<HTMLDivElement | undefined>,
  imgContainerRef: Ref<HTMLDivElement | undefined>,
  previewRef: Ref<HTMLImageElement | undefined>,
  imageDom: Ref<HTMLDivElement | undefined>,
  imageContainerDom: Ref<HTMLDivElement | undefined>,
  previewBoxRef: Ref<HTMLDivElement | undefined>
) => {
  /**
   * 全屏状态
   */
  const ifFullScreen = ref<boolean>(false)
  const scaleX = ref<number>(1)
  const scaleY = ref<number>(1)
  const rotate = ref<number>(0)

  watch(() => props.url, () => {
    initViewer()
  })
  
  onMounted(() => {
    initViewer()
    listenResize()
    dragEventConfig()
  })
  
  const initViewer = () => {
    if (props.url) previewRef.value!.src = props.url
    viewer.value && viewer.value.destroy()
    viewer.value = new Viewer(imageRef.value, {
      title: false,
      navbar: false,
      inline: true,
      minZoomRatio: 0.1,
      maxZoomRatio: 10,
      hide: () => {
        viewer.value?.destroy()
      },
      move: (ev: any) => {
        calcPreviewBoxPos(ev)
      },
      zoomed: () => {
        calcMiniMapSize()
      },
      ready: () => {
        miniMapEventConfig()
      }
    })
    viewer.value.show()
  }

  const calcPreviewBoxPos = (ev: any) => {
    if (imageDom.value && imageContainerDom.value) {
      const wp = previewRef.value!.clientWidth / imageDom.value.clientWidth
      const hp = previewRef.value!.clientHeight / imageDom.value.clientHeight
      const x: number = - (ev.detail.x * wp)
      const y: number = - (ev.detail.y * hp)
      previewBoxRef.value!.style.left = `${x}px`
      previewBoxRef.value!.style.top = `${y}px`
    }
  }
  
  const calcMiniMapSize = () => {
    if (!imageDom.value || !imageContainerDom.value) {
      imageDom.value = imgMainRef.value?.getElementsByClassName('viewer-move')[0] as HTMLDivElement
      imageContainerDom.value = imgMainRef.value?.getElementsByClassName('viewer-container')[0] as HTMLDivElement
    }
    if (imageDom.value && imageContainerDom.value) {
      if (imageDom.value.clientWidth > imageContainerDom.value.clientWidth || imageDom.value.clientHeight > imageContainerDom.value.clientHeight) {
        previewRef.value!.style.display = ''
        previewBoxRef.value!.style.display = ''
        const wp = imageContainerDom.value.clientWidth / imageDom.value.clientWidth
        const hp = imageContainerDom.value.clientHeight / imageDom.value.clientHeight
        const previewboxWidth = previewRef.value!.clientWidth * wp
        const previewboxHeight = previewRef.value!.clientHeight * hp
        previewBoxRef.value!.style.width = `${previewboxWidth}px`
        previewBoxRef.value!.style.height = `${previewboxHeight}px`
        viewer.value?.move(0)
      } else {
        hideMiniMap()
      }
    }
  }
  
  const hideMiniMap = () => {
    previewRef.value!.style.display = 'none'
    previewBoxRef.value!.style.display = 'none'
  }
  
  const miniMapEventConfig = () => {
    /**
     * 1:1比例按钮
     */
    const toOneBtn: HTMLButtonElement = document.getElementsByClassName('viewer-one-to-one')[0] as HTMLButtonElement
    /**
     * 重置按钮
     */
    const resetBtn: HTMLButtonElement = document.getElementsByClassName('viewer-reset')[0] as HTMLButtonElement
    /**
     * 全屏按钮
     */
    const fullScreenBtn: HTMLButtonElement = document.getElementsByClassName('viewer-button viewer-fullscreen')[0] as HTMLButtonElement
    /**
     * 逆时针旋转按钮
     */
    const rotateLeftBtn: HTMLButtonElement = document.getElementsByClassName('viewer-rotate-left')[0] as HTMLButtonElement
    /**
     * 顺时针旋转按钮
     */
    const rotateRightBtn: HTMLButtonElement = document.getElementsByClassName('viewer-rotate-right')[0] as HTMLButtonElement
    /**
     * 水平翻转按钮
     */
    const flipHorizontalBtn: HTMLButtonElement = document.getElementsByClassName('viewer-flip-horizontal')[0] as HTMLButtonElement
    /**
     * 垂直翻转按钮
     */
    const flipVerticalBtn: HTMLButtonElement = document.getElementsByClassName('viewer-flip-vertical')[0] as HTMLButtonElement
    
    let stopKeyboardEvent: Function
    /**
     * ESC键盘事件
     * @param {KeyboardEvent} event
     * @returns {void} void
     */
    const keyboardEvent = (event: KeyboardEvent) => {
      if (event.code == 'Escape' && ifFullScreen) {
        hideMiniMap()
        ifFullScreen.value = false
        miniMapRef.value!.style.position = 'absolute'
        miniMapRef.value!.style.maxHeight = '200px'
        miniMapRef.value!.style.maxWidth = '200px'
        stopKeyboardEvent()
      }
    }
  
    /**
     * 全屏图片
     * @returns {void} void
     */
    const fullScreenImg = () => {
      hideMiniMap()
      if (ifFullScreen.value) {
        ifFullScreen.value = false
        miniMapRef.value!.style.position = 'absolute'
        miniMapRef.value!.style.maxHeight = '200px'
        miniMapRef.value!.style.maxWidth = '200px'
        stopKeyboardEvent()
      } else {
        ifFullScreen.value = true
        miniMapRef.value!.style.position = 'fixed'
        miniMapRef.value!.style.maxHeight = '400px'
        miniMapRef.value!.style.maxWidth = '400px'
      }
      stopKeyboardEvent = useEventListener(document, 'keydown', keyboardEvent)
    }
  
    /**
     * 重置鹰眼及图片位置
     * @returns {void} void
     */
    const resetImg = () => {
      hideMiniMap()
      rotate.value = 0
      scaleX.value = 1
      scaleY.value = 1
      previewRef.value!.style.transform = `rotate(${rotate.value}deg)`
    }
  
    /**
     * 旋转图片
     * @param {string} direction 旋转方向
     * @returns {void} void
     */
    const rotateImg = (direction: 'left' | 'right') => {
      const compare: number = direction == 'left' ? -270 : 270
      const plus: number = direction == 'left' ? -90 : 90
      rotate.value = (rotate.value == compare) ? 0 : (rotate.value + plus)
      previewRef.value!.style.transform = `rotate(${rotate.value}deg)`
    }
  
    /**
     * 翻转图片
     * @param {string} direction 翻转方向
     * @returns {void} void
     */
    const flipImg = (direction: 'horizontal' | 'vertical') => {
      if ((((Math.abs(rotate.value) / 90) % 2 == 1) && direction == 'horizontal') || (((Math.abs(rotate.value) / 90) % 2 == 0) && direction == 'vertical')) {
        scaleY.value = -scaleY.value
      } else if ((((Math.abs(rotate.value) / 90) % 2 == 0) && direction == 'horizontal') || (((Math.abs(rotate.value) / 90) % 2 == 1) && direction == 'vertical')) {
        scaleX.value = -scaleX.value
      }
      imgContainerRef.value!.style.transform = `scale(${scaleX.value}, ${scaleY.value})`
    }
  
    useEventListener(toOneBtn, 'click', resetImg)
    useEventListener(resetBtn, 'click', resetImg)
    useEventListener(rotateLeftBtn, 'click', () => rotateImg('left'))
    useEventListener(rotateRightBtn, 'click', () => rotateImg('right'))
    useEventListener(flipHorizontalBtn, 'click', () => flipImg('horizontal'))
    useEventListener(flipVerticalBtn, 'click', () => flipImg('vertical'))
    useEventListener(fullScreenBtn, 'click', fullScreenImg)
  }
  
  /**
   * 单击鹰眼事件
   * @param {MouseEvent} event 
   */
  const onPreviewBoxClick = (event: MouseEvent) => {
    /**
     * 图片是否相对初始位置水平(0°，180°，360°算作水平)
     */
    let posFlag: boolean = true, hp: number, wp: number, left: number, top: number
    const { offsetX, offsetY } = event
    const x: number = (scaleX.value == -1 || rotate.value == 180) ? (previewRef.value!.clientWidth - offsetX) : offsetX
    const y: number = (scaleY.value == -1 || rotate.value == 180) ? (previewRef.value!.clientHeight - offsetY) : offsetY
    if ([-270, -90, 90, 270].includes(rotate.value)) posFlag = false
    if (!(imageDom.value && imageContainerDom.value && viewer.value)) return
    if (posFlag) {
      wp = previewRef.value!.clientWidth / imageDom.value.clientWidth
      hp = previewRef.value!.clientHeight / imageDom.value.clientHeight
      left = px2Int(previewBoxRef.value!.style.left) - x + previewBoxRef.value!.clientWidth / 2
      top = px2Int(previewBoxRef.value!.style.top) - y + previewBoxRef.value!.clientHeight / 2
    } else {
      wp = previewRef.value!.clientHeight / imageDom.value.clientHeight
      hp = previewRef.value!.clientWidth / imageDom.value.clientWidth
      if ([-270, 90].includes(rotate.value)) {
        left = px2Int(previewBoxRef.value!.style.left) - (previewRef.value!.clientHeight - y) + previewBoxRef.value!.clientHeight / 2
        top = px2Int(previewBoxRef.value!.style.top) - x + previewBoxRef.value!.clientWidth / 2
      } else if ([-90, 270].includes(rotate.value)) {
        left = px2Int(previewBoxRef.value!.style.left) - y + previewBoxRef.value!.clientHeight / 2
        top = px2Int(previewBoxRef.value!.style.top) - (previewRef.value!.clientWidth - x) + previewBoxRef.value!.clientWidth / 2
      }
    }
    viewer.value.move(left! / wp, top! / hp)
  }
  
  /**
   * 鹰眼可视边框单击拖拽
   */
  const dragEventConfig = () => {
    if (!previewBoxRef.value) return
    useEventListener(previewRef.value, 'mousedown', (ev: MouseEvent) => {
      onPreviewBoxClick(ev)
      const moveEvent = (event: MouseEvent) => {
        onPreviewBoxClick(event)
      }
      const stopMouseEvent = useEventListener(previewRef.value, 'mousemove', moveEvent)
      useEventListener(document, 'mouseup', stopMouseEvent, { once: true })
    })
  }
  
  /**
   * 监听窗口大小变化
   */
  const listenResize = () => {
    useEventListener(window, 'resize', hideMiniMap)
  }

  return {
    onPreviewBoxClick
  }
}