import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaStar} from 'react-icons/fa'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusInfo = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetailApiStatus: apiStatusInfo.initial,
    jobDetailData: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobItemDetailApiStatus: apiStatusInfo.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const similarJobsList = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobItemDetailApiStatus: apiStatusInfo.success,
        jobDetailData: formattedData,
        similarJobs: similarJobsList,
      })
    } else {
      this.setState({
        jobItemDetailApiStatus: apiStatusInfo.failure,
      })
    }
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <div className="similar-jobs-con">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(each => (
            <SimilarJobItem key={each.id} similarJobsDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderSuccess = () => {
    const {jobDetailData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailData
    return (
      <div className="job-item-detail-container">
        <div className="job-list-item">
          <div className="job-type-con">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
                <MdLocationOn className="location-icon" />
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
          <div className="job-description-heading-con">
            <h1 className="description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit-link">
              Visit <BiLinkExternal className="link-icon" />
            </a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="description-heading">Skills</h1>
          <ul className="skills-con">
            {skills.map(each => (
              <li className="skill-list-item" key={each.name}>
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-image"
                />
                <p className="skill-name">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="description-heading">Life at Company</h1>
          <div className="life-at-company-con">
            <p className="description">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailure = () => (
    <div className="no-jobs-found-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderResult = () => {
    const {jobItemDetailApiStatus} = this.state
    switch (jobItemDetailApiStatus) {
      case apiStatusInfo.success:
        return this.renderSuccess()
      case apiStatusInfo.failure:
        return this.renderJobsFailure()
      case apiStatusInfo.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-bg-container">{this.renderResult()}</div>
      </>
    )
  }
}

export default JobItemDetails
