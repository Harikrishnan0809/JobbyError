import './index.css'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'

const JobItems = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = details
  return (
    <li className="job-details-list-container">
      <Link className="link" to={`/jobs/${id}`}>
        <div className="logo-and-title-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="job details company logo"
          />
          <div className="title-and-rating-container">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="rating-star" />
              <p className="rating-num">{rating}</p>
            </div>
          </div>
        </div>

        <div className="job-location-and-employee-type-container">
          <div className="job-location-container">
            <MdLocationOn className="location-icons" />
            <p className="location-name">{location}</p>
            <MdWork className="location-icons employee-type-container" />
            <p className="location-name">{employmentType}</p>
          </div>

          <p className="job-title">{packagePerAnnum}</p>
        </div>
        <hr className="hr-line-job" />
        <h1 className="desc-heading">Description</h1>
        <p className="location-name">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItems
