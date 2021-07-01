import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import Sidebar from './components/Sidebar'

import Schedulings from './pages/Schedulings'
import Customer from './pages/Customer'
import Employees from './pages/Employees'


const Routes = () => {
    return (
        <div>
            <Header />
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <Router>
                        <Sidebar />
                        <Switch>
                            <Route path="/" exact component={Schedulings} />
                            <Route path="/customer" exact component={Customer} />
                            <Route path="/employees" exact component={Employees} />
                        </Switch>
                    </Router>
                </div>
            </div>
        </div>
    )
}

export default Routes;