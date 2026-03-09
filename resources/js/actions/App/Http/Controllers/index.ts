import DashboardController from './DashboardController'
import ProfileController from './ProfileController'
import MeetingController from './MeetingController'
import GoogleCalendarController from './GoogleCalendarController'
import MeetingAgendaController from './MeetingAgendaController'
import MeetingParticipantController from './MeetingParticipantController'
import MeetingMinuteController from './MeetingMinuteController'
import AgreementController from './AgreementController'
import AgreementUpdateController from './AgreementUpdateController'
import AttachmentController from './AttachmentController'
import MinuteExportController from './MinuteExportController'
import SearchController from './SearchController'
import Admin from './Admin'
import Auth from './Auth'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ProfileController: Object.assign(ProfileController, ProfileController),
MeetingController: Object.assign(MeetingController, MeetingController),
GoogleCalendarController: Object.assign(GoogleCalendarController, GoogleCalendarController),
MeetingAgendaController: Object.assign(MeetingAgendaController, MeetingAgendaController),
MeetingParticipantController: Object.assign(MeetingParticipantController, MeetingParticipantController),
MeetingMinuteController: Object.assign(MeetingMinuteController, MeetingMinuteController),
AgreementController: Object.assign(AgreementController, AgreementController),
AgreementUpdateController: Object.assign(AgreementUpdateController, AgreementUpdateController),
AttachmentController: Object.assign(AttachmentController, AttachmentController),
MinuteExportController: Object.assign(MinuteExportController, MinuteExportController),
SearchController: Object.assign(SearchController, SearchController),
Admin: Object.assign(Admin, Admin),
Auth: Object.assign(Auth, Auth),
}

export default Controllers