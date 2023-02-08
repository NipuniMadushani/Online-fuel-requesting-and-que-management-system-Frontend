import { Grid } from '@mui/material';
import React from 'react';
import AuthService from 'services/auth.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { useState } from 'react';
import { useEffect } from 'react';

const UserProfile = () => {
    const [isLoading, setLoading] = useState(true);
    const currentUser = AuthService.getCurrentUser();
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div>
            <MainCard title="Profile Details">
                <Grid container spacing={gridSpacing}>
                    {currentUser === null ? (
                        ''
                    ) : (
                        <Grid item xs={12}>
                            {/* <SubCard title="Basic Shadow"> */}
                            <Grid container spacing={gridSpacing}></Grid>
                            <h3>
                                <strong>{currentUser.username}</strong> Profile
                            </h3>

                            <p>
                                <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{' '}
                                {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                            </p>
                            <p>
                                <strong>Id:</strong> {currentUser.id}
                            </p>
                            <p>
                                <strong>Email:</strong> {currentUser.email}
                            </p>
                            <strong>Authorities:</strong>
                            <ul>{currentUser.roles && currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}</ul>
                            {/* </SubCard> */}
                        </Grid>
                    )}
                </Grid>
            </MainCard>
        </div>
    );
};

export default UserProfile;
