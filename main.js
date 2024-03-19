import { quarterTurnRotations } from "./discreteRotations.js"
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

function axisNameToIndex(axis) {
    switch (axis) {
        case 'x':
            return 0
        case 'y':
            return 1
        case 'z':
            return 2
    }
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
    const s = height / 2
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
    "R":  createMove('x', 2, 3, -1),
    "R'": createMove('x', 2, 3,  1),
    "R2": createMove('x', 2, 3, -2),
    "r":  createMove('x', 1, 3, -1),
    "r'": createMove('x', 1, 3,  1),
    "r2": createMove('x', 1, 3, -2),
    "M":  createMove('x', 1, 2, -1),
    "M'": createMove('x', 1, 2,  1),
    "M2": createMove('x', 1, 2, -2),
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
    "E":  createMove('y', 1, 2, -1),
    "E'": createMove('y', 1, 2,  1),
    "E2": createMove('y', 1, 2, -2),
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
    "S":  createMove('z', 1, 2, -1),
    "S'": createMove('z', 1, 2,  1),
    "S2": createMove('z', 1, 2, -2),
    "B":  createMove('z', 0, 1,  1),
    "B'": createMove('z', 0, 1, -1),
    "B2": createMove('z', 0, 1,  2),
    "b":  createMove('z', 0, 2,  1),
    "b'": createMove('z', 0, 2, -1),
    "b2": createMove('z', 0, 2,  2),
}

const black = vec3.fromValues(0, 0, 0)

function main() {
    const canvas = document.querySelector('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    const fovy = 90 / 180 * Math.PI
    const screenSpaceMat = createScreenSpaceMatrix(canvas.width, canvas.height)
    const projection = mat4.perspective(mat4.create(), fovy, canvas.width / canvas.height, 0.01, 100)
    //const projection = mat4.orthographic(mat4.create(), 3, 3)

    let currentMove = null

    const viewTranslation = mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, -5))
    const view = mat4.copy(mat4.create(), viewTranslation)

    let cameraRotX = 0
    let cameraRotY = 0
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

        cameraRotY = x * 1
        const mY = mat4.fromRotY(mat4.create(), cameraRotY)
        cameraRotX = -y * 0.6
        const mX = mat4.fromRotX(mat4.create(), cameraRotX)

        mat4.mul(view, mX, mY)
        mat4.mul(view, viewTranslation, view)
    })

    const lightDir = vec3.fromValues(1, 1, 1)
    vec3.normalize(lightDir, lightDir)
    const floorHeight = -3

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
        CubeModel.blackFaces.forEach(f => model.addFace(f.indices, f.normal, f.color))
        {
            const f = CubeModel.coloredFaces[0]
            model.addFace(f.indices, f.normal, z === 2 ? f.color : black)
        }
        {
            const f = CubeModel.coloredFaces[1]
            model.addFace(f.indices, f.normal, z === 0 ? f.color : black)
        }
        {
            const f = CubeModel.coloredFaces[2]
            model.addFace(f.indices, f.normal, y === 2 ? f.color : black)
        }
        {
            const f = CubeModel.coloredFaces[3]
            model.addFace(f.indices, f.normal, y === 0 ? f.color : black)
        }
        {
            const f = CubeModel.coloredFaces[4]
            model.addFace(f.indices, f.normal, x === 2 ? f.color : black)
        }
        {
            const f = CubeModel.coloredFaces[5]
            model.addFace(f.indices, f.normal, x === 0 ? f.color : black)
        }
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

        // floor
        ctx.fillStyle = '#c0c0c0'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // sky
        ctx.fillStyle = '#c0c0e0'
        const horizon = Math.tan(cameraRotX) / Math.tan(fovy / 2)
        ctx.fillRect(0, 0, canvas.width, (canvas.height - canvas.height * horizon) / 2)

        const moveMat = mat4.create()
        if (currentMove) {
            currentMove.progress += deltaTime * 2
            const moveAngle = smoothstep(0, 1, currentMove.progress) * Math.PI / 2 * currentMove.move.quarterTurns
            currentMove.move.matRotFunc(moveMat, moveAngle)

            if (currentMove.progress >= 1) {
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

        // points projection
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
            m.model.transformPoints(m.totalTransform, view, projection, screenSpaceMat, lightDir, floorHeight)
        })

        // shadow
        cubons.forEach(m => {
            m.model.renderShadow(ctx, '#505050')
        })

        // painter' algorithm
        cubons.forEach(m => {
            const tmp = vec3.create()
            vec3.transformMat4(tmp, m.center, m.totalTransform)
            vec3.transformMat4(tmp, tmp, view)
            m.distanceToCamera = vec3.length(tmp)
        })
        const groups = []
        if (currentMove) {
            groups.push([], [], [])

            const v0 = vec3.create()
            v0[axisNameToIndex(currentMove.move.axis)] = currentMove.move.layerStart / 2 - 1.5
            vec3.transformMat4(v0, v0, view)
            const v1 = vec3.create()
            v1[axisNameToIndex(currentMove.move.axis)] = (currentMove.move.layerEnd + currentMove.move.layerStart) / 2 - 1.5
            vec3.transformMat4(v1, v1, view)
            const v2 = vec3.create()
            v2[axisNameToIndex(currentMove.move.axis)] = (currentMove.move.layerEnd + 3) / 2 - 1.5
            vec3.transformMat4(v2, v2, view)

            const order = [
                { dist: vec3.length(v0), index: 0, },
                { dist: vec3.length(v1), index: 1, },
                { dist: vec3.length(v2), index: 2, },
            ]
            order.sort((a, b) => b.dist - a.dist)

            for (let i = 0; i < cubons.length; i++) {
                const cubon = cubons[i]
                const cubonLayer = cubon.position[currentMove.move.axis]
                if (cubonLayer < currentMove.move.layerStart) {
                    groups[order[0].index].push(cubon)
                }
                else if (cubonLayer >= currentMove.move.layerEnd) {
                    groups[order[2].index].push(cubon)
                }
                else {
                    groups[order[1].index].push(cubon)
                }
            }
        }
        else {
            groups.push(cubons.slice())
        }
        groups.forEach(cubons => cubons.sort((a, b) => b.distanceToCamera - a.distanceToCamera))

        // rendering
        groups.forEach(cubons => cubons.forEach((m, i) => {
            //const col = '#' + Math.floor(i / 27 * 256).toString(16).padStart(2, '0') + '0000'
            m.model.render(
                ctx, m.totalTransform, view, projection, screenSpaceMat, lightDir
                //, col
            )
        }))

        requestAnimationFrame(frame)
    }
    frame(0)
}

main()















