// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSplice'; // Adjust the path as needed
import loginReducer from './slices/loginSplice'
import StaffAddSlice from './slices/staff/staffAddSlice';
import singleFileUpload from './slices/fileupload/singleFileUpload';
import editStaff from './slices/staff/staffEditSlice';
import deleteStaff from './slices/staff/staffDeleteSlice';
import UpdateStaff from './slices/staff/staffUpdateSlice';
import athleteAddReducer from './slices/athlete/athleteAddSlice';
import editAthleteReducer from './slices/athlete/athleteEditSlice';
import getAthleteIDReducer from './slices/athlete/getAthleteIDSlice';
import getAthleteListReducer from './slices/athlete/getAthleteListSlice';
import athleteUpdateReducer from './slices/athlete/athleteUpdateSlice';
import coachCommentsReducer from './slices/athlete/coachCommentsSlice';
import StaffListSlice from './slices/staff/staffListSlice';
import athleteListReducer from './slices/athlete/athleteListSlice';
import deleteAthleteReducer from './slices/athlete/athleteDeleteSlice'
import listGoalsTargetsReducer from './slices/goalsTargets/goalsTargetsListSlice'
import AddGoalsTargetsReducer from './slices/goalsTargets/goalsTargetsAddSlice'
import EditGoalsTargetsReducer from './slices/goalsTargets/goalsTargetsEditSlice'
import UpdateGoalsTargetsReducer from './slices/goalsTargets/goalsTargetsUpdateSlice'
import DeleteGoalsTargetsReducer from './slices/goalsTargets/goalsTargetsDeleteSlice'
import fileDeleteReducer from './slices/fileupload/deleteFile'
import roleReducer from './slices/settingSlice/roleSlice/roleSlice'
import getSportListReducer from './slices/sportsMenu/getSportsListSlice'
import listSeasonReducer from './slices/season/SeasonListSlice'
import AddSeasonReducer from './slices/season/SeasonAddSlice'
import EditSeasonReducer from './slices/season/SeasonEditSlice'
import UpdateSeasonReducer from './slices/season/SeasonUpdateSlice'
import DeleteSeasonReducer from './slices/season/SeasonDeleteSlice'
import LanguageListReducer from './slices/language/getLanguageListSlice'

const store = configureStore({
  reducer: {
    login: loginReducer,
    ui: appReducer,

    // Staff
    staffAdd: StaffAddSlice,
    staffList: StaffListSlice,
    staffEdit: editStaff,
    updateStaff: UpdateStaff,
    deleteStaff: deleteStaff,

    //file
    singleUpload: singleFileUpload,
    fileDelete: fileDeleteReducer,

    // Athlete
    getAthleteList: getAthleteListReducer,
    athleteAdd: athleteAddReducer,
    athleteEdit: editAthleteReducer,
    getAthleteByID: getAthleteIDReducer,
    athleteUpdateByID: athleteUpdateReducer,
    athleteList: athleteListReducer,
    deleteAthlete: deleteAthleteReducer,
    coachComments: coachCommentsReducer,

    // ListGoalsTargets
    listGoalsTargets: listGoalsTargetsReducer,
    addGoalsTargets: AddGoalsTargetsReducer,
    editGoalsTargets: EditGoalsTargetsReducer,
    updateGoalsTargets: UpdateGoalsTargetsReducer,
    deleteGoalsTargets: DeleteGoalsTargetsReducer,

    //Role
    rolesList: roleReducer,

    // Sports List
    getSportList: getSportListReducer,

    // ListSeason
    listSeason: listSeasonReducer,
    addSeason: AddSeasonReducer,
    editSeason: EditSeasonReducer,
    updateSeason: UpdateSeasonReducer,
    deleteSeason: DeleteSeasonReducer,

    // Language List
    getLanguagesList: LanguageListReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>; // Type for the entire state
export type AppDispatch = typeof store.dispatch; // Type for dispatch
export type DummyDispatch = typeof store.dispatch; // Type for dispatch
export type singleFileUploadDispatch = typeof store.dispatch; // Type for dispatch
export type editStaffDispatch = typeof store.dispatch; // Type for dispatch
export type updateStaffDispatch = typeof store.dispatch; // Type for dispatch
export type getAthleteListDispatch = typeof store.dispatch; // Type for dispatch
export type athleteUpdateByIDDispatch = typeof store.dispatch; // Type for dispatch
export type getSportListDispatch = typeof store.dispatch; // Type for dispatch

export default store;