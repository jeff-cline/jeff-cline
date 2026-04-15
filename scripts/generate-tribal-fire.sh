#!/bin/bash
# Generate Bufo Ceremony - Tribal Fire meditation track
# 7 minutes (420 seconds)
# Volume curve: 30% -> 40% (1min) -> 50% (2min) -> hold 3min -> fade down 5% steps to 0

set -e
OUTDIR="/Users/jeffcline/.openclaw/workspace/jeff-cline-site/public/audio/meditations"
TMPDIR="/tmp/tribal-fire-build"
mkdir -p "$TMPDIR" "$OUTDIR"
DUR=420

echo "=== Generating frequency layers ==="

# 1. Heavy ocean waves crashing against rocks (aggressive surf - brown noise filtered)
echo "Layer 1: Heavy crashing waves..."
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=brown:r=44100:a=0.6,highpass=f=60,lowpass=f=800,tremolo=f=0.15:d=0.7" \
  -t $DUR "$TMPDIR/waves-crash.wav" 2>/dev/null

# 2. Secondary wave layer (higher frequency spray/foam)
echo "Layer 2: Wave spray..."
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=pink:r=44100:a=0.2,highpass=f=2000,lowpass=f=6000,tremolo=f=0.12:d=0.5" \
  -t $DUR "$TMPDIR/wave-spray.wav" 2>/dev/null

# 3. Tribal drums - deep ceremonial (starts 70bpm, accelerates to ~100bpm)
echo "Layer 3: Tribal drums..."
# Create a deep drum hit pattern using low frequency pulse
ffmpeg -y -f lavfi -i "sine=f=55:d=$DUR,tremolo=f=1.3:d=0.9,volume=0.5" \
  -t $DUR "$TMPDIR/drum-base.wav" 2>/dev/null

# Secondary drum pattern (higher, offset rhythm)
ffmpeg -y -f lavfi -i "sine=f=82:d=$DUR,tremolo=f=2.6:d=0.8,volume=0.3" \
  -t $DUR "$TMPDIR/drum-high.wav" 2>/dev/null

# Accelerating drum layer
ffmpeg -y -f lavfi -i "sine=f=45:d=$DUR,tremolo=f=1.8:d=0.95,volume=0.35" \
  -t $DUR "$TMPDIR/drum-accel.wav" 2>/dev/null

# 4. Tribal chanting simulation (rich harmonic drone with vocal-like formants)
echo "Layer 4: Tribal vocal drone..."
# Deep male vocal range with harmonics
ffmpeg -y -f lavfi -i "sine=f=110:d=$DUR" -f lavfi -i "sine=f=220:d=$DUR" -f lavfi -i "sine=f=330:d=$DUR" -f lavfi -i "sine=f=440:d=$DUR" \
  -filter_complex "[0]volume=0.25[a];[1]volume=0.15[b];[2]volume=0.10[c];[3]volume=0.05[d];[a][b][c][d]amix=inputs=4:duration=first,tremolo=f=0.3:d=0.4,bandpass=f=300:width_type=h:w=200" \
  -t $DUR "$TMPDIR/chant-drone.wav" 2>/dev/null

# Chanting rhythm overlay (pulsing vocal harmonics)
ffmpeg -y -f lavfi -i "sine=f=165:d=$DUR,tremolo=f=0.8:d=0.7,volume=0.15,bandpass=f=400:width_type=h:w=150" \
  -t $DUR "$TMPDIR/chant-rhythm.wav" 2>/dev/null

# 5. 417Hz Solfeggio (sacral/emotional release)
echo "Layer 5: 417Hz Solfeggio..."
ffmpeg -y -f lavfi -i "sine=f=417:d=$DUR,volume=0.12,tremolo=f=0.08:d=0.3" \
  -t $DUR "$TMPDIR/417hz.wav" 2>/dev/null

# 6. 432Hz harmonic tuning
echo "Layer 6: 432Hz harmonic..."
ffmpeg -y -f lavfi -i "sine=f=432:d=$DUR,volume=0.10,tremolo=f=0.06:d=0.25" \
  -t $DUR "$TMPDIR/432hz.wav" 2>/dev/null

# 7. 528Hz transformation
echo "Layer 7: 528Hz transformation..."
ffmpeg -y -f lavfi -i "sine=f=528:d=$DUR,volume=0.10,tremolo=f=0.05:d=0.2" \
  -t $DUR "$TMPDIR/528hz.wav" 2>/dev/null

# 8. Isochronic theta pulses (6Hz pulse on 200Hz carrier)
echo "Layer 8: Isochronic theta..."
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR,tremolo=f=6:d=1.0,volume=0.08" \
  -t $DUR "$TMPDIR/isochronic.wav" 2>/dev/null

# 9. Binaural beats - LEFT channel (base frequencies)
echo "Layer 9: Binaural beats..."
# 200Hz left, 204Hz right = 4Hz theta
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR,volume=0.06" -t $DUR "$TMPDIR/bin-left-1.wav" 2>/dev/null
ffmpeg -y -f lavfi -i "sine=f=204:d=$DUR,volume=0.06" -t $DUR "$TMPDIR/bin-right-1.wav" 2>/dev/null
# 300Hz left, 307Hz right = 7Hz theta
ffmpeg -y -f lavfi -i "sine=f=300:d=$DUR,volume=0.05" -t $DUR "$TMPDIR/bin-left-2.wav" 2>/dev/null
ffmpeg -y -f lavfi -i "sine=f=307:d=$DUR,volume=0.05" -t $DUR "$TMPDIR/bin-right-2.wav" 2>/dev/null
# 400Hz left, 410Hz right = 10Hz alpha
ffmpeg -y -f lavfi -i "sine=f=400:d=$DUR,volume=0.04" -t $DUR "$TMPDIR/bin-left-3.wav" 2>/dev/null
ffmpeg -y -f lavfi -i "sine=f=410:d=$DUR,volume=0.04" -t $DUR "$TMPDIR/bin-right-3.wav" 2>/dev/null

# Merge binaural into stereo pairs
echo "Merging binaural pairs..."
ffmpeg -y -i "$TMPDIR/bin-left-1.wav" -i "$TMPDIR/bin-right-1.wav" \
  -filter_complex "[0][1]join=inputs=2:channel_layout=stereo" "$TMPDIR/binaural-4hz.wav" 2>/dev/null
ffmpeg -y -i "$TMPDIR/bin-left-2.wav" -i "$TMPDIR/bin-right-2.wav" \
  -filter_complex "[0][1]join=inputs=2:channel_layout=stereo" "$TMPDIR/binaural-7hz.wav" 2>/dev/null
ffmpeg -y -i "$TMPDIR/bin-left-3.wav" -i "$TMPDIR/bin-right-3.wav" \
  -filter_complex "[0][1]join=inputs=2:channel_layout=stereo" "$TMPDIR/binaural-10hz.wav" 2>/dev/null

# 10. Subliminal low-frequency bed (barely audible, felt more than heard)
echo "Layer 10: Subliminal bed..."
ffmpeg -y -f lavfi -i "sine=f=40:d=$DUR,volume=0.04" -t $DUR "$TMPDIR/subliminal.wav" 2>/dev/null

echo "=== Converting mono layers to stereo ==="
for f in waves-crash wave-spray drum-base drum-high drum-accel chant-drone chant-rhythm 417hz 432hz 528hz isochronic subliminal; do
  ffmpeg -y -i "$TMPDIR/$f.wav" -ac 2 "$TMPDIR/${f}-stereo.wav" 2>/dev/null
done

echo "=== Mixing all layers ==="
ffmpeg -y \
  -i "$TMPDIR/waves-crash-stereo.wav" \
  -i "$TMPDIR/wave-spray-stereo.wav" \
  -i "$TMPDIR/drum-base-stereo.wav" \
  -i "$TMPDIR/drum-high-stereo.wav" \
  -i "$TMPDIR/drum-accel-stereo.wav" \
  -i "$TMPDIR/chant-drone-stereo.wav" \
  -i "$TMPDIR/chant-rhythm-stereo.wav" \
  -i "$TMPDIR/417hz-stereo.wav" \
  -i "$TMPDIR/432hz-stereo.wav" \
  -i "$TMPDIR/528hz-stereo.wav" \
  -i "$TMPDIR/isochronic-stereo.wav" \
  -i "$TMPDIR/binaural-4hz.wav" \
  -i "$TMPDIR/binaural-7hz.wav" \
  -i "$TMPDIR/binaural-10hz.wav" \
  -i "$TMPDIR/subliminal-stereo.wav" \
  -filter_complex "
    [0][1][2][3][4][5][6][7][8][9][10][11][12][13][14]amix=inputs=15:duration=first:normalize=0,
    volume='if(lt(t,60),0.3, if(lt(t,120),0.4, if(lt(t,300),0.5, if(lt(t,312),0.45, if(lt(t,324),0.40, if(lt(t,336),0.35, if(lt(t,348),0.30, if(lt(t,360),0.25, if(lt(t,372),0.20, if(lt(t,384),0.15, if(lt(t,396),0.10, if(lt(t,408),0.05, 0.0))))))))))))':eval=frame,
    alimiter=limit=0.95
  " \
  -t $DUR -b:a 320k "$OUTDIR/bufo-ceremony-tribal-fire.mp3" 2>/dev/null

echo "=== Done ==="
ls -lh "$OUTDIR/bufo-ceremony-tribal-fire.mp3"
echo "Duration check:"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTDIR/bufo-ceremony-tribal-fire.mp3"

# Cleanup
rm -rf "$TMPDIR"
echo "Temp files cleaned."
