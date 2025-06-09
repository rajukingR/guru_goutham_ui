import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import UserForm from './components/UserForm';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/user" component={UserForm} />
      </Switch>
    </Router>
  );
};

export default App;