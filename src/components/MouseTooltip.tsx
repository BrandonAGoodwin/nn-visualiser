import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';

interface Point2D {
    x: number;
    y: number;
}

interface TooltipProps {
    className?: string;
    visible: boolean;
    offsetX?: number;
    offsetY?: number;
    style?: object;
}

const MouseTooltip: React.FC<TooltipProps> = ({
    offsetX = 0,
    offsetY = 0,
    ...args
}) => {
    const props = { offsetX, offsetY, ...args };
 
    const [position, setPosition] = useState<Point2D>({ x: 0, y: 0 });
    const [mouseMoved, setMouseMoved] = useState<boolean>(false);
    const [listenerActive, setListenerActive] = useState<boolean>(false);


    useEffect(() => {
        addListener();
        return () => {
            removeListener();
        }
    }, []);

    useEffect(() => {
        if (!listenerActive && props.visible) {
            addListener();
        }

        if (listenerActive && !props.visible) {
            removeListener();
        }
    }, [props.visible, mouseMoved]);

    const getTooltipPosition = (event: MouseEvent) => {
        setPosition({ x: event.clientX, y: event.clientY });
        setMouseMoved(true);
    };

      const addListener = () => {
        window.addEventListener('mousemove', getTooltipPosition);
        setListenerActive(true);
      };

      const removeListener = () => {
        window.removeEventListener('mousemove', getTooltipPosition);
            setListenerActive(false);
      };

    return (
        <div
            className={props.className}
            style={{
                display: props.visible && mouseMoved ? 'block' : 'none',
                position: 'fixed',
                top: position.y + props.offsetY,
                left: position.x + props.offsetX,
                ...props.style,
            }}
        >
            {props.children}
        </div>
    );
}


export default MouseTooltip;