import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DefaultLayout } from './layout';
import { privateRouter, publicRouter } from './router';
import { Fragment, useEffect, useState } from 'react';
import loaded from './method/loaded';
import { useDispatch, useSelector } from 'react-redux';
import { setState } from './redux/userobject';
import { setAccount } from './redux/account';
import RefreshToken from './method/refreshToken';
import { selectToken } from './redux/token';

function App() {
    const [doumainUrl] = useState(process.env.REACT_APP_DOUMAIN_URL);
    const dispath = useDispatch();
    const user = loaded();
    const Token = useSelector(selectToken);

    useEffect(() => {
        fetch(`${doumainUrl}/admin/get-stage-id`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispath);
                }
                if (res.status === 200) {
                    dispath(setState(jsonData[0]));
                }
            })
            .catch((error) => {
                console.log(error);
            });
        fetch(`${doumainUrl}/account/get-account`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status === 200) {
                    if (user === 'student') {
                        jsonData.id = jsonData.studentId;
                    }
                    if (user === 'lecturers') {
                        jsonData.id = jsonData.lecturersId;
                    }
                    if (user === 'admin') {
                        jsonData.id = jsonData.Id;
                    }
                    dispath(setAccount(jsonData));
                }
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispath);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, dispath, user, Token]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRouter.map((route, index) => {
                        let Layout = DefaultLayout;
                        let Page = route.component;

                        if (route.layout !== null) {
                            Layout = route.layout;
                        } else {
                            Layout = Fragment;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {privateRouter.map((route, index) => {
                        let Layout = DefaultLayout;
                        let Page = route.component;

                        if (route.layout !== null) {
                            Layout = route.layout;
                        } else {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    !JSON.parse(sessionStorage.getItem(user)) ? (
                                        <Navigate to={`/${loaded()}/login`} replace />
                                    ) : (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    )
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
