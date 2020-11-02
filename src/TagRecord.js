import React, { Component } from 'react';

class TagRecord extends Component {
    constructor(props) {
        super(props);

        this.state = {
            record: '',
            code: '',
            owner: ''
        }

        this.rerenderTarget = props.rerenderTarget;

        if (props.record.indexOf(',') >= 0) {
            let tmp = props.record.split(',');
            this.state.code = tmp[0];
            this.state.owner = tmp[1];
        } else {
            this.state.code = props.record;
        }

        this.state.record = props.record;
    }

    onApprove() {
        let msg = this.state.code.substring(0);
        msg += ',' + document.getElementById(this.state.code).value;
        fetch('/addTag', { method: 'POST', body: msg })
            .then(response => response.text())
            .then(response => {
                document.location.reload();
            });
    }

    onRemove() {
        let targetURL = (!this.state.owner) ? '/removePending' : '/removeTag';
        fetch(targetURL, { method: 'POST', body: this.state.code })
            .then(response => response.text())
            .then(response => {
                document.location.reload();
            });
    }

    render() {
        return (
            <li>
                <div className="record">
                    <label>{ this.state.record }</label>
                    { (!this.state.owner) ? <button onClick={ () => this.onApprove() }>Autorizar</button> : null }
                    <button onClick={ () => this.onRemove() }>Remover</button>
                    { (!this.state.owner) ? <input type="text" id={ this.state.code } /> : null }
                </div>
            </li>
        );
    }
}

export default TagRecord;