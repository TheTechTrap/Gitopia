// from react-monaco-editor
import * as monaco from "monaco-editor"
import React from "react"

function noop() {
  return
}

export default class MonacoEditor extends React.Component<any, any> {
  static defaultProps = {
    width: "100%",
    height: "100%",
    value: null,
    initialValue: "",
    language: "javascript",
    theme: null,
    options: {},
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop
  }

  editor: any

  containerElement: any
  // tslint:disable-next-line:variable-name
  __current_value: any
  // tslint:disable-next-line:variable-name
  __prevent_trigger_change_event: any
  _onResize: any = null

  constructor(props: any) {
    super(props)
    this.containerElement = undefined
    this.__current_value = props.value
  }

  componentDidMount() {
    this.initMonaco()
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.value !== this.__current_value) {
      // Always refer to the latest value
      this.__current_value = this.props.value
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true
        this.editor.setValue(this.__current_value)
        this.__prevent_trigger_change_event = false
      }
    }
    if (prevProps.language !== this.props.language) {
      monaco.editor.setModelLanguage(
        this.editor.getModel(),
        this.props.language
      )
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme)
    }
    if (
      this.editor &&
      (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height)
    ) {
      this.editor.layout()
    }
  }

  componentWillUnmount() {
    this.destroyMonaco()
  }

  editorWillMount() {
    const { editorWillMount } = this.props
    editorWillMount(monaco)
    window.removeEventListener("resize", this._onResize)
  }

  editorDidMount(editor: any) {
    this.props.editorDidMount(editor, monaco)
    editor.onDidChangeModelContent((event: any) => {
      const value = editor.getValue()

      // Always refer to the latest value
      this.__current_value = value

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(value, event)
      }
    })

    this._onResize = (ev: any) => {
      editor.layout()
    }
    // window
    window.addEventListener("resize", this._onResize)
  }

  initMonaco() {
    const value =
      this.props.value !== null ? this.props.value : this.props.defaultValue
    const { language, theme, options } = this.props
    if (this.containerElement) {
      // Before initializing monaco editor
      this.editorWillMount()
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language,
        ...options
      })
      if (theme) {
        monaco.editor.setTheme(theme)
      }
      // After initializing monaco editor
      this.editorDidMount(this.editor)
    }
  }

  destroyMonaco() {
    if (typeof this.editor !== "undefined") {
      this.editor.dispose()
    }
  }

  assignRef = (component: any) => {
    this.containerElement = component
  }

  render() {
    const { width, height } = this.props
    const fixedWidth =
      width.toString().indexOf("%") !== -1 ? width : `${width}px`
    const fixedHeight =
      height.toString().indexOf("%") !== -1 ? height : `${height}px`
    const style = {
      width: fixedWidth,
      height: fixedHeight
    }

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    )
  }
}
