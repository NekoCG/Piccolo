#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;
    
    highp float color_b_0_lo = floor(color.b * 16.);
    highp float color_b_0_hi = ceil (color.b * 16.);
    highp float color_b_1 = color.b * 16. - color_b_0_lo;

    highp vec2 uv_0 = vec2((color_b_0_lo + color.r) / 16., color.g);
    highp vec2 uv_1 = vec2((color_b_0_hi + color.r) / 16., color.g);

    highp vec4 color_sampled_0 = texture(color_grading_lut_texture_sampler, uv_0);
    highp vec4 color_sampled_1 = texture(color_grading_lut_texture_sampler, uv_1);

    highp vec4 color_sampled = mix(color_sampled_0, color_sampled_1, color_b_1);

    out_color = color_sampled;
    // out_color = texture(color_grading_lut_texture_sampler, vec2((floor() + color.r) / 16., color.g));
}
