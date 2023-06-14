import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Message({ title, message, type, setIsShowMessage, index }) {
    const [Message, setMessage] = useState({
        color: '',
    });

    useEffect(() => {
        if (type === 'success') {
            setMessage({
                color: '--message-success',
                icon: faCircleCheck,
            });
        }

        if (type === 'info') {
            setMessage({
                color: '--message-info',
                icon: faCircleInfo,
            });
        }

        if (type === 'error') {
            setMessage({
                color: '--message-error',
                icon: faCircleExclamation,
            });
        }
    }, [type]);

    return (
        <div
            className={cx('wrapper')}
            style={{ borderLeftColor: ` var(${Message.color})` }}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {Message.icon ? (
                <div className={cx('icon', 'icon_left', 'mar-r-10')} style={{ color: `var(${Message.color})` }}>
                    <FontAwesomeIcon icon={Message.icon} />
                </div>
            ) : (
                ''
            )}

            <div className={cx('item_middle')}>
                <p className={cx('title')}>{title}</p>
                <p className={cx('message')}>{message}</p>
            </div>
            <div
                className={cx('icon', 'icon_close')}
                onClick={() => {
                    setIsShowMessage(index);
                }}
            >
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    );
}

export default Message;
