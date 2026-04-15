#!/bin/bash
# Generate speaker-friendly versions of both meditation tracks
# Replaces binaural beats (headphones-only) with monaural beats + stronger isochronic tones
set -e
OUTDIR="/Users/jeffcline/.openclaw/workspace/jeff-cline-site/public/audio/meditations"
TMPDIR="/tmp/speaker-mix-build"
mkdir -p "$TMPDIR" "$OUTDIR"
DUR=420

echo "=== DEEP STATE (Speaker Version) ==="

# Reuse same base layers as original but with monaural beats instead of binaural
# Monaural: both ears hear the same amplitude-modulated tone (works on speakers)

echo "Generating base layers..."
# Ocean waves
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=brown:r=44100:a=0.5,highpass=f=80,lowpass=f=900,tremolo=f=0.12:d=0.6" -ac 2 -t $DUR "$TMPDIR/ds-ocean.wav" 2>/dev/null &

# Singing bowls: 528, 432, 417, 396
ffmpeg -y -f lavfi -i "sine=f=528:d=$DUR" -af "volume=0.12,tremolo=f=0.1:d=0.2" -ac 2 -t $DUR "$TMPDIR/ds-528.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=432:d=$DUR" -af "volume=0.11,tremolo=f=0.1:d=0.2" -ac 2 -t $DUR "$TMPDIR/ds-432.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=417:d=$DUR" -af "volume=0.10,tremolo=f=0.1:d=0.25" -ac 2 -t $DUR "$TMPDIR/ds-417.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=396:d=$DUR" -af "volume=0.09,tremolo=f=0.1:d=0.2" -ac 2 -t $DUR "$TMPDIR/ds-396.wav" 2>/dev/null &

# Om drone 136.1Hz
ffmpeg -y -f lavfi -i "sine=f=136.1:d=$DUR" -af "volume=0.12,tremolo=f=0.1:d=0.3" -ac 2 -t $DUR "$TMPDIR/ds-om.wav" 2>/dev/null &

# Heartbeat drums 60bpm
ffmpeg -y -f lavfi -i "sine=f=55:d=$DUR" -af "tremolo=f=1:d=0.9,volume=0.4" -ac 2 -t $DUR "$TMPDIR/ds-drums.wav" 2>/dev/null &

wait
echo "Base layers done."

echo "Generating monaural beats (speaker-safe)..."
# Monaural 4Hz theta: 200Hz carrier amplitude-modulated at 4Hz (both channels identical)
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=4:d=0.8,volume=0.08" -ac 2 -t $DUR "$TMPDIR/ds-mono-4hz.wav" 2>/dev/null &

# Monaural 7Hz theta
ffmpeg -y -f lavfi -i "sine=f=300:d=$DUR" -af "tremolo=f=7:d=0.8,volume=0.07" -ac 2 -t $DUR "$TMPDIR/ds-mono-7hz.wav" 2>/dev/null &

# Monaural 10Hz alpha
ffmpeg -y -f lavfi -i "sine=f=400:d=$DUR" -af "tremolo=f=10:d=0.7,volume=0.06" -ac 2 -t $DUR "$TMPDIR/ds-mono-10hz.wav" 2>/dev/null &

# Stronger isochronic pulses (work great on speakers)
ffmpeg -y -f lavfi -i "sine=f=250:d=$DUR" -af "tremolo=f=4:d=1.0,volume=0.06" -ac 2 -t $DUR "$TMPDIR/ds-iso-4hz.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=350:d=$DUR" -af "tremolo=f=7:d=1.0,volume=0.05" -ac 2 -t $DUR "$TMPDIR/ds-iso-7hz.wav" 2>/dev/null &

wait
echo "Monaural beats done."

echo "Mixing Deep State (Speaker)..."
ffmpeg -y \
  -i "$TMPDIR/ds-ocean.wav" \
  -i "$TMPDIR/ds-528.wav" \
  -i "$TMPDIR/ds-432.wav" \
  -i "$TMPDIR/ds-417.wav" \
  -i "$TMPDIR/ds-396.wav" \
  -i "$TMPDIR/ds-om.wav" \
  -i "$TMPDIR/ds-drums.wav" \
  -i "$TMPDIR/ds-mono-4hz.wav" \
  -i "$TMPDIR/ds-mono-7hz.wav" \
  -i "$TMPDIR/ds-mono-10hz.wav" \
  -i "$TMPDIR/ds-iso-4hz.wav" \
  -i "$TMPDIR/ds-iso-7hz.wav" \
  -filter_complex "[0][1][2][3][4][5][6][7][8][9][10][11]amix=inputs=12:duration=first:normalize=0,alimiter=limit=0.95" \
  -t $DUR -b:a 320k "$OUTDIR/bufo-ceremony-deep-state-speaker.mp3" 2>/dev/null
echo "Deep State (Speaker) done."

echo ""
echo "=== TRIBAL FIRE (Speaker Version) ==="

echo "Generating base layers..."
# Heavy crashing waves
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=brown:r=44100:a=0.6,highpass=f=60,lowpass=f=800,tremolo=f=0.15:d=0.7" -ac 2 -t $DUR "$TMPDIR/tf-waves.wav" 2>/dev/null &
# Wave spray
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=pink:r=44100:a=0.2,highpass=f=2000,lowpass=f=6000,tremolo=f=0.12:d=0.5" -ac 2 -t $DUR "$TMPDIR/tf-spray.wav" 2>/dev/null &
# Tribal drums
ffmpeg -y -f lavfi -i "sine=f=55:d=$DUR" -af "tremolo=f=1.3:d=0.9,volume=0.5" -ac 2 -t $DUR "$TMPDIR/tf-drum1.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=82:d=$DUR" -af "tremolo=f=2.6:d=0.8,volume=0.3" -ac 2 -t $DUR "$TMPDIR/tf-drum2.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=45:d=$DUR" -af "tremolo=f=1.8:d=0.95,volume=0.35" -ac 2 -t $DUR "$TMPDIR/tf-drum3.wav" 2>/dev/null &
# Chanting drone
ffmpeg -y -f lavfi -i "sine=f=110:d=$DUR" -f lavfi -i "sine=f=220:d=$DUR" -f lavfi -i "sine=f=330:d=$DUR" \
  -filter_complex "[0]volume=0.25[a];[1]volume=0.15[b];[2]volume=0.10[c];[a][b][c]amix=inputs=3:duration=first,tremolo=f=0.3:d=0.4,bandpass=f=300:width_type=h:w=200" \
  -ac 2 -t $DUR "$TMPDIR/tf-chant.wav" 2>/dev/null &
# Chant rhythm
ffmpeg -y -f lavfi -i "sine=f=165:d=$DUR" -af "tremolo=f=0.8:d=0.7,volume=0.15,bandpass=f=400:width_type=h:w=150" -ac 2 -t $DUR "$TMPDIR/tf-chant2.wav" 2>/dev/null &
# Solfeggio
ffmpeg -y -f lavfi -i "sine=f=417:d=$DUR" -af "volume=0.12,tremolo=f=0.1:d=0.3" -ac 2 -t $DUR "$TMPDIR/tf-417.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=432:d=$DUR" -af "volume=0.10,tremolo=f=0.1:d=0.25" -ac 2 -t $DUR "$TMPDIR/tf-432.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=528:d=$DUR" -af "volume=0.10,tremolo=f=0.1:d=0.2" -ac 2 -t $DUR "$TMPDIR/tf-528.wav" 2>/dev/null &
# Subliminal bed
ffmpeg -y -f lavfi -i "sine=f=40:d=$DUR" -af "volume=0.04" -ac 2 -t $DUR "$TMPDIR/tf-sub.wav" 2>/dev/null &

wait
echo "Base layers done."

echo "Generating monaural + isochronic (speaker-safe)..."
# Monaural beats
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=4:d=0.8,volume=0.08" -ac 2 -t $DUR "$TMPDIR/tf-mono-4hz.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=300:d=$DUR" -af "tremolo=f=7:d=0.8,volume=0.07" -ac 2 -t $DUR "$TMPDIR/tf-mono-7hz.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=400:d=$DUR" -af "tremolo=f=10:d=0.7,volume=0.06" -ac 2 -t $DUR "$TMPDIR/tf-mono-10hz.wav" 2>/dev/null &
# Stronger isochronic for speakers
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=6:d=1.0,volume=0.10" -ac 2 -t $DUR "$TMPDIR/tf-iso.wav" 2>/dev/null &

wait
echo "Speaker beats done."

echo "Mixing Tribal Fire (Speaker)..."
ffmpeg -y \
  -i "$TMPDIR/tf-waves.wav" \
  -i "$TMPDIR/tf-spray.wav" \
  -i "$TMPDIR/tf-drum1.wav" \
  -i "$TMPDIR/tf-drum2.wav" \
  -i "$TMPDIR/tf-drum3.wav" \
  -i "$TMPDIR/tf-chant.wav" \
  -i "$TMPDIR/tf-chant2.wav" \
  -i "$TMPDIR/tf-417.wav" \
  -i "$TMPDIR/tf-432.wav" \
  -i "$TMPDIR/tf-528.wav" \
  -i "$TMPDIR/tf-sub.wav" \
  -i "$TMPDIR/tf-mono-4hz.wav" \
  -i "$TMPDIR/tf-mono-7hz.wav" \
  -i "$TMPDIR/tf-mono-10hz.wav" \
  -i "$TMPDIR/tf-iso.wav" \
  -filter_complex "
    [0][1][2][3][4][5][6][7][8][9][10][11][12][13][14]amix=inputs=15:duration=first:normalize=0,
    volume='if(lt(t,60),0.3, if(lt(t,120),0.4, if(lt(t,300),0.5, if(lt(t,312),0.45, if(lt(t,324),0.40, if(lt(t,336),0.35, if(lt(t,348),0.30, if(lt(t,360),0.25, if(lt(t,372),0.20, if(lt(t,384),0.15, if(lt(t,396),0.10, if(lt(t,408),0.05, 0.0))))))))))))':eval=frame,
    alimiter=limit=0.95
  " \
  -t $DUR -b:a 320k "$OUTDIR/bufo-ceremony-tribal-fire-speaker.mp3" 2>/dev/null
echo "Tribal Fire (Speaker) done."

echo ""
echo "=== All speaker mixes complete ==="
ls -lh "$OUTDIR"/*speaker*.mp3

rm -rf "$TMPDIR"
echo "Temp cleaned."
