<script setup lang="ts">
import { NFlex, NButton, NUpload, NImage, type UploadFileInfo } from 'naive-ui'

interface Props {
    imageSrc: string
    uploadUrl: string
    uploadName: string
    uploadMethod: string
    token: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'finish', originLink: string, thumbnailLink: string): void
    (e: 'error', message: string): void
}>()
const handleFinished = ({ file, event } : { file: UploadFileInfo, event?: ProgressEvent }) => {
    const response = (event?.target as XMLHttpRequest).response
    emit('finish', response.origin, response.thumbnail)
}
const handleError = ({ file, event } : { file: UploadFileInfo, event?: ProgressEvent }) => {
    const response = (event?.target as XMLHttpRequest).response
    const status = (event?.target as XMLHttpRequest).status
    if (status === 413) {
        emit('error', '上传失败，文件过大')
        return
    }
    emit('error', response.message)
}

</script>

<template>
    <div id="container">
        <n-flex vertical>
            <n-image 
                :src="imageSrc"
            />
            <n-upload
                :action="uploadUrl"
                :name="uploadName"
                :headers="{ Authorization: `Bearer ${token}` }"
                :method="uploadMethod"
                response-type="json"
                :show-file-list="false"
                @finish="handleFinished"
                @error="handleError"
            >
                <n-button>上传头像</n-button>
            </n-upload>
        </n-flex>
    </div>
</template>