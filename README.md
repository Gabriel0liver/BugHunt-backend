# BugHunt

## Description

BugHunt is a website where hackers and startup developers can easilly communicate.

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

-  **Signup:** As an anon I can sign up in the platform so I start using the website.

-  **Login:** As a user I can login to the platform so that I can use the website.

-  **Logout:** As a user I can logout from the platform so no one else can use my account.

-  **Create report** As a hacker I can create reports to inform developers of buggs in their apps.

-  **View list of created reports** As a hacker I can see a list of my created reports.

-  **View a repot** As a user a can view an open report.

-  **Edit report** As a hacker I can edit one of my opened reports to correct any mistake I have made.

-  **Remove report** As a hacker I can remove an open report I have made in case I regret posting the report.

-  **Close report** As a developer I can close a report once the bug has been fixed.

-  **Reject report** As a developer I ca reject a report if I belive the report is mistaken.

## Backlog

- **More detailed report lists**

- **Add comment to closed and rejected reports**

- **More complete profiles**

- **Add chat**

- **Leaderboards**

- **Forum for closed reports**


# Client

## Routes

- `/`

  - HomePageComponent

  - public

  - link to list of open reports if dev
  
  - link to my reports and create report if hacker

- `/auth/signup-hacker`

  - SignupPageComponent

  - anon only

  - signup form, link to login

  - navigate to homepage after signup
  
- `/auth/signup-dev`

  - SignupPageComponent

  - anon only

  - signup form, link to login

  - navigate to homepage after signup

- `/auth/login`

  - LoginPageComponent

  - anon only

  - login form, link to signups

  - navigate to homepage after login

- `/my-reports` 

  - MyReportsListPageComponent

  - hacker only

  - shows created reports and links to each report

- `/report/create` 

  - ReportCreatePageComponent

  - hacker only

  - creates a new open report

  - navigates to my reports

  - is developer dosen't exist send flash.

- `/report/:id` 

  - ReportComponent 

  - user only

  - links to edit and remove if owner
  
  - links to close and reject if destined dev
  
  - `/report/edit` 

  - EditReportComponent 

  - owner only

  - can edit if owner

- `**`

  - NotFoundPageComponent

## Components

- Login:

  - userFormComponent(title: string, button: string, onSubmit: function)

- Sign up:

  - userFormComponent(title: string, button: string, onSubmit: function)

- Report list:

  - reportListComponent (list: array)

- Report:

  - reportComponent (title: string, button: string, onSubmit: function)
  
- CreateReport:

  - createReportComponent (title: string, button: string, onSubmit: function)
  
- EditReport:

  - editReportComponent (title: string, button: string, onSubmit: function)

## Services

- Auth Service

  - auth.login(user)

  - auth.signup(user)

  - auth.logout()

  - auth.me()

  - auth.getUser() // synchronous

- Report Service

  - report.list()
.local
.local
.local
  - report.detail(idReport)

  - report.create({user})
  
  - report.edit({user})
  
  - report.delete({user})
  
  - report.aprove({user})


# Server

## Models

User model

```

username - String // required

password - String // required

type - String // required

```

Report model

```

title - String // required

description - String // required

hacker - ObjectId(User) // required

developer - ObjectId(User) // required

```

## API Endpoints (backend routes)

- GET /auth/me

  - 404 if no user in session

  - 200 with user object

- POST /auth/signup

  - 401 if user logged in

  - body:

    - username

    - password

  - validation

    - fields not empty (422)

    - user not exists (409)

  - create user with encrypted password

  - store user in session

  - 200 with user object

- POST /auth/login

  - 401 if user logged in

  - body:

    - username

    - password

  - validation

    - fields not empty (422)

    - user exists (404)

    - passdword matches (404)

  - store user in session

  - 200 with user object

- POST /auth/logout

  - body: (empty)

  - 204

- POST /reports

  - body:

    - title
    
    - description
    
    - hacker Id
    
    - dev Id

  - validation

    - id is valid (404)

    - id exists (404)

  - updates user in session

- DELETE /reports/:id

  - validation

    - id is valid (404)

    - id exists (404)

  - body: (empty - the user is already stored in the session)

  - remove from db

- GET /reports/:id

  - validation

    - id is valid (404)

    - id exists (404)

  - body: (empty - the user is already stored in the session)

  - get report

- GET /reports

  - get reports from user
  
  - body: 
  
    - userId
    
- PUT /reports/:id

  - validation

    - id is valid (404)

    - id exists (404)

  - body:
    - title
    - description
    - dev id

  - updates report

## Links

### Git

The url to your repository and to your deployed project

https://github.com/

https://github.com/

[Deploy Link](https://.firebaseapp.com)

### Slides

The url to your presentation slides

[Slides Link](https://)
