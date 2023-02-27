import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from 'apis/Apis';
import {
    ADD_FAILED_FILLING_STATION_DATA,
    ADD_SUCCESS_FILLING_STATION_DATA,
    FAILED_GET_ALL_FILLING_STATION_DATA,
    FAILED_GET_FILLING_STATION_DETAILS_BY_CODE,
    FAILED_GET_FILLING_STATION_DETAILS_BY_USERNAME,
    SUCCESS_GET_ALL_FILLING_STATION_DATA,
    SUCCESS_GET_FILLING_STATION_DETAILS_BY_CODE,
    SUCCESS_GET_FILLING_STATION_DETAILS_BY_USERNAME,
    UPDATE_FAILED_FILLING_STATION_DATA,
    UPDATE_SUCCESS_FILLING_STATION_DATA
} from 'store/constants/FuelStationConstant';

// import {
//     ADD_FAILED_FILLING_STATION_DATA,
//     ADD_SUCCESS_FILLING_STATION_DATA,
//     FAILED_GET_ALL_ACTIVE_FILLING_STATION_DATA,
//     FAILED_GET_ALL_FILLING_STATION_DATA,
//     FAILED_GET_FILLING_STATION_DETAILS_BY_CODE,
//     FAILED_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
//     FILLING_STATION_CODE_DUPLICATE,
//     SUCCESS_GET_ALL_ACTIVE_FILLING_STATION_DATA,
//     SUCCESS_GET_ALL_FILLING_STATION_DATA,
//     SUCCESS_GET_FILLING_STATION_DETAILS_BY_CODE,
//     SUCCESS_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
//     UPDATE_FAILED_FILLING_STATION_DATA,
//     UPDATE_SUCCESS_FILLING_STATION_DATA,
//     FILLING_STATION_NUMBER_DUPLICATE,
//     CHASSIS_NUMBER_DUPLICATE
// } from 'store/constants/FILLING_STATIONConstant';

export function* getAllFillingStationDataSaga(action) {
    // console.log('FILLING_STATION:' + `${action.data}`);
    let responseData = [];
    try {
        responseData = yield call(get, `http://localhost:8090/api/auth/v1/fuel-station/allFillingStations`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_FILLING_STATION_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_FILLING_STATION_DATA, data: responseData.data });
    }
}

// export function* getFILLING_STATIONLatestModifiedDateSaga() {
//     console.log('latest date');
//     let responseData = [];
//     try {
//         responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/FILLING_STATION/lastModifiedTime`);
//         yield put({
//             type: SUCCESS_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
//             data: responseData.data
//         });
//     } catch (e) {
//         console.log('Error:' + e);
//         yield put({ type: FAILED_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME, data: '' });
//     }
// }

export function* saveFillingStationDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `http://localhost:8090/api/auth/v1/fuel-station/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_FILLING_STATION_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_FILLING_STATION_DATA, data: responseData.data });
    }
}

export function* getFillingStationByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `http://localhost:8090/api/auth/v1/fuel-station/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_FILLING_STATION_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_FILLING_STATION_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* getFillingStationByManagerUserNameSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `http://localhost:8090/api/auth/v1/fuel-station/manager/${action.data.userName}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_FILLING_STATION_DETAILS_BY_USERNAME, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_FILLING_STATION_DETAILS_BY_USERNAME, data: responseData.data });
    }
}

export function* updateFillingStationDataSaga(action) {
    action.data.path = `http://localhost:8090/api/auth/v1/fuel-station/${action.data.id}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_FILLING_STATION_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_FILLING_STATION_DATA, data: responseData.data });
    }
}

// export function* checkFILLING_STATIONDupicateNumberSaga(action) {
//     let responseData = [];
//     try {
//         responseData = yield call(getById, `http://localhost:8090/api/auth/v1/FILLING_STATION/FILLING_STATIONNumberDuplicate/${action.data}`);
//         console.log(responseData);
//         yield put({ type: FILLING_STATION_NUMBER_DUPLICATE, data: responseData.data });
//     } catch (e) {
//         console.log(responseData);
//         yield put({ type: FILLING_STATION_NUMBER_DUPLICATE, data: responseData });
//     }
// }

// export function* checkChassisDupicateNumberSaga(action) {
//     let responseData = [];
//     try {
//         responseData = yield call(getById, `http://localhost:8090/api/auth/v1/FILLING_STATION/chassisNumberDuplicate/${action.data}`);
//         console.log(responseData);
//         yield put({ type: CHASSIS_NUMBER_DUPLICATE, data: responseData.data });
//     } catch (e) {
//         console.log(responseData);
//         yield put({ type: CHASSIS_NUMBER_DUPLICATE, data: responseData });
//     }
// }

// export function* getAllActiveFILLING_STATIONDataSaga() {
//     let responseData = [];
//     try {
//         responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/FILLING_STATION/active`);
//         yield put({ type: SUCCESS_GET_ALL_ACTIVE_FILLING_STATION_DATA, data: responseData.data });
//     } catch (e) {
//         yield put({ type: FAILED_GET_ALL_ACTIVE_FILLING_STATION_DATA, data: responseData.data });
//     }
// }
