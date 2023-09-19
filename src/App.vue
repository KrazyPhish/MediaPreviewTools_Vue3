<script setup lang="ts">
import { ElCol, ElForm, ElFormItem, ElOption, ElRow, ElSelect, ElInput } from 'element-plus'
import { useAppConfig } from './App'
import { ref } from 'vue'
import { MediaTools } from './components/MediaTools'

const MediaToolsRef = ref<InstanceType<typeof MediaTools>>()

const {
  videoBtnConfig,
  audioBtnConfig,
  extension,
  url,
  vtt,
  poster,
  information,
  formState,
  formOption,
  dataSources,
  zoomIn,
  zoomOut,
  onSubmit,
  saveCutter
} = useAppConfig(MediaToolsRef)
</script>

<template>
  <ElRow class="my-row" :gutter="10">
    <ElCol :span="6">
      <div class="container left">
        <ElForm ref="form" label-width="80px" size="small">
          <ElFormItem label="文件类型">
            <ElSelect v-model="formState.extension" placeholder="请选择活动区域">
              <ElOption label="音频" value=".mp3"></ElOption>
              <ElOption label="邮件" value=".eml"></ElOption>
              <ElOption label="Office" value=".docx"></ElOption>
              <ElOption label="PDF" value=".pdf"></ElOption>
              <ElOption label="图片" value=".jpg"></ElOption>
              <ElOption label="视频" value=".mp4"></ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="文件名称">
            <ElSelect v-model="formState.url" filterable allow-create>
              <ElOption v-for="item in formOption.options" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="文件地址">
            <ElInput v-model="formState.url"></ElInput>
          </ElFormItem>
          <ElFormItem size="small">
            <ElButton type="primary" @click="onSubmit">加载</ElButton>
            <ElButton type="primary" @click="zoomIn">+</ElButton>
            <ElButton type="primary" @click="zoomOut">-</ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </ElCol>
    <ElCol :span="18">
      <div class="container">
        <MediaTools
          ref="MediaToolsRef"
          :extension="extension"
          :url="url"
          :vtt="vtt"
          :poster="poster"
          :information="information"
          :dataSources="dataSources"
          :audioBtnConfig="audioBtnConfig"
          :videoBtnConfig="videoBtnConfig"
          @saveCutter="saveCutter"
        ></MediaTools>
      </div>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.my-row {
  height: 100%;
}
.container {
  box-sizing: border-box;
  height: 100%;
  border: 1px solid rgb(0, 204, 255);

  &.left {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
}
</style>