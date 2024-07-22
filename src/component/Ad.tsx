import React from 'react';

const Ad = ({size}:{size:"sm" | "md" | "lg"}) => {
    return (
        <div className={'p-4 bg-white  shadow-md rounded-lg text-sm'}>
            ADS
        </div>
    );
};

export default Ad;