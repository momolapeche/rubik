import { mat4 } from "./math.js";
import { Transform } from "./transform.js";

export class Camera {
    /** @type { Transform } */
    transform
    /** @type { mat4 } */
    matrix
    /** @type { mat4 } */
    projection

    /**
        * @param { mat4 } projection
    */
    constructor(projection) {
        this.projection = projection
        this.transform = new Transform()
        this.matrix = mat4.create()
    }

    update() {
        mat4.invert(this.matrix, this.transform.matrix)
    }
}
