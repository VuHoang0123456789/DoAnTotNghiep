import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Update({
    obj,
    UpdateTeam,
    UpdateResearchfield,
    UpdateFileOfTeam,
    UpdateResearchQuestion,
    researchIndex,
    UpdateLecturers,
    UpdateFile,
    UpdateAccount,
}) {
    const [isAction, setIsAction] = useState(false);

    function GetInput(e) {
        const parentElement = e.target.parentElement;
        const nodeList = parentElement.childNodes[0];
        let Input;
        for (let i = 0; i < nodeList.childNodes.length; i++) {
            if (nodeList.childNodes[i].nodeName === 'INPUT') {
                Input = nodeList.childNodes[i];
                break;
            }
        }

        return Input;
    }

    function VisibleInput(Input) {
        if (Input !== undefined) {
            Input.disabled = false;
        }
    }

    function DisabledInput(Input) {
        if (Input !== undefined) {
            Input.disabled = true;
        }
    }

    async function Saved(e, Input) {
        const parentElement = e.target.parentElement;
        const nodeList = parentElement.childNodes[0];
        let P;

        for (let i = 0; i < nodeList.childNodes.length; i++) {
            if (nodeList.childNodes[i].nodeName === 'P') {
                P = nodeList.childNodes[i];
                break;
            }
        }

        if (Input.value.replace(/\s/g, '') === '') {
            Input.style.borderBottom = '1px solid var(--primary-color)';
            P.innerText = `${P.getAttribute('name')}`;
        } else {
            Input.style.borderBottom = '1px solid var(--table-color)';
            P.innerText = '';
            setIsAction(!isAction);
            DisabledInput(GetInput(e));

            if (UpdateTeam) {
                UpdateTeam();
            }

            if (UpdateResearchfield) {
                UpdateResearchfield();
            }

            if (UpdateFileOfTeam) {
                UpdateFileOfTeam();
            }

            if (UpdateResearchQuestion) {
                UpdateResearchQuestion(researchIndex);
            }

            if (UpdateLecturers) {
                UpdateLecturers();
            }

            if (UpdateFile) {
                UpdateFile();
            }

            if (UpdateAccount) {
                UpdateAccount();
            }
        }
    }

    function Cancel(e, Input) {
        const parentElement = e.target.parentElement;
        const nodeList = parentElement.childNodes[0];
        let P;

        for (let i = 0; i < nodeList.childNodes.length; i++) {
            if (nodeList.childNodes[i].nodeName === 'P') {
                P = nodeList.childNodes[i];
                break;
            }
        }

        if (Input.value.replace(/\s/g, '') === '') {
            if (Input.type !== 'file') {
                Input.value = obj[Input.getAttribute('name')];
            }
        }
        Input.style.borderBottom = '1px solid var(--table-color)';
        P.innerText = '';
        setIsAction(!isAction);
        DisabledInput(GetInput(e));
    }
    return !isAction ? (
        <button
            className={cx('btn')}
            onClick={(e) => {
                e.stopPropagation();
                setIsAction(!isAction);
                VisibleInput(GetInput(e));
            }}
        >
            Chỉnh sửa
        </button>
    ) : (
        <>
            <button
                className={cx('btn', 'btn__save')}
                onClick={(e) => {
                    e.stopPropagation();
                    Saved(e, GetInput(e));
                }}
            >
                Lưu
            </button>
            <button
                className={cx('btn', 'btn__cancel')}
                onClick={(e) => {
                    e.stopPropagation();
                    Cancel(e, GetInput(e));
                }}
            >
                Hủy
            </button>
        </>
    );
}

export default Update;
