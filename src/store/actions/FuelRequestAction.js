import {
    SAVE_VEHICLE_DATA,
    CHECK_VEHICLE_CODE_DUPLICATE,
    GET_ALL_ACTIVE_VEHICLE_DATA,
    GET_ALL_VEHICLE_DATA,
    GET_VEHICLE_DETAILS_BY_CODE,
    GET_VEHICLE_LAST_MODIFIED_DATE_TIME,
    UPDATE_VEHICLE_DATA,
    CHECK_VEHICLE_NUMBER_DUPLICATE,
    CHECK_CHASSIS_NUMBER_DUPLICATE
} from 'store/constants/VehicleConstant';

export const saveVehicleData = (data) => {
    console.log('save Data action s called', data);
    return {
        type: SAVE_VEHICLE_DATA,
        data
    };
};
export const getAllVehicleData = (data) => {
    return {
        type: GET_ALL_VEHICLE_DATA,
        data: data
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_VEHICLE_LAST_MODIFIED_DATE_TIME
    };
};

export const getVehicleDetailsByCode = (id) => {
    return {
        type: GET_VEHICLE_DETAILS_BY_CODE,
        data: { id }
    };
};

export const updateVehicleData = (data) => {
    return {
        type: UPDATE_VEHICLE_DATA,
        data
    };
};

export const checkVehicleNumber = (data) => {
    return {
        type: CHECK_VEHICLE_NUMBER_DUPLICATE,
        data: data
    };
};

export const checkChassisNumber = (data) => {
    return {
        type: CHECK_CHASSIS_NUMBER_DUPLICATE,
        data: data
    };
};

export const getAllActiveVehicleData = () => {
    return {
        type: GET_ALL_ACTIVE_VEHICLE_DATA
    };
};
