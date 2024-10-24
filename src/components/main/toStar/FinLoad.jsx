import React, { useState, useEffect } from 'react';
import Machine from '../../../assets/img/machine.png';

const FinLoad = () => {
    const [rocket, setRocket] = useState(true);
    const [finLoad, setFinLoad] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);

    useEffect(() => {
        const timer01 = setTimeout(() => {
            setRocket(false);
            setFinLoad(true);
        }, 6000);

        const timer03 = setTimeout(() => {
            setShowSubmit(true); // 10초 후에 버튼을 보이도록 설정
        }, 9000);

        return () => {
            clearTimeout(timer01);
            clearTimeout(timer03);
        };
    }, []);

    return (
        <div className='loads'>
            {rocket && (
                <div className='loading-wrap'>
                    <p className='text'>달이에게 마음이 전해지고 있어요...</p>
                    <div className="rocket">
                        <div className="rocket-body">
                            <div className="body"></div>
                            <div className="fin fin-left"></div>
                            <div className="fin fin-right"></div>
                            <div className="window"></div>
                        </div>
                        <div className="exhaust-flame"></div>
                        <ul className="exhaust-fumes">
                            {Array.from({ length: 9 }, (_, index) => (
                                <li key={index}></li>
                            ))}
                        </ul>
                        <ul className="star">
                            {Array.from({ length: 7 }, (_, index) => (
                                <li key={index}></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {finLoad && (
                <div className='finload-wrap'>
                    <p className='text'>달이가 보호자님의 마음을 읽으며 답장을 쓰고 있어요.</p>
                    <img src={Machine} alt="machine" />
                    {showSubmit && <button className='submit'>달이의 마음 확인하기</button>}
                </div>
            )}
        </div>
    );
};

export default FinLoad;
