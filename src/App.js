import React, { Component, lazy, Suspense } from 'react';
import {
    BrowserRouter,
    NavLink,
    Route,
    Switch
} from 'react-router-dom';

import { Collapse, Nav, Navbar, NavbarBrand, NavItem, NavbarToggler } from 'reactstrap';


const Home = lazy(() => import('./Home'));
const Approved = lazy(() => import('./Approved'));
const Pending = lazy(() => import('./Pending'));

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
                        <Suspense fallback={<div>Carregando...</div>}>
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/approved" component={Approved}/>
                                <Route path="/pending" component={Pending}/>
                            </Switch>
                        </Suspense>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;