import React from 'react'
import ViewMentorAndMenteeList from './ViewMentorAndMenteeList'
import ManagementReviews from "./ManagementReviews"
import Management from '../../../../backend/models/management.model'

const MentorshipPage = () => {
  return (
    <div>
      <ManagementReviews/>
      <ViewMentorAndMenteeList/>
      
    </div>
  )
}

export default MentorshipPage
