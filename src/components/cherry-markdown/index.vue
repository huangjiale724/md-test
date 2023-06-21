<template>
  <div @click.prevent.stop>
    <div :id="mdId" :style="{ height: height }" />
  </div>
</template>

<script>
import Cherry from 'cherry-markdown/dist/cherry-markdown.core'
import CherryMermaidPlugin from 'cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin'
import mermaid from 'mermaid'

Cherry.usePlugin(CherryMermaidPlugin, {
  mermaid // 传入mermaid引用
  // mermaidAPI: mermaid.mermaidAPI, // 也可以传入mermaid API
  // 同时可以在这里配置mermaid的行为，可参考mermaid官方文档
  // theme: 'neutral',
  // sequence: { useMaxWidth: false, showSequenceNumbers: true }
})
// import * as echarts from "echarts"
import 'cherry-markdown/dist/cherry-markdown.min.css'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    mdId: {
      type: String,
      default: 'markdown-container'
    },
    defaultMode: {
      type: String,
      default: 'edit&preview'
    },
    height: {
      type: [ Number, String ],
      default: 'calc(100vh - 155px)'
    }
  },
  data () {
    return {
      content: null,
      cherrInstance: null,
      fileType: ''
    }
  },
  mounted () {
    // this.initCherryMD()
  },
  methods: {
    // 初始化编辑器
    async initCherryMD (value) {
      if (this.cherrInstance) {
        this.cherrInstance.setMarkdown(value)
        return
      }
      const { afterChange, afterInit, beforeImageMounted, fileUpload } = this
      const defaultValue = value || this.value
      this.cherrInstance = new Cherry({
        id: this.mdId,
        value: defaultValue,
        // 第三方包
        externals: {
          // externals
        },
        // 解析引擎配置
        engine: {
          // 全局配置
          global: {
            // 是否启用经典换行逻辑
            // true：一个换行会被忽略，两个以上连续换行会分割成段落，
            // false： 一个换行会转成<br>，两个连续换行会分割成段落，三个以上连续换行会转成<br>并分割段落
            classicBr: true,
            /**
             * 额外允许渲染的html标签
             * 标签以英文竖线分隔，如：htmlWhiteList: 'iframe|script|style'
             * 默认为空，默认允许渲染的html见src/utils/sanitize.js whiteList 属性
             * 需要注意：
             *    - 启用iframe、script等标签后，会产生xss注入，请根据实际场景判断是否需要启用
             *    - 一般编辑权限可控的场景（如api文档系统）可以允许iframe、script等标签
             */
            htmlWhiteList: ''
          },
          // 内置语法配置
          syntax: {
            // 语法开关
            // 'hookName': false,
            // 语法配置
            // 'hookName': {
            //
            // }
            autoLink: {
              /** 是否开启短链接 */
              enableShortLink: true,
              /** 短链接长度 */
              shortLinkLength: 20,
            },
            list: {
              listNested: false, // 同级列表类型转换后变为子级
              indentSpace: 2, // 默认2个空格缩进
            },
            table: {
              enableChart: false,
              // chartRenderEngine: EChartsTableEngine,
              // externals: ['echarts'],
            },
            inlineCode: {
              theme: 'red',
            },
            codeBlock: {
              theme: 'dark', // 默认为深色主题
              wrap: true, // 超出长度是否换行，false则显示滚动条
              lineNumber: true, // 默认显示行号
              customRenderer: {
                // 自定义语法渲染器
              },
              /**
               * indentedCodeBlock是缩进代码块是否启用的开关
               *
               *    在6.X之前的版本中默认不支持该语法。
               *    因为cherry的开发团队认为该语法太丑了（容易误触）
               *    开发团队希望用```代码块语法来彻底取代该语法
               *    但在后续的沟通中，开发团队发现在某些场景下该语法有更好的显示效果
               *    因此开发团队在6.X版本中才引入了该语法
               *    已经引用6.x以下版本的业务如果想做到用户无感知升级，可以去掉该语法：
               *        indentedCodeBlock：false
               */
              indentedCodeBlock: true,
            },
            emoji: {
              useUnicode: true, // 是否使用unicode进行渲染
            },
            fontEmphasis: {
              allowWhitespace: true, // 是否允许首尾空格
            },
            strikethrough: {
              needWhitespace: true, // 是否必须有首位空格
            },
            mathBlock: {
              engine: 'MathJax', // katex或MathJax
              src: '',
              plugins: true, // 默认加载插件
            },
            inlineMath: {
              engine: 'MathJax', // katex或MathJax
              src: '',
            },
            toc: {
              /** 默认只渲染一个目录 */
              allowMultiToc: false,
            },
            header: {
              /**
               * 标题的样式：
               *  - default       默认样式，标题前面有锚点
               *  - autonumber    标题前面有自增序号锚点
               *  - none          标题没有锚点
               */
              anchorStyle: 'default',
            },
          },
        },
        editor: {
          codemirror: {
            // depend on codemirror theme name: https://codemirror.net/demo/theme.html
            // 自行导入主题文件: `import 'codemirror/theme/<theme-name>.css';`
            theme: 'default',
          },
          // 编辑器的高度，默认100%，如果挂载点存在内联设置的height则以内联样式为主
          height: '100%',
          // defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
          // edit&preview: 双栏编辑预览模式
          // editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
          // previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
          defaultModel: this.defaultMode,
          // 粘贴时是否自动将html转成markdown
          convertWhenPaste: true,
        },
        toolbars: {
          theme: 'light', // light or dark
          showToolbar: true, // false：不展示顶部工具栏； true：展示工具栏; toolbars.showToolbar=false 与 toolbars.toolbar=false 等效
          toolbar: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'sub',
            'sup',
            '|',
            'size',
            'color',
            'header',
            '|',
            // 'checklist',
            'list',
            'code',
            'image',
            'table',
            {
              insert: [
                'image',
                'link',
                'hr',
                'br',
                'code',
                'formula',
                'toc',
                'table',
                'line-table',
                'bar-table',
                'pdf',
                'word',
              ],
            },
            'graph',
            // 'draw',
            'settings',
            'export'
            // "togglePreview"
          ],
          sidebar: [],
          bubble: [ 'bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color' ], // array or false
          float: [ 'h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code' ], // array or false
        },
        // fileUpload,
        callback: {
          afterChange,
          afterInit,
          beforeImageMounted
          // onClickPreview: function (e) {
          //   const { target } = e
          //   if (target.tagName === 'IMG') {
          //     console.log('click img', target)
          //     const tmp = new Viewer(target, {
          //       button: true,
          //       navbar: true,
          //       title: [ 1, (image, imageData) => `${image.alt.replace(/#.+$/, '')} (${imageData.naturalWidth} × ${imageData.naturalHeight})` ],
          //     })
          //     tmp.show()
          //   }
          // }
        },
        previewer: {
          dom: false,
          className: 'cherry-markdown',
          // 是否启用预览区域编辑能力（目前支持编辑图片尺寸、编辑表格内容）
          enablePreviewerBubble: true,
        },
        // 预览页面不需要绑定事件
        isPreviewOnly: false,
        // 预览区域跟随编辑器光标自动滚动
        autoScrollByCursor: true,
        // 外层容器不存在时，是否强制输出到body上
        forceAppend: true,
      })

    },
    // 上传通用接口未实现audioVideo
    fileUpload (file) {
      // console.log('file--->', file)
      this.fileType = file.type
      // console.log('this.fileType--->', this.fileType)
      const formData = new FormData()
      formData.append('files', file)
      const request = new XMLHttpRequest()
      // 图片上传路径修改为自己连接
      // request.open('POST', process.env.PICTURE_API + '/file/ckeditorUploadFile?token=' + getToken())
      request.open('POST', import.meta.env.VITE_APP_BASE_API + '/page/file/wangEditor/upload')
      request.onload = this.onloadCallback
      request.send(formData)
    },
    onloadCallback (oEvent) {
      const currentTarget = oEvent.currentTarget
      // console.log('返回的结果', currentTarget)
      if (currentTarget.status !== 200) {
        return this.$message({
          type: 'error',
          message: currentTarget.status + ' ' + currentTarget.statusText
        })
      }
      const resp = JSON.parse(currentTarget.response)
      // console.log('resp--->', resp)
      let imgMdStr = ''
      if (resp.errno !== 0) {
        return this.$message({
          type: 'error',
          message: '请求错误！'
        })
      } else {
        if ([ 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ].includes(this.fileType)) {
          imgMdStr = `[${resp.data.fileName || '<文件名>'}](${resp.data.url})`
        } else {
          imgMdStr = `![${resp.data.fileName || '<文件名>'}](${resp.data.url})`
        }
      }
      // console.log('imgMdStr--->', imgMdStr)
      this.cherrInstance.insert(imgMdStr)
    },
    // 变更事件回调
    afterChange (e) {
      // console.log('afterChange:e--->', e)
      this.content = e
      const mdHtml = this.getCherryHtml()
      const mdTxt = e
      const mdContent = this.getCherryContent()
      this.$emit('input', mdHtml, mdTxt, mdContent)
      this.$emit('md-change', mdHtml, mdTxt, mdContent)
    },
    // 初始化事件回调
    afterInit (e) {
      // console.log('afterInit:e', e, this.value)
    },
    // 图片加载回调
    beforeImageMounted (e, src) {
      console.log('src', src)
      // console.log('e', e)
      return { [ e ]: src }
    },
    setMarkdown (content) {
      if (!this.cherrInstance) { // 未加载则重新初始化
        this.initCherryMD(content)
        return
      }
      this.cherrInstance.setMarkdown(content)
    },
    getCherryContent () {
      const result = this.cherrInstance.getMarkdown()// 获取markdown内容
      return result
    },
    getCherryHtml () {
      const result = this.cherrInstance.getHtml()
      return result
    },
    /**
     * type：{'pdf'|'img'}
     */
    exportMD (type = 'pdf') {
      this.cherrInstance.export(type)
    },
    /**
     * model{'edit&preview'|'editOnly'|'previewOnly'}
     */
    switchModel (model) {
      if (this.isInit()) {
        this.cherrInstance.switchModel(model)
      }
    },

    insert (content, isSelect = false, anchor = [], focus = true) {
      this.cherrInstance.insert(content, isSelect, anchor, focus)
    },
    // 判断编辑器是否已经初始化
    isInit () {
      if (this.cherrInstance) {
        return true
      }
      this.$message.warning('编辑器未初始化，请检查')
      return false
    }
  }
}
</script>
