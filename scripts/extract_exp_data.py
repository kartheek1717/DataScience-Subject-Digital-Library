import json
import re

with open('src/data/experimentsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# The file has `export const INITIAL_EXPERIMENTS: Experiment[] = [...];`
start_idx = text.find('export const INITIAL_EXPERIMENTS: Experiment[] =')
if start_idx != -1:
    json_start = text.find('[', start_idx)
    json_end = text.rfind('];')
    json_str = text[json_start:json_end+1]
    experiments = json.loads(json_str)
    
    print(f"Total experiments parsed: {len(experiments)}")
    for exp in experiments:
        print(f"\nExp {exp.get('number')}: {exp.get('id')} - {exp.get('title')}")
        for sub in exp.get('subExperiments', []):
            raw_out = sub.get('output', {}).get('rawText', '')
            out_preview = raw_out[:60].replace('\n', ' ') if raw_out else 'NO OUTPUT'
            code_lines = len(sub.get('code', '').splitlines())
            print(f"   Part {sub.get('partLetter')}: {sub.get('title')} ({code_lines} lines code, out: {out_preview}...)")
else:
    print("Could not find INITIAL_EXPERIMENTS")
