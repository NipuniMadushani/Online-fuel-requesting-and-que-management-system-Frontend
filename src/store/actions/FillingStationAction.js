import {
    SAVE_FILLING_STATION_DATA,
    CHECK_FILLING_STATION_CODE_DUPLICATE,
    GET_ALL_ACTIVE_FILLING_STATION_DATA,
    GET_ALL_FILLING_STATION_DATA,
    GET_FILLING_STATION_DETAILS_BY_CODE,
    GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
    UPDATE_FILLING_STATION_DATA,
    CHECK_FILLING_STATION_NUMBER_DUPLICATE,
    CHECK_CHASSIS_NUMBER_DUPLICATE,
    GET_FILLING_STATION_DETAILS_BY_USERNAME
} from 'store/constants/FuelStationConstant';

export const saveFillingStationData = (data) => {
    console.log('save Data action s called', data);
    return {
        type: SAVE_FILLING_STATION_DATA,
        data
    };
};
export const getAllFillingStationData = (data) => {
    return {
        type: GET_ALL_FILLING_STATION_DATA,
        data: data
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME
    };
};

export const getFillingStationDetailsByCode = (id) => {
    return {
        type: GET_FILLING_STATION_DETAILS_BY_CODE,
        data: { id }
    };
};

export const getFillingStationDetailsManagerWise = (userName) => {
    return {
        type: GET_FILLING_STATION_DETAILS_BY_USERNAME,
        data: { userName }
    };
};
export const updateFillingStationData = (data) => {
    return {
        type: UPDATE_FILLING_STATION_DATA,
        data
    };
};

export const checkFillingStationNumber = (data) => {
    return {
        type: CHECK_FILLING_STATION_NUMBER_DUPLICATE,
        data: data
    };
};

export const checkChassisNumber = (data) => {
    return {
        type: CHECK_CHASSIS_NUMBER_DUPLICATE,
        data: data
    };
};

export const getAllActiveFillingStationData = () => {
    return {
        type: GET_ALL_ACTIVE_FILLING_STATION_DATA
    };
};
