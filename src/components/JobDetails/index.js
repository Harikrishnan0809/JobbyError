import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {RiExternalLinkLine} from 'react-icons/ri'
import Header from '../Header'

const constantStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {jobItemDetails: {}, status: constantStatus.loading}

  componentDidMount = () => {
    this.getJobItemDetails()
  }

  convertData = data => ({
    jobDetails: {
      companyLogoUrl: data.job_details.company_logo_url,
      companyWebsiteUrl: data.job_details.company_website_url,
      employmentType: data.job_details.employment_type,
      id: data.job_details.id,
      jobDescription: data.job_details.job_description,
      lifeAtCompany: {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      },
      location: data.job_details.location,
      packagePerAnnum: data.job_details.package_per_annum,
      rating: data.job_details.rating,
      skills: data.job_details.skills,
      title: data.job_details.title,
    },
    similarJobs: data.similar_jobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    })),
  })

  getJobItemDetails = async () => {
    this.setState({status: constantStatus.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.convertData(data)
      this.setState({
        jobItemDetails: updatedData,
        status: constantStatus.success,
      })
    } else {
      this.setState({
        status: constantStatus.failure,
      })
      console.log('error')
    }
  }

  loaderView = () => (
    <div className="loader-job-item-details" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="80" width="80" />
    </div>
  )

  successView = () => {
    const {jobItemDetails} = this.state
    const {jobDetails, similarJobs} = jobItemDetails
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      companyWebsiteUrl,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <div className="success-container">
          <div className="detail-logo-and-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job details company logo"
            />
            <div className="heading-and-rating-container">
              <h1 className="job-item-detail-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="lpa-loc-type-container">
            <div className="loc-employee-type-container">
              <MdLocationOn className="location-icon" />
              <p className="location-name">{location}</p>
              <MdWork className="location-icon icon" />
              <p className="location-name">{employmentType}</p>
            </div>
            <div>
              <p className="job-item-detail-title">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr-line" />

          <div className="dec-visit-container">
            <h1 className="des-heading">Description</h1>
            <a className="visit" href={companyWebsiteUrl}>
              Visit <RiExternalLinkLine />
            </a>
          </div>
          <p className="des-para">{jobDescription}</p>
          <h1 className="des-heading">Skills</h1>
          <ul className="ul-job-detail-item">
            {skills.map(eachItem => (
              <li className="logo-and-name-list-container" key={eachItem.name}>
                <img
                  src={eachItem.image_url}
                  alt={eachItem.name}
                  className="company-logo-details"
                />
                <p className="company-name">{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="des-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="des-para life-para">{description}</p>
            <img className="life-image" src={imageUrl} alt="life at company" />
          </div>
        </div>

        <div className="similar-container">
          <h1 className="des-heading">Similar Jobs</h1>
          <ul className="ul-for-similar-list">
            {similarJobs.map(each => (
              <li key={each.id} className="similar-list-container">
                <div>
                  <div className="detail-logo-and-title-container">
                    <img
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                      className="company-logo-details"
                    />
                    <div className="heading-and-rating-container">
                      <h1 className="job-item-detail-title">{each.title}</h1>
                      <div className="rating-container">
                        <AiFillStar className="star-icon" />
                        <p className="rating">{each.rating}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="des-heading">Description</h1>
                <p className="location-name">{each.jobDescription}</p>
                <div className="loc-employee-type-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location-name">{each.location}</p>
                  <MdWork className="location-icon icon" />
                  <p className="location-name">{each.employmentType}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  onClickRetryButton = () => {
    this.getJobItemDetails()
  }

  failureView = () => (
    <div className="fail-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="fail-heading">Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        onClick={this.onClickRetryButton}
        type="button"
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  switchJobItemDetails = () => {
    const {status} = this.state
    switch (status) {
      case constantStatus.loading:
        return this.loaderView()
      case constantStatus.success:
        return this.successView()
      case constantStatus.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="details-bg-container">
          {this.switchJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobDetails
