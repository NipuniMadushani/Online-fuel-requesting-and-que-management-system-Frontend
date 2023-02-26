import {
    SAVE_FUEL_REQUEST_DATA,
    CHECK_FUEL_REQUEST_CODE_DUPLICATE,
    GET_ALL_ACTIVE_FUEL_REQUEST_DATA,
    GET_ALL_FUEL_REQUEST_DATA,
    GET_FUEL_REQUEST_DETAILS_BY_CODE,
    GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME,
    UPDATE_FUEL_REQUEST_DATA,
    CHECK_FUEL_REQUEST_NUMBER_DUPLICATE,
    CHECK_CHASSIS_NUMBER_DUPLICATE,
    GET_QUOTA_BY_VEHICLE_NUMBER,
    GET_ALL_FUEL_REQUEST_DATA_BY_USER,
    GET_WEEK_END_DATE,
    DELETE_FUEL_REQUEST_DETAILS_BY_ID,
    ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
    REJECT_FUEL_REQUEST_DETAILS_BY_ID
} from 'store/constants/FuelRequestConstant';

export const saveFuelRequestData = (data) => {
    console.log('save Data action s called', data);
    return {
        type: SAVE_FUEL_REQUEST_DATA,
        data
    };
};
export const getAllFuelRequestData = (data) => {
    return {
        type: GET_ALL_FUEL_REQUEST_DATA,
        data: data
    };
};

export const getAllFuelRequestDataByUser = (id) => {
    return {
        type: GET_ALL_FUEL_REQUEST_DATA_BY_USER,
        data: { id }
    };
};

export const getLatestModifiedDetails = (userId) => {
    return {
        type: GET_FUEL_REQUEST_LAST_MODIFIED_DATE_TIME,
        data: { userId }
    };
};

export const getFuelRequestDetailsByCode = (id) => {
    return {
        type: GET_FUEL_REQUEST_DETAILS_BY_CODE,
        data: { id }
    };
};

export const updateFuelRequestData = (data) => {
    return {
        type: UPDATE_FUEL_REQUEST_DATA,
        data
    };
};

export const checkFuelRequestNumber = (data) => {
    return {
        type: CHECK_FUEL_REQUEST_NUMBER_DUPLICATE,
        data: data
    };
};

export const checkChassisNumber = (data) => {
    return {
        type: CHECK_CHASSIS_NUMBER_DUPLICATE,
        data: data
    };
};

export const getAllActiveFuelRequestData = () => {
    return {
        type: GET_ALL_ACTIVE_FUEL_REQUEST_DATA
    };
};

export const getWeekEndDate = () => {
    return {
        type: GET_WEEK_END_DATE
    };
};

export const getEligibleQuotaByVehicleNumber = (vehicleNumber) => {
    return {
        type: GET_QUOTA_BY_VEHICLE_NUMBER,
        data: { vehicleNumber }
    };
};

export const deleteFuelRequestById = (id) => {
    console.log('delete action');
    return {
        type: DELETE_FUEL_REQUEST_DETAILS_BY_ID,
        data: { id }
    };
};

export const approveFuelRequestById = (id) => {
    console.log('approve action');
    return {
        type: ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
        data: { id }
    };
};

export const rejectFuelRequestById = (id) => {
    console.log('reject action');
    return {
        type: REJECT_FUEL_REQUEST_DETAILS_BY_ID,
        data: { id }
    };
};
