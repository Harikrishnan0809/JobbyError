import './index.css'
import {withRouter, Link} from 'react-router-dom'
import Header from '../Header'

const Home = props => {
  const onFindJob = () => {
    const {history} = props
    history.push('/jobs')
  }
  return (
    <div className="home-bg-container">
      <Header />
      <div>
        <div className="home-content-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-para">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="link">
            <button
              onClick={onFindJob}
              type="button"
              className="find-job-button"
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Home)
