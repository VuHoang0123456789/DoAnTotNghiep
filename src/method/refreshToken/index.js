import loaded from '@/method/loaded';
import { setToken } from '@/redux/token';

async function RefreshToken(dispatch) {
    if (!JSON.parse(sessionStorage.getItem(loaded()))) {
        return;
    }

    const res = await fetch(`${process.env.REACT_APP_DOUMAIN_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            x_authorization: JSON.parse(sessionStorage.getItem(loaded())).accessToken,
        },
        body: JSON.stringify({ refreshToken: JSON.parse(sessionStorage.getItem(loaded())).refreshToken }),
    });
    if (res.status === 201) {
        const jsonData = await res.json();
        const user = JSON.parse(sessionStorage.getItem(loaded()));
        user.accessToken = jsonData.accessToken;
        sessionStorage.setItem(loaded(), JSON.stringify(user));

        dispatch(setToken(jsonData.accessToken));
    }
    if (res.status >= 400) {
        const jsonData = await res.json();
        console.log(jsonData);
    }
}

export default RefreshToken;
