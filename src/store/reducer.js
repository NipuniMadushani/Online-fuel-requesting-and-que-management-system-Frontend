import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import { vehicleReducer } from './reducers/VehicleReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    vehicleReducer
});

export default reducer;
