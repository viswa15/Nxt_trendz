import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Profile from '../Profile'
import JobItem from '../JobItem'

import './index.css'

const apiStatusInfo = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    isActive: false,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    isActive: false,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    isActive: false,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    isActive: false,
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
    isActive: false,
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
    isActive: false,
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
    isActive: false,
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
    isActive: false,
  },
]

class Jobs extends Component {
  state = {
    jobsApiStatus: apiStatusInfo.initial,
    jobsList: [],
    searchInput: '',
    employmentFilteredList: employmentTypesList,
    activeSalaryRange: salaryRangesList,
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusInfo.inProgress})
    const {searchInput, employmentFilteredList, activeSalaryRange} = this.state
    const employmentFilteredTypes = employmentFilteredList.filter(
      // Filtering list with the employment types who is only checked
      each => each.isActive === true,
    )
    const filteredSalaryArray = activeSalaryRange.filter(
      // Filtering list with the salary ranges who is only checked
      each => each.isActive === true,
    )
    const employmentFilterItems = employmentFilteredTypes.map(
      // filtering with only query parameters
      each => each.employmentTypeId,
    )
    const filteredSalaryItems = filteredSalaryArray.map(
      // filtering with only query parameters
      each => each.salaryRangeId,
    )
    const employmentFilter = employmentFilterItems.join(',') // getting query parameters using join function for employment_type
    const salaryFilter = filteredSalaryItems.join(',') // getting query parameter using join() for minimum_package
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=${salaryFilter}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsApiStatus: apiStatusInfo.success,
        jobsList: formattedData,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusInfo.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderJobSuccess = () => {
    const {jobsList} = this.state
    const jobsListLength = jobsList.length > 0

    return jobsListLength ? (
      <ul className="jobs-list-con">
        {jobsList.map(each => (
          <JobItem key={each.id} jobDetails={each} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-found-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

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
      <button className="retry-btn" type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusInfo.success:
        return this.renderJobSuccess()
      case apiStatusInfo.failure:
        return this.renderJobsFailure()
      case apiStatusInfo.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onChangeEmploymentType = event => {
    const {employmentFilteredList} = this.state
    const employmentIndex = employmentFilteredList.findIndex(
      object => object.employmentTypeId === event.target.id,
    )
    const employmentType = employmentFilteredList[employmentIndex]
    employmentType.isActive = !employmentType.isActive
    this.setState({employmentFilteredList}, this.getJobs)
  }

  renderEmploymentTypes = () => {
    const {employmentFilteredList} = this.state
    return (
      <div className="filter-container">
        <h1 className="filter-heading">Type of Employment</h1>
        <ul className="filters-list">
          {employmentFilteredList.map(each => (
            <li className="filter-item" key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                onChange={this.onChangeEmploymentType}
                className="filter-input"
              />
              <label className="filter-label" htmlFor={each.employmentTypeId}>
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  reRenderActiveSalaries = () => {
    const {activeSalaryRange} = this.state
    for (let i = 0; i < activeSalaryRange.length; i += 1) {
      activeSalaryRange[i].isActive = false
    }
    this.setState({activeSalaryRange})
  }

  toggleActiveSalaryRange = event => {
    this.reRenderActiveSalaries()
    const {activeSalaryRange} = this.state
    const salaryId = event.target.id
    const salary = activeSalaryRange.find(
      each => each.salaryRangeId === salaryId,
    )
    salary.isActive = !salary.isActive
    this.setState({activeSalaryRange}, this.getJobs)
  }

  renderSalaryRanges = () => {
    const {activeSalaryRange} = this.state
    return (
      <div className="filter-container">
        <h1 className="filter-heading">Salary Range</h1>
        <ul className="filters-list">
          {activeSalaryRange.map(each => (
            <li className="filter-item" key={each.salaryRangeId}>
              <input
                type="radio"
                id={each.salaryRangeId}
                name="salary-range"
                value={each.label}
                onChange={this.toggleActiveSalaryRange}
              />
              <label className="filter-label" htmlFor={each.salaryRangeId}>
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onClickSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="extra-filters-container">
            <div className="search-container mobile-search">
              <input
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onClickSearchInput}
                type="search"
                placeholder="Search"
                value={searchInput}
              />
              <button type="button" data-testid="searchButton">
                <BsSearch className="search-icon" aria-label="icon" />
              </button>
            </div>
            <Profile />
            <hr className="break-line" />
            {this.renderEmploymentTypes()}
            <hr className="break-line" />
            {this.renderSalaryRanges()}
          </div>
          <div className="job-list-container">
            <div className="search-container desktop-search">
              <input
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.getJobs}
                type="search"
                placeholder="Search"
                value={searchInput}
              />
              <button type="button" data-testid="searchButton">
                <BsSearch className="search-icon" aria-label="icon" />
              </button>
            </div>
            {this.renderJobDetails()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
