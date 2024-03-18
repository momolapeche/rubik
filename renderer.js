import { mat3, mat4, vec3 } from "./math.js";

const tmpVec3 = vec3.create()
const tmpMat4 = mat4.create()
const tmpMat3 = mat3.create()

/** @typedef {{ points: vec3[], shadowPoints: vec3[], normal: vec3, normalTestPoint: vec3, color: vec3 }} Face */

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
        * @param { vec3 } color
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
    transformPoints(transform, view, projection, screenSpaceMatrix, lightDir, floorHeight) {
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
    render(ctx, transform, view, projection, screenSpaceMatrix, lightDir, colorOverride) {
        for (const face of this.faces) {
            const points = face.points

            const mv3 = mat3.fromMat4(tmpMat3, mat4.mul(tmpMat4, view, transform))
            const normal = vec3.transformMat3(tmpVec3, face.normal, mv3)
            // visibility check
            const dot = vec3.dot(face.normalTestPoint, normal)
            if (dot > 0) {
                continue
            }

            const m3 = mat3.fromMat4(tmpMat3, transform)
            const worldSpaceNormal = vec3.transformMat3(tmpVec3, face.normal, m3)
            vec3.normalize(worldSpaceNormal, worldSpaceNormal)
            const lightStrength = Math.min(1,
                0.5 + Math.max(0, Math.min(1, vec3.dot(worldSpaceNormal, lightDir)))
            )
            if (colorOverride === undefined) {
                ctx.fillStyle = `rgb(${
                    Math.min(255, Math.floor(face.color[0] * lightStrength * 256)).toString()
                }, ${
                    Math.min(255, Math.floor(face.color[1] * lightStrength * 256)).toString()
                }, ${
                    Math.min(255, Math.floor(face.color[2] * lightStrength * 256)).toString()
                })`
            }
            else {
                ctx.fillStyle = colorOverride
            }

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






