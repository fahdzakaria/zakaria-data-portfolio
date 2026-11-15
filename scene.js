// Fond du hero en verre cannelé, teinte vert mousse :
// une braise qui ondule derrière du verre cannelé, avec grain. WebGL brut,
// basse résolution, en pause hors écran ; image figée si mouvement réduit ;
// dégradé CSS de repli si WebGL est indisponible.

const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FS = `precision mediump float;uniform vec2 r;uniform float t;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec3 ember(vec2 p,float t){
  float a=(sin(p.x*2.2+t*.12)+sin(p.y*3.1-t*.09+p.x*1.3)+sin((p.x+p.y)*1.7+t*.07))/3.;
  float b=sin(p.x*4.-t*.1+sin(p.y*2.5+t*.15)*1.5);
  float v=.5+.5*a;
  vec3 c=mix(vec3(.006,.014,.006),vec3(.05,.16,.05),smoothstep(.1,.5,v));
  c=mix(c,vec3(.22,.48,.12),smoothstep(.45,.8,v+.1*b));
  c=mix(c,vec3(.7,.92,.42),smoothstep(.8,1.,v+.15*b)*.6);
  return c;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float N=floor(r.x/22.);float f=fract(uv.x*N);float id=floor(uv.x*N);
  float ux=uv.x+(f-.5)*.07+(hash(vec2(id,1.))-.5)*.012;
  float ca=.006*(.4+f);
  float asp=r.x/r.y;
  vec3 c;
  c.r=ember(vec2((ux+ca)*asp,uv.y),t).r;
  c.g=ember(vec2(ux*asp,uv.y),t).g;
  c.b=ember(vec2((ux-ca)*asp,uv.y),t).b;
  float edge=smoothstep(0.,.1,f)*smoothstep(1.,.9,f);
  c*=(.62+.38*edge)*(.8+.35*f);
  vec2 q=vec2((ux-.78-.05*sin(t*.05))*asp,(uv.y-.62-.04*cos(t*.04))*1.4);
  float bloom=exp(-dot(q,q)*3.2);
  c*=.07+1.3*bloom;
  c+=vec3(.55,1.,.32)*pow(bloom,6.)*.3*edge;
  c+=(hash(gl_FragCoord.xy+fract(t*.37)*91.)-.5)*.08;
  gl_FragColor=vec4(max(c,0.),1.);}`;

function demarrer(cv) {
  const repli = () => cv.classList.add("repli");
  const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return repli();

  const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const v = shader(gl.VERTEX_SHADER, VS);
  const f = shader(gl.FRAGMENT_SHADER, FS);
  if (!v || !f) return repli();
  const prog = gl.createProgram();
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return repli();
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, "r");
  const uT = gl.getUniformLocation(prog, "t");

  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  let visible = true;
  const t0 = performance.now();

  const taille = () => {
    const k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
    const w = Math.max(2, Math.round(cv.clientWidth * k));
    const h = Math.max(2, Math.round(cv.clientHeight * k));
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uR, w, h);
  };
  const image = (now) => {
    raf = 0;
    taille();
    gl.uniform1f(uT, reduit ? 4 : (now - t0) / 1000 + 4);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduit && visible && !document.hidden) raf = requestAnimationFrame(image);
  };
  const relancer = () => {
    if (!raf && !reduit) raf = requestAnimationFrame(image);
  };

  image(performance.now());
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) relancer();
  }).observe(cv);
  document.addEventListener("visibilitychange", () => !document.hidden && relancer());
  window.addEventListener("resize", () => (reduit ? image(performance.now()) : relancer()));
  cv.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    visible = false;
    repli();
  });
}

const cv = document.getElementById("heroFond");
if (cv) demarrer(cv);
