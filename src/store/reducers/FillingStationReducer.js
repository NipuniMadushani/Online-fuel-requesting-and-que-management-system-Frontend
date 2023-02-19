import {
    ADD_FAILED_FILLING_STATION_DATA,
    ADD_SUCCESS_FILLING_STATION_DATA,
    FAILED_GET_ALL_ACTIVE_FILLING_STATION_DATA,
    FAILED_GET_ALL_FILLING_STATION_DATA,
    FAILED_GET_FILLING_STATION_DETAILS_BY_CODE,
    FAILED_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
    FILLING_STATION_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_FILLING_STATION_DATA,
    SUCCESS_GET_ALL_FILLING_STATION_DATA,
    SUCCESS_GET_FILLING_STATION_DETAILS_BY_CODE,
    SUCCESS_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_FILLING_STATION_DATA,
    UPDATE_SUCCESS_FILLING_STATION_DATA,
    FILLING_STATION_NUMBER_DUPLICATE,
    CHASSIS_NUMBER_DUPLICATE,
    SUCCESS_GET_FILLING_STATION_DETAILS_BY_USERNAME,
    FAILED_GET_FILLING_STATION_DETAILS_BY_USERNAME
} from 'store/constants/FuelStationConstant';

const initialState = {
    fillingStation: null,
    fillingStationList: [],
    fillingStationToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicatefillingStationNumber: null,
    duplicateChassisNumber: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    fillingStationActiveList: [],
    fillingStationDetails: null
};

export const fillingStationReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_FILLING_STATION_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, fillingStation: data.payload[0] };

        case ADD_FAILED_FILLING_STATION_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                fillingStation: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_FILLING_STATION_DETAILS_BY_CODE:
            return { ...state, fillingStationToUpdate: data.payload[0] };

        case FAILED_GET_FILLING_STATION_DETAILS_BY_CODE:
            return {
                ...state,
                fillingStationToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_FILLING_STATION_DATA:
            return { ...state, fillingStation: data.payload[0] };

        case UPDATE_FAILED_FILLING_STATION_DATA:
            return {
                ...state,
                fillingStation: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_FILLING_STATION_DATA:
            console.log(data.payload[0]);
            return { ...state, fillingStationList: data.payload[0] };

        case FAILED_GET_ALL_FILLING_STATION_DATA:
            return { ...state, fillingStationList: data };

        case FILLING_STATION_NUMBER_DUPLICATE:
            return { ...state, duplicatefillingStationNumber: data };

        case CHASSIS_NUMBER_DUPLICATE:
            return { ...state, duplicateChassisNumber: data };

        case SUCCESS_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_FILLING_STATION_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_FILLING_STATION_DATA:
            return { ...state, fillingStationActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_FILLING_STATION_DATA:
            return { ...state, fillingStationActiveList: data.payload };

        case SUCCESS_GET_FILLING_STATION_DETAILS_BY_USERNAME:
            return { ...state, fillingStationDetails: data.payload };

        case FAILED_GET_FILLING_STATION_DETAILS_BY_USERNAME:
            return {
                ...state,
                fillingStationDetails: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        default:
            return state;
    }
};
