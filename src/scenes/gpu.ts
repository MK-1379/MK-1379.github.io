export function hasHardwareWebGL() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
  if (!gl) return false
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return !/swiftshader|llvmpipe|softpipe|software/i.test(name)
}
