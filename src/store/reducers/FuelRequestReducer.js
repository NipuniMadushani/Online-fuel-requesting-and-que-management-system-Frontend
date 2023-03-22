import {
    ADD_FAILED_FUEL_REQUEST_BY_FILLING_STATION_DATA,
    ADD_FAILED_FUEL_REQUEST_DATA,
    ADD_SUCCESS_FUEL_REQUEST_BY_FILLING_STATION_DATA,
    ADD_SUCCESS_FUEL_REQUEST_DATA,
    FAILED_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
    FAILED_DELETE_FUEL_REQUEST_DETAILS_BY_ID,
    FAILED_GET_ALL_FUEL_REQUEST_BY_ALL_FILLING_STATION_DATA,
    FAILED_GET_ALL_FUEL_REQUEST_BY_FILLING_STATION_DATA,
    FAILED_GET_ALL_FUEL_REQUEST_DATA,
    FAILED_GET_ALL_FUEL_REQUEST_DATA_BY_USER,
    FAILED_GET_FUEL_REQUEST_DETAILS_BY_CODE,
    FAILED_GET_QUOTA_BY_VEHICLE_NUMBER,
    FAILED_REJECT_FUEL_REQUEST_DETAILS_BY_ID,
    SUCCESS_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID,
    SUCCESS_DELETE_FUEL_REQUEST_DETAILS_BY_ID,
    SUCCESS_GET_ALL_FUEL_REQUEST_BY_ALL_FILLING_STATION_DATA,
    SUCCESS_GET_ALL_FUEL_REQUEST_BY_FILLING_STATION_DATA,
    SUCCESS_GET_ALL_FUEL_REQUEST_DATA,
    SUCCESS_GET_ALL_FUEL_REQUEST_DATA_BY_USER,
    SUCCESS_GET_FUEL_REQUEST_DETAILS_BY_CODE,
    SUCCESS_GET_QUOTA_BY_VEHICLE_NUMBER,
    SUCCESS_GET_WEEK_END_DATE,
    SUCCESS_REJECT_FUEL_REQUEST_DETAILS_BY_ID
} from 'store/constants/FuelRequestConstant';

const initialState = {
    fuelRequest: null,
    fuelRequestByFillingStation: null,
    fuelRequstList: [],
    fuelRequestListByUser: [],
    fuelRequestListByFillingStation: [],
    allFuelRequestListByFillingStation: [],
    fuelRequstToUpdate: null,
    dateofSunday: null,
    eligibleQuotaDetails: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateVehicleNumber: null,
    duplicateChassisNumber: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    vehicleActiveList: [],
    deleteFuelRequest: null,
    acceptFuelRequest: null,
    rejectFuelRequest: null
};

export const fuelRequestReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_FUEL_REQUEST_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, fuelRequest: data.payload[0] };

        case ADD_FAILED_FUEL_REQUEST_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                fuelRequest: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_FUEL_REQUEST_DATA_BY_USER:
            console.log(data.payload[0]);
            return { ...state, fuelRequestListByUser: data.payload[0] };

        case FAILED_GET_ALL_FUEL_REQUEST_DATA_BY_USER:
            return { ...state, fuelRequestListByUser: data };

        case SUCCESS_GET_FUEL_REQUEST_DETAILS_BY_CODE:
            console.log(data.payload[0]);
            return { ...state, fuelRequstToUpdate: data.payload[0] };

        case FAILED_GET_FUEL_REQUEST_DETAILS_BY_CODE:
            return {
                ...state,
                fuelRequstToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        // case UPDATE_SUCCESS_VEHICLE_DATA:
        //     return { ...state, vehicle: data.payload[0] };

        // case UPDATE_FAILED_VEHICLE_DATA:
        //     return {
        //         ...state,
        //         vehicle: null,
        //         errorMsg: data ? data.errorMessages : 'netwok error'
        //     };

        case SUCCESS_GET_ALL_FUEL_REQUEST_DATA:
            console.log(data.payload[0]);
            return { ...state, fuelRequstList: data.payload[0] };

        case FAILED_GET_ALL_FUEL_REQUEST_DATA:
            return { ...state, fuelRequstList: data };

        // case VEHICLE_NUMBER_DUPLICATE:
        //     return { ...state, duplicateVehicleNumber: data };

        // case CHASSIS_NUMBER_DUPLICATE:
        //     return { ...state, duplicateChassisNumber: data };

        case SUCCESS_DELETE_FUEL_REQUEST_DETAILS_BY_ID:
            return { ...state, deleteFuelRequest: data };

        case FAILED_DELETE_FUEL_REQUEST_DETAILS_BY_ID:
            return { ...state, deleteFuelRequest: data };

        case SUCCESS_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID:
            return { ...state, acceptFuelRequest: data };

        case FAILED_ACCEPT_FUEL_REQUEST_DETAILS_BY_ID:
            return { ...state, acceptFuelRequest: data };

        case SUCCESS_REJECT_FUEL_REQUEST_DETAILS_BY_ID:
            return { ...state, rejectFuelRequest: data };

        case FAILED_REJECT_FUEL_REQUEST_DETAILS_BY_ID:
            return { ...state, rejectFuelRequest: data };

        // case SUCCESS_GET_ALL_ACTIVE_VEHICLE_DATA:
        //     return { ...state, vehicleActiveList: data.payload[0] };

        // case FAILED_GET_ALL_ACTIVE_VEHICLE_DATA:
        //     return { ...state, vehicleActiveList: data.payload[0] };

        case SUCCESS_GET_QUOTA_BY_VEHICLE_NUMBER:
            console.log(data.payload[0]);
            return { ...state, eligibleQuotaDetails: data.payload[0] };

        case SUCCESS_GET_WEEK_END_DATE:
            return { ...state, dateofSunday: data };

        case FAILED_GET_QUOTA_BY_VEHICLE_NUMBER:
            return {
                ...state,
                eligibleQuotaDetails: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case ADD_SUCCESS_FUEL_REQUEST_BY_FILLING_STATION_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, fuelRequestByFillingStation: data.payload[0] };

        case ADD_FAILED_FUEL_REQUEST_BY_FILLING_STATION_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                fuelRequestByFillingStation: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_FUEL_REQUEST_BY_FILLING_STATION_DATA:
            console.log(data.payload[0]);
            return { ...state, fuelRequestListByFillingStation: data.payload[0] };

        case FAILED_GET_ALL_FUEL_REQUEST_BY_FILLING_STATION_DATA:
            return { ...state, fuelRequestListByFillingStation: data };

        case SUCCESS_GET_ALL_FUEL_REQUEST_BY_ALL_FILLING_STATION_DATA:
            console.log(data.payload[0]);
            return { ...state, allFuelRequestListByFillingStation: data.payload[0] };

        case FAILED_GET_ALL_FUEL_REQUEST_BY_ALL_FILLING_STATION_DATA:
            return { ...state, allFuelRequestListByFillingStation: data };

        default:
            return state;
    }
};
