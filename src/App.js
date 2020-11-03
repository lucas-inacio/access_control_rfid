import React, { Component } from 'react';
import {
    Route,
    NavLink,
    BrowserRouter
} from 'react-router-dom';

import { Collapse, Nav, Navbar, NavbarBrand, NavItem, NavbarToggler } from 'reactstrap';


import Home from './Home';
import Approved from './Approved';
import Pending from './Pending';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: true };
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <h1>Controle de Acesso</h1>
                    <Navbar className="header" color="light" light expand="md">
                        <NavbarBrand>Menu</NavbarBrand>
                        <NavbarToggler onClick={() => this.toggle()} className="mr-2" />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem><NavLink to="/">Home</NavLink></NavItem>
                                <NavItem><NavLink to="/approved">Autorizados</NavLink></NavItem>
                                <NavItem><NavLink to="/pending">Pendentes</NavLink></NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                    <div id="content">
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