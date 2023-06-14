import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Message({ CloseForm, Agree, title }) {
    function closeForm() {
        const Form = document.getElementsByClassName(cx('form_message'))[0];
        Form.classList.add(cx('is-hidden'));

        setTimeout(() => {
            CloseForm();
        }, 400);
    }

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('form_message')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={cx('icon_close')} onClick={closeForm}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={cx('item_top')}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                    </div>
                    <h5 className={cx('title')}>{title}?</h5>
                </div>
                <div className={cx('item_bottom')}>
                    <button
                        className={cx('btn', 'btn_ok')}
                        onClick={() => {
                            Agree();
                            closeForm();
                        }}
                    >
                        Đồng ý
                    </button>
                    <button className={cx('btn', 'btn_cancel')} onClick={closeForm}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Message;
