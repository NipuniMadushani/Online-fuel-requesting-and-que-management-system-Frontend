import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get, Delete } from 'apis/Apis';

import {
    ADD_FAILED_FUEL_REQUEST_DATA,
    ADD_SUCCESS_FUEL_REQUEST_DATA,
    FAILED_GET_ALL_ACTIVE_FUEL_REQUEST_DATA,
    FAILED_GET_ALL_FUEL_REQUEST_DATA,
    FAILED_GET_FUEL_REQUEST_DETAILS_BY_CODE,
    FAILED_GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME,
    FUEL_REQUEST_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_FUEL_REQUEST_DATA,
    SUCCESS_GET_ALL_FUEL_REQUEST_DATA,
    SUCCESS_GET_FUEL_REQUEST_DETAILS_BY_CODE,
    SUCCESS_GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_FUEL_REQUEST_DATA,
    UPDATE_SUCCESS_FUEL_REQUEST_DATA,
    FUEL_REQUEST_NUMBER_DUPLICATE,
    CHASSIS_NUMBER_DUPLICATE,
    SUCCESS_GET_QUOTA_BY_VEHICLE_NUMBER,
    FAILED_GET_QUOTA_BY_VEHICLE_NUMBER,
    SUCCESS_GET_ALL_FUEL_REQUEST_DATA_BY_USER,
    FAILED_GET_ALL_FUEL_REQUEST_DATA_BY_USER,
    SUCCESS_GET_WEEK_END_DATE,
    SUCCESS_DELETE_FUEL_REQUEST_DETAILS_BY_ID,
    FAILED_DELETE_FUEL_REQUEST_DETAILS_BY_ID,
    SUCCESS_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
    FAILED_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
    SUCCESS_REJECT_FUEL_REQUEST_DETAILS_BY_ID,
    FAILED_REJECT_FUEL_REQUEST_DETAILS_BY_ID
} from 'store/constants/FuelRequestConstant';

export function* getAllFuelRequstDataSaga(action) {
    console.log('FuelRequest:' + `${action.data}`);
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/fuelrequest/all`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_FUEL_REQUEST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_FUEL_REQUEST_DATA, data: responseData.data });
    }
}

export function* getFuelRequestLatestModifiedDateSaga(action) {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/fuelrequest/lastModified/${action.data.userId}`);
        yield put({
            type: SUCCESS_GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* saveFuelRequestDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `http://localhost:8090/api/auth/v1/fuelrequest/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_FUEL_REQUEST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_FUEL_REQUEST_DATA, data: responseData.data });
    }
}

export function* getFuelRequestDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `http://localhost:8090/api/auth/v1/fuelrequest/details/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_FUEL_REQUEST_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_FUEL_REQUEST_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateFuelRequestDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/FuelRequest/${action.data.guideCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_FUEL_REQUEST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_FUEL_REQUEST_DATA, data: responseData.data });
    }
}

export function* checkFuelRequestDupicateNumberSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `http://localhost:8090/api/auth/v1/FuelRequest/FUEL_REQUESTNumberDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: FUEL_REQUEST_NUMBER_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: FUEL_REQUEST_NUMBER_DUPLICATE, data: responseData });
    }
}

export function* checkChassisDupicateNumberSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `http://localhost:8090/api/auth/v1/FuelRequest/chassisNumberDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: CHASSIS_NUMBER_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: CHASSIS_NUMBER_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveFuelRequestDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/FUEL_REQUEST/active`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_FUEL_REQUEST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_FUEL_REQUEST_DATA, data: responseData.data });
    }
}

export function* getWeekEndDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/fuelrequest/sunday`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_WEEK_END_DATE, data: responseData.data });
    } catch (e) {
        yield put({ type: SUCCESS_GET_WEEK_END_DATE, data: responseData.data });
    }
}

export function* getEligibleQuotaDetailsByVehicleNumberSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `http://localhost:8090/api/auth/v1/fuelrequest/fuel-request-filter/${action.data.vehicleNumber}`
        );
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_QUOTA_BY_VEHICLE_NUMBER, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_QUOTA_BY_VEHICLE_NUMBER, data: responseData.data });
    }
}

export function* getAllFuelRequestDataByUserSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `http://localhost:8090/api/auth/v1/fuelrequest/unique/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_ALL_FUEL_REQUEST_DATA_BY_USER, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_FUEL_REQUEST_DATA_BY_USER, data: responseData.data });
    }
}

export function* deleteFuelRequestByIdDataSaga(action) {
    alert('saga');
    let responseData = [];
    try {
        responseData = yield call(Delete, `http://localhost:8090/api/auth/v1/fuelrequest/delete/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_DELETE_FUEL_REQUEST_DETAILS_BY_ID, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_DELETE_FUEL_REQUEST_DETAILS_BY_ID, data: responseData.data });
    }
}

export function* acceptFuelRequestByIdDataSaga(action) {
    console.log('approve saga');
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/fuelrequest/approveRequest/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID, data: responseData.data });
    }
}
export function* rejectFuelRequestByIdDataSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/fuelrequest/reject/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_REJECT_FUEL_REQUEST_DETAILS_BY_ID, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_REJECT_FUEL_REQUEST_DETAILS_BY_ID, data: responseData.data });
    }
}
