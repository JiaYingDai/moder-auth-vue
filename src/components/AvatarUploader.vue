<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera, User, X } from 'lucide-vue-next'

interface Props {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    currentImage?: string | null
    removable?: boolean
    readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    size: 'lg',
    currentImage: '',
    removable: true,
    readonly: false
})

const emit = defineEmits<{
    change: [file: File]
    remove: []
}>()

const previewUrl = ref('')
const isDragging = ref(false)
const isHovering = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const displayImage = computed(() => {
    return previewUrl.value || props.currentImage || ''
})

const sizeValue = computed(() => {
    const sizes = { xs: 32, sm: 64, md: 96, lg: 128, xl: 160 }
    return sizes[props.size]
})

const iconSize = computed(() => {
    const sizes = { xs: 14, sm: 20, md: 28, lg: 36, xl: 44 }
    return sizes[props.size]
})

const buttonSize = computed(() => {
    const sizes = { xs: 16, sm: 24, md: 32, lg: 40, xl: 48 }
    return sizes[props.size]
})

const removeButtonSize = computed(() => {
    const sizes = { xs: 12, sm: 18, md: 24, lg: 28, xl: 32 }
    return sizes[props.size]
})

const processFile = (file: File) => {
    if (file && file.type.indexOf('image/') === 0) {
        previewUrl.value = URL.createObjectURL(file)
        emit('change', file)
    }
}

const handleFileChange = (event: Event) => {
    if (props.readonly) return
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) processFile(file)
}

const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    if (props.readonly) return
    isDragging.value = false
    const file = event.dataTransfer?.files?.[0]
    if (file) processFile(file)
}

const handleRemove = () => {
    if (props.readonly) return
    previewUrl.value = ''
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
    emit('remove')
}

const triggerFileInput = () => {
    if (props.readonly) return
    fileInputRef.value?.click()
}
</script>

<template>
    <div class="avatar-wrapper">
        <input v-if="!readonly" ref="fileInputRef" type="file" accept="image/*" class="avatar-input"
            @change="handleFileChange" />

        <div class="avatar-display" :class="{
            dragging: isDragging,
            clickable: !readonly
        }" :style="{ width: sizeValue + 'px', height: sizeValue + 'px' }" @click="triggerFileInput" @drop="handleDrop"
            @dragover.prevent="!readonly && (isDragging = true)" @dragleave="isDragging = false"
            @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <img v-if="displayImage" :src="displayImage" alt="大頭貼" class="avatar-image" />

            <div v-else class="avatar-placeholder">
                <User :size="iconSize" />
            </div>

            <div v-if="!readonly" class="avatar-overlay" :class="{ visible: isHovering }">
                <Camera :size="iconSize * 0.6" />
            </div>
        </div>

        <button v-if="!readonly && removable && displayImage" type="button" class="remove-button"
            :style="{ width: removeButtonSize + 'px', height: removeButtonSize + 'px' }" @click="handleRemove"
            aria-label="移除大頭貼">
            <X :size="removeButtonSize * 0.5" />
        </button>

        <button v-if="!readonly" type="button" class="camera-button"
            :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" @click="triggerFileInput" aria-label="上傳大頭貼">
            <Camera :size="buttonSize * 0.5" />
        </button>
    </div>
</template>

<style scoped>
.avatar-wrapper {
    position: relative;
    display: inline-block;
}

.avatar-input {
    display: none;
}

.avatar-display {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #e5e7eb;
    background-color: #f3f4f6;
    transition: all 0.2s ease;
}

.avatar-display.clickable {
    cursor: pointer;
}

.avatar-display.dragging {
    box-shadow: 0 0 0 2px white, 0 0 0 4px #3b82f6;
    transform: scale(1.05);
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.avatar-overlay.visible {
    opacity: 1;
}

.camera-button {
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    background-color: #B5C7D3;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease;
    padding: 0;
}

.camera-button:hover {
    background-color: #92b8d2;
}

.camera-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #3b82f6;
}

.remove-button {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    background-color: #84898C;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease;
    padding: 0;
}

.remove-button:hover {
    background-color: #505456;
}

.remove-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #ef4444;
}
</style>