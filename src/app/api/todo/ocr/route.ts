import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

function parseBusinessCard(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const result: Record<string, string> = { name: "", business: "", email: "", phone: "", address: "", website: "", misc: "" };

  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRe = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const urlRe = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?/i;
  const zipRe = /\b\d{5}(?:-\d{4})?\b/;
  const stateRe = /\b(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;
  const usedLines = new Set<number>();

  for (let i = 0; i < lines.length; i++) { const m = lines[i].match(emailRe); if (m) { result.email = m[0].toLowerCase(); usedLines.add(i); break; } }
  for (let i = 0; i < lines.length; i++) { const m = lines[i].match(phoneRe); if (m) { result.phone = m[0]; usedLines.add(i); break; } }
  for (let i = 0; i < lines.length; i++) { if (usedLines.has(i)) continue; const m = lines[i].match(urlRe); if (m && !emailRe.test(lines[i])) { result.website = m[0]; usedLines.add(i); break; } }

  const addressParts: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (usedLines.has(i)) continue;
    if (zipRe.test(lines[i]) || (stateRe.test(lines[i]) && /\d/.test(lines[i]))) {
      addressParts.push(lines[i]); usedLines.add(i);
      if (i > 0 && !usedLines.has(i - 1) && /\d/.test(lines[i - 1])) { addressParts.unshift(lines[i - 1]); usedLines.add(i - 1); }
    }
  }
  result.address = addressParts.join(", ");

  const remaining: { idx: number; text: string }[] = [];
  for (let i = 0; i < lines.length; i++) { if (!usedLines.has(i)) remaining.push({ idx: i, text: lines[i] }); }

  const titleWords = /\b(?:president|ceo|cfo|coo|cto|vp|vice|director|manager|owner|founder|partner|associate|consultant|specialist|coordinator|representative|agent|broker|realtor|attorney|advisor|analyst|engineer|developer|designer|principal|executive|sales|marketing|operations|chief|senior|junior|assistant|office|fax|cell|mobile|tel|phone|email|website|address)\b/i;
  const miscParts: string[] = [];

  for (const item of remaining) {
    if (titleWords.test(item.text) && item.text.split(/\s+/).length <= 4) { miscParts.push(item.text); usedLines.add(item.idx); continue; }
    if (!result.name && /^[A-Za-z.\-']{2,}\s+[A-Za-z.\-']{2,}/.test(item.text) && item.text.split(/\s+/).length <= 4) { result.name = item.text; usedLines.add(item.idx); }
    else if (!result.business && item.text.length > 2) { result.business = item.text; usedLines.add(item.idx); }
  }
  for (let i = 0; i < lines.length; i++) { if (!usedLines.has(i) && lines[i].length > 1) miscParts.push(lines[i]); }
  result.misc = miscParts.join("; ");
  if (!result.name && remaining.length > 0) { const first = remaining.find(r => !usedLines.has(r.idx)); if (first) result.name = first.text; }
  return result;
}

function run(cmd: string, args: string[], timeout = 15000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout }, (err, stdout) => err ? reject(err) : resolve(stdout));
  });
}

function score(text: string): number {
  // Count real words (3+ alpha chars)
  const words = (text.match(/[a-zA-Z]{3,}/g) || []).length;
  let s = words * 5;
  if (/@/.test(text)) s += 40;
  if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) s += 40;
  if (/www\.|\.com|\.org|\.net/i.test(text)) s += 40;
  // Penalize heavy junk
  const alpha = (text.match(/[a-zA-Z]/g) || []).length;
  const junk = (text.match(/[^a-zA-Z0-9\s@.\-+(),:\/'"]/g) || []).length;
  if (junk > alpha * 0.3) s = Math.floor(s * 0.2);
  return s;
}

export async function POST(req: NextRequest) {
  const cleanup: string[] = [];
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    if (!image || image.size === 0) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const buf = Buffer.from(await image.arrayBuffer());
    const id = randomUUID();
    const raw = join(tmpdir(), `ocr-${id}-raw.jpg`);
    await writeFile(raw, buf);
    cleanup.push(raw);
    console.log(`[ocr] Received ${image.size} bytes`);

    // Step 1: Preprocess with ImageMagick -- auto-orient, resize smaller, grayscale, sharpen
    const prepped = join(tmpdir(), `ocr-${id}-prep.png`);
    await run("convert", [raw, "-auto-orient", "-resize", "1200x1200>", "-colorspace", "Gray", "-sharpen", "0x1", "-normalize", prepped]);
    cleanup.push(prepped);

    // Step 2: Quick scan -- try 4 rotations with psm 3 only (fastest, best general mode)
    let bestText = "";
    let bestScore = -1;

    for (const deg of [0, 90, 270, 180]) {
      let img = prepped;
      if (deg !== 0) {
        img = join(tmpdir(), `ocr-${id}-r${deg}.png`);
        await run("convert", [prepped, "-rotate", String(deg), img]);
        cleanup.push(img);
      }
      try {
        const text = await run("tesseract", [img, "stdout", "-l", "eng", "--psm", "3"], 8000);
        const s = score(text);
        console.log(`[ocr] rot=${deg} score=${s}`);
        if (s > bestScore) { bestScore = s; bestText = text; }
        if (bestScore > 100) break; // good enough
      } catch { /* skip */ }
    }

    // Step 3: If weak result, try one more pass with threshold (black & white) on best rotation
    if (bestScore < 100) {
      const bw = join(tmpdir(), `ocr-${id}-bw.png`);
      await run("convert", [prepped, "-threshold", "55%", bw]);
      cleanup.push(bw);
      for (const deg of [0, 90, 270]) {
        let img = bw;
        if (deg !== 0) {
          img = join(tmpdir(), `ocr-${id}-bw${deg}.png`);
          await run("convert", [bw, "-rotate", String(deg), img]);
          cleanup.push(img);
        }
        try {
          const text = await run("tesseract", [img, "stdout", "-l", "eng", "--psm", "3"], 8000);
          const s = score(text);
          console.log(`[ocr] bw rot=${deg} score=${s}`);
          if (s > bestScore) { bestScore = s; bestText = text; }
          if (bestScore > 100) break;
        } catch { /* skip */ }
      }
    }

    console.log(`[ocr] Done. Best score=${bestScore} len=${bestText.length}`);

    if (!bestText || bestScore < 5) {
      return NextResponse.json({ error: "Could not read text. Try a clearer, well-lit photo." }, { status: 422 });
    }

    return NextResponse.json({ success: true, rawText: bestText, fields: parseBusinessCard(bestText) });
  } catch (err) {
    console.error("[ocr] Error:", err);
    return NextResponse.json({ error: "OCR processing failed" }, { status: 500 });
  } finally {
    for (const f of cleanup) unlink(f).catch(() => {});
  }
}
