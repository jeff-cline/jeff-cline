#!/bin/bash
# Generate Cave 444 - Realistic ceremony audio
# Each layer is a separate MP3 so they can be mixed live AND seeked
# Uses envelope-shaped percussive hits, not continuous oscillation
set -e
OUTDIR="/Users/jeffcline/.openclaw/workspace/jeff-cline-site/public/audio/meditations/cave444"
TMPDIR="/tmp/cave444-build"
mkdir -p "$TMPDIR" "$OUTDIR"
DUR=420
SR=44100

echo "=== CAVE 444: Generating realistic ceremony layers ==="

# ─────────────────────────────────────────
# LAYER 1: Ocean waves with periodic hard crashes
# Base: gentle brown noise surf
# Crashes: louder bursts every 20-30 seconds
# ─────────────────────────────────────────
echo "Layer 1: Ocean with crashes..."
# Base gentle ocean
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=brown:r=$SR:a=0.3,highpass=f=60,lowpass=f=1200,tremolo=f=0.08:d=0.5" \
  -ac 2 -t $DUR "$TMPDIR/ocean-base.wav" 2>/dev/null

# Hard crash layer: louder, with more dramatic envelope
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=brown:r=$SR:a=0.7,highpass=f=40,lowpass=f=2000,tremolo=f=0.05:d=0.8" \
  -ac 2 -t $DUR "$TMPDIR/ocean-crash.wav" 2>/dev/null

# Mist/spray: high frequency shimmer (feeling of mist on face)
ffmpeg -y -f lavfi -i "anoisesrc=d=$DUR:c=white:r=$SR:a=0.08,highpass=f=4000,lowpass=f=12000,tremolo=f=0.1:d=0.4" \
  -ac 2 -t $DUR "$TMPDIR/mist.wav" 2>/dev/null
wait

# ─────────────────────────────────────────
# LAYER 2: Ceremonial drums - REAL percussive hits
# Deep drum hits with attack/decay envelope
# Pattern: slow heartbeat that builds, individual STRIKES
# Using aevalsrc to create envelope-shaped percussion
# ─────────────────────────────────────────
echo "Layer 2: Ceremonial drums (percussive hits)..."

# Generate a single drum hit (deep, resonant, ~0.8 second decay)
# Frequency: 65Hz fundamental + 130Hz overtone
ffmpeg -y -f lavfi -i "aevalsrc=exprs='(sin(2*PI*65*t)+0.5*sin(2*PI*130*t)+0.3*sin(2*PI*195*t))*exp(-3*t)*0.8':s=$SR:d=1.5" \
  -t 1.5 "$TMPDIR/drum-hit.wav" 2>/dev/null

# Generate a louder accent hit
ffmpeg -y -f lavfi -i "aevalsrc=exprs='(sin(2*PI*55*t)+0.6*sin(2*PI*110*t)+0.4*sin(2*PI*165*t)+0.2*sin(2*PI*220*t))*exp(-2.5*t)*1.0':s=$SR:d=2.0" \
  -t 2.0 "$TMPDIR/drum-accent.wav" 2>/dev/null

# Build the drum pattern: 7 minutes of carefully spaced hits
# Phase 1 (0-60s): Slow, one hit every 3-4 seconds (grounding)
# Phase 2 (60-180s): Building, one hit every 1.5-2 seconds
# Phase 3 (180-300s): Peak, steady heartbeat ~80BPM with accents
# Phase 4 (300-420s): Slowing down, fading
python3 -c "
import struct, math, random
sr = $SR
dur = $DUR
samples = sr * dur
data = [0.0] * samples

def add_hit(data, start_sec, freq, decay, volume, sr):
    start = int(start_sec * sr)
    hit_len = int(4.0 * sr)  # 4 second max decay
    for i in range(min(hit_len, len(data) - start)):
        t = i / sr
        env = math.exp(-decay * t)
        if env < 0.001: break
        val = (math.sin(2*math.pi*freq*t) + 0.5*math.sin(2*math.pi*freq*2*t) + 0.3*math.sin(2*math.pi*freq*3*t)) * env * volume
        if start + i < len(data):
            data[start + i] += val

random.seed(444)
t = 0.5
# Phase 1: slow grounding (0-60s)
while t < 60:
    gap = random.uniform(2.5, 4.0)
    vol = random.uniform(0.4, 0.6)
    add_hit(data, t, 65, 3.0, vol, sr)
    t += gap

# Phase 2: building (60-180s)
while t < 180:
    gap = random.uniform(1.2, 2.5)
    vol = random.uniform(0.5, 0.8)
    freq = random.choice([55, 65, 65, 65])
    decay = random.uniform(2.5, 3.5)
    add_hit(data, t, freq, decay, vol, sr)
    # Occasional double hit
    if random.random() < 0.2:
        add_hit(data, t + 0.3, 80, 4.0, vol * 0.6, sr)
    t += gap

# Phase 3: peak ceremony (180-300s) - steady heartbeat with accents
while t < 300:
    gap = random.uniform(0.7, 1.5)  # ~60-80 BPM
    vol = random.uniform(0.6, 1.0)
    freq = random.choice([55, 60, 65, 70])
    decay = random.uniform(2.0, 3.0)
    add_hit(data, t, freq, decay, vol, sr)
    # Accent every ~4 beats
    if random.random() < 0.25:
        add_hit(data, t, 45, 2.0, vol * 1.2, sr)  # deeper accent
    # Occasional rapid trio
    if random.random() < 0.1:
        add_hit(data, t + 0.2, 75, 4.0, vol * 0.5, sr)
        add_hit(data, t + 0.4, 85, 4.5, vol * 0.4, sr)
    t += gap

# Phase 4: slowing (300-420s)
while t < 415:
    progress = (t - 300) / 120
    gap = random.uniform(2.0 + progress * 3, 3.5 + progress * 4)
    vol = random.uniform(0.3, 0.5) * (1 - progress * 0.8)
    add_hit(data, t, 65, 3.5, max(0.05, vol), sr)
    t += gap

# Normalize
peak = max(abs(x) for x in data) or 1
data = [x / peak * 0.9 for x in data]

# Write raw PCM
import array
pcm = array.array('f', data)
with open('$TMPDIR/drums-raw.pcm', 'wb') as f:
    pcm.tofile(f)
print(f'Drum pattern: {len(data)} samples, peak normalized')
" 2>&1

# Convert raw PCM to wav
ffmpeg -y -f f32le -ar $SR -ac 1 -i "$TMPDIR/drums-raw.pcm" -ac 2 "$TMPDIR/drums.wav" 2>/dev/null
echo "  Drums generated."

# ─────────────────────────────────────────
# LAYER 3: Singing bowls / chimes - STRUCK and RINGING
# Each strike: fast attack, long sustain/decay (10-20 sec)
# Different frequencies struck at different times
# ─────────────────────────────────────────
echo "Layer 3: Singing bowls (struck and ringing)..."
python3 -c "
import math, random, array
sr = $SR
dur = $DUR
samples = sr * dur
data = [0.0] * samples

def add_bowl(data, start_sec, freq, decay, volume, sr):
    start = int(start_sec * sr)
    ring_len = int(20.0 * sr)  # bowls ring for up to 20 seconds
    for i in range(min(ring_len, len(data) - start)):
        t = i / sr
        # Fast attack (0.05s), long exponential decay
        attack = min(1.0, t / 0.05)
        env = attack * math.exp(-decay * t)
        if env < 0.0005: break
        # Bowl sound: fundamental + slight detuned overtones (beating)
        val = (math.sin(2*math.pi*freq*t) +
               0.4*math.sin(2*math.pi*freq*2.003*t) +  # slight detune = shimmer
               0.2*math.sin(2*math.pi*freq*3.007*t) +
               0.1*math.sin(2*math.pi*freq*4.01*t)) * env * volume
        if start + i < len(data):
            data[start + i] += val

random.seed(4440)
bowls = [
    (528, 0.15),  # 528Hz - transformation
    (432, 0.12),  # 432Hz - coherence
    (417, 0.14),  # 417Hz - sacral
    (396, 0.13),  # 396Hz - liberation
]

t = 3.0  # start after 3 seconds
while t < dur - 10:
    freq, decay = random.choice(bowls)
    vol = random.uniform(0.4, 0.8)
    add_bowl(data, t, freq, decay, vol, sr)
    # Sometimes a second bowl shortly after
    if random.random() < 0.3:
        f2, d2 = random.choice(bowls)
        add_bowl(data, t + random.uniform(2, 5), f2, d2, vol * 0.7, sr)
    gap = random.uniform(12, 25)  # 12-25 seconds between strikes
    t += gap

peak = max(abs(x) for x in data) or 1
data = [x / peak * 0.85 for x in data]
pcm = array.array('f', data)
with open('$TMPDIR/bowls-raw.pcm', 'wb') as f:
    pcm.tofile(f)
print(f'Bowls: {len(data)} samples')
" 2>&1

ffmpeg -y -f f32le -ar $SR -ac 1 -i "$TMPDIR/bowls-raw.pcm" -ac 2 "$TMPDIR/bowls.wav" 2>/dev/null
echo "  Bowls generated."

# ─────────────────────────────────────────
# LAYER 4: Tribal chanting/singing
# Periodic bursts of harmonic vocal-like tones
# Comes in and out, not continuous
# Low male voice range with formants
# ─────────────────────────────────────────
echo "Layer 4: Tribal chanting (periodic)..."
python3 -c "
import math, random, array
sr = $SR
dur = $DUR
samples = sr * dur
data = [0.0] * samples

def add_chant_phrase(data, start_sec, duration_sec, base_freq, volume, sr):
    start = int(start_sec * sr)
    phrase_len = int(duration_sec * sr)
    for i in range(min(phrase_len, len(data) - start)):
        t = i / sr
        # Envelope: 1s fade in, hold, 1s fade out
        fade_in = min(1.0, t / 1.0)
        fade_out = min(1.0, (duration_sec - t) / 1.0)
        env = fade_in * fade_out
        # Vocal formants: fundamental + harmonics shaped like a voice
        # Slight vibrato
        vibrato = math.sin(2*math.pi*5.5*t) * 3  # 5.5Hz vibrato, +/-3Hz
        f = base_freq + vibrato
        # Nasal/chest voice harmonics
        val = (0.8*math.sin(2*math.pi*f*t) +
               0.6*math.sin(2*math.pi*f*2*t) +
               0.4*math.sin(2*math.pi*f*3*t) +
               0.25*math.sin(2*math.pi*f*4*t) +
               0.15*math.sin(2*math.pi*f*5*t) +
               0.1*math.sin(2*math.pi*f*6*t)) * env * volume
        if start + i < len(data):
            data[start + i] += val

random.seed(44400)
# Chanting comes in ~4-5 bursts throughout the 7 minutes
# Each burst is 15-30 seconds of chanting phrases
burst_times = [30, 90, 170, 250, 340]
for bt in burst_times:
    # Each burst: 3-6 phrases
    num_phrases = random.randint(3, 6)
    t = bt
    for _ in range(num_phrases):
        base = random.choice([110, 120, 130, 100, 95])  # male vocal range
        phrase_dur = random.uniform(3, 6)
        vol = random.uniform(0.3, 0.6)
        add_chant_phrase(data, t, phrase_dur, base, vol, sr)
        # Sometimes a second voice joins
        if random.random() < 0.3:
            add_chant_phrase(data, t + 0.5, phrase_dur - 1, base * 1.5, vol * 0.4, sr)
        t += phrase_dur + random.uniform(1, 3)  # gap between phrases

peak = max(abs(x) for x in data) or 1
data = [x / peak * 0.8 for x in data]
pcm = array.array('f', data)
with open('$TMPDIR/chant-raw.pcm', 'wb') as f:
    pcm.tofile(f)
print(f'Chanting: {len(data)} samples, {len(burst_times)} bursts')
" 2>&1

ffmpeg -y -f f32le -ar $SR -ac 1 -i "$TMPDIR/chant-raw.pcm" -ac 2 "$TMPDIR/chanting.wav" 2>/dev/null
echo "  Chanting generated."

# ─────────────────────────────────────────
# LAYER 5: Solfeggio tones (sustained background)
# 417, 432, 528 Hz - gentle, continuous
# ─────────────────────────────────────────
echo "Layer 5: Solfeggio background..."
ffmpeg -y -f lavfi \
  -i "sine=f=417:d=$DUR" -f lavfi -i "sine=f=432:d=$DUR" -f lavfi -i "sine=f=528:d=$DUR" \
  -filter_complex "[0]volume=0.06[a];[1]volume=0.05[b];[2]volume=0.06[c];[a][b][c]amix=inputs=3:duration=first" \
  -ac 2 -t $DUR "$TMPDIR/solfeggio.wav" 2>/dev/null &

# ─────────────────────────────────────────
# LAYER 6: Om drone (136.1Hz)
# ─────────────────────────────────────────
echo "Layer 6: Om drone..."
ffmpeg -y -f lavfi -i "sine=f=136.1:d=$DUR" -af "volume=0.08,tremolo=f=0.1:d=0.2" \
  -ac 2 -t $DUR "$TMPDIR/om.wav" 2>/dev/null &

# ─────────────────────────────────────────
# LAYER 7: Monaural beats (speaker-safe)
# ─────────────────────────────────────────
echo "Layer 7: Monaural beats..."
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=4:d=0.8,volume=0.06" \
  -ac 2 -t $DUR "$TMPDIR/mono4.wav" 2>/dev/null &
ffmpeg -y -f lavfi -i "sine=f=300:d=$DUR" -af "tremolo=f=7:d=0.8,volume=0.05" \
  -ac 2 -t $DUR "$TMPDIR/mono7.wav" 2>/dev/null &

# ─────────────────────────────────────────
# LAYER 8: Isochronic pulses
# ─────────────────────────────────────────
echo "Layer 8: Isochronic..."
ffmpeg -y -f lavfi -i "sine=f=200:d=$DUR" -af "tremolo=f=6:d=1.0,volume=0.06" \
  -ac 2 -t $DUR "$TMPDIR/iso.wav" 2>/dev/null &

wait
echo "All layers generated."

# ─────────────────────────────────────────
# Convert each layer to individual MP3 (for live mixer)
# ─────────────────────────────────────────
echo "=== Converting layers to MP3 ==="
for layer in ocean-base ocean-crash mist drums bowls chanting solfeggio om mono4 mono7 iso; do
  ffmpeg -y -i "$TMPDIR/$layer.wav" -b:a 192k "$OUTDIR/$layer.mp3" 2>/dev/null &
done
wait
echo "Individual MP3s done."

# ─────────────────────────────────────────
# Also create a pre-mixed download version
# ─────────────────────────────────────────
echo "=== Creating pre-mixed download ==="
ffmpeg -y \
  -i "$TMPDIR/ocean-base.wav" \
  -i "$TMPDIR/ocean-crash.wav" \
  -i "$TMPDIR/mist.wav" \
  -i "$TMPDIR/drums.wav" \
  -i "$TMPDIR/bowls.wav" \
  -i "$TMPDIR/chanting.wav" \
  -i "$TMPDIR/solfeggio.wav" \
  -i "$TMPDIR/om.wav" \
  -i "$TMPDIR/mono4.wav" \
  -i "$TMPDIR/mono7.wav" \
  -i "$TMPDIR/iso.wav" \
  -filter_complex "
    [0]volume=1.0[a0];[1]volume=0.6[a1];[2]volume=1.0[a2];
    [3]volume=1.5[a3];[4]volume=1.2[a4];[5]volume=1.0[a5];
    [6]volume=0.8[a6];[7]volume=0.8[a7];[8]volume=0.6[a8];
    [9]volume=0.5[a9];[10]volume=0.6[a10];
    [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10]amix=inputs=11:duration=first:normalize=0,
    volume='if(lt(t,60),0.5, if(lt(t,120),0.7, if(lt(t,300),0.9, if(lt(t,312),0.8, if(lt(t,324),0.7, if(lt(t,336),0.6, if(lt(t,348),0.5, if(lt(t,360),0.4, if(lt(t,372),0.3, if(lt(t,384),0.2, if(lt(t,396),0.1, if(lt(t,408),0.05, 0.0))))))))))))':eval=frame,
    alimiter=limit=0.95
  " \
  -t $DUR -b:a 320k "$OUTDIR/cave-ceremony-444.mp3" 2>/dev/null

echo "=== Done ==="
ls -lh "$OUTDIR/"
rm -rf "$TMPDIR"
echo "Temp cleaned."
