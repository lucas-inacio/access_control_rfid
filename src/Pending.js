import React, { Component } from 'react';
import { Col } from 'reactstrap';
import TagRecord from "./TagRecord";

class Pending extends Component {
    constructor(props) {
        super(props);
        this.state = { pendingList : [] };

        this.updateList();
        setInterval(() => this.updateList(), 10000);
    }

    updateList() {
        fetch('/pending', { method: 'POST' })
            .then(response => response.text())
            .then(response => {
                let tmp = response.split('\n');
                this.setState({ pendingList: tmp.filter(value => value.length > 0) });
            });
    }

    render() {
        return (
            <Col>
                {
                    (this.state.pendingList.length > 0) ?
                        this.state.pendingList.map((item, i) => {
                            if (item)
                            return <TagRecord key={item} record={item} updateList={() => this.updateList()}/>
                            else return null;
                        }) : <h2>Sem cartões pendentes</h2>
                }
            </Col>
        );
    }
}

export default Pending;