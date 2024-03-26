import { Camera } from "./camera.js"
import { mat3, mat4, quat, vec3 } from "./math.js"
import { moves } from "./moves.js"
import { Model } from "./renderer.js"
import { Transform } from "./transform.js"
import { CubonModel, WebGlRenderer } from "./webGlRenderer.js"

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
    const scale = mat4.fromScale(mat4.create(), vec3.fromValues(width / 2, -height / 2, 1))
    const offset = mat4.fromTranslation(mat4.create(), vec3.fromValues(
        width / 2,
        height / 2,
        0
    ))

    mat4.mul(mat, offset, scale)

    return mat
}

function main() {
    const canvas = document.querySelector('canvas')
    canvas.width = 800
    canvas.height = 600


    const renderer = new WebGlRenderer(canvas)


    let currentMove = null

    const fovy = 45 / 180 * Math.PI
    const projection = mat4.perspective(mat4.create(), fovy, canvas.width / canvas.height, 0.01, 100)
    const camera = new Camera(projection)
    camera.transform.position[2] = 10
    const cameraRig = new Transform()
    cameraRig.children.push(camera.transform)

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

        cameraRotY = x * 2
        cameraRotX = -y * 2

        const rotX = quat.setAxisAngle(quat.create(), [1, 0, 0], -cameraRotX)
        const rotY = quat.setAxisAngle(quat.create(), [0, 1, 0], -cameraRotY)
        quat.mul(cameraRig.rotation, rotY, rotX)
    })

    const cubons = []
    for (let i = 0; i < 27; i++) {
        const x = i % 3
        const y = Math.floor(i / 3) % 3
        const z = Math.floor(i / 9)
        const transform = new Transform()
        vec3.set(transform.position, x-1, y-1, z-1)
        const s = 0.5
        vec3.set(transform.scale, s, s, s)

        const model = new CubonModel(
            renderer.gl,
            renderer.createProgram(
                renderer.shaders.cubonVS,
                renderer.shaders.cubonFS
            ),
            x===0 ? -0.1 : 0, x === 2 ? 0.1 : 0,
            y===0 ?  0.75 : 0, y === 2 ? -0.75 : 0,
            z===0 ?  0.5 : 0, z === 2 ? -0.5 : 0
        )
        cubons.push({
            model,
            transform,
            totalTransform: mat4.create(),
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
        
        renderer.frameStart()

        cameraRig.update()
        camera.update()

        const cubeTransform = new Transform()
        if (currentMove) {
            currentMove.progress = Math.min(1, currentMove.progress + deltaTime * 2)
            const moveAngle = smoothstep(0, 1, currentMove.progress) * Math.PI / 2 * currentMove.move.quarterTurns
            const blocs = [
                new Transform(),
                new Transform(),
                new Transform(),
            ]
            cubeTransform.children = blocs
            if (currentMove.move.axis === 'x') {
                quat.setAxisAngle(blocs[1].rotation, [1, 0, 0], moveAngle)
            }
            else if (currentMove.move.axis === 'y') {
                quat.setAxisAngle(blocs[1].rotation, [0, 1, 0], moveAngle)
            }
            else if (currentMove.move.axis === 'z') {
                quat.setAxisAngle(blocs[1].rotation, [0, 0, 1], moveAngle)
            }
            cubons.forEach(c => {
                const layer = c.position[currentMove.move.axis]
                const blockIndex = layer < currentMove.move.layerStart ? 0 : (layer < currentMove.move.layerEnd ? 1 : 2)
                blocs[blockIndex].children.push(c.transform)
            })

            if (currentMove.progress >= 1) {
                cubons.forEach(c => {
                    if (
                        c.position[currentMove.move.axis] >= currentMove.move.layerStart &&
                        c.position[currentMove.move.axis] < currentMove.move.layerEnd
                    ) {
                        quat.mul(c.transform.rotation, blocs[1].rotation, c.transform.rotation)
                        vec3.transformMat3(c.transform.position, c.transform.position, currentMove.move.rotationMat)
                        const v = new Int8Array([c.position.x - 1, c.position.y - 1, c.position.z - 1])
                        vec3.transformMat3(v, v, currentMove.move.rotationMat)
                        c.position.x = v[0] + 1
                        c.position.y = v[1] + 1
                        c.position.z = v[2] + 1
                    }
                })
                currentMove = null
                enableButtons()
                cubeTransform.children = cubons.map(c => c.transform)
            }
        }
        else {
            cubeTransform.children = cubons.map(c => c.transform)
        }

        cubeTransform.update()

        // rendering
        cubons.forEach(m => {
            m.model.render(m.transform.matrix, camera.matrix, camera.projection)
        })

        requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
}

main()















