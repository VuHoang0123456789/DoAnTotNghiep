import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function FormLecturers({ SetIsShowFormLecturers, user }) {
    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <div
                        className={cx('icon')}
                        onClick={() => {
                            SetIsShowFormLecturers(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <div className={cx('form-lecturers')}>
                    <div className={cx('information')}>
                        <h1 className={cx('title')}>{user.title}</h1>
                        <div className={cx('content')}>
                            {user.arr.map((use, index) => {
                                return (
                                    <div className={cx('content__item')} key={index}>
                                        <h3 className="font-size-16">{use.title}</h3>
                                        <p className="mar-l-10">{use.value}</p>
                                    </div>
                                );
                            })}

                            {user.question ? (
                                <div className={cx('content__item', 'flex-column')}>
                                    <h3 className="font-size-16">{user.question.title}</h3>
                                    {user.question.arr.map((question, index) => {
                                        return (
                                            <p className="mar-l-10" key={index}>
                                                {index + 1}. {question.NoiDungCauHoi}
                                            </p>
                                        );
                                    })}
                                </div>
                            ) : (
                                ''
                            )}

                            <span
                                className={cx('file')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://docs.google.com/gview?url=${user.link.url}`);
                                }}
                            >
                                {user.link.title}
                            </span>
                        </div>
                    </div>

                    {user.image_url ? (
                        <div
                            className={cx('avatar')}
                            style={{
                                background: `url('${user.image_url}') top/ cover no-repeat`,
                            }}
                        ></div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormLecturers;
