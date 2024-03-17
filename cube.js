import { mat3, mat4, vec3 } from "./math.js"

const lightDir = vec3.fromValues(1, 1, 1)
vec3.normalize(lightDir, lightDir)

const tmpVec3 = vec3.create()

const floorCenter = vec3.fromValues(0, -1.5, 0)
const floorNormal = vec3.fromValues(0,  1, 0)

const colors = {
    red: vec3.fromValues(255, 0, 0),
    orange: vec3.fromValues(255, 128, 0),
    blue: vec3.fromValues(0, 0, 255),
    green: vec3.fromValues(0, 255, 0),
    white: vec3.fromValues(255, 255, 255),
    yellow: vec3.fromValues(255, 255, 0),
    black: vec3.fromValues(0, 0, 0),
}
const orderedColors = [
    colors.red,
    colors.orange,
    colors.blue,
    colors.green,
    colors.white,
    colors.yellow,
]


const shadowFaces = [
    //  x   y   z
    [
        0 + 0 + 1,
        4 + 0 + 1,
        4 + 2 + 1,
        0 + 2 + 1,
    ],
    [
        0 + 0 + 0,
        4 + 0 + 0,
        4 + 2 + 0,
        0 + 2 + 0,
    ],
    [
        4 + 0 + 1,
        4 + 0 + 0,
        4 + 2 + 0,
        4 + 2 + 1,
    ],
    [
        0 + 0 + 1,
        0 + 0 + 0,
        0 + 2 + 0,
        0 + 2 + 1,
    ],
    [
        0 + 2 + 1,
        4 + 2 + 1,
        4 + 2 + 0,
        0 + 2 + 0,
    ],
    [
        0 + 0 + 1,
        4 + 0 + 1,
        4 + 0 + 0,
        0 + 0 + 0,
    ],
]


/**
    * ordered normals [ front, back, right, left, up, down ]
    * @type { vec3[] }
 */
const normals = [
    vec3.fromValues(0, 0,  1),
    vec3.fromValues(0, 0, -1),
    vec3.fromValues( 1, 0, 0),
    vec3.fromValues(-1, 0, 0),
    vec3.fromValues(0,  1, 0),
    vec3.fromValues(0, -1, 0),
]
const NORMAL_FRONT = 0
const NORMAL_BACK  = 1
const NORMAL_RIGHT = 2
const NORMAL_LEFT  = 3
const NORMAL_UP    = 4
const NORMAL_DOWN  = 5


function mapNormalToIndex(x, y, z) {
    return (x ? 2 + (1 - x) / 2 : 0) + (y ? 4 + (1 - y) / 2 : 0) + (z ? 0 + (1 - z) / 2 : 0)
}

/**
    * default points
    * @type { vec3[] }
 */
const defaultPoints = Array(4 * 4 * 4).fill(null).map((_, i) => {
    const x = Math.floor(i / 16)
    const y = Math.floor(i / 4) % 4
    const z = i % 4
    return vec3.fromValues(
        x / 3 - 0.5,
        y / 3 - 0.5,
        z / 3 - 0.5
    )
})

/**
    * @typedef {{ points: number[], normal: number, color: vec3 }} Face
 */

/**
    * @param { vec3 } c
    * @returns { string }
 */
function vecToRGB(c) {
    return `rgb(${ Math.floor(c[0]) }, ${ Math.floor(c[1]) }, ${ Math.floor(c[2]) })`
}

/**
    * @param { mat3[] } cubeState
    * @param { number } x0
    * @param { number } x1
    * @param { number } y0
    * @param { number } y1
    * @param { number } z0
    * @param { number } z1
    * @returns { { faces: Face[], boundingBox: number[][] } }
 */
function createFaces(cubeState, x0, x1, y0, y1, z0, z1) {
    const faces = []

    const yRatio = (z1 - z0 + 1)
    const xRatio = (y1 - y0 + 1) * yRatio

    for (let x = 0; x < x1 - x0; x++) {
        for (let y = 0; y < y1 - y0; y++) {
            for (let z = 0; z < z1 - z0; z++) {
                const cubonId = x + x0 + (y + y0) * 3 + (z + z0) * 9
                const rotationInverse = mat3.transpose(mat3.create(), cubeState[cubonId])

                const mappedColors = [
                    orderedColors[mapNormalToIndex(
                        rotationInverse[6],
                        rotationInverse[7],
                        rotationInverse[8]
                    )],
                    orderedColors[mapNormalToIndex(
                        -rotationInverse[6],
                        -rotationInverse[7],
                        -rotationInverse[8]
                    )],
                    orderedColors[mapNormalToIndex(
                        rotationInverse[0],
                        rotationInverse[1],
                        rotationInverse[2]
                    )],
                    orderedColors[mapNormalToIndex(
                        -rotationInverse[0],
                        -rotationInverse[1],
                        -rotationInverse[2]
                    )],
                    orderedColors[mapNormalToIndex(
                        rotationInverse[3],
                        rotationInverse[4],
                        rotationInverse[5]
                    )],
                    orderedColors[mapNormalToIndex(
                        -rotationInverse[3],
                        -rotationInverse[4],
                        -rotationInverse[5]
                    )],
                ]

                if (z === z1 - z0 - 1) {
                    faces.push({
                        points: [
                            (x    ) * xRatio + (y    ) * yRatio + z + 1,
                            (x + 1) * xRatio + (y    ) * yRatio + z + 1,
                            (x + 1) * xRatio + (y + 1) * yRatio + z + 1,
                            (x    ) * xRatio + (y + 1) * yRatio + z + 1,
                        ],
                        normal: NORMAL_FRONT,
                        color: z1 === 3 ? mappedColors[0] : colors.black,
                    })
                }
                if (z === 0) {
                    faces.push({
                        points: [
                            (x    ) * xRatio + (y    ) * yRatio + z,
                            (x + 1) * xRatio + (y    ) * yRatio + z,
                            (x + 1) * xRatio + (y + 1) * yRatio + z,
                            (x    ) * xRatio + (y + 1) * yRatio + z,
                        ],
                        normal: NORMAL_BACK,
                        color: z0 === 0 ? mappedColors[1] : colors.black,
                    })
                }
                if (x === x1 - x0 - 1) {
                    faces.push({
                        points: [
                            (x + 1) * xRatio + (y    ) * yRatio + z + 1,
                            (x + 1) * xRatio + (y    ) * yRatio + z    ,
                            (x + 1) * xRatio + (y + 1) * yRatio + z    ,
                            (x + 1) * xRatio + (y + 1) * yRatio + z + 1,
                        ],
                        normal: NORMAL_RIGHT,
                        color: x1 === 3 ? mappedColors[2] : colors.black,
                    })
                }
                if (x === 0) {
                    faces.push({
                        points: [
                            x * xRatio + (y    ) * yRatio + z + 1,
                            x * xRatio + (y    ) * yRatio + z    ,
                            x * xRatio + (y + 1) * yRatio + z    ,
                            x * xRatio + (y + 1) * yRatio + z + 1,
                        ],
                        normal: NORMAL_LEFT,
                        color: x0 === 0 ? mappedColors[3] : colors.black,
                    })
                }
                if (y === y1 - y0 - 1) {
                    faces.push({
                        points: [
                            (x    ) * xRatio + (y + 1) * yRatio + z + 1,
                            (x + 1) * xRatio + (y + 1) * yRatio + z + 1,
                            (x + 1) * xRatio + (y + 1) * yRatio + z    ,
                            (x    ) * xRatio + (y + 1) * yRatio + z    ,
                        ],
                        normal: NORMAL_UP,
                        color: y1 === 3 ? mappedColors[4] : colors.black,
                    })
                }
                if (y === 0) {
                    faces.push({
                        points: [
                            (x    ) * xRatio + y * yRatio + z + 1,
                            (x + 1) * xRatio + y * yRatio + z + 1,
                            (x + 1) * xRatio + y * yRatio + z    ,
                            (x    ) * xRatio + y * yRatio + z    ,
                        ],
                        normal: NORMAL_DOWN,
                        color: y0 === 0 ? mappedColors[5] : colors.black,
                    })
                }
            }
        }
    }

    const xMax = (x1 - x0) * xRatio
    const yMax = (y1 - y0) * yRatio
    const zMax = (z1 - z0)
    const boundingBox = [
            0    + 0    + 0,
            0    + 0    + zMax,
            0    + yMax + 0,
            0    + yMax + zMax,
            xMax + 0    + 0,
            xMax + 0    + zMax,
            xMax + yMax + 0,
            xMax + yMax + zMax,
    ]

    return {
        faces,
        boundingBox,
    }
}

export class Cube {
    /** @type { mat4 } */
    rotation
    /** @type { mat4 } */
    transform

    /** @type { vec3 } */
    baseCenterOfMass
    /** @type { vec3 } */
    centerOfMass

    /** @type { vec3[] } */
    basePoints
    /** @type { vec3[] } */
    mvPoints
    /** @type { vec3[] } */
    mvpPoints

    /** @type { number[] } */
    boundingBoxPoints
    /** @type { vec3[] } */
    shadowPoints
    /** @type { vec3[] } */
    shadowPointsProjected

    /** @type { vec3[] } */
    normalsCache

    /** @type { Face[] } */
    faces

    /**
        * @param { CanvasRenderingContext2D } ctx
        * @param { CubeState } cubeState
        * @param { number } x0
        * @param { number } x1
        * @param { number } y0
        * @param { number } y1
        * @param { number } z0
        * @param { number } z1
    **/
    constructor(cubeState, x0, x1, y0, y1, z0, z1) {
        this.rotation = mat4.create()
        this.transform = mat4.create()

        this.baseCenterOfMass = vec3.lerp(
            vec3.create(),
            defaultPoints[x0 * 16 + y0 * 4 + z0],
            defaultPoints[x1 * 16 + y1 * 4 + z1],
            0.5
        )
        this.centerOfMass = vec3.create()

        this.basePoints = []
        for (let x = x0; x <= x1; x++)
            for (let y = y0; y <= y1; y++)
                for (let z = z0; z <= z1; z++)
                    this.basePoints.push(defaultPoints[x * 16 + y * 4 + z])

        /*
        for (let x = 0; x <= x1 - x0; x++) {
            for (let y = 0; y <= y1 - y0; y++) {
                for (let z = 0; z <= z1 - z0; z++) {
                    const p = vec3.fromValues(x - (x1 - x0) / 2, y - (y1 - y0) / 2, z - (z1 - z0) / 2)
                    p[0] /= 3
                    p[1] /= 3
                    p[2] /= 3
                    this.basePoints.push(p)
                }
            }
        }
        */
        this.mvPoints = this.basePoints.map(_ => vec3.create())
        this.mvpPoints = this.basePoints.map(_ => vec3.create())

        const facesAndBoundingBox = createFaces(cubeState, x0, x1, y0, y1, z0, z1)
        this.faces = facesAndBoundingBox.faces
        this.boundingBox = facesAndBoundingBox.boundingBox
        //this.faces.forEach(f => f.color = f.color === colors.black ? colors.black : faceColors[Math.floor(Math.random() * 6)])
        
        this.shadowPoints = Array(8).fill(null).map(_ => vec3.create())
        this.shadowPointsProjected = Array(8).fill(null).map(_ => vec3.create())

        this.normalsCache = normals.map(_ => vec3.create())
    }

    /**
        * @param { mat4 } view
        * @param { mat4 } moveRot
    */
    update(view, moveRot) {
        const rotX = mat4.fromRotX(mat4.create(), 0 / 180 * Math.PI)
        const rotY = mat4.fromRotY(mat4.create(), 0 / 180 * Math.PI)
        
        mat4.mul(this.rotation, rotX, rotY)
        mat4.mul(this.rotation, this.rotation, moveRot)

        //const translation = mat4.fromTranslation(mat4.create(), this.baseCenterOfMass)
        const translation = mat4.fromTranslation(mat4.create(), vec3.create())

        mat4.mul(this.transform, translation, this.rotation)

        const mv = mat4.mul(mat4.create(), view, this.transform)
        const normalRot = mat3.fromMat4(mat3.create(), mv)

        for (let i = 0; i < this.basePoints.length; i++) {
            vec3.transformMat4(this.mvPoints[i], this.basePoints[i], mv)
        }

        // update shadows
        for (let i = 0; i < this.shadowPoints.length; i++) {
            vec3.transformMat4(this.shadowPoints[i], this.basePoints[this.boundingBox[i]], this.transform)
            const tmp = vec3.sub(tmpVec3, this.shadowPoints[i], floorCenter)
            const distanceFromFloor = vec3.dot(tmp, floorNormal)
            vec3.sub(this.shadowPoints[i], this.shadowPoints[i], vec3.scale(tmpVec3, lightDir, distanceFromFloor))
        }

        // update normals
        for (let i = 0; i < normals.length; i++) {
            vec3.transformMat3(this.normalsCache[i], normals[i], normalRot)
        }

        vec3.transformMat4(this.centerOfMass, this.baseCenterOfMass, mv)
    }

    /**
        * @param { CanvasRenderingContext2D } ctx
        * @param { mat4 } vp
        * @param { mat4 } screenSpaceMat
     */
    renderShadow(ctx, vp, screenSpaceMat) {
        // projection of the points
        for (const p of this.shadowPoints) {
            vec3.transformMat4ThenDivide(p, p, vp)
            vec3.transformMat4(p, p, screenSpaceMat)
            p[0] = Math.floor(p[0])
            p[1] = Math.floor(p[1])
            p[2] = Math.floor(p[2])
        }

        // renders faces
        for (const face of shadowFaces) {
            ctx.fillStyle = '#000'

            const lastPoint = this.shadowPoints[face[face.length - 1]]

            ctx.beginPath()
            ctx.moveTo(lastPoint[0], lastPoint[1])
            face.forEach(pId => {
                const p = this.shadowPoints[pId]
                ctx.lineTo(p[0], p[1])
            })
            ctx.fill()

        }
    }

    /**
        * @param { CanvasRenderingContext2D } ctx
        * @param { mat4 } vp
        * @param { mat4 } screenSpaceMat
     */
    render(ctx, view, vp, screenSpaceMat) {
        const mvp = mat4.mul(mat4.create(), vp, this.transform)

        // projection of the points
        for (let i = 0; i < this.basePoints.length; i++) {
            const tp = this.mvpPoints[i]
            vec3.transformMat4ThenDivide(tp, this.basePoints[i], mvp)
            vec3.transformMat4(tp, tp, screenSpaceMat)
            tp[0] = Math.floor(tp[0])
            tp[1] = Math.floor(tp[1])
            tp[2] = Math.floor(tp[2])
        }

        const screenSpaceLightDir = vec3.transformMat3(vec3.create(), lightDir, mat3.fromMat4(mat3.create(), view))
        // renders faces
        const points = this.mvpPoints
        for (const face of this.faces) {
            const normal = this.normalsCache[face.normal]

            // checks if the face is visible
            const testP = this.mvPoints[face.points[0]]
            const dot = vec3.dot(testP, normal)
            if (dot > 0) {
                continue
            }

            const lightStrength = 0.5 + 0.5 * Math.max(0, Math.min(1, vec3.dot(normal, screenSpaceLightDir)))
            ctx.fillStyle = vecToRGB(vec3.scale(vec3.create(), face.color, lightStrength))

            const lastPoint = points[face.points[face.points.length - 1]]

            ctx.beginPath()
            ctx.moveTo(lastPoint[0], lastPoint[1])
            face.points.forEach(pId => {
                const p = points[pId]
                ctx.lineTo(p[0], p[1])
            })
            ctx.fill()
        }
    }
}
