import * as d3 from "d3";

export type Dataset2D = {
    x1: number,
    x2: number,
    y: number
};

export type DatasetGenerator = (numSamples: number, noise: number) => Dataset2D[];

export class Dataset {
    
    // Could create 3 gauss data quite easily
    public static GAUSSIAN: DatasetGenerator = (numSamples, noise) => {
        let varianceScale = d3.scaleLinear().domain([0, .5]).range([0.5, 4]); // Arbitrary
        let variance = varianceScale(noise) || 0;
        let samples: Dataset2D[] = [];

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
                samples.push({ x1: x1, x2: x2, y: y })
            }
        }

        // Generate two sets of gauss distributed data with mean at points (-3, -3) and (3, 3) each with 
        generateGaussianData(-3, -3, -1); // Classifications 0 or 1 changed from -1 to 1 because of sigmoid neural net output
        generateGaussianData(3, 3, 1)

        return samples;
    }

    public static XOR: DatasetGenerator = (numSamples, noise) => {
        let samples: Dataset2D[] = [];
        // Noise currently not implemented
        function generateUniformData(cx1: number, cx2: number, width: number, height: number, y: number) {
            let x1Scale = d3.scaleLinear().domain([0, 1]).range([cx1 - (width / 2), cx1 + (width / 2)]);
            let x2Scale = d3.scaleLinear().domain([0, 1]).range([cx2 - (height / 2), cx2 + (height / 2)]);
            for (let i = 0; i < numSamples / 4; i++) {
                let x1 = x1Scale(Math.random()) || 0;
                let x2 = x2Scale(Math.random()) || 0;
                samples.push({ x1: x1, x2: x2, y: y })
            }
        }

        generateUniformData(-8 / 2, 8 / 2, 8, 8, 1) // Top left +1
        generateUniformData(8 / 2, 8 / 2, 8, 8, -1) // Top right -1
        generateUniformData(-8 / 2, -8 / 2, 8, 8, -1) // Bottom left -1
        generateUniformData(8 / 2, -8 / 2, 8, 8, 1) // Bottom right +1

        return samples;
    }
}

// let GENERATORS: { [datasetType: string]: DatasetGenerator } = {
//     "Gaussian" : Dataset,
//     "XOR": nn.Activations.SIGMOID,
// }



/**
 * Function to randomly generate a point in the normal distribution described by
 * the mean and variance parameters, using the Box-Muller transform
 * @param mean the mean or mu to describe the normal(/gaussian) distribution
 * @param variance The variance or sigma squared to describe the normal(/gaussian) distribution
 */
function normalDistribution(mean: number, variance: number): number {
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

    return mean + Math.sqrt(variance) * y;
}