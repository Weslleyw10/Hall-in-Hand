import './styles.css'

const Header = () => {
    return (
        <header className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center">
                <div className="text-right mr-3">
                    <span className="d-block m-0 p-0 text-white">Barbearia The Robs</span>
                    <small className="m-0 p-0">Plano Gold</small>
                </div>
                <img src="https://image.freepik.com/vetores-gratis/logotipo-do-barbeiro_1415-617.jpg" alt="" title="" />
                <span className="mdi mdi-chevron-down"></span>
            </div>
        </header>
    )
}

export default Header