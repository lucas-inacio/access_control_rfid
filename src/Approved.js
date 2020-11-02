import React, { Component } from 'react';
import TagRecord from "./TagRecord";

class Approved extends Component {
    constructor(props) {
        super(props);
        this.state = { approvedList : [] };

        fetch('/approved', { method: 'POST' })
            .then(response => {
                return response.text();
            })
            .then(response => {
                let tmp = response.split('\n');
                this.setState({ approvedList: tmp });
            });
    }

    render() {
        let records = [];
        for (let record of this.state.approvedList) {
            if (record) records.push(<TagRecord record={ record } />);
        }
        return (
            <ul>
                { records }
            </ul>
        );
    }
}

export default Approved;