import { CubonGeometry, CubonRTGeometry } from "./cubonModel.js"
import { mat4 } from "./math.js"

export class CubonModel {
    /** @type { WebGL2RenderingContext } */
    gl
    /** @type { WebGLVertexArrayObject } */
    vao
    /** @type { WebGLBuffer } */
    indices
    /** @type { number } */
    count

    /** @type { WebGLProgram } */
    program
    /** @type { Object.<string, WebGLUniformLocation> } */
    uniformLocations = {}

    /**
        * @param {WebGL2RenderingContext} gl
        * @param {WebGLProgram} program 
    */
    constructor(gl, program, x0, x1, y0, y1, z0, z1) {
        this.gl = gl

        this.program = program
        this.uniformLocations['transform'] = gl.getUniformLocation(program, 'transform')
        this.uniformLocations['view'] = gl.getUniformLocation(program, 'view')
        this.uniformLocations['projection'] = gl.getUniformLocation(program, 'projection')

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)

        this.indices = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices)
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, CubonGeometry.indices, gl.STATIC_DRAW)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, CubonRTGeometry.indices, gl.STATIC_DRAW)
        //this.count = CubonGeometry.indices.length
        this.count = CubonRTGeometry.indices.length

        //const { normals, colors, } = CubonGeometry.getNormalsAndColors(true)
        const normals = CubonRTGeometry.normals
        const colors = CubonRTGeometry.colors
        {
            const location = gl.getAttribLocation(program, 'position')
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            /*
            gl.bufferData(gl.ARRAY_BUFFER, CubonGeometry.getPositions(
                x0, x1, y0, y1, z0, z1
            ), gl.STATIC_DRAW)
            */
            gl.bufferData(gl.ARRAY_BUFFER, CubonRTGeometry.positions, gl.STATIC_DRAW)

            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0)
        }
        {
            const location = gl.getAttribLocation(program, 'normal')
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0)
        }
        {
            const location = gl.getAttribLocation(program, 'color')
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0)
        }

        gl.bindVertexArray(null)
    }

    /**
        * @param {mat4} transform
        * @param {mat4} view
        * @param {mat4} projection
    */
    render(transform, view, projection) {
        const gl = this.gl

        gl.useProgram(this.program)
        gl.uniformMatrix4fv(this.uniformLocations['transform'], false, transform)
        gl.uniformMatrix4fv(this.uniformLocations['view'], false, view)
        gl.uniformMatrix4fv(this.uniformLocations['projection'], false, projection)

        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices)
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null)
    }
}

const cubonVS = `#version 300 es

precision highp float;

uniform mat4 transform;
uniform mat4 view;
uniform mat4 projection;

in vec3 position;
in vec3 color;
in vec3 normal;

out vec3 vPosition;
out vec3 vColor;
out vec3 vNormal;
flat out mat4 vView;

void main() {
    vColor = color;
    vView = view;
    vPosition = (view * transform * vec4(position, 1)).xyz;
    vNormal = mat3(view) * mat3(transform) * normal;
    gl_Position = projection * view * transform * vec4(position, 1);
}
`

const cubonFS = `#version 300 es

precision highp float;

uniform mat4 transform;
uniform mat4 view;
uniform mat4 projection;

in vec3 vPosition;
in vec3 vColor;
in vec3 vNormal;

out vec4 color;

float offset = 0.75;
float radius = 0.25;

bool sphereIntersection(in vec3 o, in vec3 d, out float dist, out vec3 normal) {
    float a = dot(d, d);
    float b = 2.0 * dot(o, d);
    float c = dot(o, o) - radius * radius;
    float disc = b*b - 4.0 * a * c;

    if (disc < 0.0) {
        return false;
    }

    disc = sqrt(disc);

    float t0 = (-b + disc) / (2.0 * a);
    float t1 = (-b - disc) / (2.0 * a);

    float t = min(t0, t1);

    dist = t;

    vec3 inter = o + t * d;

    normal = normalize(inter);

    return true;
}

void main() {
    mat4 m = view * transform;
    vec3 d = inverse(mat3(m)) * normalize(vPosition);
    vec3 o = (inverse(m) * vec4(0, 0, 0, 1)).xyz;

    vec3 albedo = vec3(0);
    vec3 normal;
    vec3 inter;
    float dist = 100000.;

    float tDist;
    vec3 tNormal;
    
    for (int i = 0; i < 4; i++) {
        bool hit = sphereIntersection(vec3(
            o.x - (float(i % 2) * 2. - 1.) * offset,
            o.y - (float(i / 2) * 2. - 1.) * offset,
            0
        ), vec3(d.x, d.y, 0), tDist, tNormal);
        inter = o + d * tDist;
        if (hit != false && abs(inter.z) < offset && tDist < dist) {
            dist = tDist;
            normal = tNormal;
            albedo = vec3(0);
        }
    }
    for (int i = 0; i < 4; i++) {
        bool hit = sphereIntersection(vec3(
            o.x - (float(i % 2) * 2. - 1.) * offset,
            0,
            o.z - (float(i / 2) * 2. - 1.) * offset
        ), vec3(d.x, 0, d.z), tDist, tNormal);
        inter = o + d * tDist;
        if (hit != false && abs(inter.y) < offset && tDist < dist) {
            dist = tDist;
            normal = tNormal;
            albedo = vec3(0);
        }
    }
    for (int i = 0; i < 4; i++) {
        bool hit = sphereIntersection(vec3(
            0,
            o.y - (float(i % 2) * 2. - 1.) * offset,
            o.z - (float(i / 2) * 2. - 1.) * offset
        ), vec3(0, d.y, d.z), tDist, tNormal);
        inter = o + d * tDist;
        if (hit != false && abs(inter.x) < offset && tDist < dist) {
            dist = tDist;
            normal = tNormal;
            albedo = vec3(0);
        }
    }
    for (int i = 0; i < 8; i++) {
        bool hit = sphereIntersection(vec3(
            o.x - (float(i % 2) * 2. - 1.) * offset,
            o.y - (float((i / 2) % 2) * 2. - 1.) * offset,
            o.z - (float(i / 4) * 2. - 1.) * offset
        ), d, tDist, tNormal);
        if (hit != false && tDist < dist) {
            dist = tDist;
            normal = tNormal;
            albedo = vec3(0);
        }
    }

    float faceOffset = offset + 0.25;
    tDist = (o.z - faceOffset) / -d.z;
    inter = o + tDist * d;
    if (tDist >= 0.0 && tDist < dist && all(lessThanEqual(abs(inter.xy), vec2(offset)))) {
        dist = tDist;
        normal = vec3(0, 0, 1);
        albedo = vec3(1, 0, 0);
    }
    tDist = (o.z + faceOffset) / -d.z;
    inter = o + tDist * d;
    if (tDist >= 0.0 && tDist < dist && all(lessThanEqual(abs(inter.xy), vec2(offset)))) {
        dist = tDist;
        normal = vec3(0, 0, -1);
        albedo = vec3(0, 1, 1);
    }
    
    tDist = (o.y - faceOffset) / -d.y;
    inter = o + tDist * d;
    if (tDist >= 0.0 && tDist < dist && all(lessThanEqual(abs(inter.xz), vec2(offset)))) {
        dist = tDist;
        normal = vec3(0, 1, 0);
        albedo = vec3(0, 1, 0);
    }
    tDist = (o.y + faceOffset) / -d.y;
    inter = o + tDist * d;
    if (tDist >= 0.0 && tDist < dist && all(lessThanEqual(abs(inter.xz), vec2(offset)))) {
        dist = tDist;
        normal = vec3(0, -1, 0);
        albedo = vec3(1, 0, 1);
    }
    
    tDist = (o.x - faceOffset) / -d.x;
    inter = o + tDist * d;
    if (tDist >= 0.0 && tDist < dist && all(lessThanEqual(abs(inter.yz), vec2(offset)))) {
        dist = tDist;
        normal = vec3(1, 0, 0);
        albedo = vec3(0, 0, 1);
    }
    tDist = (o.x + faceOffset) / -d.x;
    inter = o + tDist * d;
    if (tDist >= 0.0 && tDist < dist && all(lessThanEqual(abs(inter.yz), vec2(offset)))) {
        dist = tDist;
        normal = vec3(-1, 0, 0);
        albedo = vec3(1, 1, 0);
    }
    

    if (dist == 100000.) {
        discard;
    }

    inter = o + d * dist;


    normal = normalize(mat3(view) * mat3(transform) * normal);

    vec3 lightDir = mat3(view) * normalize(vec3(1));

    float dt = clamp(0.0, 1.0, dot(normal, lightDir));
    dt = 0.5 + 0.5 * dt;

    vec3 V = normalize(vPosition);
    float specular = pow(clamp(0.0, 1.0, dot(reflect(V, normal), lightDir)), 4.0);


    //color = vec4(vColor * dt * 0.0 + vec3(1) * specular, 1);
    //color = vec4(normal * .5 + .5, 1);
    color = vec4(albedo * dt, 1);
    //color = vec4(disc < 0.0 ? vec3(0) : vec3(1), 1);
}
`

/**
    * @param { WebGL2RenderingContext } gl
    * @param { string } src
    * @param { number } type
    * @returns { WebGLShader }
*/
function compileShader(gl, src, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(src.split('\n').map((s, i) => `${i}: ${s}`).join('\n'))
        throw new Error('Could not compile shader: ' + gl.getShaderInfoLog(shader));
    }
    return shader
}

export class WebGlRenderer {
    /** @type { WebGL2RenderingContext } gl */
    gl
    /** @type { Object.<string, WebGLShader> } */
    shaders = {}

    /**
        * @param { HTMLCanvasElement } canvas
    */
    constructor(canvas) {
        this.gl = canvas.getContext('webgl2')

        const gl = this.gl

        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.CULL_FACE)

        gl.clearColor(0.1, 0.2, 0.3, 1)

        this.shaders['cubonVS'] = compileShader(gl, cubonVS, gl.VERTEX_SHADER)
        this.shaders['cubonFS'] = compileShader(gl, cubonFS, gl.FRAGMENT_SHADER)
    }

    /**
        * @param { WebGLShader } vShader
        * @param { WebGLShader } fShader
        * @returns { WebGLProgram }
    */
    createProgram(vShader, fShader) {
        const gl = this.gl

        const program = gl.createProgram()
        gl.attachShader(program, vShader)
        gl.attachShader(program, fShader)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program))
        }

        return program
    }
    
    frameStart() {
        const gl = this.gl

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
}
