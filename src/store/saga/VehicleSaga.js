import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from 'apis/Apis';

import {
    ADD_FAILED_VEHICLE_DATA,
    ADD_SUCCESS_VEHICLE_DATA,
    FAILED_GET_ALL_ACTIVE_VEHICLE_DATA,
    FAILED_GET_ALL_VEHICLE_DATA,
    FAILED_GET_VEHICLE_DETAILS_BY_CODE,
    FAILED_GET_VEHICLE_LAST_MODIFIED_DATE_TIME,
    VEHICLE_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_VEHICLE_DATA,
    SUCCESS_GET_ALL_VEHICLE_DATA,
    SUCCESS_GET_VEHICLE_DETAILS_BY_CODE,
    SUCCESS_GET_VEHICLE_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_VEHICLE_DATA,
    UPDATE_SUCCESS_VEHICLE_DATA
} from 'store/constants/VehicleConstant';

export function* getAllVehicleDataSaga() {
    console.log('guide class');
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/Vehicle/`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_VEHICLE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_VEHICLE_DATA, data: responseData.data });
    }
}

export function* getVehicleLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/Vehicle/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_VEHICLE_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_VEHICLE_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* saveVehicleDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `http://localhost:8090/api/auth/v1/Vehicle/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_VEHICLE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_VEHICLE_DATA, data: responseData.data });
    }
}

export function* getVehicleDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/Vehicle/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_VEHICLE_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_VEHICLE_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateVehicleDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/Vehicle/${action.data.guideCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_VEHICLE_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_VEHICLE_DATA, data: responseData.data });
    }
}

export function* checkVehicleDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/Vehicle/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: VEHICLE_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: VEHICLE_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveVehicleDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/Vehicle/active`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_VEHICLE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_VEHICLE_DATA, data: responseData.data });
    }
}
