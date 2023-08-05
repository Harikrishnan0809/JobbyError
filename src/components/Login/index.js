import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', message: ''}

  onUsername = event => {
    this.setState({username: event.target.value})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    console.log(jwtToken)
    Cookies.set('jwt_token', jwtToken, {expires: 5})
    history.replace('/')
  }

  getJWTToken = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const url = 'https://apis.ccbp.in/login'
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.setState({message: data.error_msg})
    }
  }

  render() {
    const {username, password, message} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.getJWTToken}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="job-logo"
          />
          <div className="input-container">
            <label className="label-name" htmlFor="username">
              USERNAME
            </label>
            <input
              onChange={this.onUsername}
              value={username}
              className="input"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>

          <div className="input-container">
            <label className="label-name" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="input"
              id="password"
              type="password"
              placeholder="Password"
              onChange={this.onPassword}
              value={password}
            />
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">
              Login
            </button>
            <p className="error-message">{message}</p>
          </div>
        </form>
      </div>
    )
  }
}

export default Login
