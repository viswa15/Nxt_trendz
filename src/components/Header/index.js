import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <div className="header-items desktop">
        <ul className="header-routes-con">
          <Link to="/" className="header-link-item">
            <li className="header-route">Home</li>
          </Link>
          <Link to="/jobs" className="header-link-item">
            <li className="header-route">Jobs</li>
          </Link>
        </ul>
        <button
          className="header-logout-btn"
          type="button"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
      <div className="header-icons mobile">
        <Link to="/">
          <li className="header-route">
            <IoMdHome className="header-route" />
          </li>
        </Link>
        <Link to="/jobs">
          <li className="header-route">
            <BsFillBriefcaseFill className="header-route" />
          </li>
        </Link>
        <li className="header-route" onClick={onClickLogout}>
          <FiLogOut />
        </li>
      </div>
    </div>
  )
}

export default withRouter(Header)
