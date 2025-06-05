use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub fn mangafy(width: usize, height: usize, pixels: &mut [u8]) {
    // Step 1: Grayscale conversion
    let mut gray = vec![0u8; width * height];
    for y in 0..height {
        for x in 0..width {
            let idx = (y * width + x) * 4;
            let r = pixels[idx] as f32;
            let g = pixels[idx + 1] as f32;
            let b = pixels[idx + 2] as f32;
            gray[y * width + x] = (0.299 * r + 0.587 * g + 0.114 * b) as u8;
        }
    }

    // Step 2: Sobel edge detection
    let mut edge = vec![0u8; width * height];
    let sobel_x = [[-1i32, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    let sobel_y = [[-1i32, -2, -1], [0, 0, 0], [1, 2, 1]];

    for y in 1..height-1 {
        for x in 1..width-1 {
            let mut gx = 0i32;
            let mut gy = 0i32;
            for j in 0..3 {
                for i in 0..3 {
                    let px = gray[(y + j - 1) * width + (x + i - 1)] as i32;
                    gx += sobel_x[j][i] * px;
                    gy += sobel_y[j][i] * px;
                }
            }
            let magnitude = ((gx * gx + gy * gy) as f32).sqrt().min(255.0) as u8;
            edge[y * width + x] = 255 - magnitude; 
        }
    }

    // Step 3: Posterize the grayscale image
    for y in 0..height {
        for x in 0..width {
            let idx = (y * width + x) * 4;
            let base = gray[y * width + x];
            let tone = match base {
                0..=85 => 32,           
                86..=170 => 128, 
                _ => 220,                           
            };

            let edge_val = edge[y * width + x];
            let final_val = if edge_val < 90 { 0 } else { tone };

            for c in 0..3 {
                pixels[idx + c] = final_val;
            }
            pixels[idx + 3] = 255;
        }
    }
}