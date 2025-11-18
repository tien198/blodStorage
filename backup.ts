import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import 'dotenv/config';
import { Stream } from 'stream';

// Đảm bảo bạn đã có biến môi trường BLOB_READ_WRITE_TOKEN trong file .env

async function backupBlobStore() {
    console.log('🚀 Bắt đầu quá trình backup...');

    // 1. Liệt kê tất cả các file trong Blob Store
    // Lưu ý: Nếu có quá nhiều file, bạn cần dùng pagination (cursor)
    const { blobs } = await list();

    const backupDir = './backup-data';
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    console.log(`📦 Tìm thấy ${blobs.length} file.`);

    for (const blob of blobs) {
        const fileName = path.basename(blob.pathname);
        const dirname = path.dirname(blob.pathname);

        const destinationDir = path.join(backupDir, dirname);
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }

        const filePath = path.join(destinationDir, fileName);
        console.log(`⬇️ Đang tải: ${blob.pathname}`);

        // 2. Tải file về
        const response = await fetch(blob.url);
        if (!response.ok) {
            console.error(`❌ Lỗi khi tải ${blob.pathname}: ${response.statusText}`);
            continue;
        }

        // 3. Lưu vào ổ cứng
        const fileStream = fs.createWriteStream(filePath);
        await pipeline(
            response.body as Stream.PipelineSource<any>,
            fileStream
        );
    }

    console.log('✅ Sao lưu hoàn tất!');
}

backupBlobStore().catch(console.error);