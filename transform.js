import { mat4, quat, vec3 } from "./math.js"

export class Transform {
    /** @type { vec3 } */
    position
    /** @type { quat } */
    rotation
    /** @type { vec3 } */
    scale
    /** @type { mat4 } */
    matrix
    /** @type { Transform[] } */
    children

    constructor() {
        this.position = vec3.create()
        this.rotation = quat.create()
        this.scale = vec3.fromValues(1, 1, 1)
        this.matrix = mat4.create()
        this.children = []
    }

    /** @param { mat4 | undefined } parentMatrix */
    update(parentMatrix) {
        mat4.fromRotationTranslationScale(this.matrix, this.rotation, this.position, this.scale)
        if (parentMatrix !== undefined) {
            mat4.mul(this.matrix, parentMatrix, this.matrix)
        }
        for (const c of this.children) {
            c.update(this.matrix)
        }
    }
}
