import PropTypes from 'prop-types';

// material-ui
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

// third-party
// import currency from 'currency.js';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { useEffect } from 'react';

// ==============================|| CHECKOUT CART - ORDER SUMMARY ||============================== //

const OrderSummary = ({ value }) => {
    useEffect(() => {
        console.log(value.fuelAmount);
    }, []);

    return (
        <SubCard>
            <TableContainer>
                <Table sx={{ minWidth: 'auto' }} size="small" aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1">Payment Summary</Typography>
                            </TableCell>
                            <TableCell />
                        </TableRow>
                        <TableRow>
                            <TableCell>Sub Total</TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1">{value.fualAmount}</Typography>

                                <Typography variant="subtitle1">{value.fuelAmount}</Typography>
                                {/* {checkout.subtotal && <Typography variant="subtitle1">{currency(checkout.subtotal).format()}</Typography>} */}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Other Charges</TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1">0.00</Typography>
                                {/* {checkout.shipping && (
                                <Typography variant="subtitle1">
                                    {checkout.shipping <= 0 ? '-' : currency(checkout.shipping).format()}
                                </Typography>
                            )} */}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ borderBottom: 'none' }}>
                                <Typography variant="subtitle1">Total</Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                <Typography variant="subtitle1">{value.fualAmount}</Typography>
                                <Typography variant="subtitle1">{value.fuelAmount}</Typography>
                                {/* {checkout.total && <Typography variant="subtitle1">{currency(checkout.total).format()}</Typography>} */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </SubCard>
    );
};

// OrderSummary.propTypes = {
//     checkout: PropTypes.object
// };

export default OrderSummary;
