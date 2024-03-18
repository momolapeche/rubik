import { quarterTurnRotations } from "./cubeState.js"
import { CubeModel } from "./faceModel.js"
import { mat3, mat4, vec3 } from "./math.js"
import { Model } from "./renderer.js"

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
    console.log(quarterTurnRotations)
    return {
        axis,
        layerStart,
        layerEnd,
        quarterTurns,
        rotationMat: quarterTurnRotations[axis][((quarterTurns + 4) % 4) - 1],
        matRotFunc: (axis === 'x' ? mat4.fromRotX : (axis === 'y' ? mat4.fromRotY : mat4.fromRotZ)),
    }
}

const moves = {
    "r":  createMove('x', 2, 3, -1),
    "r'": createMove('x', 2, 3,  1),
    "r2": createMove('x', 2, 3, -2),
    "R":  createMove('x', 1, 3, -1),
    "R'": createMove('x', 1, 3,  1),
    "R2": createMove('x', 1, 3, -2),
    "m":  createMove('x', 1, 2, -1),
    "m'": createMove('x', 1, 2,  1),
    "m2": createMove('x', 1, 2, -2),
    "l":  createMove('x', 0, 1,  1),
    "l'": createMove('x', 0, 1, -1),
    "l2": createMove('x', 0, 1,  2),
    "L":  createMove('x', 0, 2,  1),
    "L'": createMove('x', 0, 2, -1),
    "L2": createMove('x', 0, 2,  2),

    "u":  createMove('y', 2, 3, -1),
    "u'": createMove('y', 2, 3,  1),
    "u2": createMove('y', 2, 3, -2),
    "U":  createMove('y', 1, 3, -1),
    "U'": createMove('y', 1, 3,  1),
    "U2": createMove('y', 1, 3, -2),
    "e":  createMove('y', 1, 2, -1),
    "e'": createMove('y', 1, 2,  1),
    "e2": createMove('y', 1, 2, -2),
    "d":  createMove('y', 0, 1,  1),
    "d'": createMove('y', 0, 1, -1),
    "d2": createMove('y', 0, 1,  2),
    "D":  createMove('y', 0, 2,  1),
    "D'": createMove('y', 0, 2, -1),
    "D2": createMove('y', 0, 2,  2),

    "f":  createMove('z', 2, 3, -1),
    "f'": createMove('z', 2, 3,  1),
    "f2": createMove('z', 2, 3, -2),
    "F":  createMove('z', 1, 3, -1),
    "F'": createMove('z', 1, 3,  1),
    "F2": createMove('z', 1, 3, -2),
    "s":  createMove('z', 1, 2, -1),
    "s'": createMove('z', 1, 2,  1),
    "s2": createMove('z', 1, 2, -2),
    "b":  createMove('z', 0, 1,  1),
    "b'": createMove('z', 0, 1, -1),
    "b2": createMove('z', 0, 1,  2),
    "B":  createMove('z', 0, 2,  1),
    "B'": createMove('z', 0, 2, -1),
    "B2": createMove('z', 0, 2,  2),
}

function main() {
    const canvas = document.querySelector('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    const screenSpaceMat = createScreenSpaceMatrix(canvas.width, canvas.height)
    const projection = mat4.perspective(mat4.create(), 35 / 180 * Math.PI, canvas.width / canvas.height, 0.01, 100)

    let currentMove = null

    const viewTranslation = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, -5))
    const view = mat4.copy(mat4.create(), viewTranslation)

    let rotationLocked = false

    // events
    const buttons = document.querySelectorAll('#buttons-container button')
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            disableButtons()
            const newMove = moves[e.target.innerHTML]
            currentMove = {
                move: newMove,
                progress: 0,
            }
        })
    })


    canvas.addEventListener('click', () => {
        rotationLocked = !rotationLocked
    })

    canvas.addEventListener('mousemove', (e) => {
        if (rotationLocked)
            return
        const rect = canvas.getBoundingClientRect()
        const x = ((e.clientX - rect.x) / rect.width) * 2 - 1
        const y = 1 - 2 * ((e.clientY - rect.y) / rect.height)

        const rotY = mat4.fromRotY(mat4.create(), x * 3)
        const rotX = mat4.fromRotX(mat4.create(), -y * 3)

        mat4.mul(view, rotX, rotY)
        mat4.mul(view, viewTranslation, view)
    })


    const cubons = []
    for (let i = 0; i < 27; i++) {
        const x = i % 3
        const y = Math.floor(i / 3) % 3
        const z = Math.floor(i / 9)
        const transform = mat4.create()
        const translation = mat4.fromTranslation(mat4.create(), vec3.fromValues(x - 1, y - 1, z - 1))
        const s = 0.5
        const scale = mat4.fromScale(mat4.create(), vec3.fromValues(s,s,s))
        mat4.mul(transform, translation, scale)
        const model = new Model(CubeModel.points)
        CubeModel.faces.forEach(f => model.addFace(f.indices, f.normal, f.color))
        cubons.push({
            model,
            transform,
            totalTransform: mat4.create(),
            center: vec3.fromValues(0, 0, 0),
            distanceToCamera: 0,
            position: {x, y, z},
        })
    }

    let then = 0
    /**
        * @param { number } now
     */
    function frame(now) {
        now /= 1000
        const deltaTime = Math.min(1 / 12, now - then)
        then = now
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Background
        ctx.fillStyle = '#aaa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const moveMat = mat4.create()
        if (currentMove) {
            currentMove.progress += deltaTime * 0.2
            const moveAngle = smoothstep(0, 1, currentMove.progress) * Math.PI / 2 * currentMove.move.quarterTurns
            currentMove.move.matRotFunc(moveMat, moveAngle)

            if (currentMove.progress >= 1) {
                console.log(currentMove)
                const m = mat4.fromMat3(mat4.create(), currentMove.move.rotationMat)
                cubons.forEach(c => {
                    if (
                        c.position[currentMove.move.axis] >= currentMove.move.layerStart &&
                        c.position[currentMove.move.axis] < currentMove.move.layerEnd
                    ) {
                        mat4.mul(c.transform, m, c.transform)
                        const v = new Int8Array([c.position.x - 1, c.position.y - 1, c.position.z - 1])
                        vec3.transformMat3(v, v, currentMove.move.rotationMat)
                        c.position.x = v[0] + 1
                        c.position.y = v[1] + 1
                        c.position.z = v[2] + 1
                    }
                })
                currentMove = null
                mat4.identity(moveMat)
                enableButtons()
            }
        }

        cubons.forEach(m => {
            if (currentMove &&
                m.position[currentMove.move.axis] >= currentMove.move.layerStart &&
                m.position[currentMove.move.axis] < currentMove.move.layerEnd
            ) {
                mat4.mul(m.totalTransform, moveMat, m.transform)
            }
            else {
                mat4.copy(m.totalTransform, m.transform)
            }
            m.model.transformPoints(m.totalTransform, view, projection, screenSpaceMat)
        })

        cubons.forEach(m => {
            m.model.renderShadow(ctx, '#000000')
        })

        cubons.forEach(m => {
            const tmp = vec3.create()
            vec3.transformMat4(tmp, m.center, m.totalTransform)
            vec3.transformMat4(tmp, tmp, view)
            m.distanceToCamera = vec3.length(tmp)
        })
        cubons.sort((a, b) => b.distanceToCamera - a.distanceToCamera)
        cubons.forEach((m, i) => {
            //const col = '#' + Math.floor(i / 27 * 256).toString(16).padStart(2, '0') + '0000'
            m.model.render(
                ctx, m.totalTransform, view, projection, screenSpaceMat
                //, col
            )
        })

        requestAnimationFrame(frame)
    }
    frame(0)
}

main()















