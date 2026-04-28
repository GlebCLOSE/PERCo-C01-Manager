export function splitConcatenatedJson(raw: string): string[] {
    const s = String(raw ?? '');
    const out: string[] = [];
    let start = -1;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\') { if (inString) escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') {
        if (depth === 0) start = i;
        depth++;
        continue;
      }
      if (ch === '}') {
        if (depth > 0) depth--;
        if (depth === 0 && start !== -1) {
          out.push(s.slice(start, i + 1));
          start = -1;
        }
      }
    }
    return out;
  }
  
  export function parseIncomingFrames(raw: unknown): any[] {
    if (typeof raw !== 'string' || !raw.trim()) return [];
    const frames = splitConcatenatedJson(raw);
    const parsed: any[] = [];
    for (const f of frames) {
      try { parsed.push(JSON.parse(f)); } catch { /* ignore */ }
    }
    return parsed;
  }