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
    //   static defaultProps = {
    //     visible: true,
    //     offsetX: 0,
    //     offsetY: 0,
    //   };

    //   state = {
    //     xPosition: 0,
    //     yPosition: 0,
    //     mouseMoved: false,
    //     listenerActive: false,
    //   };

    //   const [xPosition, setXPosition] = useState<number>(0);
    //   const [yPositionm, setYPosition] = useState<number>(0);
    const [position, setPosition] = useState<Point2D>({ x: 0, y: 0 });
    const [mouseMoved, setMouseMoved] = useState<boolean>(false);
    const [listenerActive, setListenerActive] = useState<boolean>(false);


    useEffect(() => {
        // window.addEventListener('mousemove', getTooltipPosition);
        // setListenerActive(true);
        addListener();
        return () => {
            // window.removeEventListener('mousemove', getTooltipPosition);
            // setListenerActive(false);
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

    //   componentDidMount() {
    //     this.addListener();
    //   }

    //   componentDidUpdate() {
    //     this.updateListener();
    //   }

    //   componentWillUnmount() {
    //     this.removeListener();
    //   }

    const getTooltipPosition = (event: MouseEvent) => {
        setPosition({ x: event.clientX, y: event.clientY });
        setMouseMoved(true);
        // Maybe have one state object
        // this.setState({
        //   xPosition,
        //   yPosition,
        //   mouseMoved: true,
        // });
    };

    //   addListener = () => {
    //     window.addEventListener('mousemove', this.getTooltipPosition);
    //     this.setState({ listenerActive: true });
    //   };

      const addListener = () => {
        window.addEventListener('mousemove', getTooltipPosition);
        setListenerActive(true);
      };

    //   removeListener = () => {
    //     window.removeEventListener('mousemove', this.getTooltipPosition);
    //     this.setState({ listenerActive: false });
    //   };

      const removeListener = () => {
        window.removeEventListener('mousemove', getTooltipPosition);
            setListenerActive(false);
      };

    //   updateListener = () => {
    //     if (!this.state.listenerActive && this.props.visible) {
    //       this.addListener();
    //     }

    //     if (this.state.listenerActive && !this.props.visible) {
    //       this.removeListener();
    //     }
    //   };

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

// MouseTooltip.propTypes = {
//   visible: PropTypes.bool,
//   children: PropTypes.node.isRequired,
//   offsetX: PropTypes.number,
//   offsetY: PropTypes.number,
//   className: PropTypes.string,
//   style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
// };

export default MouseTooltip;