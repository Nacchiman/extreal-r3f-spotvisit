varying vec2 vUv;
uniform float time;
uniform float speed;

uniform sampler2D baseTexture;
uniform sampler2D maskTexture;
uniform vec4 baseColor;

float strength = 20.0;
float noiseScale = 0.25;
float noiseStrength = 0.1;
float alphaScale = 2.4;

/*****************************************************************************/
/* twirl                                                                     */
/*****************************************************************************/

/**
* 2次元ベクトルを回転させる関数
* @param uv 回転させるベクトル
* @param center 回転の中心座標
* @param strength 回転の強さ
* @return 回転後のベクトル
*/
vec2 twirl(vec2 uv, vec2 center, float strength, vec2 offset)
{
    vec2 delta = uv - center;
    float angle = strength * length(delta);
    float x = cos(angle) * delta.x - sin(angle) * delta.y;
    float y = sin(angle) * delta.x + cos(angle) * delta.y;
    return vec2(x + center.x + offset.x, y + center.y + offset.y);
}

/*************************************************************************************************/
/* SimpleNoise                                                                                   */
/* https://docs.unity3d.com/ja/Packages/com.unity.shadergraph@10.0/manual/Simple-Noise-Node.html */
/*************************************************************************************************/

// ランダム値を生成する関数
float randomValue(vec2 xuv) {
    return fract(sin(dot(xuv, vec2(12.9898, 78.233))) * 43758.5453);
}

// 補間関数
float interpolate(float a, float b, float t) {
    return a * (1.0 - t) + b * t;
}

// 値ノイズを生成する関数
float valueNoise(vec2 xuv) {
    vec2 i = floor(xuv);
    vec2 f = fract(xuv);
    f = f * f * (3.0 - 2.0 * f);
    
    vec2 c0 = i + vec2(0.0, 0.0);
    vec2 c1 = i + vec2(1.0, 0.0);
    vec2 c2 = i + vec2(0.0, 1.0);
    vec2 c3 = i + vec2(1.0, 1.0);
    float r0 = randomValue(c0);
    float r1 = randomValue(c1);
    float r2 = randomValue(c2);
    float r3 = randomValue(c3);
    
    float bottomOfGrid = interpolate(r0, r1, f.x);
    float topOfGrid = interpolate(r2, r3, f.x);
    return interpolate(bottomOfGrid, topOfGrid, f.y);
}

// シンプルノイズを生成する関数
float SimpleNoise(vec2 UV, float Scale) {
    float t = 0.0;
    
    float freq = pow(2.0, 0.0);
    float amp = pow(0.5, 3.0);
    t += valueNoise(vec2(UV.x * Scale / freq, UV.y * Scale / freq)) * amp;
    
    freq = pow(2.0, 1.0);
    amp = pow(0.5, 2.0);
    t += valueNoise(vec2(UV.x * Scale / freq, UV.y * Scale / freq)) * amp;
    
    freq = pow(2.0, 2.0);
    amp = pow(0.5, 1.0);
    t += valueNoise(vec2(UV.x * Scale / freq, UV.y * Scale / freq)) * amp;
    
    return t;
}

/*************************************************************************************************/
/* Remap                                                                                         */
/* https://docs.unity3d.com/ja/Packages/com.unity.shadergraph@10.0/manual/Remap-Node.html        */
/* リマップの例                                                                                  */
/*   vec4 color = vec4(noise, noise, noise, 1.0);                                                */
/*   vec2 inRange = vec2(0.0, 1.0);                                                              */
/*   vec2 outRange = vec2(0.0, 1.0);                                                             */
/*   color = Remap(color, inRange, outRange);                                                    */
/*************************************************************************************************/

vec4 Remap(vec4 In, vec2 InMinMax, vec2 OutMinMax) {
    return OutMinMax.x + (In - InMinMax.x) * (OutMinMax.y - OutMinMax.x) / (InMinMax.y - InMinMax.x);
}

/*************************************************************************************************/
/* Add                                                                                           */
/* https://docs.unity3d.com/ja/Packages/com.unity.shadergraph@10.0/manual/Add-Node.html          */
/*************************************************************************************************/

vec4 Add(vec4 A, vec4 B) {
    return A + B;
}

/*************************************************************************************************/
/* Multiplay                                                                                     */
/* https://docs.unity3d.com/ja/Packages/com.unity.shadergraph@10.0/manual/Add-Node.html          */
/*************************************************************************************************/

// ベクトル * ベクトル
vec4 Multiply(vec4 A, vec4 B) {
    return A * B;
}

// ベクトル * 行列
vec4 Multiply(vec4 A, mat4 B) {
    return B * A; // 行列 * ベクトルの順序に変更
}

// 行列 * 行列
mat4 Multiply(mat4 A, mat4 B) {
    return A * B;
}

/*************************************************************************************************/
/* Rotate                                                                                        */
/* https://docs.unity3d.com/ja/Packages/com.unity.shadergraph@10.0/manual/Rotate-Node.html       */
/*************************************************************************************************/

vec2 RotateRadians(vec2 UV, vec2 Center, float Rotation){
    UV -= Center;
    float s = sin(Rotation);
    float c = cos(Rotation);
    mat2 rMatrix = mat2(c, -s, s, c);
    UV = rMatrix * UV;
    UV += Center;
    return UV;
}

vec2 RotateDegrees(vec2 UV, vec2 Center, float Rotation){
    Rotation = radians(Rotation); // 度をラジアンに変換
    UV -= Center;
    float s = sin(Rotation);
    float c = cos(Rotation);
    mat2 rMatrix = mat2(c, -s, s, c);
    UV = rMatrix * UV;
    UV += Center;
    return UV;
}

/******************************************************************************************************/
/* Simple Texture 2D                                                                                  */
/* https://docs.unity3d.com/ja/Packages/com.unity.shadergraph@10.0/manual/Sample-Texture-2D-Node.html */
/******************************************************************************************************/
// 入力されたUV座標を使用してテクスチャをサンプリングします
vec4 SampleTexture2D(sampler2D tex, vec2 uv) {
    return texture(tex, uv);
}

// ノーマルマップをデコードするための関数
vec3 UnpackNormalRGorAG(vec3 packedNormal) {
    vec3 normal;
    normal.xy = packedNormal.xy * 2.0 - 1.0;
    normal.z = sqrt(max(0.0, 1.0 - dot(normal.xy, normal.xy)));
    return normal;
}

// UV座標を使用してテクスチャをサンプリングし、ノーマルマップとして処理します（ノーマルモード）
vec4 SampleTexture2DNormal(sampler2D tex, vec2 uv){
    vec4 sampledColor = texture(tex, uv);
    vec3 unpackedNormal = UnpackNormalRGorAG(sampledColor.rgb);
    return vec4(unpackedNormal, sampledColor.a);
}

vec3 applyGamma(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}

vec3 adjustBrightnessContrast(vec3 color, float brightness, float contrast) {
    return (color - 0.5) * contrast + 0.5 + brightness;
}

vec3 toneMap(vec3 color) {
    return color / (color + vec3(1.0));
}

/*************************************************************************************************/

void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    vec2 twirled = twirl(uv, center, strength, vec2(0.0, 0.0));
    
    // ノイズを生成
    float noise = SimpleNoise(uv, noiseScale);
    vec4 color = vec4(noise, noise, noise, noise);
    vec2 inRange = vec2(0.0, 1.0);
    // vec2 outRange = vec2(-0.2, 0.2);
    vec2 outRange = vec2(-1.0, 1.0);
    vec4 remapped = Remap(color, inRange, outRange);
    remapped = vec4(remapped.rgb, color.a);
    
    // 乗算
    float mpFactor = noiseStrength;
    vec4 multiplied = Multiply(remapped, vec4(mpFactor, mpFactor, mpFactor, mpFactor));
    
    // 回転テクスチャとノイズを加算
    vec4 added = Add(vec4(twirled, 0.5, 0.5), multiplied);
    
    // 時間にもとづく回転のアニメーション
    float rotationAngle = time * speed; // 時間による回転角度(ラジアン)
    vec2 rotation = RotateRadians(added.xy, center, rotationAngle);
    
    // サンプリング
    vec4 sampled = SampleTexture2D(baseTexture, rotation);
    //単色テクスチャと乗算
    vec4 baseMultiplied = Multiply(baseColor, sampled);
    // マスクテクスチャをサンプリングしてアルファを使用
    vec4 alphaSampled = SampleTexture2D(maskTexture, uv);
    
    // Splitノードは値を取り出すだけなので，演算で実装
    float alpha = alphaSampled.a * baseMultiplied.a * alphaScale;

    // 色の明るさを調整するために、baseMultipliedに乗算を追加
    baseMultiplied.rgb *= 1.3; // 明るさを30%増加
    
    gl_FragColor = vec4(baseMultiplied.rgb, alpha);
}

/*************************************************************************************************/
