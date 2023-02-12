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

const initialState = {
    vehicle: null,
    vehicleList: [],
    vehicleToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    vehicleActiveList: []
};

export const vehicleReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_VEHICLE_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, vehicle: data.payload[0] };

        case ADD_FAILED_VEHICLE_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                vehicle: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_VEHICLE_DETAILS_BY_CODE:
            return { ...state, vehicleToUpdate: data.payload[0] };

        case FAILED_GET_VEHICLE_DETAILS_BY_CODE:
            return {
                ...state,
                vehicleToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_VEHICLE_DATA:
            return { ...state, vehicle: data.payload[0] };

        case UPDATE_FAILED_VEHICLE_DATA:
            return {
                ...state,
                vehicle: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_VEHICLE_DATA:
            console.log(data.payload[0]);
            return { ...state, vehicleList: data.payload[0] };

        case FAILED_GET_ALL_VEHICLE_DATA:
            return { ...state, vehicleList: data };

        case VEHICLE_CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        case SUCCESS_GET_VEHICLE_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_VEHICLE_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_VEHICLE_DATA:
            return { ...state, vehicleActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_VEHICLE_DATA:
            return { ...state, vehicleActiveList: data.payload[0] };

        default:
            return state;
    }
};
