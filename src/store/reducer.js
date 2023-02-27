import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import { vehicleReducer } from './reducers/VehicleReducer';
import { fillingStationReducer } from './reducers/FillingStationReducer';
import { fuelRequestReducer } from './reducers/FuelRequestReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    vehicleReducer,
    fillingStationReducer,
    fuelRequestReducer
});

export default reducer;
