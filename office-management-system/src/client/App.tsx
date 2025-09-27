import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Employees from './components/employees';
import Calendar from './components/calendar';
import Documents from './components/documents';
import './styles/main.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/employees" component={Employees} />
                    <Route path="/calendar" component={Calendar} />
                    <Route path="/documents" component={Documents} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;