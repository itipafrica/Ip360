import React from 'react';

export default function IconDev({ classes, list, onClickHandlers }) {
    return (
        <div className={`w-full flex flex-wrap lg:gap-4 gap-2 items-center ${classes}`}>
            {list && list.map((icon, index) => (
                <button
                    type="button"
                    key={index}
                    className="lg:w-10 w-7 opacity-85 hover:opacity-100 sl-animated-md"
                    onClick={(e) => onClickHandlers[icon] && onClickHandlers[icon](e)}
                >
                    <img src={`/icon/${icon}.png`} alt={icon} />
                </button>
            ))}
        </div>
    );
}