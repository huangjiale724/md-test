<template>
  <div class="cherry-markdown">
    <CherryMarkdown ref="cherryMarkdownRef" v-model="mdContent" @input="mdChange" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CherryMarkdown from '@/components/cherry-markdown/index.vue'
const mdContent = ref('')
const mdChange = (mdHtml, mdTxt, content) => {
  mdContent.value = content
}
const cherryMarkdownRef = ref(null)
onMounted(() => {
  cherryMarkdownRef.value.initCherryMD('')
})
</script>

<style scoped lang="scss"></style>