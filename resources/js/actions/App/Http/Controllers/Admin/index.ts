import DepartmentController from './DepartmentController'
import MeetingTypeController from './MeetingTypeController'
import UserController from './UserController'
import RoleController from './RoleController'
const Admin = {
    DepartmentController: Object.assign(DepartmentController, DepartmentController),
MeetingTypeController: Object.assign(MeetingTypeController, MeetingTypeController),
UserController: Object.assign(UserController, UserController),
RoleController: Object.assign(RoleController, RoleController),
}

export default Admin