import { takeLatest } from 'redux-saga/effects';
import { getAllFuelRequestDataByUser } from 'store/actions/FuelRequestAction';
import {
    ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
    DELETE_FUEL_REQUEST_DETAILS_BY_ID,
    GET_ALL_FUEL_REQUEST_BY_ALL_FILLING_STATION_DATA,
    GET_ALL_FUEL_REQUEST_BY_FILLING_STATION_DATA,
    GET_ALL_FUEL_REQUEST_DATA,
    GET_ALL_FUEL_REQUEST_DATA_BY_USER,
    GET_FUEL_REQUEST_DETAILS_BY_CODE,
    GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME,
    GET_QUOTA_BY_VEHICLE_NUMBER,
    GET_WEEK_END_DATE,
    REJECT_FUEL_REQUEST_DETAILS_BY_ID,
    SAVE_FUEL_REQUEST_BY_FILLING_STATION_DATA,
    SAVE_FUEL_REQUEST_DATA
} from 'store/constants/FuelRequestConstant';
import {
    CHECK_FILLING_STATION_NUMBER_DUPLICATE,
    GET_ALL_ACTIVE_FILLING_STATION_DATA,
    GET_ALL_FILLING_STATION_DATA,
    GET_FILLING_STATION_DETAILS_BY_CODE,
    GET_FILLING_STATION_DETAILS_BY_USERNAME,
    GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
    SAVE_FILLING_STATION_DATA,
    UPDATE_FILLING_STATION_DATA
} from 'store/constants/FuelStationConstant';
import {
    CHECK_CHASSIS_NUMBER_DUPLICATE,
    CHECK_VEHICLE_CODE_DUPLICATE,
    CHECK_VEHICLE_NUMBER_DUPLICATE,
    GET_ALL_ACTIVE_VEHICLE_DATA,
    GET_ALL_VEHICLE_DATA,
    GET_VEHICLE_DETAILS_BY_CODE,
    GET_VEHICLE_LAST_MODIFIED_DATE_TIME,
    SAVE_VEHICLE_DATA,
    UPDATE_VEHICLE_DATA
} from 'store/constants/VehicleConstant';
import {
    getAllFillingStationDataSaga,
    getFillingStationByCodeSaga,
    getFillingStationByCodeSagaa,
    getFillingStationByManagerUserNameSaga,
    saveFillingStationDataHandler,
    updateFillingStationDataSaga
} from './FillingStationSage';
import {
    acceptFuelRequestByIdDataSaga,
    deleteFuelRequestByIdDataSaga,
    getAllFuelRequestDataAllSaga,
    getAllFuelRequestDataByFillingStationHandler,
    getAllFuelRequestDataByUserSaga,
    getAllFuelRequstDataSaga,
    getEligibleQuotaDetailsByVehicleNumberSaga,
    getFuelRequestDetailsByCodeSaga,
    getFuelRequestLatestModifiedDateSaga,
    getWeekEndDateSaga,
    rejectFuelRequestByIdDataSaga,
    saveFuelRequestByFillingStationDataHandler,
    saveFuelRequestDataHandler
} from './FuelRequstSaga';
import {
    checkChassisDupicateNumberSaga,
    checkVehicleDupicateCodeSaga,
    checkVehicleDupicateNumberSaga,
    getAllActiveVehicleDataSaga,
    getAllVehicleDataSaga,
    getVehicleDetailsByCodeSaga,
    getVehicleLatestModifiedDateSaga,
    saveVehicleDataHandler,
    updateVehicleDataSaga
} from './VehicleSaga';

export function* wacherSaga() {
    //vehicle

    yield takeLatest(SAVE_VEHICLE_DATA, saveVehicleDataHandler);
    yield takeLatest(GET_ALL_VEHICLE_DATA, getAllVehicleDataSaga);
    yield takeLatest(GET_VEHICLE_DETAILS_BY_CODE, getVehicleDetailsByCodeSaga);
    yield takeLatest(GET_VEHICLE_LAST_MODIFIED_DATE_TIME, getVehicleLatestModifiedDateSaga);
    yield takeLatest(CHECK_VEHICLE_NUMBER_DUPLICATE, checkVehicleDupicateNumberSaga);
    yield takeLatest(CHECK_CHASSIS_NUMBER_DUPLICATE, checkChassisDupicateNumberSaga);
    yield takeLatest(UPDATE_VEHICLE_DATA, updateVehicleDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_VEHICLE_DATA, getAllActiveVehicleDataSaga);

    //fuel station
    yield takeLatest(GET_ALL_FILLING_STATION_DATA, getAllFillingStationDataSaga);
    yield takeLatest(SAVE_FILLING_STATION_DATA, saveFillingStationDataHandler);
    yield takeLatest(GET_FILLING_STATION_DETAILS_BY_CODE, getFillingStationByCodeSaga);
    yield takeLatest(GET_FILLING_STATION_DETAILS_BY_USERNAME, getFillingStationByManagerUserNameSaga);
    // yield takeLatest(GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME, getVehicleLatestModifiedDateSaga);
    // yield takeLatest(CHECK_FILLING_STATION_NUMBER_DUPLICATE, checkVehicleDupicateNumberSaga);
    // // yield takeLatest(CHECK_CHASSIS_NUMBER_DUPLICATE, checkChassisDupicateNumberSaga);
    yield takeLatest(UPDATE_FILLING_STATION_DATA, updateFillingStationDataSaga);
    // yield takeLatest(GET_ALL_ACTIVE_FILLING_STATION_DATA, getAllActiveVehicleDataSaga);

    //fuel request
    yield takeLatest(GET_QUOTA_BY_VEHICLE_NUMBER, getEligibleQuotaDetailsByVehicleNumberSaga);
    yield takeLatest(SAVE_FUEL_REQUEST_DATA, saveFuelRequestDataHandler);
    yield takeLatest(GET_ALL_FUEL_REQUEST_DATA_BY_USER, getAllFuelRequestDataByUserSaga);
    yield takeLatest(GET_WEEK_END_DATE, getWeekEndDateSaga);
    yield takeLatest(GET_FUEL_REQUEST_DETAILS_BY_CODE, getFuelRequestDetailsByCodeSaga);
    yield takeLatest(GET_ALL_FUEL_REQUEST_DATA, getAllFuelRequstDataSaga);
    yield takeLatest(GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME, getFuelRequestLatestModifiedDateSaga);
    yield takeLatest(DELETE_FUEL_REQUEST_DETAILS_BY_ID, deleteFuelRequestByIdDataSaga);
    yield takeLatest(ACCEPT_FUEL_REQUEST_DETAILS_BY_ID, acceptFuelRequestByIdDataSaga);
    yield takeLatest(REJECT_FUEL_REQUEST_DETAILS_BY_ID, rejectFuelRequestByIdDataSaga);

    // fuel request by filling station

    yield takeLatest(SAVE_FUEL_REQUEST_BY_FILLING_STATION_DATA, saveFuelRequestByFillingStationDataHandler);
    yield takeLatest(GET_ALL_FUEL_REQUEST_BY_FILLING_STATION_DATA, getAllFuelRequestDataByFillingStationHandler);
    yield takeLatest(GET_ALL_FUEL_REQUEST_BY_ALL_FILLING_STATION_DATA, getAllFuelRequestDataAllSaga);
}

// yield takeLatest(GET_ALL_VEHICLE_DATA, getAllVehicleDataSaga);
// yield takeLatest(GET_VEHICLE_DETAILS_BY_CODE, getVehicleDetailsByCodeSaga);
// yield takeLatest(GET_VEHICLE_LAST_MODIFIED_DATE_TIME, getVehicleLatestModifiedDateSaga);
// yield takeLatest(CHECK_VEHICLE_NUMBER_DUPLICATE, checkVehicleDupicateNumberSaga);
// yield takeLatest(CHECK_CHASSIS_NUMBER_DUPLICATE, checkChassisDupicateNumberSaga);
// yield takeLatest(UPDATE_VEHICLE_DATA, updateVehicleDataSaga);
// yield takeLatest(GET_ALL_ACTIVE_VEHICLE_DATA, getAllActiveVehicleDataSaga);
