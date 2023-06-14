import { useEffect, useState } from 'react';
import ManagePlatform from '..';
import classNames from 'classnames/bind';
import styles from '../../platform/styles.module.scss';
import RefreshToken from '@/method/refreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import Message from '@/components/message/default';
import loaded from '@/method/loaded';
import { selectToken } from '@/redux/token';

const cx = classNames.bind(styles);

function LecturersPlatform() {
    const [isDisabled, setIsDisable] = useState(false);
    const [formMessages, setformMessages] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const arr = new Array(4).fill(4);
    const arrs = [arr];

    const stageId = useSelector(selectUserObject);
    const user = loaded();
    const Token = useSelector(selectToken);
    const dispatch = useDispatch();
    const doumainUrl = process.env.REACT_APP_DOUMAIN_URL;

    const [lecturersInfomation, setLecturersInfomation] = useState({
        lecturersId: '',
        lecturersName: '',
        birthDay: '',
        email: '',
        acdecmic: '',
        language: '',
        specialized: '',
        count: 1,
        pathImage: {},
        pathLecturers: {},
    });
    const Obj = {
        lecturersId: lecturersInfomation.lecturersId,
        lecturersName: lecturersInfomation.lecturersName,
        birthDay: lecturersInfomation.birthDay,
        email: lecturersInfomation.email,
        acdecmic: lecturersInfomation.acdecmic,
        language: lecturersInfomation.language,
        specialized: lecturersInfomation.specialized,
        count: lecturersInfomation.count,
        pathImage: lecturersInfomation.pathImage,
        pathLecturers: lecturersInfomation.pathLecturers,
    };

    const lecturers = [
        {
            title: 'Thông tin giảng viên',
            items: [
                {
                    title: 'Mã giảng viên',
                    value: lecturersInfomation.lecturersId,
                    placeholder: 'Nhập mã giảng viên',
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, lecturersId: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Họ và tên',
                    value: lecturersInfomation.lecturersName,
                    placeholder: 'Nhập mã họ tên giảng viên',
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, lecturersName: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Ngày sinh',
                    placeholder: 'Nhập ngày sinh',
                    value: lecturersInfomation.birthDay,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, birthDay: value });
                    },
                    type: 'date',
                },
                {
                    title: 'Học hàm/ học vị',
                    placeholder: 'Nhập học hàm/ học vị',
                    value: lecturersInfomation.acdecmic,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, acdecmic: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Email',
                    placeholder: 'Nhập địa chỉ email',
                    value: lecturersInfomation.email,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, email: value });
                    },

                    type: 'email',
                },
                {
                    title: 'Chuyên ngành hướng dẫn',
                    placeholder: 'Nhập chuyên ngành hướng dẫn',
                    value: lecturersInfomation.specialized,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, specialized: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Ngôn ngữ hướng dẫn',
                    placeholder: 'Nhập ngôn ngữ hướng dẫn',
                    value: lecturersInfomation.language,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, language: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Số nhóm có thể nhận',
                    placeholder: 'Số nhóm có thể nhận',
                    value: lecturersInfomation.count,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        FormatCountChange(value);
                    },
                    max: 4,
                    min: 1,
                    type: 'number',
                },
                {
                    title: 'Chọn ảnh',
                    placeholder: 'Chọn file ảnh',
                    fileName: lecturersInfomation.pathImage ? lecturersInfomation.pathImage.name : '',
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, pathImage: value });
                    },
                    type: 'file',
                    accept: 'image/*',
                },
                {
                    title: 'Lý lịch giảng viên',
                    placeholder: 'Chọn file lý lịch giảng viên',
                    fileName: lecturersInfomation.pathLecturers ? lecturersInfomation.pathLecturers.name : '',
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setLecturersInfomation({ ...lecturersInfomation, pathLecturers: value });
                    },
                    type: 'file',
                    accept: '.doc,.docx',
                },
            ],
        },
    ];

    // format giá trị của số lượng thành viên
    function FormatCountChange(value) {
        let count;

        if (value.length >= 3) {
            count = value[0] + '' + value[2];
        } else {
            count = value;
        }
        if (count.length === 2) {
            if (parseInt(count) > 4) {
                count = '04';
            }
            if (parseInt(count) < 1) {
                count = '01';
            }
        }

        setLecturersInfomation({ ...lecturersInfomation, count });
    }
    function FormatCount() {
        let Count = lecturersInfomation.count;

        if (Count === 2) {
            return;
        }
        if (Count.length < 2) {
            Count = '0' + lecturersInfomation.count;
        }
        if (parseInt(Count) > 4) {
            Count = '04';
        }
        if (parseInt(Count) < 1) {
            Count = '01';
        }

        setLecturersInfomation({ ...lecturersInfomation, count: Count });
    }

    useEffect(() => {
        if (stageId.STT !== 1) {
            return;
        }
        fetch(`${doumainUrl}/lecturers/get-lecturers-platfrom`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                const birthDay = new Date(jsonData.NgaySinh);

                if (res.status === 200) {
                    const lecturers = {
                        lecturersId: jsonData.MaGiangVien,
                        lecturersName: jsonData.HoTen,
                        birthDay: [
                            birthDay.getFullYear(),
                            birthDay.getMonth() + 1 < 10 ? '0' + (birthDay.getMonth() + 1) : birthDay.getMonth() + 1,
                            birthDay.getDate() < 10 ? '0' + birthDay.getDate() : birthDay.getDate(),
                        ].join('-'),
                        email: jsonData.Email,
                        acdecmic: jsonData.TenHocHamHocVi,
                        language: jsonData.TenNgonNguHuongDan ? jsonData.TenNgonNguHuongDan : '',
                        specialized: jsonData.TenChuyenNganhHuongDan ? jsonData.TenChuyenNganhHuongDan : '',
                        count: jsonData.count ? jsonData.count : 1,
                        pathImage: jsonData.FileAnhUrl ? { url: jsonData.FileAnhUrl } : {},
                        pathLecturers: jsonData.FileLyLichUrl ? { url: jsonData.FileLyLichUrl } : {},
                        lecturersRegistedId: jsonData.lecturersRegistedId ? jsonData.lecturersRegistedId : undefined,
                    };

                    setLecturersInfomation(lecturers);
                    setIsloading(false);
                }

                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }

                if (res.status === 500) {
                    console.log(jsonData);
                    setIsloading(false);
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, user, dispatch, Token, stageId]);

    useEffect(() => {
        if (stageId.STT !== 1) {
            return;
        }
        if (
            lecturersInfomation.lecturersName.replace(/\s/g, '') === '' ||
            lecturersInfomation.birthDay.replace(/\s/g, '') === '' ||
            lecturersInfomation.email.replace(/\s/g, '') === '' ||
            lecturersInfomation.acdecmic.replace(/\s/g, '') === '' ||
            lecturersInfomation.language.replace(/\s/g, '') === '' ||
            lecturersInfomation.specialized.replace(/\s/g, '') === '' ||
            !lecturersInfomation.count ||
            !lecturersInfomation.pathImage.name ||
            !lecturersInfomation.pathLecturers.name
        ) {
            setIsDisable(true);
        } else {
            setIsDisable(false);
        }
    }, [lecturersInfomation, stageId]);

    useEffect(() => {
        if (stageId.STT !== 1) {
            return;
        }
        const nameLectures = [
            'Vui lòng nhập mã giảng viên',
            'Vui lòng nhập họ tên',
            'Vui lòng nhập ngày sinh',
            'Vui lòng nhập học hàm, học vị',
            'Vui lòng nhập địa chỉ email',
            'Vui lòng nhập chuyên ngành đăng ký',
            'Vui lòng nhập ngôn ngữ hướng dẫn',
            'Vui lòng nhập số lượng nhóm',
            'Vui lòng chọn file ảnh',
            'Vui lòng chọn file lý lịch',
        ];
        const InputsName = [
            'lecturersNameId',
            'lecturersName',
            'birthDay',
            'email',
            'acdecmic',
            'language',
            'count',
            'specialized',
            'pathImage',
            'pathLecturers',
        ];
        const Messages = document.getElementsByClassName(cx('mesage-js'));
        const Inputs = document.getElementsByClassName(cx('input__platform'));

        for (let i = 0; i < Messages.length; i++) {
            Messages[i].setAttribute('name', nameLectures[i]);
        }
        for (let i = 0; i < Inputs.length; i++) {
            Inputs[i].setAttribute('name', InputsName[i]);
        }
    }, [stageId]);

    function ResertLecturersInfomation() {
        setLecturersInfomation({
            ...lecturersInfomation,
            language: '',
            specialized: '',
            pathImage: {},
            pathLecturers: {},
        });
    }

    function ShowFormMessage(message) {
        setformMessages([...formMessages, message]);
        setTimeout(() => {
            let arr = [...formMessages];
            arr.splice(0, 1);
            setformMessages(arr);
        }, 5000);
    }
    function setIsShowMessage(index) {
        let arr = [...formMessages];
        arr.splice(index, 1);
        setformMessages(arr);
    }

    async function Registered() {
        try {
            if (stageId === '') {
                return;
            }
            setIsDisable(true);
            //Upload file
            let resUploadFile;
            if (!lecturers.lecturersRegistedId) {
                const fileToUpload = new FormData();
                fileToUpload.append('uploadfile', lecturersInfomation.pathImage);
                fileToUpload.append('uploadfile', lecturersInfomation.pathLecturers);
                resUploadFile = await fetch(`${doumainUrl}/lecturers/upload-file`, {
                    method: 'POST',
                    headers: {
                        token: Token,
                        lecturersid: lecturersInfomation.lecturersId,
                        stageid: stageId.Id,
                    },
                    body: fileToUpload,
                });
            }
            let jsonData;
            let mesage = {
                title: '',
                content: '',
                type: '',
            };
            if (resUploadFile) {
                jsonData = await resUploadFile.json();
                setIsDisable(false);

                if (resUploadFile.status === 400 || resUploadFile.status === 500) {
                    mesage.title = 'Error';
                    mesage.content = jsonData.msg;
                    mesage.type = 'error';

                    ShowFormMessage(mesage);
                    return;
                }
            }
            console.log(jsonData);
            // update các thông tin khác
            const res = await fetch(`${doumainUrl}/lecturers/register-platform`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    lecturersId: lecturersInfomation.lecturersId,
                    stageId: stageId.Id,
                    count: lecturersInfomation.count,
                    lecturersRegistedId: jsonData ? jsonData.LecturersId : lecturers.lecturersRegistedId,
                    language: lecturersInfomation.language,
                    specialized: lecturersInfomation.specialized,
                }),
            });
            const result = await res.json();

            if (res.status === 201) {
                mesage.title = 'Success';
                mesage.content = result.msg;
                mesage.type = 'success';

                ResertLecturersInfomation();
            }
            if (res.status === 400) {
                mesage.title = 'Error';
                mesage.content = result.msg;
                mesage.type = 'error';
            }
            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            if (res.status === 500) {
                console.log(jsonData);
                return;
            }

            ShowFormMessage(mesage);
            ResertLecturersInfomation();
        } catch (error) {
            console.log(error);
        }
    }

    return stageId.STT === 1 || stageId === '' ? (
        <div style={{ position: 'relative' }}>
            <div className={cx('show-message')}>
                {formMessages.map((formMessage, index) => {
                    return (
                        <div key={index}>
                            <Message
                                title={formMessage.title}
                                message={formMessage.content}
                                type={formMessage.type}
                                setIsShowMessage={setIsShowMessage}
                                index={index}
                            />
                        </div>
                    );
                })}
            </div>

            <ManagePlatform
                User={lecturers}
                Obj={Obj}
                Registered={Registered}
                FormatCount={FormatCount}
                isDisabled={isDisabled}
                isLoading={isLoading}
                arrs={arrs}
            />
        </div>
    ) : (
        <div
            className={cx('jkgf')}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
            Hiện tại không phải thời gian diễn ra giai đoạn đăng ký platform, vui lòng quay lại sau
        </div>
    );
}
export default LecturersPlatform;
