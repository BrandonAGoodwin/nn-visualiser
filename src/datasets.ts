//var d3 = require("d3"); // might require browserify/watchify
//var p5 = require("p5")
import * as d3 from "d3";

export type Dataset2D = {
    x: number,
    y: number,
    label: number
};

export class Datasets {
    public static GAUSSIAN: Dataset2D
}

// Could create 3 gauss data quite easily
export function generateTwoGaussianData(numSamples: number, noise: number): Dataset2D[] {
    // Implementing without noise first
    noise = 0;
    let varianceScale = d3.scaleLinear().domain([0, .5]).range([0.5, 4]); // Arbitrary
    let variance = 0.5;
    let samples: Dataset2D[] = [];

    /**
     * Generate a gaussian dataset with centre point (/mean) at cx, cy
     * @param cx Mean of distribution along x
     * @param cy Mean of distribution along y
     * @param variance Variance of distribution
     */
    function generateGaussianData(cx: number, cy: number, label: number) {
        // Workiung with an -8, 8 grid non-variable for the forseeable future
        for(let i = 0; i < numSamples/2; i++) {
            let x = normalDistribution(cx, variance);
            let y = normalDistribution(cy, variance);
            console.log(x)
            samples.push({x: x, y: y, label: label})
        }
    }

    // Generate two sets of gauss distributed data with mean at points (-3, -3) and (3, 3) each with 
    generateGaussianData(-3,-3, -1);
    generateGaussianData(3, 3, 1)

    return samples;
}

/**
 * Function to randomly generate a point in the normal distribution described by
 * the mean and variance parameters, using the Box-Muller transform
 * @param mean the mean or mu to describe the normal(/gaussian) distribution
 * @param variance The variance or sigma squared to describe the normal(/gaussian) distribution
 */
function normalDistribution(mean: number, variance:number): number {
    let x1, x2, y, w: number;

    // check that the mean and variance have values
    mean = mean || 0;
    variance = variance || 1;
    // check this works ^^

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        w = x1 * x1 + x2 * x2;
    } while (w > 1);

    y = Math.sqrt(-2 * Math.log(w) / w) * x1;
    
    // while(mean === 0) mean = Math.random();
    // while(variance === 0) variance = Math.random();
    //console.log(mean)
    return mean + Math.sqrt(variance) * y;
}