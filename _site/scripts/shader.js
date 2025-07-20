// assets/js/shadertoy-renderer.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myShaderCanvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        alert('Your browser does not support WebGL.');
        return;
    }

    // --- 1. 获取 ShaderToy 的 GLSL 代码 ---
    // 你需要从 ShaderToy 网站上复制你想要使用的片段着色器代码。
    // 例如，一个简单的 ShaderToy 着色器：
    const fragmentShaderSource = `
        #ifdef GL_ES
        precision mediump float;
        #endif

        uniform float iTime;
        uniform vec2 iResolution;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float aspect = iResolution.y/iResolution.x;
    float value;
	vec2 uv = fragCoord.xy / iResolution.x;
    uv -= vec2(0.5, 0.5*aspect);
    float rot = radians(45.0); // radians(45.0*sin(iTime));
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m * uv;
    uv += vec2(0.5, 0.5*aspect);
    uv.y+=0.5*(1.0-aspect);
    vec2 pos = 10.0*uv;
    vec2 rep = fract(pos);
    float dist = 2.0*min(min(rep.x, 1.0-rep.x), min(rep.y, 1.0-rep.y));
    float squareDist = length((floor(pos)+vec2(0.5)) - vec2(5.0) );
    
    float edge = sin(iTime-squareDist*0.5)*0.5+0.5;
    
    edge = (iTime-squareDist*0.5)*0.5;
    edge = 2.0*fract(edge*0.5);
    //value = 2.0*abs(dist-0.5);
    //value = pow(dist, 2.0);
    value = fract (dist*2.0);
    value = mix(value, 1.0-value, step(1.0, edge));
    //value *= 1.0-0.5*edge;
    edge = pow(abs(1.0-edge), 2.0);
    
    //edge = abs(1.0-edge);
    value = smoothstep( edge-0.05, edge, 0.95*value);
    
    
    value += squareDist*.1;
    //fragColor = vec4(value);
    fragColor = mix(vec4(1.0,1.0,1.0,1.0),vec4(0.5,0.75,1.0,1.0), value);
    fragColor.a = 0.25*clamp(value, 0.0, 1.0);
}

        void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
    `;

    // ShaderToy 的着色器通常没有顶点着色器，它隐含在一个全屏四边形上。
    // 你需要提供一个简单的顶点着色器来绘制这个四边形。
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `;

    // --- 2. 编译着色器 ---
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // --- 3. 创建着色器程序 ---
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return;
    }

    gl.useProgram(program);

    // --- 4. 设置顶点数据 (全屏四边形) ---
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1, -1, // bottom left
        1, -1, // bottom right
        -1, 1, // top left
        -1, 1, // top left
        1, -1, // bottom right
        1, 1, // top right
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // --- 5. 获取 uniform 变量位置 ---
    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');

    // --- 6. 渲染循环 ---
    let startTime = Date.now();

    function render() {
        const currentTime = (Date.now() - startTime) / 1000; // 时间以秒为单位

        gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(iTimeLocation, currentTime);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); // 清除画布为透明
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    render();

    // 调整画布大小以适应窗口变化
    window.addEventListener('resize', () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
    });
    // 首次加载时设置正确大小
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
});