import React from 'react'
import ViewMentorAndMenteeList from './ViewMentorAndMenteeList'
import ManagementReviews from "./ManagementReviews"
import Management from '../../../../backend/models/management.model'
import MentorshipProgrammeStats from './MentorshipProgrammeStats'

const MentorshipPage = () => {
  return (
    <div>
      
      <ViewMentorAndMenteeList/>
      <MentorshipProgrammeStats/>
      <ManagementReviews/>
    </div>
  )
}

export default MentorshipPage
