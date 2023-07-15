import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);
const folderPath = '../Frank Ocean';

// Get a list of all FLAC files in the input folder
function getFlacFiles(directory: string): string[] {
  let files: string[] = [];
  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      files = files.concat(getFlacFiles(itemPath));
    } else if (stat.isFile() && item.toLowerCase().endsWith('.flac')) {
      files.push(itemPath);
    }
  });

  return files;
}

const flacFiles = getFlacFiles(folderPath);

// Convert each FLAC file to ALAC
flacFiles.forEach((file) => {
  const inputFilePath = path.join(folderPath, file);
  const outputFilePath = path.join(folderPath, file.replace('.flac', '.m4a'));

  ffmpeg()
    .input(inputFilePath)
  .outputOptions('-acodec alac')
    .outputOptions('-vcodec copy')
    .output(outputFilePath)
    .on('end', () => {
      console.log(`Conversion complete for ${file}!`);
    })
    .on('error', (err) => {
      console.error(`An error occurred while converting ${file}:`, err.message);
    })
    .run();
});
