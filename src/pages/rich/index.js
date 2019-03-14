import React from 'react';
import {Button, Card, Modal} from 'antd';
import {EditorState} from 'draft-js';
import draftjs from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {Editor} from 'react-draft-wysiwyg';

export default class RichText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      showRichText: false
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onEditorChange = (contentState) => {
    this.setState({
      contentState
    })
  }

  handleClearContent = () => {
    this.setState({
      editorState: ''
    });
  }

  handleGetText = () => {
    this.setState({
      showRichText: true
    })
  }

  render() {
    return (
        <div>
          <Card style={{marginBottom: 10}}>
            <Button type="primary" onClick={this.handleClearContent} style={{marginRight: 10}}>清空内容</Button>
            <Button type="primary" onClick={this.handleGetText}>获取HTML文本</Button>
          </Card>
          <Card title="富文本编辑器">
            <Editor
                editorState={this.state.editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onContentStateChange={this.onEditorChange}
                onEditorStateChange={this.onEditorStateChange}
            />
          </Card>
          <Modal
              title="富文本"
              visible={this.state.showRichText}
              onCancel={() => {
                this.setState({
                  showRichText: false
                })
              }}
              footer={null}
          >
            {draftjs(this.state.contentState)}
          </Modal>
        </div>
    )
  }
}