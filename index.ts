// Tên file: upload.js

// Import các thư viện cần thiết
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Nạp file .env để lấy token
dotenv.config()

async function uploadImage() {
    // Tên file bạn muốn tải lên Vercel Blob
    const fileName = 'eric-patterson-2.jpg';

    // Đường dẫn đến file ảnh trên máy của bạn
    const filepath = path.join(__dirname, fileName); // (Giả sử bạn có file 'my-image.png' cùng thư mục)

    // Đọc file ảnh từ đĩa
    let fileBody;
    try {
        fileBody = fs.readFileSync(filepath);
    } catch (error) {
        console.error(`Không tìm thấy file tại: ${filepath}`);
        console.error('Hãy chắc chắn bạn đã tạo file "my-image.png" trong cùng thư mục.');
        return;
    }

    console.log(`Đang tải file "${fileName}" lên Vercel Blob...`);

    try {
        const date = new Date(Date.now())

        const dir = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + '/'
        // Gọi hàm 'put' để tải file lên
        const blob = await put(
            dir + fileName, // Tên file trên Vercel Blob (có thể bao gồm thư mục, vd: 'images/test.png')
            fileBody, // Nội dung file (dạng Buffer hoặc Stream)
            {
                access: 'public', // Quan trọng: Đặt là 'public' để có thể truy cập qua URL
            }
        );

        console.log('Tải lên thành công!');
        console.log('File của bạn có thể được truy cập tại URL:');
        console.log(blob.url); // Đây là URL công khai của file

    } catch (error: any) {
        console.error('Lỗi khi tải file lên:', error.message);
    }
}

// Chạy hàm
uploadImage();
