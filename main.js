import { Cube } from "./cube.js"
import { cubeStateRotationX, cubeStateRotationY, cubeStateRotationZ } from "./cubeState.js"
import { mat3, mat4, vec3 } from "./math.js"

/**
    * @param { number } a
    * @param { number } b
    * @param { number } s
    * @returns { number }
 */
function smoothstep(a, b, s) {
    const x = (s - a) / (b - a)
    return 3 * x*x - 2 * x*x*x
}

function disableButtons() {
    document.querySelectorAll('#buttons-container button').forEach(b => b.disabled = true)
}

function enableButtons() {
    document.querySelectorAll('#buttons-container button').forEach(b => b.disabled = false)
}

/**
    * @param { number } width
    * @param { number } height
    * @returns { mat4 }
 */
function createScreenSpaceMatrix(width, height) {
    const mat = mat4.create()
    const s = height / 2 * .3
    const scale = mat4.fromScale(mat4.create(), vec3.fromValues(s, -s, s))
    const offset = mat4.fromTranslation(mat4.create(), vec3.fromValues(
        width / 2,
        height / 2,
        0
    ))

    mat4.mul(mat, offset, scale)

    return mat
}

function createMove(axis, layerStart, layerEnd, quarterTurns) {
    const cubesLayers = []
    if (layerStart > 0) {
        cubesLayers.push([0, layerStart])
    }
    cubesLayers.push([layerStart, layerEnd])
    if (layerEnd < 3) {
        cubesLayers.push([layerEnd, 3])
    }
    return {
        movingCube: layerStart > 0 ? 1 : 0,
        quarterTurns,
        createCubesFunc(cubeState) {
            if (axis === 'x') {
                return cubesLayers.map(layers => new Cube(cubeState, layers[0], layers[1], 0, 3, 0, 3))
            }
            else if (axis === 'y') {
                return cubesLayers.map(layers => new Cube(cubeState, 0, 3, layers[0], layers[1], 0, 3))
            }
            else if (axis === 'z') {
                return cubesLayers.map(layers => new Cube(cubeState, 0, 3, 0, 3, layers[0], layers[1]))
            }
        },
        cubeStateUpdateFunc(cubeState) {
            if (axis === 'x') {
                return cubeStateRotationX(cubeState, (quarterTurns + 4) % 4, layerStart, layerEnd)
            }
            else if (axis === 'y') {
                return cubeStateRotationY(cubeState, (quarterTurns + 4) % 4, layerStart, layerEnd)
            }
            else if (axis === 'z') {
                return cubeStateRotationZ(cubeState, (quarterTurns + 4) % 4, layerStart, layerEnd)
            }
        },
        matRotFunc: (axis === 'x' ? mat4.fromRotX : (axis === 'y' ? mat4.fromRotY : mat4.fromRotZ)),
    }
}

const moves = {
    "r": createMove('x', 2, 3, -1),
    "r'": createMove('x', 2, 3, 1),
    "r2": createMove('x', 2, 3, -2),
    "R": createMove('x', 1, 3, -1),
    "R'": createMove('x', 1, 3, 1),
    "R2": createMove('x', 1, 3, -2),
    "m": createMove('x', 1, 2, -1),
    "m'": createMove('x', 1, 2, 1),
    "m2": createMove('x', 1, 2, -2),
    "l": createMove('x', 0, 1,  1),
    "l'": createMove('x', 0, 1, -1),
    "l2": createMove('x', 0, 1,  2),
    "L": createMove('x', 0, 2,  1),
    "L'": createMove('x', 0, 2, -1),
    "L2": createMove('x', 0, 2,  2),

    "u": createMove('y', 2, 3, -1),
    "u'": createMove('y', 2, 3, 1),
    "u2": createMove('y', 2, 3, -2),
    "U": createMove('y', 1, 3, -1),
    "U'": createMove('y', 1, 3, 1),
    "U2": createMove('y', 1, 3, -2),
    "e": createMove('y', 1, 2, -1),
    "e'": createMove('y', 1, 2, 1),
    "e2": createMove('y', 1, 2, -2),
    "d": createMove('y', 0, 1,  1),
    "d'": createMove('y', 0, 1, -1),
    "d2": createMove('y', 0, 1,  2),
    "D": createMove('y', 0, 2,  1),
    "D'": createMove('y', 0, 2, -1),
    "D2": createMove('y', 0, 2,  2),

    "f": createMove('z', 2, 3, -1),
    "f'": createMove('z', 2, 3,  1),
    "f2": createMove('z', 2, 3, -2),
    "F": createMove('z', 1, 3, -1),
    "F'": createMove('z', 1, 3,  1),
    "F2": createMove('z', 1, 3, -2),
    "s": createMove('z', 1, 2, -1),
    "s'": createMove('z', 1, 2,  1),
    "s2": createMove('z', 1, 2, -2),
    "b": createMove('z', 0, 1,  1),
    "b'": createMove('z', 0, 1, -1),
    "b2": createMove('z', 0, 1,  2),
    "B": createMove('z', 0, 2,  1),
    "B'": createMove('z', 0, 2, -1),
    "B2": createMove('z', 0, 2,  2),
}

function main() {
    const canvas = document.querySelector('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    let cubeState = Array(27).fill(null).map(_ => mat3.create())
    let cube = new Cube(cubeState, 0, 3, 0, 3, 0, 3)

    const screenSpaceMat = createScreenSpaceMatrix(canvas.width, canvas.height)
    const projection = mat4.perspective(mat4.create(), 35 / 180 * Math.PI, canvas.width / canvas.height, 0.01, 100)

    let currentMove = null
    const moveRotTmp = mat4.create()
    const identityMat = mat4.create()

    const view = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, -1.5))
    const viewProjection = mat4.create()

    const buttons = document.querySelectorAll('#buttons-container button')
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            disableButtons()
            const newMove = moves[e.target.innerHTML]
            currentMove = {
                move: newMove,
                progress: 0,
                cubes: newMove.createCubesFunc(cubeState),
            }
        })
        console.log(button.innerHTML)
    })

    let then = 0
    /**
        * @param { number } now
     */
    function frame(now) {
        now /= 1000
        const deltaTime = Math.min(1 / 12, now - then)
        then = now
        
        if (currentMove) {
            currentMove.progress += deltaTime * 2
            if (currentMove.progress >= 1) {
                cubeState = currentMove.move.cubeStateUpdateFunc(cubeState)
                cube = new Cube(cubeState, 0, 3, 0, 3, 0, 3)
                currentMove = null
                enableButtons()
            }
        }
        /*else {
            const keys = Object.keys(moves)
            const newMove = moves[keys[Math.floor(Math.random() * keys.length)]]
            currentMove = {
                move: newMove,
                progress: 0,
                cubes: newMove.createCubesFunc(cubeState),
            }
        }*/

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        mat4.mul(viewProjection, projection, view)

        if (currentMove) {
            const moveAngle = smoothstep(0, 1, currentMove.progress) * Math.PI / 2 * currentMove.move.quarterTurns
            const cubes = currentMove.cubes.map((c, i) => {
                const m = i === currentMove.move.movingCube ? currentMove.move.matRotFunc(moveRotTmp, moveAngle) : identityMat
                c.update(view, m)
                return c
            })
            cubes.sort((a, b) => a.centerOfMass[2] - b.centerOfMass[2])
            cubes.forEach(c => c.renderShadow(ctx, viewProjection, screenSpaceMat))

            // Background
            ctx.fillStyle = '#aaa'
            ctx.globalAlpha = 0.5
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1

            cubes.forEach(c => c.render(ctx, viewProjection, screenSpaceMat))
        }
        else {
            cube.update(view, identityMat)
            cube.renderShadow(ctx, viewProjection, screenSpaceMat)

            // Background
            ctx.fillStyle = '#aaa'
            ctx.globalAlpha = 0.5
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.globalAlpha = 1

            cube.render(ctx, viewProjection, screenSpaceMat)
        }
        requestAnimationFrame(frame)
    }
    frame(0)
}

main()















