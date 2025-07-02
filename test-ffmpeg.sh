#!/bin/bash

echo "=== VÉRIFICATION FFMPEG ==="
echo "Version de FFmpeg:"
ffmpeg -version | head -1

echo -e "\n=== VÉRIFICATION DES CODECS ==="
ffmpeg -codecs | grep -E "(mp3|opus|vorbis)" | head -5

echo -e "\n=== TEST SIMPLE FFMPEG ==="
ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 -f null - 2>&1 | grep -E "(built|configuration)"

echo -e "\n=== VÉRIFICATION DES PERMISSIONS ==="
which ffmpeg
ls -la $(which ffmpeg)

echo -e "\n=== TEST DISTUBE CONFIG ==="
node -e "
try {
  const { spawn } = require('child_process');
  console.log('Test spawn ffmpeg...');
  const ffmpeg = spawn('ffmpeg', ['-version']);
  ffmpeg.stdout.on('data', (data) => {
    console.log('FFmpeg OK:', data.toString().split('\n')[0]);
  });
  ffmpeg.on('error', (error) => {
    console.error('Erreur FFmpeg:', error.message);
  });
  setTimeout(() => process.exit(0), 2000);
} catch(e) {
  console.error('Erreur:', e.message);
}
"
