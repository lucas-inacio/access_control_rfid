import React, { Component } from 'react';
import {
    Route,
    NavLink,
    BrowserRouter
} from 'react-router-dom';

import Home from './Home';
import Approved from './Approved';
import Pending from './Pending';

import './App.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter className="App">
                <div className="App">
                    <h1>Controle de Acesso</h1>
                    <ul className="header">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/approved">Autorizados</NavLink></li>
                        <li><NavLink to="/pending">Pendentes</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/approved" component={Approved}/>
                        <Route path="/pending" component={Pending}/>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;