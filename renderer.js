import { mat3, mat4, vec3 } from "./math.js";

const tmpVec3 = vec3.create()
const tmpMat4 = mat4.create()
const tmpMat3 = mat3.create()

/** @typedef {{ points: vec3[], shadowPoints: vec3[], normal: vec3, normalTestPoint: vec3, color: string }} Face */

export class Model {
    /** @type { vec3[] } */
    points
    /** @type { vec3[] } */
    transformedPoints
    /** @type { vec3[] } */
    viewSpacePoints
    /** @type { vec3[] } */
    screenSpacePoints

    /** @type { vec3[] } */
    shadowPoints

    /** @type { Face[] } */
    faces

    constructor(points) {
        this.points = points
        this.transformedPoints = this.points.map(_ => vec3.create())
        this.viewSpacePoints = this.points.map(_ => vec3.create())
        this.screenSpacePoints = this.points.map(_ => vec3.create())
        this.shadowPoints = this.points.map(_ => vec3.create())

        this.faces = []
    }

    /**
        * @param { number[] } indices
        * @param { vec3 } normal
        * @param { string } color
    */
    addFace(indices, normal, color) {
        this.faces.push({
            points: indices.map(index => this.screenSpacePoints[index]),
            shadowPoints: indices.map(index => this.shadowPoints[index]),
            normal,
            normalTestPoint: this.viewSpacePoints[indices[0]],
            color,
        })
    }

    /**
        * @param { mat4 } transform
        * @param { mat4 } view
        * @param { mat4 } projection
        * @param { mat4 } screenSpaceMatrix
    */
    transformPoints(transform, view, projection, screenSpaceMatrix) {
        for (let i = 0; i < this.points.length; i++) {
            vec3.transformMat4(this.transformedPoints[i], this.points[i], transform)
        }
        for (let i = 0; i < this.points.length; i++) {
            vec3.transformMat4(this.viewSpacePoints[i], this.transformedPoints[i], view)
        }
        for (let i = 0; i < this.points.length; i++) {
            vec3.transformMat4ThenDivide(this.screenSpacePoints[i], this.viewSpacePoints[i], projection)
        }
        for (let i = 0; i < this.points.length; i++) {
            vec3.transformMat4(this.screenSpacePoints[i], this.screenSpacePoints[i], screenSpaceMatrix)
        }

        const lightDir = vec3.fromValues(1, 1, 1)
        vec3.normalize(lightDir, lightDir)
        const floorHeight = -3

        for (let i = 0; i < this.points.length; i++) {
            const p = this.transformedPoints[i]
            vec3.scale(tmpVec3, lightDir, (p[1] - floorHeight) / lightDir[1])
            vec3.sub(this.shadowPoints[i], this.transformedPoints[i], tmpVec3)
            vec3.transformMat4(this.shadowPoints[i], this.shadowPoints[i], view)
            vec3.transformMat4ThenDivide(this.shadowPoints[i], this.shadowPoints[i], projection)
            vec3.transformMat4(this.shadowPoints[i], this.shadowPoints[i], screenSpaceMatrix)
        }
    }

    /**
        * @param { CanvasRenderingContext2D } ctx
        * @param { string } color
    */
    renderShadow(ctx, color) {
        ctx.fillStyle = color
        for (const face of this.faces) {
            const points = face.shadowPoints

            const lastPoint = points[points.length - 1]

            ctx.beginPath()
            ctx.moveTo(lastPoint[0], lastPoint[1])
            points.forEach(p => {
                ctx.lineTo(p[0], p[1])
            })
            ctx.fill()
        }
    }

    /**
        * @param { CanvasRenderingContext2D } ctx
        * @param { mat4 } transform
        * @param { mat4 } view
        * @param { mat4 } projection
        * @param { mat4 } screenSpaceMatrix
    */
    render(ctx, transform, view, projection, screenSpaceMatrix, colorOverride) {
        for (const face of this.faces) {
            const points = face.points

            const mv3 = mat3.fromMat4(tmpMat3, mat4.mul(tmpMat4, view, transform))
            const normal = vec3.transformMat3(tmpVec3, face.normal, mv3)
            // visibility check
            const dot = vec3.dot(face.normalTestPoint, normal)
            if (dot > 0) {
                continue
            }

            ctx.fillStyle = colorOverride ?? face.color

            const lastPoint = points[points.length - 1]

            ctx.beginPath()
            ctx.moveTo(lastPoint[0], lastPoint[1])
            points.forEach(p => {
                ctx.lineTo(p[0], p[1])
            })
            ctx.fill()
        }
    }
}
