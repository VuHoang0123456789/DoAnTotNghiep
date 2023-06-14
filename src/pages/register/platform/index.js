import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { BtnUpdate } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import Skeleton from '@/components/skeleton';

const cx = classNames.bind(styles);

function ManagePlatform({ User, Obj, isDisabled, Registered, questions, FormatCount, isLoading, arrs }) {
    function RegisterPlatfrom(e) {
        e.stopPropagation();
        Registered();
    }

    return !isLoading ? (
        <div className={cx('container')} onClick={FormatCount}>
            <div className={cx('wrapper')}>
                <h1 className={cx('title')}>Đăng ký vào Platform</h1>
                <div className={cx('content')}>
                    {User.map((item, index) => {
                        return (
                            <div
                                className={cx('content__student')}
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <div className={cx('content__item', 'content__title')}>
                                    <h3 className="font-size-22 font-weight-500 ">{item.title}</h3>
                                </div>
                                {item.items.map((user, index) => {
                                    return (
                                        <div
                                            className={cx('content__item')}
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                FormatCount();
                                            }}
                                        >
                                            <div className={cx('item__left')}>
                                                <h3 className="font-size-16">{user.title}</h3>
                                                <input
                                                    type={user.type}
                                                    className="input__platform"
                                                    placeholder={`${user.placeholder}`}
                                                    value={user.value}
                                                    title={user.fileName}
                                                    max={user.max ? user.max : ''}
                                                    min={user.min ? user.min : ''}
                                                    maxLength={user.maxLength ? user.maxLength : ''}
                                                    accept={user.accept ? user.accept : ''}
                                                    onChange={(e) => {
                                                        if (user.type === 'file') {
                                                            user.fuc(e.target.files[0]);
                                                        } else {
                                                            user.fuc(e.target.value);
                                                        }
                                                    }}
                                                    disabled={user.isDisabled}
                                                />
                                                <p className={cx('message', 'mesage-js')}></p>
                                            </div>
                                            {user.isUpdate ? (
                                                <BtnUpdate obj={Obj} />
                                            ) : (
                                                <div className={cx('item__right')}></div>
                                            )}
                                        </div>
                                    );
                                })}
                                {item.isQuestion ? (
                                    <div>
                                        <div className="flex">
                                            <h3 className="font-size-16 font-weight-500">Câu hỏi nghiên cứu</h3>
                                            <div
                                                className={cx('button_add_question')}
                                                onClick={(e) => {
                                                    questions.handleClick('');
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </div>
                                        </div>
                                        {questions.value.map((question, index) => {
                                            return (
                                                <div className="flex" key={index}>
                                                    <input
                                                        placeholder="Nhập nội dung câu hỏi"
                                                        value={question}
                                                        onChange={(e) => {
                                                            questions.change(e.target.value, index);
                                                        }}
                                                    />
                                                    <div
                                                        className={cx('btn__close')}
                                                        onClick={() => {
                                                            questions.close(index);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        );
                    })}
                </div>

                <button className={cx('btn-register')} disabled={isDisabled} onClick={RegisterPlatfrom}>
                    Đăng ký
                </button>
            </div>
        </div>
    ) : (
        <div className={cx('container')} onClick={FormatCount}>
            <div className={cx('wrapper')}>
                <h1 className={cx('title')}>
                    <Skeleton width={43} height={51} percent={true} />
                </h1>
                <div className={cx('content')}>
                    {arrs.map((arr, index) => {
                        return (
                            <div className={cx('content__student')} key={index}>
                                <Skeleton width={100} height={50} percent={true} />
                                {arr.map((user, index) => {
                                    return (
                                        <div className={cx('content__item')} key={index}>
                                            <Skeleton width={90} height={50} percent={true} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Skeleton width={30} height={50} ellipse={true} percent={true} />
                </div>
            </div>
        </div>
    );
}

export default ManagePlatform;
