import { mat3, vec3 } from "./math.js"

const rotations = {
    x: [
        new Int8Array([
            1,  0, 0,
            0,  0, 1,
            0, -1, 0,
        ]),
        new Int8Array([
            1,  0,  0,
            0, -1,  0,
            0,  0, -1,
        ]),
        new Int8Array([
            1, 0,  0,
            0, 0, -1,
            0, 1,  0,
        ]),
    ],
    y: [
        new Int8Array([
            0, 0, -1,
            0, 1,  0,
            1, 0,  0,
        ]),
        new Int8Array([
            -1, 0,  0,
            0,  1,  0,
            0,  0, -1,
        ]),
        new Int8Array([
            0,  0, 1,
            0,  1, 0,
            -1, 0, 0,
        ]),
    ],
    z: [
        new Int8Array([
            0, 1, 0,
            -1, 0, 0,
            0, 0, 1,
        ]),
        new Int8Array([
            -1,  0, 0,
            0,  -1, 0,
            0,   0, 1,
        ]),
        new Int8Array([
            0, -1, 0,
            1,  0, 0,
            0,  0, 1,
        ]),
    ],
}

/** @typedef { mat3[] } CubeState */

/**
    * IMPORTANT: modifies previous state
    * @param { CubeState } state
    * @param { number } quantity
    * @param { number } x0
    * @param { number } x1
    * @returns { CubeState }
 */
export function cubeStateRotationX(state, quantity, x0, x1) {
    const newState = []

    const rotation = rotations.x[quantity - 1]

    for (let i = 0; i < 3*3*3; i++) {
        const x = (i % 3)
        const y = (Math.floor(i / 3) % 3)
        const z = (Math.floor(i / 9))

        if (x < x0 || x >= x1) {
            newState[i] = state[i]
        }
        else {
            const v = new Int8Array([x - 1, y - 1, z - 1])

            vec3.transformMat3(v, v, rotation)

            const newIndex = (v[0] + 1) + (v[1] + 1) * 3 + (v[2] + 1) * 9
            newState[newIndex] = mat3.mul(state[i], rotation, state[i])
        }
    }

    return newState
}

/**
    * IMPORTANT: modifies previous state
    * @param { CubeState } state
    * @param { number } quantity
    * @param { number } y0
    * @param { number } y1
    * @returns { CubeState }
 */
export function cubeStateRotationY(state, quantity, y0, y1) {
    const newState = []

    const rotation = rotations.y[quantity - 1]

    for (let i = 0; i < 3*3*3; i++) {
        const x = (i % 3)
        const y = (Math.floor(i / 3) % 3)
        const z = (Math.floor(i / 9))

        if (y < y0 || y >= y1) {
            newState[i] = state[i]
        }
        else {
            const v = new Int8Array([x - 1, y - 1, z - 1])

            vec3.transformMat3(v, v, rotation)

            const newIndex = (v[0] + 1) + (v[1] + 1) * 3 + (v[2] + 1) * 9
            newState[newIndex] = mat3.mul(state[i], rotation, state[i])
        }
    }

    return newState
}

/**
    * IMPORTANT: modifies previous state
    * @param { CubeState } state
    * @param { number } quantity
    * @param { number } z0
    * @param { number } z1
    * @returns { CubeState }
 */
export function cubeStateRotationZ(state, quantity, z0, z1) {
    const newState = []

    const rotation = rotations.z[quantity - 1]

    for (let i = 0; i < 3*3*3; i++) {
        const x = (i % 3)
        const y = (Math.floor(i / 3) % 3)
        const z = (Math.floor(i / 9))

        if (z < z0 || z >= z1) {
            newState[i] = state[i]
        }
        else {
            const v = new Int8Array([x - 1, y - 1, z - 1])

            vec3.transformMat3(v, v, rotation)

            const newIndex = (v[0] + 1) + (v[1] + 1) * 3 + (v[2] + 1) * 9
            newState[newIndex] = mat3.mul(state[i], rotation, state[i])
        }
    }

    return newState
}
