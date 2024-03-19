import { vec3 } from "./math.js"


const b = 0.85
const c = 0.7

const black   = vec3.fromValues(0, 0, 0)
const red     = vec3.fromValues(1, 0, 0)
const cyan    = vec3.fromValues(1, 0.5, 0)
const green   = vec3.fromValues(1, 1, 0)
const magenta = vec3.fromValues(1, 1, 1)
const blue    = vec3.fromValues(0, 1, 0)
const yellow  = vec3.fromValues(0, 0, 1)

const points = [
    vec3.fromValues(-c, -b, 1),
    vec3.fromValues( c, -b, 1),
    vec3.fromValues( b, -c, 1),
    vec3.fromValues( b,  c, 1),
    vec3.fromValues( c,  b, 1),
    vec3.fromValues(-c,  b, 1),
    vec3.fromValues(-b,  c, 1),
    vec3.fromValues(-b, -c, 1),

    vec3.fromValues(-c, -b, -1),
    vec3.fromValues( c, -b, -1),
    vec3.fromValues( b, -c, -1),
    vec3.fromValues( b,  c, -1),
    vec3.fromValues( c,  b, -1),
    vec3.fromValues(-c,  b, -1),
    vec3.fromValues(-b,  c, -1),
    vec3.fromValues(-b, -c, -1),

    vec3.fromValues(-c,  1,  b),
    vec3.fromValues( c,  1,  b),
    vec3.fromValues( b,  1,  c),
    vec3.fromValues( b,  1, -c),
    vec3.fromValues( c,  1, -b),
    vec3.fromValues(-c,  1, -b),
    vec3.fromValues(-b,  1, -c),
    vec3.fromValues(-b,  1,  c),

    vec3.fromValues(-c, -1,  b),
    vec3.fromValues( c, -1,  b),
    vec3.fromValues( b, -1,  c),
    vec3.fromValues( b, -1, -c),
    vec3.fromValues( c, -1, -b),
    vec3.fromValues(-c, -1, -b),
    vec3.fromValues(-b, -1, -c),
    vec3.fromValues(-b, -1,  c),

    vec3.fromValues( 1, -b,  c),
    vec3.fromValues( 1, -b, -c),
    vec3.fromValues( 1, -c, -b),
    vec3.fromValues( 1,  c, -b),
    vec3.fromValues( 1,  b, -c),
    vec3.fromValues( 1,  b,  c),
    vec3.fromValues( 1,  c,  b),
    vec3.fromValues( 1, -c,  b),

    vec3.fromValues(-1, -b,  c),
    vec3.fromValues(-1, -b, -c),
    vec3.fromValues(-1, -c, -b),
    vec3.fromValues(-1,  c, -b),
    vec3.fromValues(-1,  b, -c),
    vec3.fromValues(-1,  b,  c),
    vec3.fromValues(-1,  c,  b),
    vec3.fromValues(-1, -c,  b),

    // sides
    // Y
    vec3.fromValues(b,  c, 1),
    vec3.fromValues(b, -c, 1),
    vec3.fromValues(1, -c, b),
    vec3.fromValues(1,  c, b),

    vec3.fromValues(-b,  c, 1),
    vec3.fromValues(-b, -c, 1),
    vec3.fromValues(-1, -c, b),
    vec3.fromValues(-1,  c, b),

    vec3.fromValues(b,  c, -1),
    vec3.fromValues(b, -c, -1),
    vec3.fromValues(1, -c, -b),
    vec3.fromValues(1,  c, -b),

    vec3.fromValues(-b,  c, -1),
    vec3.fromValues(-b, -c, -1),
    vec3.fromValues(-1, -c, -b),
    vec3.fromValues(-1,  c, -b),

    // X
    vec3.fromValues(-c,  b,  1),
    vec3.fromValues( c,  b,  1),
    vec3.fromValues( c,  1,  b),
    vec3.fromValues(-c,  1,  b),

    vec3.fromValues(-c, -b,  1),
    vec3.fromValues( c, -b,  1),
    vec3.fromValues( c, -1,  b),
    vec3.fromValues(-c, -1,  b),

    vec3.fromValues(-c,  b, -1),
    vec3.fromValues( c,  b, -1),
    vec3.fromValues( c,  1, -b),
    vec3.fromValues(-c,  1, -b),

    vec3.fromValues(-c, -b, -1),
    vec3.fromValues( c, -b, -1),
    vec3.fromValues( c, -1, -b),
    vec3.fromValues(-c, -1, -b),

    // Z
    vec3.fromValues( 1,  b,  c),
    vec3.fromValues( 1,  b, -c),
    vec3.fromValues( b,  1, -c),
    vec3.fromValues( b,  1,  c),

    vec3.fromValues( 1, -b,  c),
    vec3.fromValues( 1, -b, -c),
    vec3.fromValues( b, -1, -c),
    vec3.fromValues( b, -1,  c),

    vec3.fromValues(-1,  b,  c),
    vec3.fromValues(-1,  b, -c),
    vec3.fromValues(-b,  1, -c),
    vec3.fromValues(-b,  1,  c),

    vec3.fromValues(-1, -b,  c),
    vec3.fromValues(-1, -b, -c),
    vec3.fromValues(-b, -1, -c),
    vec3.fromValues(-b, -1,  c),

    // vertices
    vec3.fromValues( c,  b,  1),
    vec3.fromValues( b,  c,  1),
    vec3.fromValues( 1,  c,  b),
    vec3.fromValues( 1,  b,  c),
    vec3.fromValues( b,  1,  c),
    vec3.fromValues( c,  1,  b),

    vec3.fromValues(-c,  b,  1),
    vec3.fromValues(-b,  c,  1),
    vec3.fromValues(-1,  c,  b),
    vec3.fromValues(-1,  b,  c),
    vec3.fromValues(-b,  1,  c),
    vec3.fromValues(-c,  1,  b),

    vec3.fromValues( c, -b,  1),
    vec3.fromValues( b, -c,  1),
    vec3.fromValues( 1, -c,  b),
    vec3.fromValues( 1, -b,  c),
    vec3.fromValues( b, -1,  c),
    vec3.fromValues( c, -1,  b),

    vec3.fromValues(-c, -b,  1),
    vec3.fromValues(-b, -c,  1),
    vec3.fromValues(-1, -c,  b),
    vec3.fromValues(-1, -b,  c),
    vec3.fromValues(-b, -1,  c),
    vec3.fromValues(-c, -1,  b),

    vec3.fromValues( c,  b, -1),
    vec3.fromValues( b,  c, -1),
    vec3.fromValues( 1,  c, -b),
    vec3.fromValues( 1,  b, -c),
    vec3.fromValues( b,  1, -c),
    vec3.fromValues( c,  1, -b),

    vec3.fromValues(-c,  b, -1),
    vec3.fromValues(-b,  c, -1),
    vec3.fromValues(-1,  c, -b),
    vec3.fromValues(-1,  b, -c),
    vec3.fromValues(-b,  1, -c),
    vec3.fromValues(-c,  1, -b),

    vec3.fromValues( c, -b, -1),
    vec3.fromValues( b, -c, -1),
    vec3.fromValues( 1, -c, -b),
    vec3.fromValues( 1, -b, -c),
    vec3.fromValues( b, -1, -c),
    vec3.fromValues( c, -1, -b),

    vec3.fromValues(-c, -b, -1),
    vec3.fromValues(-b, -c, -1),
    vec3.fromValues(-1, -c, -b),
    vec3.fromValues(-1, -b, -c),
    vec3.fromValues(-b, -1, -c),
    vec3.fromValues(-c, -1, -b),
]

function successiveIndices(o) { return [o, o+1, o+2, o+3, o+4, o+5, o+6, o+7] }
function successiveIndices4(o) { return [o, o+1, o+2, o+3] }
function successiveIndices6(o) { return [o, o+1, o+2, o+3, o+4, o+5] }
function createFace(indices, normal, color) {
    return { indices, normal, color }
}

const c45 = 1 / Math.sqrt(2)
const r3 = 1 / Math.sqrt(3)
const coloredFaces = [
	createFace(successiveIndices(0), vec3.fromValues(0, 0, 1), red),
	createFace(successiveIndices(8), vec3.fromValues(0, 0, -1), cyan),
	createFace(successiveIndices(16), vec3.fromValues(0, 1, 0), green),
	createFace(successiveIndices(24), vec3.fromValues(0, -1, 0), magenta),
	createFace(successiveIndices(32), vec3.fromValues(1, 0, 0), blue),
	createFace(successiveIndices(40), vec3.fromValues(-1, 0, 0), yellow),
]

const blackFaces = [
	createFace(successiveIndices4(48), vec3.fromValues(c45, 0, c45), black),
	createFace(successiveIndices4(52), vec3.fromValues(-c45, 0, c45), black),
	createFace(successiveIndices4(56), vec3.fromValues(c45, 0, -c45), black),
	createFace(successiveIndices4(60), vec3.fromValues(-c45, 0, -c45), black),

	createFace(successiveIndices4(64), vec3.fromValues(0,  c45,  c45), black),
	createFace(successiveIndices4(68), vec3.fromValues(0, -c45,  c45), black),
	createFace(successiveIndices4(72), vec3.fromValues(0,  c45, -c45), black),
	createFace(successiveIndices4(76), vec3.fromValues(0, -c45, -c45), black),

	createFace(successiveIndices4(80), vec3.fromValues( c45,  c45, 0), black),
	createFace(successiveIndices4(84), vec3.fromValues( c45, -c45, 0), black),
	createFace(successiveIndices4(88), vec3.fromValues(-c45,  c45, 0), black),
	createFace(successiveIndices4(92), vec3.fromValues(-c45, -c45, 0), black),

	createFace(successiveIndices6( 96), vec3.fromValues( r3,  r3,  r3), black),
	createFace(successiveIndices6(102), vec3.fromValues(-r3,  r3,  r3), black),
	createFace(successiveIndices6(108), vec3.fromValues( r3, -r3,  r3), black),
	createFace(successiveIndices6(114), vec3.fromValues(-r3, -r3,  r3), black),
	createFace(successiveIndices6(120), vec3.fromValues( r3,  r3, -r3), black),
	createFace(successiveIndices6(126), vec3.fromValues(-r3,  r3, -r3), black),
	createFace(successiveIndices6(132), vec3.fromValues( r3, -r3, -r3), black),
	createFace(successiveIndices6(138), vec3.fromValues(-r3, -r3, -r3), black),
]

export const CubeModel = {
    points,
    coloredFaces,
    blackFaces,
}
