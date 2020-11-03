import React, { Component } from 'react';
import { Button, Card, CardBody, CardText, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';

class TagRecord extends Component {
    constructor(props) {
        super(props);

        this.state = {
            record: '',
            code: '',
            owner: ''
        }

        this.updateList = props.updateList;

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
        let name = document.getElementById(this.state.code).value;
        if (!name) {
            alert('Escreva um nome para a tag');
            return;
        }
        
        let msg = this.state.code.substring(0);
        msg += ',' + document.getElementById(this.state.code).value;
        fetch('/addTag', { method: 'POST', body: msg })
            .then(response => response.text())
            .then(response => {
                this.updateList();
            });
    }

    onRemove() {
        let targetURL = (!this.state.owner) ? '/removePending' : '/removeTag';
        fetch(targetURL, { method: 'POST', body: this.state.code })
            .then(response => response.text())
            .then(response => {
                this.updateList();
            });
    }

    render() {
        return (
            <Row>
                <Card body className="record">
                    <CardText>{ this.state.record }</CardText>
                    <CardBody>
                        { 
                            (!this.state.owner) ?
                            <InputGroup>
                                <Input id={this.state.code} />
                                <InputGroupAddon addonType="append">
                                    <Button color="success" onClick={ () => this.onApprove() }>Autorizar</Button>
                                    <Button color="danger" onClick={ () => this.onRemove() }>Remover</Button>
                                </InputGroupAddon>
                            </InputGroup> : <Button color="danger" onClick={ () => this.onRemove() }>Remover</Button>
                        }
                    </CardBody>
                </Card>
            </Row>
        );
    }
}

export default TagRecord;