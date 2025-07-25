# Ticket Management App

This Ticket Management App is a lightweight tool designed to showcase key front-end and back-end integration skills, focusing on core CRUD operations, asynchronous state management, and UX considerations under artificial network delays. It demonstrates state handling with Redux Toolkit and user-friendly features like filtering and assignment workflows.

---

## I. Live Demo

- **Frontend:** https://ticket-system-ldh.web.app/  
  (Deployed via Firebase Hosting)  
- **Backend:** Deployed on Heroku

<img src="./docs/UI.png" alt="UI" style="width: 323px" />

---

## II. Setup & Running Locally

1. Clone the repo and install dependencies:  
   `yarn install`

2. Start the development server (frontend + backend via Nx monorepo):  
   `yarn start`

3. Access the app at `http://localhost:3333`

> Note: Ensure `.env` is configured for API URLs and keys. 

---

## III. System Requirements (SRS)

**Objective:** 
Build a minimal ticket management app, focusing on add, filter, assign, and complete workflows, and deliberate handling of an artificial API delay.

### Core Features

- **Add tickets:** Create new tickets with description.  
- **Filter tickets:** By status (open, completed).  
- **Assign tickets:** Assign to a user.  
- **Complete tickets:** Mark as completed or revert.  

### Screens

- **List Screen** (`/tickets`)  
- **Details Screen** (`/tickets/:id`)  

### **Tech Stack**

- **Frontend:** React + React Router v6 + Redux Toolkit + Styled Components + Bootstrap 5
- **Backend:** NestJS + TypeScript + Artificial API delay on Heroku
- **Monorepo:** Nx workspace managing both FE + BE
- **Testing:** Jest + React Testing Library

---

## IV. Software Design & Architecture

- [Frontend Source Code](./client/src)  
	- [React Components](./client/src/app/components) 
	- [Redux Slices & Thunks](./client/src/app/slices) 
	
- [Backend Source Code](./server/src)  

### High-Level Architecture

```mermaid
graph TD
  %% Components and routing
  App["App.tsx"]
  Tickets["Tickets.tsx"]
  TicketDetails["TicketDetails.tsx"]
  TicketItem["TicketItem.tsx"]
  AddTicketModal["AddTicketModal.tsx"]

  %% Redux slices & thunks
  Store["Redux Store"]
  TicketsSlice["tickets slice"]
  UsersSlice["users slice"]
  TicketsThunks["tickets thunks"]
  UsersThunks["users thunks"]

  %% Services
  TicketsService["tickets.service.ts"]
  UsersService["users.service.ts"]

  %% Backend API
  BackendAPI["Back End API"]

  %% Routing flow
  App -->|Route /tickets| Tickets
  App -->|Route /tickets/:id| TicketDetails

  %% Tickets component connections
  Tickets --> TicketItem
  Tickets --> AddTicketModal

  %% Redux Store connections
  App --> Store
  Store --> TicketsSlice
  Store --> UsersSlice

  %% Thunks connect slices to services
  TicketsSlice <--> TicketsThunks
  UsersSlice <--> UsersThunks
  TicketsThunks --> TicketsService
  UsersThunks --> UsersService

  %% Services call Backend API
  TicketsService --> BackendAPI
  UsersService --> BackendAPI

  %% Components dispatch thunks & select from slices
  Tickets -- dispatch/load tickets, users --> TicketsThunks
  Tickets -- select tickets, users from slice --> TicketsSlice
  TicketDetails -- dispatch/update ticket --> TicketsThunks
  TicketDetails -- select ticket, users from slice --> TicketsSlice
  TicketDetails -- select users from slice --> UsersSlice
```

- **Frontend:**  
  - React renders the UI components  
  - Redux & Redux Toolkit manage application state  
  - Services handle API communication  
  - Async thunks manage side effects and async flows (e.g., fetching, saving)  
  - For this app, data is simple enough, so no explicit mapper was implemented for serialization/deserialization

```mermaid
flowchart TD
  Start((Start / App Load))
  LoadData[Load tickets & users data]
  ShowList[/Show Ticket List Screen/]
  FilterTickets[Filter tickets by status]
  ClickTicket[Click on a ticket]
  ShowDetails[/Show Ticket Details Screen/]
  EditDetails[Edit assignee or completion status]
  SaveChanges[Save changes - dispatch update thunk]
  SuccessSave[Update successful]
  AddTicket[Click Add Ticket button]
  OpenModal[/Open Add Ticket Modal/]
  InputDesc[Enter ticket description]
  SubmitAdd[Submit new ticket - dispatch create thunk]
  SuccessAdd[Add successful]
  Error[Error Handling - show error]
  BackToList[Back to Ticket List]

  %% Flow
  Start --> LoadData --> ShowList
  ShowList --> FilterTickets
  FilterTickets --> ShowList
  ShowList --> ClickTicket
  ClickTicket --> ShowDetails
  ShowDetails --> EditDetails
  EditDetails --> SaveChanges
  SaveChanges -->|Success| SuccessSave
  SaveChanges -->|Error| Error
  SuccessSave --> BackToList
  Error --> ShowDetails

  ShowList --> AddTicket
  AddTicket --> OpenModal
  OpenModal --> InputDesc
  InputDesc --> SubmitAdd
  SubmitAdd -->|Success| SuccessAdd
  SubmitAdd -->|Error| Error
  SuccessAdd --> BackToList
```

- **Client Routing:** Two main routes using React Router v6:  
  - `/tickets` (list screen)  
  - `/tickets/:id` (details screen)  
- **API Layer:**  
  - REST endpoints for tickets and users, deployed on NestJS backend (Heroku)  

### Race Condition Mitigation

- **Loading flags** (`loadingList`, `loadingDetails`, `saving`) to disable UI during requests.  
- **Stale-request handling:**  “always latest wins” behavior by adding a request-ID guard in the slices

### **Notes**

- .env are included for demo purpose.

---



## V. Test Cases

- ✅ = Implemented
- ⏳ = Not Implemented (Pending)

### 1. Tickets List Screen

| **Test ID** | **Priority** | **Test Scenario**                          | **Test Steps / Actions**                              | **Expected Outcome**                                         | **Status** |
| ----------- | ------------ | ------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| TC-001      | High         | Render all tickets with details            | Render `<Tickets>` with sample tickets                | Ticket descriptions, assignee names, and statuses appear correctly | ✅          |
| TC-002      | High         | Filter tickets by each filter type         | Click on filter buttons ("All", "Open", "Completed")  | Tickets list updates correctly per selected filter           | ⏳          |
| TC-003      | Medium       | Display error message on tickets list      | Render `<Tickets>` with error prop set                | Error message text is displayed                              | ✅          |
| TC-004      | Medium       | Add button opens AddTicketModal            | Click the "Add" button                                | Add Ticket modal opens                                       | ✅          |
| TC-005      | Low          | Disabled Add button when loading or saving | Set `loading` or `isSaving` state, check "Add" button | Button is disabled                                           | ⏳          |

### 2. Add Ticket Modal

| **Test ID** | **Priority** | **Test Scenario**                             | **Test Steps / Actions**                         | **Expected Outcome**                                       | **Status** |
| ----------- | ------------ | --------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- | ---------- |
| TC-006      | High         | Render Add Ticket modal when `isOpen` is true | Render `<AddTicketModal>` with `isOpen=true`     | Modal dialog with title “Add New Ticket” is shown          | ✅          |
| TC-007      | High         | Submit button disabled if empty description   | Render modal with empty description              | Submit button disabled                                     | ✅          |
| TC-008      | Medium       | Do not render Add Ticket modal when closed    | Render `<AddTicketModal>` with `isOpen=false`    | Modal is not present in the DOM                            | ✅          |
| TC-009      | Medium       | Close Add Ticket modal on close button click  | Click the modal’s close button                   | `onClose` handler is called                                | ✅          |
| TC-010      | Medium       | Cancel button triggers onClose                | Click "Cancel" button                            | onClose handler called                                     | ✅          |
| TC-011      | Medium       | Limits description input length               | Enter text longer than 100 characters            | Input truncated at 100 chars                               | ⏳          |
| TC-012      | Low          | Escape key closes modal if not saving         | Press Escape key while modal open and not saving | Modal closes                                               | ⏳          |
| TC-013      | Low          | Submitting AddTicketModal triggers submit     | Fill description, submit form                    | Dispatch createTicketThunk called, modal closes on success | ⏳          |



### 3. Ticket Details Screen

| **Test ID** | **Priority** | **Test Scenario**                     | **Test Steps / Actions**                                 | **Expected Outcome**                                         | **Status** |
| ----------- | ------------ | ------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| TC-014      | High         | Load ticket data and show form fields | Navigate to ticket details page with valid ticket ID     | Form shows ticket description, assignee dropdown, completed checkbox | ⏳          |
| TC-015      | Medium       | Show loading, error, empty states     | Simulate loading, API error, and no ticket found states  | Loading spinner, error alert, or empty view rendered accordingly | ⏳          |
| TC-016      | High         | Save updates dispatch correct thunks  | Change assignee and/or completion status, click "Update" | Correct assign/unassign and complete/incomplete thunks are dispatched | ⏳          |



### Tests Screenshots

![test-1](./docs/test-1.png)

![test-2](./docs/test-2.png)

## VI. Future Work

To enhance this app, I would focus on these technical improvements:

- **Progressive Web App (PWA) support:**  
  Enable installation and offline capabilities for a native app-like experience. 

- **State Persistence:**  
  Integrate `redux-persist` to cache Redux state in local storage, improving load times and offline usability.
