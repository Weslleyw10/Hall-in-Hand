import { Link, withRouter } from 'react-router-dom'

import logo from '../../assets/logo.png'
import './styles.css'

const Sidebar = ({ location }) => {
    return (
        <sidebar className="col-2">
            <img src={logo} alt="" title="" className="img-fluid px-3 py-4" />
            <ul className="m-0 p-0">
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        <span className="mdi mdi-calendar-check"></span>
                        <span>Agendamentos</span>
                    </Link>
                </li>
                <li>
                    <Link to="customer" className={location.pathname === '/customer' ? 'active' : ''}>
                        <span className="mdi mdi-account-multiple"></span>
                        <span>Clientes</span>
                    </Link>
                </li>
                <li>
                    <Link to="employees" className={location.pathname === '/employees' ? 'active' : ''}>
                        <span className="mdi mdi-card-account-details-outline"></span>
                        <span>Colaboradores</span>
                    </Link>
                </li>
            </ul>
        </sidebar>

    )
}

export default withRouter(Sidebar)