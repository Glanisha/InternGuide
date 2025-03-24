
# Internship Showcase and Tracking Platform

## Introduction
The **Internship Showcase and Tracking Platform** is a web-based system designed to showcase internship statistics across various departments, track faculty mentor assignments, and monitor internship progress for students. The platform provides transparency and allows all stakeholders, including students, faculty, management, and employers, to visualize internship data and assess its alignment with academic and sustainability goals.

## Features
### 1. Viewers (Public, Employers, Prospective Interns)
- View department-wise internship statistics.
- Explore available internships and their alignment with Sustainable Development Goals (SDGs), Program Outcomes (POs), and Program Educational Objectives (PEOs).
- Filter internships by department, SDG, PO/PEO mapping, or industry sector.
- Contact internship providers for collaboration or networking.

### 2. Students (Internship Seekers)
- Browse and apply for internships.
- Track application status and deadlines.
- View assigned faculty mentor details.
- Monitor internship progress with tasks, deadlines, and learning outcomes.
- Receive feedback from mentors and industry supervisors.
- Generate reports on personal skill development and SDG contributions.

### 3. Faculty Coordinators (Mentors, Course Instructors)
- Assign faculty mentors to students.
- Monitor internship progress and track milestones.
- Evaluate student performance based on industry and academic criteria.
- Collaborate with industry supervisors to assess student progress.
- Generate reports on internship success rates and SDG alignment.

### 4. Admins (System Moderators, Platform Administrators)
- Manage internship listings (approve, edit, remove).
- Assign roles to students, faculty, and industry mentors.
- Monitor department-wise internship data and student participation rates.
- Send notifications and alerts for deadlines and mentor assignments.
- Generate detailed reports on student performance and SDG contributions.

### 5. Management (Institutional Coordinators, University Officials)
- View institution-wide internship statistics.
- Track SDG contribution of internships.
- Evaluate program success based on student performance and industry collaboration.
- Generate department-level analytics and insights.

## Key Functional Requirements
- **Internship Listing & Management**: Admins and faculty can manage internship postings.
- **SDG, PO, and PEO Mapping**: Ensure internships align with academic and sustainability goals.
- **Internship Progress Tracking**: Students can track progress and milestones.
- **Mentorship Assignment & Communication**: Faculty mentors can guide students.
- **Feedback & Evaluation**: Regular performance feedback from faculty and industry supervisors.
- **Reports & Analytics**: Comprehensive reports on student performance and internship success.
- **User Authentication & Role-Based Access**: Secure login with appropriate role-based permissions.

## Technology Stack
### Frontend
- **React.js / Next.js** (for a dynamic and responsive UI)
### Backend
- **Node.js with Express.js** (for API development)
### Database
- **MongoDB** (for flexible and scalable data storage)


## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- npm 

### Backend Setup
```sh
cd server
npm install
npm start
```

### Frontend Setup
```sh
cd client
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in both `server` and `client` directories and configure the required environment variables.


