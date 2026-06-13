export NODE_OPTIONS="--max-old-space-size=4096"
cd /home/edi/tunnelpicks
npm run build 2>&1 | tail -40
