import React, { Component } from 'react';
import TagRecord from "./TagRecord";

class Pending extends Component {
    constructor(props) {
        super(props);
        this.state = { pendingList : [] };

        fetch('/pending', { method: 'POST' })
            .then(response => {
                return response.text();
            })
            .then(response => {
                let tmp = response.split('\n');
                this.setState({ pendingList: tmp });
            });
    }

    render() {
        let records = [];
        for (let record of this.state.pendingList) {
            if (record) records.push(<TagRecord record={ record } />);
        }
        return (
            <ul>
                { records }
            </ul>
        );
    }
}

export default Pending;