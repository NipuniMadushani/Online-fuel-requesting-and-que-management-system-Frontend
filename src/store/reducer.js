import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import { vehicleReducer } from './reducers/VehicleReducer';
import { fillingStationReducer } from './reducers/FillingStationReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    vehicleReducer,
    fillingStationReducer
});

export default reducer;
