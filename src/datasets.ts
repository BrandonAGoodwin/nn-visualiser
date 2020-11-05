import d3 from 'd3';

export type Dataset2D = {
    x: number,
    y: number,
    label: number
};

export class Datasets {
    public static GAUSSIAN: Dataset2D
}

export function generateGaussianData(numSamples: number, noise: number): Dataset2D[] {
    // Implementing without noise first
    noise = 0;
    
    let samples: Dataset2D[] = [];

    // Workiung with an -8, 8 grid


    return samples;
}

/**
 * Function to randomly generate a point in the normal distribution described by
 * the mean and variance parameters, using the Box-Muller transform
 * @param mean 
 * @param variance 
 */
function normalDistribution(mean: number, variance:number): number {
    while(mean === 0) mean = Math.random();
    while(variance === 0) variance = Math.random();
    return Math.sqrt(-2.0 * Math.log(mean)) * Math.cos(2.0 * Math.PI * variance);
}