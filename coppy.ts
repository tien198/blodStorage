import fs from 'fs';
import path from 'path';

const read = fs.createReadStream(path.join(__dirname, 'eric-patterson-2.jpg'));
if (!fs.existsSync(path.join(__dirname, 'clone'))) {
    fs.mkdirSync(path.join(__dirname, 'clone'));
}

const write = fs.createWriteStream(path.join(__dirname, 'clone', 'eric-patterson-copy.jpg'));

read.pipe(write);
read.on('end', () => {
    console.log('-> Đã sao chép xong!');
});
write.on('error', (err) => {
    console.error('Lỗi ghi file:', err);
});
write.on('finish', () => {
    console.log('-> Ghi file hoàn tất!');
});