import * as d3 from "d3";

// Maybe refactor to Datapoint
export type Datapoint2D = {
    x1: number,
    x2: number,
    y: number
};

export type DatasetGenerator = (numSamples: number, noise: number) => Datapoint2D[];


export class Dataset {

    public static GAUSSIAN_2: DatasetGenerator = (numSamples, noise) => {
        // When noise = 0, variance = 0.5 and when noise = 1, variance = 8
        let varianceScale = d3.scaleLinear().domain([0, .5]).range([0.5, 4]); // Arbitrary
        let variance = varianceScale(noise) || 0;
        let samples: Datapoint2D[] = [];

        /**
         * Generate a gaussian dataset with centre point (/mean) at cx, cy
         * @param cx Mean of distribution along x
         * @param cy Mean of distribution along y
         * @param variance Variance of distribution
         */
        function generateGaussianData(cx1: number, cx2: number, y: number) {
            // Workiung with an -8, 8 grid non-variable for the forseeable future
            for (let i = 0; i < numSamples / 2; i++) {
                let x1 = normalDistribution(cx1, variance);
                let x2 = normalDistribution(cx2, variance);
                samples.push({ x1: x1, x2: x2, y: y });
            }
        }

        // Generate two sets of gauss distributed data with mean at points (-3, -3) and (3, 3) each with 
        generateGaussianData(-3, -3, -1);
        generateGaussianData(3, 3, 1);

        return shuffle(samples);
    }

    public static GAUSSIAN_3: DatasetGenerator = (numSamples, noise) => {
        let varianceScale = d3.scaleLinear().domain([0, .5]).range([0.5, 4]); // Arbitrary
        let variance = varianceScale(noise) || 0;
        let samples: Datapoint2D[] = [];

        /**
         * Generate a gaussian dataset with centre point (/mean) at cx, cy
         * @param cx Mean of distribution along x
         * @param cy Mean of distribution along y
         * @param variance Variance of distribution
         */
        function generateGaussianData(numSamples: number, cx1: number, cx2: number, y: number) {
            // Workiung with an -8, 8 grid non-variable for the forseeable future
            for (let i = 0; i < numSamples; i++) {
                let x1 = normalDistribution(cx1, variance);
                let x2 = normalDistribution(cx2, variance);
                samples.push({ x1: x1, x2: x2, y: y });
            }
        }

        // Generate two sets of gauss distributed data with mean at points (-3, -3) and (3, 3) each with 
        generateGaussianData(numSamples / 4, -4, -4, -1);
        generateGaussianData(numSamples / 2, 0, 0, 1);
        generateGaussianData(numSamples / 4, 4, 4, -1);

        return shuffle(samples);
    }

    public static XOR: DatasetGenerator = (numSamples, noise) => {
        let noiseScale = d3.scaleLinear().domain([0, 1]).range([-0.5, 0.5]);
        let samples: Datapoint2D[] = [];
        function generateUniformData(cx1: number, cx2: number, width: number, height: number, y: number) {
            let x1Scale = d3.scaleLinear().domain([0, 1]).range([cx1 - (width / 2), cx1 + (width / 2)]);
            let x2Scale = d3.scaleLinear().domain([0, 1]).range([cx2 - (height / 2), cx2 + (height / 2)]);
            for (let i = 0; i < numSamples / 4; i++) {
                let x1 = x1Scale(Math.random() + (noiseScale(Math.random()) || 0) * noise) || 0;
                let x2 = x2Scale(Math.random() + (noiseScale(Math.random()) || 0) * noise) || 0;
                samples.push({ x1: x1, x2: x2, y: y });
            }
        }

        generateUniformData(-8 / 2, 8 / 2, 8, 8, 1);     // Top left +1
        generateUniformData(8 / 2, 8 / 2, 8, 8, -1);     // Top right -1
        generateUniformData(-8 / 2, -8 / 2, 8, 8, -1);   // Bottom left -1
        generateUniformData(8 / 2, -8 / 2, 8, 8, 1);     // Bottom right +1

        return shuffle(samples);
    }
}


/**
 * Function to randomly generate a point in the normal distribution described by
 * the mean and variance parameters, using the Box-Muller transform
 * @param mean the mean or mu to describe the normal(/gaussian) distribution
 * @param variance The variance or sigma squared to describe the normal(/gaussian) distribution
 */
function normalDistribution(mean: number, variance: number): number {
    let x1, x2, y, w: number;

    mean = mean || 0;
    variance = variance || 1;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        w = x1 * x1 + x2 * x2;
    } while (w > 1);

    y = Math.sqrt(-2 * Math.log(w) / w) * x1;

    return mean + Math.sqrt(variance) * y;
}

function shuffle(dataset: Datapoint2D[]): Datapoint2D[] {
    var currentIndex = dataset.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = dataset[currentIndex];
        dataset[currentIndex] = dataset[randomIndex];
        dataset[randomIndex] = temporaryValue;
    }

    return dataset;
}