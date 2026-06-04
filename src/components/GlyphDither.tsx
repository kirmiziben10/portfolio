//Mocked in Unicorn Studio, made AI write slimmer version.
//Reason to use this over Unicorn studio version was,
//Unicorn shader becoming choppy while resizing the viewport.
//This has no issue when resizing while achieving the desired effect.

import { useEffect, useRef } from 'react';

const VERTEX_SRC = `\
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = a_position * 0.5 + 0.5;
}`;

const FRAGMENT_SRC = `\
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_gridCols;
uniform float u_voronoiScale;
uniform float u_skew;
uniform float u_angle;
uniform float u_threshold;
uniform float u_gamma;
uniform float u_mix;
uniform float u_speed;
uniform float u_drift;
uniform sampler2D u_glyphAtlas;

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;

    float cellSize = u_resolution.x / u_gridCols;
    vec2 cellId = floor(gl_FragCoord.xy / cellSize);
    vec2 sampleCoord = (cellId + 0.5) * cellSize;

    vec2 p = (sampleCoord - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    p.x /= aspect;

    float c = cos(u_angle);
    float s = sin(u_angle);
    p = mat2(c, -s, s, c) * p;

    p.x += u_skew * p.y;
    p *= u_voronoiScale;

    p.x += u_drift + u_time * u_speed;

    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 8.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 g = vec2(float(x), float(y));
            vec2 o = hash2(n + g);
            vec2 r = g + o - f;
            float d = dot(r, r);
            md = min(md, d);
        }
    }
    float dist = sqrt(md);
    float noiseVal = clamp(dist, 0.0, 1.0);

    float val = pow(noiseVal, 1.0 / u_gamma);
    if (val < u_threshold) discard;

    float index = floor(val * 9.0);
    index = clamp(index, 0.0, 8.0);

    vec2 cellLocalUV = fract(gl_FragCoord.xy / cellSize);
    vec2 atlasUV = vec2((index + cellLocalUV.x) / 9.0, cellLocalUV.y);
    vec4 sample = texture2D(u_glyphAtlas, atlasUV);

    gl_FragColor = vec4(1.0, 1.0, 1.0, sample.a * u_mix);
}`;

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

const CHARS = ['', '.', ':', '=', '+', '*', '#', '%', '@'];
const ATLAS_CELL = 32;
const ATLAS_COLS = CHARS.length;

function compileShader(gl: WebGLRenderingContext, src: string, type: number): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Shader compile error: ${log}`);
    }
    return shader;
}

function linkProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`Program link error: ${log}`);
    }
    return program;
}

function createAtlas(gl: WebGLRenderingContext): WebGLTexture {
    const canvas = document.createElement('canvas');
    canvas.width = ATLAS_CELL * ATLAS_COLS;
    canvas.height = ATLAS_CELL;
    const ctx = canvas.getContext('2d')!;
    ctx.font = '16px "Courier New", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < CHARS.length; i++) {
        ctx.fillText(CHARS[i], i * ATLAS_CELL + ATLAS_CELL / 2, ATLAS_CELL / 2);
    }

    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

interface GlyphDitherProps {
    gridCols?: number;
    voronoiScale?: number;
    skew?: number;
    angle?: number;
    threshold?: number;
    gamma?: number;
    mix?: number;
    speed?: number;
    drift?: number;
}

const DEFAULTS = {
    gridCols: 80,
    voronoiScale: 20,
    skew: 0.5,
    angle: 178,
    threshold: 0.05,
    gamma: 0.5,
    mix: 1,
    speed: 6,
    drift: 42,
} as const;

export default function GlyphDither(props: GlyphDitherProps) {
    const {
        gridCols = DEFAULTS.gridCols,
        voronoiScale = DEFAULTS.voronoiScale,
        skew = DEFAULTS.skew,
        angle = DEFAULTS.angle,
        threshold = DEFAULTS.threshold,
        gamma = DEFAULTS.gamma,
        mix = DEFAULTS.mix,
        speed = DEFAULTS.speed,
        drift = DEFAULTS.drift,
    } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<{
        gl: WebGLRenderingContext;
        uniforms: Record<string, WebGLUniformLocation | null>;
    } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            console.warn('WebGL not available');
            return;
        }

        const vs = compileShader(gl, VERTEX_SRC, gl.VERTEX_SHADER);
        const fs = compileShader(gl, FRAGMENT_SRC, gl.FRAGMENT_SHADER);
        const program = linkProgram(gl, vs, fs);

        const U = (name: string) => gl.getUniformLocation(program, name);
        const uniforms = {
            resolution: U('u_resolution'),
            time: U('u_time'),
            gridCols: U('u_gridCols'),
            voronoiScale: U('u_voronoiScale'),
            skew: U('u_skew'),
            angle: U('u_angle'),
            threshold: U('u_threshold'),
            gamma: U('u_gamma'),
            mix: U('u_mix'),
            speed: U('u_speed'),
            drift: U('u_drift'),
        };

        glRef.current = { gl, uniforms };

        const buffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const atlas = createAtlas(gl);

        gl.useProgram(program);

        gl.uniform1f(uniforms.gridCols, gridCols);
        gl.uniform1f(uniforms.voronoiScale, voronoiScale);
        gl.uniform1f(uniforms.skew, skew);
        gl.uniform1f(uniforms.angle, (angle * Math.PI) / 180);
        gl.uniform1f(uniforms.threshold, threshold);
        gl.uniform1f(uniforms.gamma, gamma);
        gl.uniform1f(uniforms.mix, mix);
        gl.uniform1f(uniforms.speed, speed);
        gl.uniform1f(uniforms.drift, drift);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, atlas);
        const atlasLoc = gl.getUniformLocation(program, 'u_glyphAtlas');
        gl.uniform1i(atlasLoc, 0);

        function resize() {
            if (!canvas || !gl) return;
            const dpr = window.devicePixelRatio || 1;
            const w = Math.round(canvas.clientWidth * dpr);
            const h = Math.round(canvas.clientHeight * dpr);
            if (w === 0 || h === 0) return;
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            gl.uniform2f(uniforms.resolution, w, h);
        }

        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        resize();

        let animationId = 0;
        const startTime = performance.now();

        function render() {
            if (!canvas || !gl) return;
            animationId = requestAnimationFrame(render);
            if (canvas.width === 0 || canvas.height === 0) return;
            gl.uniform1f(uniforms.time, (performance.now() - startTime) / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        render();

        return () => {
            glRef.current = null;
            cancelAnimationFrame(animationId);
            observer.disconnect();
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteBuffer(buffer);
            gl.deleteTexture(atlas);
        };
    }, []);

    useEffect(() => {
        const ctx = glRef.current;
        if (!ctx) return;
        const { gl, uniforms } = ctx;
        gl.uniform1f(uniforms.gridCols, gridCols);
        gl.uniform1f(uniforms.voronoiScale, voronoiScale);
        gl.uniform1f(uniforms.skew, skew);
        gl.uniform1f(uniforms.angle, (angle * Math.PI) / 180);
        gl.uniform1f(uniforms.threshold, threshold);
        gl.uniform1f(uniforms.gamma, gamma);
        gl.uniform1f(uniforms.mix, mix);
        gl.uniform1f(uniforms.speed, speed);
        gl.uniform1f(uniforms.drift, drift);
    }, [gridCols, voronoiScale, skew, angle, threshold, gamma, mix, speed, drift]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', minHeight: '500px', display: 'block' }} />;
}
