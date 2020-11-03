import React, { Component } from 'react';
import { Col } from 'reactstrap';
import TagRecord from "./TagRecord";

class Approved extends Component {
    constructor(props) {
        super(props);
        this.state = { approvedList : [] };

        this.updateList();
    }

    updateList() {
        fetch('/approved', { method: 'POST' })
            .then(response => response.text())
            .then(response => {
                let tmp = response.split('\n');
                this.setState({ approvedList: tmp.filter(value => value.length > 0) });
            });
    }

    render() {        
        return (
            <Col>
                {
                    (this.state.approvedList.length > 0) ?
                        this.state.approvedList.map((item, i) => {
                            if (item)
                                return <TagRecord key={item} record={item} updateList={() => this.updateList()} />
                            else return null;
                        }) : <h2>Nenhum cartão registrado</h2>
                }
            </Col>
        );
    }
}

export default Approved;