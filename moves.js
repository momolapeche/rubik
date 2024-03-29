import { quarterTurnRotations } from "./discreteRotations.js"
import { mat4 } from "./math.js"

function createMove(axis, layerStart, layerEnd, quarterTurns) {
    return {
        axis,
        layerStart,
        layerEnd,
        quarterTurns,
        rotationMat: quarterTurnRotations[axis][((quarterTurns + 4) % 4) - 1],
        matRotFunc: (axis === 'x' ? mat4.fromRotX : (axis === 'y' ? mat4.fromRotY : mat4.fromRotZ)),
    }
}

export const moves = {
    "X":  createMove('x', 0, 3, -1),
    "X'": createMove('x', 0, 3,  1),
    "X2": createMove('x', 0, 3, -2),
    "Y":  createMove('y', 0, 3, -1),
    "Y'": createMove('y', 0, 3,  1),
    "Y2": createMove('y', 0, 3, -2),
    "Z":  createMove('z', 0, 3, -1),
    "Z'": createMove('z', 0, 3,  1),
    "Z2": createMove('z', 0, 3, -2),
    "R":  createMove('x', 2, 3, -1),
    "R'": createMove('x', 2, 3,  1),
    "R2": createMove('x', 2, 3, -2),
    "r":  createMove('x', 1, 3, -1),
    "r'": createMove('x', 1, 3,  1),
    "r2": createMove('x', 1, 3, -2),
    "M":  createMove('x', 1, 2,  1),
    "M'": createMove('x', 1, 2, -1),
    "M2": createMove('x', 1, 2,  2),
    "L":  createMove('x', 0, 1,  1),
    "L'": createMove('x', 0, 1, -1),
    "L2": createMove('x', 0, 1,  2),
    "l":  createMove('x', 0, 2,  1),
    "l'": createMove('x', 0, 2, -1),
    "l2": createMove('x', 0, 2,  2),

    "U":  createMove('y', 2, 3, -1),
    "U'": createMove('y', 2, 3,  1),
    "U2": createMove('y', 2, 3, -2),
    "u":  createMove('y', 1, 3, -1),
    "u'": createMove('y', 1, 3,  1),
    "u2": createMove('y', 1, 3, -2),
    "E":  createMove('y', 1, 2,  1),
    "E'": createMove('y', 1, 2, -1),
    "E2": createMove('y', 1, 2,  2),
    "D":  createMove('y', 0, 1,  1),
    "D'": createMove('y', 0, 1, -1),
    "D2": createMove('y', 0, 1,  2),
    "d":  createMove('y', 0, 2,  1),
    "d'": createMove('y', 0, 2, -1),
    "d2": createMove('y', 0, 2,  2),

    "F":  createMove('z', 2, 3, -1),
    "F'": createMove('z', 2, 3,  1),
    "F2": createMove('z', 2, 3, -2),
    "f":  createMove('z', 1, 3, -1),
    "f'": createMove('z', 1, 3,  1),
    "f2": createMove('z', 1, 3, -2),
    "S":  createMove('z', 1, 2,  1),
    "S'": createMove('z', 1, 2, -1),
    "S2": createMove('z', 1, 2,  2),
    "B":  createMove('z', 0, 1,  1),
    "B'": createMove('z', 0, 1, -1),
    "B2": createMove('z', 0, 1,  2),
    "b":  createMove('z', 0, 2,  1),
    "b'": createMove('z', 0, 2, -1),
    "b2": createMove('z', 0, 2,  2),
}
