import React, { useState, useEffect } from 'react';
import Machine from '../../../assets/img/machine.png';

const FinLoad = () => {
    const [rocket, setRocket] = useState(true);
    const [finLoad, setFinLoad] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [minTime, setminTime] =useState(1);

    useEffect(() => {
        const timer01 = setTimeout(() => {
            setFinLoad(true);
        }, 5000);
        const timer02 = setTimeout(()=>{
            setminTime(2);
        },5000)
        const timer03 = setTimeout(() => {
            setShowSubmit(true); // 10초 후에 버튼을 보이도록 설정
            setminTime(3);
        }, 9000);


        return () => {
            clearTimeout(timer01);
            clearTimeout(timer03);
        };
    }, []);

    return (
        <div className='loads'>
            {minTime === 1 ? (
                <p className='text rocket-text'>달이에게 마음이 전해지고 있어요...</p>
            ) : minTime === 2 ? (
                <p className='text type-text'>달이가 보호자님의 마음을 읽으며 <br/>답장을 쓰고 있어요.</p>
            ) : (
                <p className='text final-text'>달이의 소중한 답장이 도착했어요.</p>
            )}
                
                
            {rocket && (
                <div className='loading-wrap'>
                    <div className='rocket-wrap'>
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
                </div>
            )}
            {finLoad && (
                <div className='finload-wrap'>
                    
                    <div className='typing-machine'>
                    <div className="typewriter">
                        <div className="slide"><i></i></div>
                        <div className="paper"></div>
                        <div className="keyboard"></div>
                        <ul className="star">
                                {Array.from({ length: 7 }, (_, index) => (
                                    <li key={index}></li>
                                ))}
                            </ul>
                    </div>
                    </div>
                    {showSubmit && <button className='submit'>달이의 마음 확인하기</button>}
                </div>
            )}
        </div>
    );
};

export default FinLoad;
