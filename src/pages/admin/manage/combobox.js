import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Combobox({ itemSource, handleClick, displayMember, SelecteLabel, title }) {
    const [isShow, setIsShow] = useState(false);
    const [values, setvalues] = useState(itemSource);
    const [selectedValue, setSelectedValue] = useState(itemSource[0]);
    const labelRef = useRef(0);

    useEffect(() => {
        SelecteLabel(labelRef.current);
    }, []);

    useEffect(() => {
        handleClick(selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        setvalues(itemSource);
    }, [itemSource]);

    return (
        <div className={cx('wrapper__input', 'mar-b-20')} style={{ position: 'relative', flex: '1' }}>
            <label htmlFor="team-report" onClick={(e) => SelecteLabel(e.target)} ref={labelRef}>
                {title}
            </label>
            <input
                id="team-report"
                value={selectedValue ? selectedValue[displayMember] : ''}
                onChange={(e) => {
                    const selectedValues = itemSource.filter(
                        (item) => item[displayMember].toLowerCase() === e.target.value.toLowerCase(),
                    );
                    if (selectedValues.length !== 0) {
                        setSelectedValue(selectedValues[0]);
                    } else {
                        setSelectedValue({});
                    }
                    const arr = itemSource.filter((item) =>
                        item[displayMember].toLowerCase().includes(e.target.value.toLowerCase()),
                    );
                    setvalues(arr);

                    if (arr.length === 0) {
                        setIsShow(false);
                    } else {
                        setIsShow(true);
                    }
                }}
            />
            <div
                className={cx('icon')}
                onClick={() => {
                    setIsShow(!isShow);
                }}
            >
                <FontAwesomeIcon icon={faAngleDown} />
            </div>
            {isShow ? (
                <div className={cx('form-controll')}>
                    <ul>
                        {values.map((value, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setSelectedValue(value);
                                        setIsShow(false);
                                        SelecteLabel(labelRef.current);
                                        handleClick(value);
                                    }}
                                >
                                    {value[displayMember]}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

export default Combobox;
