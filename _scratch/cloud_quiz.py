#!/usr/bin/env python3
"""
Cloud type quiz: send cloud images to GPT Vision (as base64, no filenames),
then compare GPT's answer with the actual cloud type.
"""

import base64
import json
import os
from openai import OpenAI

CLOUD_PHOTOS_DIR = os.path.join(os.path.dirname(__file__), "ref/cloud-photos")

# Ground truth: filename -> actual cloud type (Chinese + English)
GROUND_TRUTH = {
    "01_cirrus.jpg":        ("卷云",   "Cirrus"),
    "02_cirrocumulus.jpg":  ("卷积云", "Cirrocumulus"),
    "03_cirrostratus.jpg":  ("卷层云", "Cirrostratus"),
    "04_altocumulus.jpg":   ("高积云", "Altocumulus"),
    "05_altostratus.jpg":   ("高层云", "Altostratus"),
    "06_nimbostratus.jpg":  ("雨层云", "Nimbostratus"),
    "07_stratus.jpg":       ("层云",   "Stratus"),
    "08_stratocumulus.jpg": ("层积云", "Stratocumulus"),
    "09_cumulus.jpg":       ("积云",   "Cumulus"),
    "10_cumulonimbus.jpg":  ("积雨云", "Cumulonimbus"),
}

PROMPT = (
    "Look at this cloud photo and identify the cloud type step by step.\n\n"
    "Step 1 – Altitude cues: Does the cloud appear HIGH (thin, icy, wispy), MID-level (gray layer or patchy), or LOW (close to ground, thick)?\n"
    "Step 2 – Shape/texture: Is it (a) wispy/fibrous, (b) uniform gray sheet, (c) lumpy/puffy patches in a layer, (d) large puffy tower, (e) anvil-topped storm tower, (f) fish-scale or ripple pattern?\n"
    "Step 3 – Coverage: Does it cover the whole sky as a sheet, or appear as individual puffs/patches?\n"
    "Step 4 – Sun visibility: Is the sun (1) completely hidden, (2) visible as a blurry disk, (3) clearly visible?\n\n"
    "Based on your analysis, state the single most likely cloud type from this list:\n"
    "Cirrus, Cirrocumulus, Cirrostratus, Altocumulus, Altostratus, Nimbostratus, Stratus, Stratocumulus, Cumulus, Cumulonimbus\n\n"
    "Final answer format — last line must be exactly: 'Cloud type: <name>'"
)

def encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def ask_gpt(client: OpenAI, image_b64: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}",
                            "detail": "high",
                        },
                    },
                ],
            }
        ],
        max_tokens=300,
    )
    return response.choices[0].message.content.strip()

def main():
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        # fallback: read from script arg or hardcoded for dev use
        import sys
        if len(sys.argv) > 1:
            api_key = sys.argv[1]

    client = OpenAI(api_key=api_key)

    results = []
    correct = 0
    total = len(GROUND_TRUTH)

    print(f"\n{'='*60}")
    print(f"{'Cloud Type Quiz — GPT Vision vs Ground Truth':^60}")
    print(f"{'='*60}\n")

    for filename, (cn_name, en_name) in sorted(GROUND_TRUTH.items()):
        filepath = os.path.join(CLOUD_PHOTOS_DIR, filename)
        if not os.path.exists(filepath):
            print(f"[SKIP] {filename} not found")
            continue

        print(f"Testing: {cn_name} ({en_name}) ...", end=" ", flush=True)
        image_b64 = encode_image(filepath)
        gpt_answer = ask_gpt(client, image_b64)

        # Extract "Cloud type: <name>" from chain-of-thought answer
        final_line = gpt_answer
        for line in gpt_answer.splitlines():
            if line.lower().startswith("cloud type:"):
                final_line = line.split(":", 1)[1].strip()
                break

        # Check if correct (case-insensitive, partial match)
        is_correct = en_name.lower() in final_line.lower()
        if is_correct:
            correct += 1
            status = "✓ CORRECT"
        else:
            status = "✗ WRONG"

        print(f"{status}")
        print(f"  Actual:   {cn_name} / {en_name}")
        print(f"  GPT final: {final_line}")
        print(f"  Reasoning: {gpt_answer[:200]}...\n" if len(gpt_answer) > 200 else f"  Reasoning: {gpt_answer}\n")

        results.append({
            "filename": filename,
            "actual_cn": cn_name,
            "actual_en": en_name,
            "gpt_answer": gpt_answer,
            "correct": is_correct,
        })

    print(f"{'='*60}")
    print(f"Score: {correct}/{total} ({correct/total*100:.0f}%)")
    print(f"{'='*60}\n")

    # Save results to JSON
    out_path = os.path.join(os.path.dirname(__file__), "cloud_quiz_results.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Results saved to: {out_path}")

if __name__ == "__main__":
    main()
