import { takeLatest } from 'redux-saga/effects';
import {
    CHECK_VEHICLE_CODE_DUPLICATE,
    GET_ALL_ACTIVE_VEHICLE_DATA,
    GET_ALL_VEHICLE_DATA,
    GET_VEHICLE_DETAILS_BY_CODE,
    GET_VEHICLE_LAST_MODIFIED_DATE_TIME,
    SAVE_VEHICLE_DATA,
    UPDATE_VEHICLE_DATA
} from 'store/constants/VehicleConstant';
import {
    checkVehicleDupicateCodeSaga,
    getAllActiveVehicleDataSaga,
    getAllVehicleDataSaga,
    getVehicleDetailsByCodeSaga,
    getVehicleLatestModifiedDateSaga,
    saveVehicleDataHandler,
    updateVehicleDataSaga
} from './VehicleSaga';

export function* wacherSaga() {
    yield takeLatest(SAVE_VEHICLE_DATA, saveVehicleDataHandler);
    yield takeLatest(GET_ALL_VEHICLE_DATA, getAllVehicleDataSaga);
    yield takeLatest(GET_VEHICLE_DETAILS_BY_CODE, getVehicleDetailsByCodeSaga);
    yield takeLatest(GET_VEHICLE_LAST_MODIFIED_DATE_TIME, getVehicleLatestModifiedDateSaga);
    yield takeLatest(CHECK_VEHICLE_CODE_DUPLICATE, checkVehicleDupicateCodeSaga);
    yield takeLatest(UPDATE_VEHICLE_DATA, updateVehicleDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_VEHICLE_DATA, getAllActiveVehicleDataSaga);
}
