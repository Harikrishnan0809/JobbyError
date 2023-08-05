import './index.css'
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItems from '../JobItems'

const constantProfile = {
  success: 'SUCCESS',
  loading: 'LOADING',
  retry: 'RETRY',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileStatus: constantProfile.loading,
    checkBoxInput: [],
    salary: '',
    jobDetails: [],
    searchInput: '',
    jobStatus: constantProfile.loading,
  }

  componentDidMount = () => {
    this.getProfile()
    this.getJobDetails()
  }

  getProfile = async () => {
    this.setState({profileStatus: constantProfile.loading})
    const url = 'https://apis.ccbp.in/profile'
    const CookiesToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${CookiesToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response.ok)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileStatus: constantProfile.success,
      })
      console.log('correct')
    } else {
      this.setState({profileStatus: constantProfile.retry})
    }
  }

  profileSuccessView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  loaderView = () => (
    <div className="view-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.getProfile()
  }

  retryView = () => (
    <div className="view-container">
      <button onClick={this.onRetry} className="retry-button" type="button">
        Retry
      </button>
    </div>
  )

  onCheckBoxInput = event => {
    const {checkBoxInput} = this.state
    const input = checkBoxInput.filter(eachItem => eachItem === event.target.id)
    if (input.length === 0) {
      this.setState(
        preVal => ({
          checkBoxInput: [...preVal.checkBoxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredList = checkBoxInput.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkBoxInput: [...filteredList]}, this.getJobDetails)
    }
  }

  switchProfileContent = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case constantProfile.loading:
        return this.loaderView()
      case constantProfile.success:
        return this.profileSuccessView()
      case constantProfile.retry:
        return this.retryView()
      default:
        return null
    }
  }

  onChangeRadio = event => {
    this.setState({salary: event.target.id}, this.getJobDetails)
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  getJobDetails = async () => {
    this.setState({jobStatus: constantProfile.loading})
    const {checkBoxInput, salary, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInput}&minimum_package=${salary}&search=${searchInput}`
    const token = Cookies.get('jwt_token')
    const options = {method: 'GET', headers: {Authorization: `Bearer ${token}`}}
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobDetails: updatedData,
        jobStatus: constantProfile.success,
      })
    } else {
      this.setState({jobStatus: constantProfile.retry})
    }
  }

  onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  desktopInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container desktop-input">
        <input
          value={searchInput}
          onChange={this.onChangeSearch}
          className="search-input"
          type="search"
          placeholder="Search"
          onKeyDown={this.onKeyDownSearch}
        />
        <button
          className="search-button"
          type="button"
          data-testid="searchButton"
          onClick={this.onClickSearchButton}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  successJobDetailsView = () => {
    const {jobDetails} = this.state
    if (jobDetails.length === 0) {
      return (
        <>
          {this.desktopInput()}
          {this.noJobsFoundView()}
        </>
      )
    }
    return (
      <>
        <ul className="ul-job-details">
          {this.desktopInput()}
          {jobDetails.map(each => (
            <JobItems key={each.id} details={each} />
          ))}
        </ul>
      </>
    )
  }

  onClickSearchButton = () => {
    this.getJobDetails()
  }

  retryJobButton = () => {
    this.getJobDetails()
  }

  noJobsFoundView = () => (
    <div className="no-jobs-view-container">
      {this.desktopInput()}
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-job-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-job-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  jobFailureView = () => (
    <>
      {this.desktopInput()}
      <div className="job-failure-container">
        <img
          className="failure-image"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="no-job-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          onClick={this.retryJobButton}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    </>
  )

  jobLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="70" width="70" />
    </div>
  )

  switchJobDetails = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case constantProfile.success:
        return this.successJobDetailsView()
      case constantProfile.loading:
        return this.jobLoaderView()
      case constantProfile.retry:
        return this.jobFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="over-all-container">
          <div className="job-content-container">
            <div className="search-input-container mobile-input">
              <input
                value={searchInput}
                onChange={this.onChangeSearch}
                className="search-input"
                type="search"
                placeholder="Search"
                onKeyDown={this.onKeyDownSearch}
              />
              <button
                className="search-button"
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.switchProfileContent()}
            <hr className="hr-line" />
            <ul className="un-order-list-params">
              <h1 className="side-heading">Type of Employment</h1>
              {employmentTypesList.map(eachItem => (
                <li className="check-list" key={eachItem.employmentTypeId}>
                  <input
                    id={eachItem.employmentTypeId}
                    className="checkbox"
                    type="checkbox"
                    onChange={this.onCheckBoxInput}
                  />
                  <label
                    className="check-label"
                    htmlFor={eachItem.employmentTypeId}
                  >
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="hr-line" />
            <ul className="un-order-list-params">
              <h1 className="side-heading">Salary Range</h1>
              {salaryRangesList.map(eachItem => (
                <li key={eachItem.salaryRangeId} className="check-list">
                  <input
                    id={eachItem.salaryRangeId}
                    type="radio"
                    name="radio"
                    onChange={this.onChangeRadio}
                  />
                  <label
                    className="check-label"
                    htmlFor={eachItem.salaryRangeId}
                  >
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {this.switchJobDetails()}
        </div>
      </div>
    )
  }
}

export default Jobs
