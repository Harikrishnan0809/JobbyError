import './index.css'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {MdWork} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

const Header = props => {
  const onLogOut = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <div className="header-mobile-view">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-logo"
          />
        </Link>

        <ul className="nav-un-ordered-list">
          <li>
            <Link to="/">
              <AiFillHome className="nav-icons" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <MdWork className="nav-icons" />
            </Link>
          </li>
          <li>
            <button
              onClick={onLogOut}
              className="nav-icon-button"
              type="button"
            >
              <FiLogOut className="nav-icons" />
            </button>
          </li>
        </ul>
      </div>

      <div className="header-desktop-view">
        <ul className="nav-ul-list-desktop">
          <li>
            <Link to="/">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="nav-logo"
              />
            </Link>
          </li>
          <li className="text-list-items">
            <Link className="link" to="/">
              <h1 className="nav-heading">Home</h1>
            </Link>
            <Link className="link" to="/jobs">
              <h1 className="nav-heading">Jobs</h1>
            </Link>
          </li>
          <li>
            <button onClick={onLogOut} type="button" className="log-out-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
