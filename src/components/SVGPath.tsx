import React, { useState, useEffect } from 'react';


const DEFAULT_STROKE_WIDTH = 0.15;
const DEFAULT_STROKE_COLOR = '#e1e1e1';

type Point = {x: number, y: number}

interface PathProps {
    startElementId: string;
    endElementId: string;
    points: Point[];
    color: string;
    width: number;
    trace: boolean;
    progress: number;  
}

/**
 * SVGPath is an svg <path> element with utitlities
 *
 * @param {object[]} points - Array of Point objects - {x, y} - to plot this path
 * @param {string} color - stroke color of path
 * @param {number} [strokeWidth = DEFAULT_STROKE_WIDTH] - Width of the path
 * @param {boolean} [trace = false] - Will set the strokeDashOffset and strokeDashArray to the Path.getTotalLength
 *                                    so the path can appear to "trace" over itself
 * @param {number} [progress] - (min: 0, max: 1) Determines how far the "trace" effect has progressed. This should
 *                              increase in small intervals if trying to animate.
 * @returns {SVGPath} - svg <path> react component.
 */
export default function SVGPath(props: PathProps) {
    const [totalLength, setTotalLength] = useState<number>(0);
    useEffect(() => {
        setTotalLength(getTotalLength());
        // const { color, trace, strokeWidth } = props;

        // let pathStyles;
        // if (trace) {
        //     // line needs to appear to draw itself
        //     pathStyles = {
        //         strokeDasharray: totalLength,
        //         strokeDashoffset: getOffsetLength(),
        //     };
        // }
    }, []);

    const getOffsetLength = () => totalLength - (totalLength * props.progress);

    /**
     * Should calculate the same value as the DOM Path.getTotalLength() method
     *
     * @returns {number} - Total length of all points
     */
    const getTotalLength = () => {
        return props.points.reduce((total, point, i, points) => {

            // if this isn't the first point
            if (i) {
                return distance(points[i - 1], point) + total;
            }
            return total;
        }, 0);
    }

    /**
     * Calculate the distance between two points on a plane
     *
     * @param {object} p1 - first point object {x, y}
     * @param {object} p2 - second point object {x, y}
     * @returns {number} - distance between <p1> and <p2>
     */
    const distance = (p1: Point, p2: Point) => {
        let
            dy = p1.y - p2.y,
            dx = p1.x - p2.x;
        // Pythagorean Theorem
        return Math.sqrt(
            (dx * dx) + (dy * dy)
        );
    }

    /**
     * Reduce all points into a string for plotting the svg <path>
     *
     * @returns {string} - All points to use as d attribute of an svg path
     */
    const d = () => {
        // const { points } = props;
        let points: Point[] = [];

        // Maybe change to not use words like node so it isn't specific
        let startNode = document.getElementById(props.startElementId);
        let endNode = document.getElementById(props.endElementId);
        if (startNode && endNode) {
            // Change to not used hardcoded half of node height
            points.push({x: startNode.offsetLeft + 40, y: startNode.offsetTop + 20});
            points.push({x: endNode.offsetLeft, y: endNode.offsetTop + 20})
        }

        return points.reduce(
            (d, point) => `${d}L${point.x},${point.y}`,
            `M${points[0].x},${points[0].y}`
        );
    }

    return (
        <path
            fill="transparent"
            stroke={props.color}
            strokeWidth={props.width}
            d={d()}
            //style={pathStyles}
        />
    );
}