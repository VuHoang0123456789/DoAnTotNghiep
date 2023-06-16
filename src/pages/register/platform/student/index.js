import { useEffect, useState } from 'react';
import ManagePlatform from '..';
import classNames from 'classnames/bind';
import styles from '../../platform/styles.module.scss';
import cloudinaryUpload from '@/method/cloudinary/index.js';
import Message from '@/components/message/default';
import RefreshToken from '@/method/refreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserObject } from '@/redux/userobject';
import loaded from '@/method/loaded';
import { selectToken } from '@/redux/token';

const cx = classNames.bind(styles);

function StudentPlatform() {
    const user = loaded();
    const [isLoading, setIsLoading] = useState(true);
    const arr = new Array(4).fill(4);
    const arrs = [arr, arr];

    const dispatch = useDispatch();
    const Token = useSelector(selectToken);
    const [formMessages, setformMessages] = useState([]);
    const stageId = useSelector(selectUserObject); // biến giai đoạn
    const [questions, setQuestions] = useState([]); // biến chứa câu hỏi
    const [isDisabled, setIsDisabled] = useState(false); // biến chứa giá trị disable của button đăng ký
    const [studentInfomation, setStudentInfomation] = useState({
        studentID: '',
        studentName: '',
        classOfStudent: '',
        birthDay: '',
        email: '',
        leaderName: '',
        teamName: '',
        count: '01',
        path: {},
        researchFieldName: '',
        researchTopic: '',
        stageId: '',
    }); // thông tin sinh viên

    const student = [
        {
            title: 'Thông tin sinh viên',
            items: [
                {
                    title: 'Mã sinh viên',
                    placeholder: 'Nhập mã sinh viên',
                    value: studentInfomation.studentID,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, studentID: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Họ và tên',
                    placeholder: 'Nhập họ và tên',
                    value: studentInfomation.studentName,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, studentName: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Lớp',
                    placeholder: 'Nhập lớp',
                    value: studentInfomation.classOfStudent,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, classOfStudent: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Ngày sinh',
                    placeholder: 'Nhập ngày sinh',
                    value: studentInfomation.birthDay,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, birthDay: value });
                    },
                    type: 'date',
                },
                {
                    title: 'Email',
                    placeholder: 'Nhập địa chỉ email',
                    value: studentInfomation.email,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, email: value });
                    },
                    type: 'email',
                },
            ],
        },
        {
            title: 'Thông tin nhóm',
            isQuestion: true,
            items: [
                {
                    title: 'Tên nhóm',
                    placeholder: 'Nhập tên nhóm',
                    value: studentInfomation.teamName,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, teamName: value });
                    },
                    maxLength: 100,
                    type: 'text',
                },
                {
                    title: 'Tên trưởng nhóm',
                    placeholder: 'Nhập tên trưởng nhóm',
                    value: studentInfomation.leaderName,
                    isUpdate: false,
                    isDisabled: true,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, leaderName: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Số lượng thành viên',
                    placeholder: 'Nhập số lượng thành viên',
                    value: studentInfomation.count,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        FormatCountChange(value);
                    },
                    max: 15,
                    min: 5,
                    type: 'number',
                },
                {
                    title: 'Lý lịch nhóm tham gia dự án',
                    placeholder: 'Nhập lý lịch nhóm tham gia dự án',
                    fileName: studentInfomation.path ? studentInfomation.path.name : '',
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, path: value });
                    },
                    type: 'file',
                    accept: '.doc,.docx',
                },
                {
                    title: 'Tên đề lĩnh vực nghiên cứu',
                    placeholder: 'Nhập tên đề lĩnh vực nghiên cứu',
                    value: studentInfomation.researchFieldName,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, researchFieldName: value });
                    },
                    type: 'text',
                },
                {
                    title: 'Tên đề tài nghiên cứu (không bắt buộc)',
                    placeholder: 'Nhập tên đề tài nghiên cứu',
                    value: studentInfomation.researchTopic,
                    isUpdate: false,
                    isDisabled: false,
                    fuc: (value) => {
                        setStudentInfomation({ ...studentInfomation, researchTopic: value });
                    },
                    type: 'text',
                },
            ],
        },
    ]; // mảng để render ra giao diện
    const [doumainUrl] = useState(process.env.REACT_APP_DOUMAIN_URL); // biến chứa miền của api

    const Obj = {
        studentID: studentInfomation.studentID,
        studentName: studentInfomation.studentName,
        classOfStudent: studentInfomation.classOfStudent,
        birthDay: studentInfomation.birthDay,
        email: studentInfomation.email,
        leaderName: studentInfomation.leaderName,
        teamName: studentInfomation.teamName,
        count: studentInfomation.count,
        path: studentInfomation.path,
        researchFieldName: studentInfomation.researchFieldName,
        researchTopic: studentInfomation.researchTopic,
    }; // để set attribute

    // bật tắt button đăng ký
    useEffect(() => {
        if (stageId.STT !== 1) {
            return;
        }
        if (
            studentInfomation.studentID.replace(/\s/g, '') === '' ||
            studentInfomation.studentName.replace(/\s/g, '') === '' ||
            studentInfomation.classOfStudent.replace(/\s/g, '') === '' ||
            studentInfomation.birthDay.replace(/\s/g, '') === '' ||
            studentInfomation.email.replace(/\s/g, '') === '' ||
            studentInfomation.leaderName.replace(/\s/g, '') === '' ||
            studentInfomation.teamName.replace(/\s/g, '') === '' ||
            studentInfomation.researchFieldName.replace(/\s/g, '') === '' ||
            studentInfomation.count.replace(/\s/g, '') === '' ||
            !studentInfomation.path.name
        ) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [studentInfomation, stageId]);

    //set attribute
    useEffect(() => {
        if (stageId.STT !== 1) {
            return;
        }
        const name = [
            'Vui lòng nhập mã sinh viên',
            'Vui lòng nhập họ tên',
            'Vui lòng nhập lớp',
            'Vui lòng nhập ngày sinh',
            'Vui lòng nhập địa chỉ email',
            'Vui lòng nhập tên nhóm',
            'Vui lòng nhập tên trường nhóm',
            'Vui lòng nhập số lượng thành viên',
            'Vui lòng chọn file lý lịch',
            'Vui lòng nhập tên đề lĩnh vực nghiên cứu',
            'Vui lòng nhập tên đề tài nghiên cứu',
        ];
        const InputsName = [
            'studentID',
            'studentName',
            'classOfStudent',
            'birthDay',
            'email',
            'leaderName',
            'TeamName',
            'count',
            'path',
            'researchFieldName',
            'researchTopic ',
        ];
        const Messages = document.getElementsByClassName(cx('mesage-js'));
        const Inputs = document.getElementsByClassName(cx('input__platform'));
        for (let i = 0; i < Messages.length; i++) {
            Messages[i].setAttribute('name', name[i]);
        }
        for (let i = 0; i < Inputs.length; i++) {
            Inputs[i].setAttribute('name', InputsName[i]);
        }
    }, [stageId]);

    useEffect(() => {
        if (stageId.STT !== 1) {
            return;
        }
        // lấy thông tin sinh viên
        fetch(`${doumainUrl}/student/get-student`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: Token,
            },
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (res.status === 401 || res.status === 403) {
                    RefreshToken(dispatch);
                    return;
                }
                if (res.status === 500) {
                    console.log(jsonData);
                    return;
                }
                if (res.status === 200) {
                    const birthDay = new Date(jsonData.birthDay);
                    // set lại thông tin sinh viên sau khi lấy dc thông tin từ  database
                    let Student = {
                        studentID: jsonData.studentId,
                        studentName: jsonData.studentName,
                        classOfStudent: jsonData.className,
                        birthDay: [
                            birthDay.getFullYear(),
                            birthDay.getMonth() + 1 < 9 ? '0' + (birthDay.getMonth() + 1) : birthDay.getMonth() + 1,
                            birthDay.getDate() < 10 ? '0' + birthDay.getDate() : birthDay.getDate(),
                        ].join('-'),
                        email: jsonData.email,
                        leaderName: jsonData.studentName,
                        teamName: '',
                        count: '01',
                        path: {},
                        researchFieldName: '',
                        researchTopic: '',
                        stageId: stageId.Id,
                    };
                    setStudentInfomation(Student);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [doumainUrl, stageId, user, dispatch, Token]);

    // format giá trị của số lượng thành viên
    function FormatCountChange(value) {
        let count;

        if (value.length >= 3) {
            count = value[0] + '' + value[2];
        } else {
            count = value;
        }
        if (count.length === 2) {
            if (parseInt(count) > 15) {
                count = '15';
            }
            if (parseInt(count) < 5) {
                count = '05';
            }
        }

        setStudentInfomation({ ...studentInfomation, count });
    }

    function FormatCount() {
        let Count = studentInfomation.count;

        if (Count === 2) {
            return;
        }
        if (Count.length < 2) {
            Count = '0' + studentInfomation.count;
        }
        if (parseInt(Count) > 15) {
            Count = '15';
        }
        if (parseInt(Count) < 5) {
            Count = '05';
        }

        setStudentInfomation({ ...studentInfomation, count: Count });
    }

    // xử lý đăng ký platfrorm
    async function Registered() {
        setIsDisabled(true);
        const formData = new FormData();
        formData.append('uploadfile', studentInfomation.path);
        // upload file lên cloudinary
        const result = await cloudinaryUpload(formData, studentInfomation.studentID, studentInfomation.teamName);

        setIsDisabled(false);
        let mesage = {
            title: '',
            content: '',
            type: '',
        };

        if (!result) {
            mesage.title = 'Error';
            mesage.content = 'Đăng ký không thành công';
            mesage.type = 'error';

            ShowFormMessage(mesage);
        }
        // nếu upload không thành công thì báo lỗi
        if (result.res.status === 400 || result.res.status === 500) {
            mesage.title = 'Error';
            mesage.content = result.jsonData.msg;
            mesage.type = 'error';

            ShowFormMessage(mesage);
            return;
        }
        if (result.res.status === 401 || result.res.status === 403) {
            RefreshToken(dispatch);
            return;
        }

        // nếu upload file thành công thì chuyene đến đoạn update các thông tin khác
        try {
            // update các thông tin khác thông qua api
            const res = await fetch(`${doumainUrl}/student/register-platform`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: Token,
                },
                body: JSON.stringify({
                    teamName: studentInfomation.teamName,
                    count: studentInfomation.count,
                    teamId: result.jsonData.teamId,
                    stageId: stageId.Id,
                    studentId: studentInfomation.studentID,
                    researchFieldId: result.jsonData.researchFieldId,
                    researchFieldName: studentInfomation.researchFieldName,
                    topicName: studentInfomation.researchTopic,
                    questions: questions,
                }),
            });
            const jsonData = await res.json();

            // show form mesage
            if (res.status === 201) {
                mesage.title = 'Success';
                mesage.content = jsonData.msg;
                mesage.type = 'success';

                ResertStudentInfomation();
            } // khi thành công config form message

            if (res.status === 400 || res.status === 500) {
                mesage.title = 'Error';
                mesage.content = jsonData.msg;
                mesage.type = 'error';
            } // khi thất bại config form message

            if (res.status === 401 || res.status === 403) {
                RefreshToken(dispatch);
                return;
            }
            ShowFormMessage(mesage); // show form message
            ResertStudentInfomation();
        } catch (error) {
            console.log(error);
        }
    }

    //lmà mới các ô nhập dữ liệu
    function ResertStudentInfomation() {
        setStudentInfomation({
            ...studentInfomation,
            teamName: '',
            count: '01',
            path: {},
            researchFieldName: '',
            researchTopic: '',
        });
        setQuestions([]);
    }
    // render giao diện
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
                User={student}
                Obj={Obj}
                isDisabled={isDisabled}
                Registered={Registered}
                questions={{
                    value: questions,
                    handleClick: (value) => {
                        setQuestions([...questions, value]);
                    },
                    change: (value, index) => {
                        let arr = [...questions];
                        arr[index] = value;
                        setQuestions(arr);
                    },
                    close: (index) => {
                        let arr = [...questions];
                        arr.splice(index, 1);
                        setQuestions(arr);
                    },
                }}
                FormatCount={FormatCount}
                isLoading={isLoading}
                arrs={arrs}
                title={'Đăng ký thông tin sinh viên'}
            />
        </div>
    ) : (
        <div
            className={cx('jkgf')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
            Hiện tại không phải khoảng thời gian diễn ra giai đoạn đăng ký platform, vui lòng quay trở lại sau
        </div>
    );
}
export default StudentPlatform;
