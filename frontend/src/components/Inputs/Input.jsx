import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

const Input = (props) => {
    const { value, onChange, label, placeholder, type } = props;
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className='text-[13px] text-slate-800'>{label}</label>
            <div className="input-box">
                {type === 'textarea' ? (
                    <textarea
                        placeholder={placeholder}
                        className='w-full bg-transparent outline-none'
                        value={value}
                        onChange={onChange}
                        rows={props.rows || 3}
                    />
                ) : (
                    <input
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        className='w-full bg-transparent outline-none'
                        value={value}
                        onChange={onChange}
                    />
                )}

                {type === 'password' && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='text-primary cursor-pointer'
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='text-secondary cursor-pointer'
                                onClick={toggleShowPassword}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Input