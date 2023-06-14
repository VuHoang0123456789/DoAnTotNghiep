import loaded from '../loaded';

const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;

const cloudinaryUpload = async (fileToUpload, studentid, teamname) => {
    try {
        const res = await fetch(`${doumainUrl}/student/upload-file`, {
            method: 'POST',
            headers: {
                token: JSON.parse(sessionStorage.getItem(loaded())).accessToken,
                teamname: teamname,
                studentid: studentid,
            },
            body: fileToUpload,
        });

        const jsonData = await res.json();
        return { res, jsonData };
    } catch (error) {
        console.log(error);
    }
};

export default cloudinaryUpload;
