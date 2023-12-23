import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {similarJobsDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsDetails

  return (
    <li className="similar-job-item">
      <div className="similar-job-details-con">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-company-image"
        />
        <div>
          <h1 className="similar-job-title">{title}</h1>
          <p className="rating">
            <span>
              <FaStar className="star-icon" />
            </span>
            {rating}
          </p>
        </div>
      </div>
      <h1 className="similar-job-description-heading">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>
      <div className="similar-job-location-con">
        <p className="similar-job-location">
          <MdLocationOn />
          {location}
        </p>
        <p className="similar-job-location">
          <BsFillBriefcaseFill className="similar-location-icon" />
          {employmentType}
        </p>
      </div>
    </li>
  )
}

export default SimilarJobItem
