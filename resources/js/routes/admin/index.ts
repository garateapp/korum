import departments from './departments'
import meetingTypes from './meeting-types'
import users from './users'
import roles from './roles'
const admin = {
    departments: Object.assign(departments, departments),
meetingTypes: Object.assign(meetingTypes, meetingTypes),
users: Object.assign(users, users),
roles: Object.assign(roles, roles),
}

export default admin