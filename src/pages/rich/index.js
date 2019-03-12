import React from 'react';
import {Button, Card, Modal} from 'antd';
import {EditorState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {Editor} from 'react-draft-wysiwyg';

export default class RichText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    return (
        <div>
          <Card style={{marginBottom: 10}}>
            <Button type="primary" onClick={this.handleClearContent} style={{marginRight:10}}>清空内容</Button>
            <Button type="primary" onClick={this.handleGetText}>获取HTML文本</Button>
          </Card>
          <Card title="富文本编辑器">
            <Editor
                editorState={this.state.editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
            />
          </Card>
        </div>
    )
  }
}