import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-link-item">
      <li className="job-list-item">
        <div className="job-type-con">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <p className="rating">
              <FaStar className="star-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="job-details-con">
          <div className="job-location-employment-con">
            <p className="job-location">
              <MdLocationOn />
              {location}
            </p>
            <p className="job-location">
              <BsFillBriefcaseFill className="location-icon" />
              {employmentType}
            </p>
          </div>
          <p className="salary">{packagePerAnnum}</p>
        </div>
        <hr className="break-line" />
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
