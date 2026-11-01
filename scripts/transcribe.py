# Speech recognition with the time of every word, used by scripts/make-clip.mjs.
#
#   .asr/venv/Scripts/python.exe scripts/transcribe.py <audio file> <out.json> [model]
#
# Writes [{"w": "word", "s": 1.23, "e": 1.55}, ...]. Runs on this computer (faster-whisper); the model
# (default "small", about 500 MB) is downloaded once into .asr/models.
import json
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from faster_whisper import WhisperModel

audio, out = sys.argv[1], sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "small"
root = Path(__file__).resolve().parent.parent / ".asr" / "models"
# decode with ffmpeg ourselves: 16 kHz mono floats (the bundled audio reader is not needed)
raw = subprocess.run(
    [imageio_ffmpeg.get_ffmpeg_exe(), "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
    check=True,
    capture_output=True,
).stdout
samples = np.frombuffer(raw, dtype=np.float32)
model = WhisperModel(model_name, device="cpu", compute_type="int8", download_root=str(root))
segments, _ = model.transcribe(samples, language="en", word_timestamps=True, vad_filter=True, condition_on_previous_text=False)
words = []
for segment in segments:
    for word in segment.words or []:
        text = word.word.strip()
        if text:
            words.append({"w": text, "s": round(word.start, 2), "e": round(word.end, 2)})
Path(out).write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
print(f"{len(words)} words")
