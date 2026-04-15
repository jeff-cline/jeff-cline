#!/bin/bash
# Generate Beach Ceremony 444 - pre-mixed download version
# Waves at normal volume, EVERYTHING ELSE boosted above the waves
# Same volume curve as Tribal Fire
set -e
OUTDIR="/Users/jeffcline/.openclaw/workspace/jeff-cline-site/public/audio/meditations"
TMPDIR="/tmp/beach-444-build"
mkdir -p "$TMPDIR" "$OUTDIR"
DUR=420

echo "=== Beach Ceremony 444 ==="

echo "Layer: Ocean waves (normal volume)..."
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=brown:r=44100:a=0.35,highpass=f=80,lowpass=f=900,tremolo=f=0.12:d=0.6" -ac 2 -t $DUR "$TMPDIR/waves.wav" 2>/dev/null &

echo "Layer: Heavy drums (BOOSTED)..."
ffmpeg -y -f lavfi -i "sine=f=55:d=$DUR" -af "tremolo=f=1.3:d=0.9,volume=0.9" -ac 2 -t $DUR "$TMPDIR/drum1.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=82:d=$DUR" -af "tremolo=f=2.6:d=0.8,volume=0.65" -ac 2 -t $DUR "$TMPDIR/drum2.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=45:d=$DUR" -af "tremolo=f=1.8:d=0.95,volume=0.7" -ac 2 -t $DUR "$TMPDIR/drum3.wav" 2>/dev/null &

echo "Layer: Chimes/bowls (BOOSTED)..."
# Singing bowl shimmer: main tone + overtone with slow tremolo
ffmpeg -y -f lavfi -i "sine=f=528:d=$DUR" -f lavfi -i "sine=f=1056:d=$DUR" \
  -filter_complex "[0]volume=0.30[a];[1]volume=0.10,tremolo=f=0.2:d=0.5[b];[a][b]amix=inputs=2:duration=first" \
  -ac 2 -t $DUR "$TMPDIR/chime528.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=432:d=$DUR" -f lavfi -i "sine=f=864:d=$DUR" \
  -filter_complex "[0]volume=0.28[a];[1]volume=0.09,tremolo=f=0.18:d=0.45[b];[a][b]amix=inputs=2:duration=first" \
  -ac 2 -t $DUR "$TMPDIR/chime432.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=417:d=$DUR" -f lavfi -i "sine=f=834:d=$DUR" \
  -filter_complex "[0]volume=0.26[a];[1]volume=0.08,tremolo=f=0.15:d=0.4[b];[a][b]amix=inputs=2:duration=first" \
  -ac 2 -t $DUR "$TMPDIR/chime417.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=396:d=$DUR" -f lavfi -i "sine=f=792:d=$DUR" \
  -filter_complex "[0]volume=0.24[a];[1]volume=0.07,tremolo=f=0.14:d=0.4[b];[a][b]amix=inputs=2:duration=first" \
  -ac 2 -t $DUR "$TMPDIR/chime396.wav" 2>/dev/null &

wait

echo "Layer: Om drone (BOOSTED)..."
ffmpeg -y -f lavfi -i "sine=f=136.1:d=$DUR" -af "volume=0.25,tremolo=f=0.1:d=0.3" -ac 2 -t $DUR "$TMPDIR/om.wav" 2>/dev/null &

echo "Layer: Chanting (BOOSTED)..."
ffmpeg -y -f lavfi -i "sine=f=110:d=$DUR" -f lavfi -i "sine=f=220:d=$DUR" -f lavfi -i "sine=f=330:d=$DUR" \
  -filter_complex "[0]volume=0.40[a];[1]volume=0.25[b];[2]volume=0.15[c];[a][b][c]amix=inputs=3:duration=first,tremolo=f=0.3:d=0.4,bandpass=f=300:width_type=h:w=200" \
  -ac 2 -t $DUR "$TMPDIR/chant.wav" 2>/dev/null &

echo "Layer: Isochronic theta (BOOSTED)..."
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=6:d=1.0,volume=0.18" -ac 2 -t $DUR "$TMPDIR/iso.wav" 2>/dev/null &

echo "Layer: Monaural beats (speaker-friendly, BOOSTED)..."
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=4:d=0.8,volume=0.15" -ac 2 -t $DUR "$TMPDIR/mono4.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=300:d=$DUR" -af "tremolo=f=7:d=0.8,volume=0.13" -ac 2 -t $DUR "$TMPDIR/mono7.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=400:d=$DUR" -af "tremolo=f=10:d=0.7,volume=0.11" -ac 2 -t $DUR "$TMPDIR/mono10.wav" 2>/dev/null &

echo "Layer: Subliminal bed..."
ffmpeg -y -f lavfi -i "sine=f=40:d=$DUR" -af "volume=0.05" -ac 2 -t $DUR "$TMPDIR/sub.wav" 2>/dev/null &

wait
echo "All layers generated."

echo "Mixing with volume curve..."
ffmpeg -y \
  -i "$TMPDIR/waves.wav" \
  -i "$TMPDIR/drum1.wav" \
  -i "$TMPDIR/drum2.wav" \
  -i "$TMPDIR/drum3.wav" \
  -i "$TMPDIR/chime528.wav" \
  -i "$TMPDIR/chime432.wav" \
  -i "$TMPDIR/chime417.wav" \
  -i "$TMPDIR/chime396.wav" \
  -i "$TMPDIR/om.wav" \
  -i "$TMPDIR/chant.wav" \
  -i "$TMPDIR/iso.wav" \
  -i "$TMPDIR/mono4.wav" \
  -i "$TMPDIR/mono7.wav" \
  -i "$TMPDIR/mono10.wav" \
  -i "$TMPDIR/sub.wav" \
  -filter_complex "
    [0][1][2][3][4][5][6][7][8][9][10][11][12][13][14]amix=inputs=15:duration=first:normalize=0,
    volume='if(lt(t,60),0.3, if(lt(t,120),0.4, if(lt(t,300),0.5, if(lt(t,312),0.45, if(lt(t,324),0.40, if(lt(t,336),0.35, if(lt(t,348),0.30, if(lt(t,360),0.25, if(lt(t,372),0.20, if(lt(t,384),0.15, if(lt(t,396),0.10, if(lt(t,408),0.05, 0.0))))))))))))':eval=frame,
    alimiter=limit=0.95
  " \
  -t $DUR -b:a 320k "$OUTDIR/beach-ceremony-444.mp3" 2>/dev/null

echo "=== Done ==="
ls -lh "$OUTDIR/beach-ceremony-444.mp3"
rm -rf "$TMPDIR"
