import { vec3 } from "./math.js"


const b = 0.9
const c = 0.8

const black   = vec3.fromValues(0, 0, 0)
const red     = vec3.fromValues(1, 0, 0)
const cyan    = vec3.fromValues(1, 0.5, 0)
const green   = vec3.fromValues(1, 1, 0)
const magenta = vec3.fromValues(1, 1, 1)
const blue    = vec3.fromValues(0, 1, 0)
const yellow  = vec3.fromValues(0, 0, 1)
const grey  = vec3.fromValues(0.5, 0.5, 0.5)

function getPositions(x0, x1, y0, y1, z0, z1) {
    return new Float32Array(Array(3).fill([
        // 0
        -c - x0, -b - y0, 1 + z1,
         c + x1, -b - y0, 1 + z1,
         b + x1, -c - y0, 1 + z1,
         b + x1,  c + y1, 1 + z1,
         c + x1,  b + y1, 1 + z1,
        -c - x0,  b + y1, 1 + z1,
        -b - x0,  c + y1, 1 + z1,
        -b - x0, -c - y0, 1 + z1,

        // 8
        -c - x0, -b - y0, -1 - z0,
         c + x1, -b - y0, -1 - z0,
         b + x1, -c - y0, -1 - z0,
         b + x1,  c + y1, -1 - z0,
         c + x1,  b + y1, -1 - z0,
        -c - x0,  b + y1, -1 - z0,
        -b - x0,  c + y1, -1 - z0,
        -b - x0, -c - y0, -1 - z0,

        // 16
        -c - x0,  1 + y1,  b + z1,
         c + x1,  1 + y1,  b + z1,
         b + x1,  1 + y1,  c + z1,
         b + x1,  1 + y1, -c - z0,
         c + x1,  1 + y1, -b - z0,
        -c - x0,  1 + y1, -b - z0,
        -b - x0,  1 + y1, -c - z0,
        -b - x0,  1 + y1,  c + z1,

        // 24
        -c - x0, -1 - y0,  b + z1,
         c + x1, -1 - y0,  b + z1,
         b + x1, -1 - y0,  c + z1,
         b + x1, -1 - y0, -c - z0,
         c + x1, -1 - y0, -b - z0,
        -c - x0, -1 - y0, -b - z0,
        -b - x0, -1 - y0, -c - z0,
        -b - x0, -1 - y0,  c + z1,

        // 32
        1 + x1, -b - y0,  c + z1,
        1 + x1, -b - y0, -c - z0,
        1 + x1, -c - y0, -b - z0,
        1 + x1,  c + y1, -b - z0,
        1 + x1,  b + y1, -c - z0,
        1 + x1,  b + y1,  c + z1,
        1 + x1,  c + y1,  b + z1,
        1 + x1, -c - y0,  b + z1,

        // 40
        -1 - x0, -b - y0,  c + z1,
        -1 - x0, -b - y0, -c - z0,
        -1 - x0, -c - y0, -b - z0,
        -1 - x0,  c + y1, -b - z0,
        -1 - x0,  b + y1, -c - z0,
        -1 - x0,  b + y1,  c + z1,
        -1 - x0,  c + y1,  b + z1,
        -1 - x0, -c - y0,  b + z1,
    ]).flat())
}

function getNormalsAndColors(isMirror = false) {
    const normals = []
    const colors  = []

    function createNormalsAndColors(size, normal, color) {
        for (let i = 0; i < size; i++) {
            normals.push(normal[0], normal[1], normal[2])
            colors.push(color[0], color[1], color[2])
        }
    }

    const c45 = 1 / Math.sqrt(2)
    const r3 = 1 / Math.sqrt(3)

    createNormalsAndColors(8, vec3.fromValues(0, 0, 1), isMirror ? grey : red)
    createNormalsAndColors(8, vec3.fromValues(0, 0, -1), isMirror ? grey : cyan)
    createNormalsAndColors(8, vec3.fromValues(0, 1, 0), isMirror ? grey : green)
    createNormalsAndColors(8, vec3.fromValues(0, -1, 0), isMirror ? grey : magenta)
    createNormalsAndColors(8, vec3.fromValues(1, 0, 0), isMirror ? grey : blue)
    createNormalsAndColors(8, vec3.fromValues(-1, 0, 0), isMirror ? grey : yellow)

    createNormalsAndColors(8, vec3.fromValues(0, 0, 1), black)
    createNormalsAndColors(8, vec3.fromValues(0, 0, -1), black)
    createNormalsAndColors(8, vec3.fromValues(0, 1, 0), black)
    createNormalsAndColors(8, vec3.fromValues(0, -1, 0), black)
    createNormalsAndColors(8, vec3.fromValues(1, 0, 0), black)
    createNormalsAndColors(8, vec3.fromValues(-1, 0, 0), black)

    createNormalsAndColors(8, vec3.fromValues(0, 0, 1), black)
    createNormalsAndColors(8, vec3.fromValues(0, 0, -1), black)
    createNormalsAndColors(8, vec3.fromValues(0, 1, 0), black)
    createNormalsAndColors(8, vec3.fromValues(0, -1, 0), black)
    createNormalsAndColors(8, vec3.fromValues(1, 0, 0), black)
    createNormalsAndColors(8, vec3.fromValues(-1, 0, 0), black)

    return {
        colors: new Float32Array(colors),
        normals: new Float32Array(normals),
    }
}


const indices = []
function createFace(start, size) {
    for (let i = 0; i < size - 2; i++) {
        indices.push(start + size - 1)
        indices.push(start + i)
        indices.push(start + i + 1)
    }
}

/**
    * @param {number[]} indices 
*/
function createFaceArr(pointsIndices) {
    const lastElem = pointsIndices[pointsIndices.length - 1]
    for (let i = 0; i < pointsIndices.length - 2; i++) {
        indices.push(lastElem)
        indices.push(pointsIndices[i])
        indices.push(pointsIndices[i + 1])
    }
}
createFace(0, 8)
createFace(8, 8)
createFace(16, 8)
createFace(24, 8)
createFace(32, 8)
createFace(40, 8)

createFaceArr([3, 2, 39, 38].map(x => x + 48))
createFaceArr([6, 7, 47, 46].map(x => x + 48))
createFaceArr([11, 10, 34, 35].map(x => x + 48))
createFaceArr([14, 15, 42, 43].map(x => x + 48))

createFaceArr([5, 4, 17, 16].map(x => x + 48))
createFaceArr([0, 1, 25, 24].map(x => x + 48))
createFaceArr([13, 12, 20, 21].map(x => x + 48))
createFaceArr([8, 9, 28, 29].map(x => x + 48))

createFaceArr([37, 36, 19, 18].map(x => x + 48))
createFaceArr([32, 33, 27, 26].map(x => x + 48))
createFaceArr([45, 44, 22, 23].map(x => x + 48))
createFaceArr([40, 41, 30, 31].map(x => x + 48))

createFaceArr([4, 3, 38, 37, 18, 17].map(x => x + 96))
createFaceArr([5, 6, 46, 45, 23, 16].map(x => x + 96))
createFaceArr([1, 2, 39, 32, 26, 25].map(x => x + 96))
createFaceArr([0, 7, 47, 40, 31, 24].map(x => x + 96))
createFaceArr([12, 11, 35, 36, 19, 20].map(x => x + 96))
createFaceArr([13, 14, 43, 44, 22, 21].map(x => x + 96))
createFaceArr([9, 10, 34, 33, 27, 28].map(x => x + 96))
createFaceArr([8, 15, 42, 41, 30, 29].map(x => x + 96))

export const CubonGeometry = {
    getPositions,
    getNormalsAndColors,
    indices: new Uint16Array(indices),
}


export const CubonRTGeometry = {
    positions: new Float32Array([
        -1, -1,  1,
         1, -1,  1,
        -1,  1,  1,
        -1,  1,  1,
         1, -1,  1,
         1,  1,  1,

        -1, -1, -1,
        -1,  1, -1,
         1, -1, -1,
         1, -1, -1,
        -1,  1, -1,
         1,  1, -1,

         1, -1,  1,
         1, -1, -1,
         1,  1,  1,
         1,  1,  1,
         1, -1, -1,
         1,  1, -1,

        -1, -1,  1,
        -1,  1,  1,
        -1, -1, -1,
        -1, -1, -1,
        -1,  1,  1,
        -1,  1, -1,

        -1,  1,  1,
         1,  1,  1,
        -1,  1, -1,
        -1,  1, -1,
         1,  1,  1,
         1,  1, -1,

        -1, -1,  1,
        -1, -1, -1,
         1, -1,  1,
         1, -1,  1,
        -1, -1, -1,
         1, -1, -1,
    ]),
    normals: new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]),
    colors: new Float32Array([
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,
    ]),
    indices: new Uint16Array(Array(36).fill(0).map((_, i) => i))
}
