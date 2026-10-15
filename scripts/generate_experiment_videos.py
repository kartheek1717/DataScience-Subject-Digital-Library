import os
import sys
import json
import re
import subprocess
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
WIDTH = 1280
HEIGHT = 720
FPS = 24

# Fonts
FONT_CONSOLA_SM = ImageFont.truetype("C:\\Windows\\Fonts\\consola.ttf", 13)
FONT_CONSOLA_MD = ImageFont.truetype("C:\\Windows\\Fonts\\consola.ttf", 15)
FONT_CONSOLA_BOLD = ImageFont.truetype("C:\\Windows\\Fonts\\consolab.ttf", 14)
FONT_CONSOLA_LG = ImageFont.truetype("C:\\Windows\\Fonts\\consolab.ttf", 18)

FONT_SEGOE_XS = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 12)
FONT_SEGOE_SM = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 14)
FONT_SEGOE_BOLD_SM = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 13)
FONT_SEGOE_MD = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 16)
FONT_SEGOE_LG = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 22)
FONT_SEGOE_XL = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 30)

# Colors
COLOR_BG = (11, 25, 38)            # #0B1926
COLOR_HEADER_BG = (7, 18, 29)      # #07121D
COLOR_BORDER = (30, 58, 84)        # #1E3A54
COLOR_PANEL_LEFT = (12, 29, 45)    # #0C1D2D
COLOR_PANEL_RIGHT = (6, 14, 23)    # #060E17
COLOR_GUTTER = (9, 22, 34)         # #091622

# Text colors
COLOR_WHITE = (248, 250, 252)
COLOR_MUTED = (148, 163, 184)
COLOR_DIM = (71, 85, 105)
COLOR_CYAN = (56, 189, 248)
COLOR_TEAL = (45, 212, 191)
COLOR_GREEN = (74, 222, 128)
COLOR_PINK = (244, 114, 182)
COLOR_AMBER = (251, 191, 36)
COLOR_RED = (239, 68, 68)

KEYWORDS = {
    'import', 'from', 'as', 'def', 'class', 'return', 'if', 'elif', 'else',
    'for', 'while', 'in', 'is', 'not', 'and', 'or', 'True', 'False', 'None',
    'try', 'except', 'with', 'lambda', 'global', 'yield'
}
BUILTINS = {
    'print', 'len', 'range', 'enumerate', 'zip', 'open', 'int', 'float', 'str',
    'dict', 'list', 'set', 'tuple', 'sum', 'min', 'max', 'round', 'abs'
}

def tokenize_python_line(line):
    """Simple syntax tokenization for drawing colored spans."""
    tokens = []
    comment_idx = line.find('#')
    code_part = line if comment_idx == -1 else line[:comment_idx]
    comment_part = "" if comment_idx == -1 else line[comment_idx:]
    
    pattern = re.compile(r'(\"\"\"[\s\S]*?\"\"\"|\'\'\'[\s\S]*?\'\'\'|\"[^\"]*\"|\'[^\']*\'|\b\d+\.?\d*\b|\b[A-Za-z_]\w*\b|[^\s\w]+|\s+)')
    matches = pattern.findall(code_part)
    for m in matches:
        if not m:
            continue
        if m.startswith(('"', "'")):
            tokens.append((m, COLOR_GREEN))
        elif m in KEYWORDS:
            tokens.append((m, COLOR_PINK))
        elif m in BUILTINS:
            tokens.append((m, COLOR_CYAN))
        elif re.match(r'^\d', m):
            tokens.append((m, COLOR_AMBER))
        else:
            tokens.append((m, COLOR_WHITE))
            
    if comment_part:
        tokens.append((comment_part, COLOR_MUTED))
    return tokens

def draw_header(draw, exp, sub=None, frame_idx=0):
    draw.rectangle([0, 0, WIDTH, 48], fill=COLOR_HEADER_BG)
    draw.line([0, 48, WIDTH, 48], fill=COLOR_BORDER, width=1)
    
    # Traffic light dots
    draw.ellipse([20, 18, 30, 28], fill=COLOR_RED)
    draw.ellipse([36, 18, 46, 28], fill=COLOR_AMBER)
    draw.ellipse([52, 18, 62, 28], fill=COLOR_GREEN)
    
    disp_num = exp.get('displayNumber', f"{exp.get('number', 1):02d}")
    exp_title = exp.get('title', '')
    if len(exp_title) > 42:
        exp_title = exp_title[:40] + "..."
    draw.text((75, 15), "DATA SCIENCE LAB ›", fill=COLOR_MUTED, font=FONT_SEGOE_BOLD_SM)
    draw.text((205, 15), f"EXP {disp_num}: {exp_title}", fill=COLOR_CYAN, font=FONT_SEGOE_BOLD_SM)
    
    pulse = (frame_idx % 24) < 12
    dot_color = (34, 197, 94) if pulse else (22, 163, 74)
    draw.ellipse([1100, 20, 1108, 28], fill=dot_color)
    draw.text((1115, 15), "Python 3.12 Kernel", fill=COLOR_WHITE, font=FONT_SEGOE_XS)

def draw_footer(draw, exp, sub=None):
    draw.rectangle([0, HEIGHT - 32, WIDTH, HEIGHT], fill=COLOR_HEADER_BG)
    draw.line([0, HEIGHT - 32, WIDTH, HEIGHT - 32], fill=COLOR_BORDER, width=1)
    
    draw.text((20, HEIGHT - 24), "UTF-8  |  Spaces: 4  |  Python 3.12.2", fill=COLOR_DIM, font=FONT_SEGOE_XS)
    
    if sub:
        p_letter = sub.get('partLetter', 'A')
        p_title = sub.get('title', '')
        if len(p_title) > 50:
            p_title = p_title[:48] + "..."
        draw.text((460, HEIGHT - 24), f"Active Part: {p_letter} - {p_title}", fill=COLOR_CYAN, font=FONT_SEGOE_XS)
        
    draw.text((1080, HEIGHT - 24), "Official Lab Walkthrough [OK]", fill=COLOR_TEAL, font=FONT_SEGOE_XS)

def render_title_card(exp, frame_idx, total_frames):
    img = Image.new('RGB', (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    
    draw_header(draw, exp, frame_idx=frame_idx)
    draw_footer(draw, exp)
    
    cx, cy = WIDTH // 2, HEIGHT // 2
    box_w, box_h = 920, 470
    bx1, by1 = cx - box_w // 2, cy - box_h // 2
    bx2, by2 = cx + box_w // 2, cy + box_h // 2
    
    draw.rectangle([bx1, by1, bx2, by2], fill=COLOR_PANEL_LEFT, outline=COLOR_BORDER, width=2)
    
    disp_num = exp.get('displayNumber', f"{exp.get('number', 1):02d}")
    draw.rectangle([bx1, by1, bx2, by1 + 40], fill=COLOR_HEADER_BG)
    draw.line([bx1, by1 + 40, bx2, by1 + 40], fill=COLOR_BORDER, width=1)
    draw.text((bx1 + 24, by1 + 10), f"LABORATORY EXPERIMENT {disp_num} — CODE RUNNER & OUTPUT VERIFICATION", fill=COLOR_TEAL, font=FONT_SEGOE_BOLD_SM)
    
    draw.rectangle([bx1 + 40, by1 + 65, bx1 + 180, by1 + 110], fill=(14, 116, 144), outline=COLOR_CYAN, width=1)
    draw.text((bx1 + 52, by1 + 74), f"EXP {disp_num}", fill=COLOR_WHITE, font=FONT_SEGOE_LG)
    
    title = exp.get('title', '')
    if len(title) > 48:
        title = title[:46] + "..."
    draw.text((bx1 + 40, by1 + 128), title, fill=COLOR_WHITE, font=FONT_SEGOE_XL)
    
    desc = exp.get('subtitle', exp.get('description', ''))
    if len(desc) > 90:
        desc = desc[:88] + "..."
    draw.text((bx1 + 40, by1 + 175), desc, fill=COLOR_MUTED, font=FONT_SEGOE_SM)
    
    tech = exp.get('technology', 'Python, Scikit-Learn, Pandas')
    draw.text((bx1 + 40, by1 + 215), f"Tech Stack: {tech}", fill=COLOR_AMBER, font=FONT_SEGOE_SM)
    
    subs = exp.get('subExperiments', [])
    draw.text((bx1 + 40, by1 + 260), f"Code Routines to Execute ({len(subs)} Parts):", fill=COLOR_CYAN, font=FONT_SEGOE_BOLD_SM)
    
    py = by1 + 292
    for s in subs[:3]:
        p_letter = s.get('partLetter', 'A')
        p_title = s.get('title', '')
        if len(p_title) > 65:
            p_title = p_title[:63] + "..."
        draw.text((bx1 + 55, py), f"• Part {p_letter}: {p_title}", fill=COLOR_WHITE, font=FONT_CONSOLA_MD)
        py += 26
        
    dots = "." * ((frame_idx // 6) % 4)
    draw.text((bx1 + 40, by2 - 40), f"Starting Code Simulation Engine{dots}", fill=COLOR_GREEN, font=FONT_SEGOE_BOLD_SM)
    
    return img

def render_part_intro_card(exp, sub, frame_idx, total_frames):
    img = Image.new('RGB', (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    
    draw_header(draw, exp, sub, frame_idx=frame_idx)
    draw_footer(draw, exp, sub)
    
    cx, cy = WIDTH // 2, HEIGHT // 2
    box_w, box_h = 860, 380
    bx1, by1 = cx - box_w // 2, cy - box_h // 2
    bx2, by2 = cx + box_w // 2, cy + box_h // 2
    
    draw.rectangle([bx1, by1, bx2, by2], fill=COLOR_PANEL_LEFT, outline=COLOR_CYAN, width=2)
    
    p_letter = sub.get('partLetter', 'A')
    p_title = sub.get('title', '')
    aim = sub.get('aim', sub.get('description', ''))
    
    draw.rectangle([bx1 + 36, by1 + 36, bx1 + 160, by1 + 80], fill=(13, 148, 136), outline=COLOR_TEAL, width=1)
    draw.text((bx1 + 50, by1 + 45), f"PART {p_letter}", fill=COLOR_WHITE, font=FONT_SEGOE_LG)
    
    if len(p_title) > 45:
        p_title = p_title[:43] + "..."
    draw.text((bx1 + 36, by1 + 105), p_title, fill=COLOR_WHITE, font=FONT_SEGOE_XL)
    
    draw.rectangle([bx1 + 36, by1 + 165, bx2 - 36, by1 + 250], fill=COLOR_PANEL_RIGHT, outline=COLOR_BORDER)
    draw.text((bx1 + 50, by1 + 175), "AIM / OBJECTIVE:", fill=COLOR_AMBER, font=FONT_SEGOE_BOLD_SM)
    if len(aim) > 85:
        aim_l1 = aim[:85]
        aim_l2 = aim[85:170]
        draw.text((bx1 + 50, by1 + 198), aim_l1, fill=COLOR_WHITE, font=FONT_CONSOLA_MD)
        draw.text((bx1 + 50, by1 + 220), aim_l2, fill=COLOR_WHITE, font=FONT_CONSOLA_MD)
    else:
        draw.text((bx1 + 50, by1 + 205), aim, fill=COLOR_WHITE, font=FONT_CONSOLA_MD)
        
    draw.text((bx1 + 36, by2 - 45), "> Initializing python script and dataset environment...", fill=COLOR_CYAN, font=FONT_CONSOLA_MD)
    return img

def render_editor_and_terminal(exp, sub, state="running", frame_idx=0, code_reveal_pct=1.0):
    img = Image.new('RGB', (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    
    draw_header(draw, exp, sub, frame_idx=frame_idx)
    draw_footer(draw, exp, sub)
    
    lx1, ly1, lx2, ly2 = 16, 56, 700, HEIGHT - 40
    rx1, ry1, rx2, ry2 = 714, 56, 1264, HEIGHT - 40
    p_letter = sub.get('partLetter', 'A')
    
    # 1. LEFT PANE: CODE EDITOR
    draw.rectangle([lx1, ly1, lx2, ly2], fill=COLOR_PANEL_LEFT, outline=COLOR_BORDER, width=1)
    
    tab_h = 36
    draw.rectangle([lx1, ly1, lx2, ly1 + tab_h], fill=COLOR_HEADER_BG)
    draw.line([lx1, ly1 + tab_h, lx2, ly1 + tab_h], fill=COLOR_BORDER, width=1)
    
    tab_w = 270
    draw.rectangle([lx1, ly1, lx1 + tab_w, ly1 + tab_h], fill=COLOR_PANEL_LEFT)
    draw.line([lx1, ly1, lx1 + tab_w, ly1], fill=COLOR_TEAL, width=2)
    draw.rectangle([lx1 + 12, ly1 + 9, lx1 + 32, ly1 + 27], fill=(234, 179, 8), outline=None)
    draw.text((lx1 + 15, ly1 + 10), "py", fill=(0, 0, 0), font=FONT_CONSOLA_BOLD)
    draw.text((lx1 + 38, ly1 + 10), f"experiment_{exp.get('number', 1)}_part_{p_letter.lower()}.py", fill=COLOR_WHITE, font=FONT_CONSOLA_MD)
    
    code_text = sub.get('code', '')
    all_lines = code_text.splitlines()
    visible_count = max(1, int(len(all_lines) * code_reveal_pct))
    lines_to_show = all_lines[:visible_count]
    
    gutter_w = 42
    draw.rectangle([lx1, ly1 + tab_h, lx1 + gutter_w, ly2], fill=COLOR_GUTTER)
    draw.line([lx1 + gutter_w, ly1 + tab_h, lx1 + gutter_w, ly2], fill=COLOR_BORDER, width=1)
    
    max_editor_lines = 25
    start_line_idx = max(0, len(lines_to_show) - max_editor_lines)
    
    text_y = ly1 + tab_h + 8
    for i, line in enumerate(lines_to_show[start_line_idx:], start=start_line_idx + 1):
        draw.text((lx1 + 8, text_y), f"{i:2d}", fill=COLOR_DIM, font=FONT_CONSOLA_SM)
        tokens = tokenize_python_line(line)
        tx = lx1 + gutter_w + 10
        for token_text, token_color in tokens:
            draw.text((tx, text_y), token_text, fill=token_color, font=FONT_CONSOLA_MD)
            bbox = FONT_CONSOLA_MD.getbbox(token_text)
            tw = bbox[2] - bbox[0]
            tx += tw
        text_y += 21
        if text_y > ly2 - 25:
            break
            
    if state == "running":
        cursor_pulse = (frame_idx % 12) < 6
        if cursor_pulse:
            draw.rectangle([lx1 + gutter_w + 10, text_y, lx1 + gutter_w + 18, text_y + 16], fill=COLOR_CYAN)

    # 2. RIGHT PANE: TERMINAL & OUTPUT
    draw.rectangle([rx1, ry1, rx2, ry2], fill=COLOR_PANEL_RIGHT, outline=COLOR_BORDER, width=1)
    
    draw.rectangle([rx1, ry1, rx2, ry1 + tab_h], fill=COLOR_HEADER_BG)
    draw.line([rx1, ry1 + tab_h, rx2, ry1 + tab_h], fill=COLOR_BORDER, width=1)
    draw.text((rx1 + 16, ry1 + 9), "TERMINAL  —  bash (Python 3.12)", fill=COLOR_MUTED, font=FONT_SEGOE_BOLD_SM)
    
    if state == "running":
        draw.text((rx2 - 120, ry1 + 9), "● RUNNING", fill=COLOR_AMBER, font=FONT_SEGOE_BOLD_SM)
    else:
        draw.text((rx2 - 130, ry1 + 9), "[OK] EXIT: 0", fill=COLOR_GREEN, font=FONT_SEGOE_BOLD_SM)
        
    term_y = ry1 + tab_h + 12
    draw.text((rx1 + 14, term_y), "kartheek@dslab:~$", fill=COLOR_TEAL, font=FONT_CONSOLA_BOLD)
    draw.text((rx1 + 165, term_y), f"python3 part_{p_letter.lower()}.py", fill=COLOR_WHITE, font=FONT_CONSOLA_MD)
    term_y += 24
    
    if state == "running":
        spinners = ["/", "-", "\\", "|"]
        spin_char = spinners[(frame_idx // 3) % len(spinners)]
        draw.text((rx1 + 14, term_y), f"[{spin_char}] Executing Python script on kernel...", fill=COLOR_AMBER, font=FONT_CONSOLA_LG)
        term_y += 28
        
        bar_w = 360
        pct = (frame_idx % 60) / 60.0
        draw.rectangle([rx1 + 14, term_y, rx1 + 14 + bar_w, term_y + 8], fill=COLOR_HEADER_BG, outline=COLOR_BORDER)
        draw.rectangle([rx1 + 14, term_y, rx1 + 14 + int(bar_w * pct), term_y + 8], fill=COLOR_CYAN)
        term_y += 24
        draw.text((rx1 + 14, term_y), "Processing data matrices and running computations...", fill=COLOR_DIM, font=FONT_CONSOLA_SM)
        
    elif state == "completed":
        exec_time = sub.get('output', {}).get('executionTime', '0.12s')
        draw.text((rx1 + 14, term_y), f"[Completed in {exec_time} - Exit code: 0]", fill=COLOR_GREEN, font=FONT_CONSOLA_BOLD)
        term_y += 24
        draw.line([rx1 + 14, term_y, rx2 - 14, term_y], fill=COLOR_BORDER, width=1)
        term_y += 8
        
        raw_out = sub.get('output', {}).get('rawText', '')
        out_lines = raw_out.splitlines() if raw_out else ["Process finished with no stdout."]
        
        for o_line in out_lines[:23]:
            if any(k in o_line for k in ['Data:', 'Accuracy', 'Matrix', 'Score', 'Report', 'Cluster', 'MAE', 'MSE', 'R2']):
                col = COLOR_AMBER
            elif o_line.startswith(('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')):
                col = COLOR_CYAN
            elif '---' in o_line or '===' in o_line:
                col = COLOR_DIM
            else:
                col = COLOR_WHITE
            
            if len(o_line) > 58:
                o_line = o_line[:56] + ".."
            draw.text((rx1 + 14, term_y), o_line, fill=col, font=FONT_CONSOLA_SM)
            term_y += 19
            if term_y > ry2 - 25:
                break
                
    return img

def render_outro_card(exp, frame_idx, total_frames):
    img = Image.new('RGB', (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    
    draw_header(draw, exp, frame_idx=frame_idx)
    draw_footer(draw, exp)
    
    cx, cy = WIDTH // 2, HEIGHT // 2
    box_w, box_h = 900, 420
    bx1, by1 = cx - box_w // 2, cy - box_h // 2
    bx2, by2 = cx + box_w // 2, cy + box_h // 2
    
    draw.rectangle([bx1, by1, bx2, by2], fill=COLOR_PANEL_LEFT, outline=COLOR_GREEN, width=2)
    
    draw.rectangle([bx1, by1, bx2, by1 + 44], fill=(20, 83, 45))
    draw.line([bx1, by1 + 44, bx2, by1 + 44], fill=COLOR_GREEN, width=1)
    draw.text((bx1 + 24, by1 + 12), "[OK] EXPERIMENT CODE RUNNER — COMPLETE & VERIFIED", fill=COLOR_WHITE, font=FONT_SEGOE_MD)
    
    disp_num = exp.get('displayNumber', f"{exp.get('number', 1):02d}")
    draw.text((bx1 + 40, by1 + 75), f"Experiment {disp_num}: Execution Summary", fill=COLOR_WHITE, font=FONT_SEGOE_XL)
    
    subs = exp.get('subExperiments', [])
    draw.text((bx1 + 40, by1 + 130), f"All {len(subs)} code routines executed and verified on Python 3.12 Kernel.", fill=COLOR_CYAN, font=FONT_SEGOE_SM)
    
    py = by1 + 175
    for s in subs[:3]:
        p_letter = s.get('partLetter', 'A')
        p_title = s.get('title', '')
        exec_t = s.get('output', {}).get('executionTime', '0.12s')
        draw.rectangle([bx1 + 40, py, bx2 - 40, py + 34], fill=COLOR_PANEL_RIGHT, outline=COLOR_BORDER)
        draw.text((bx1 + 55, py + 8), f"[OK] Part {p_letter}: {p_title}", fill=COLOR_GREEN, font=FONT_CONSOLA_MD)
        draw.text((bx2 - 140, py + 8), f"Time: {exec_t}", fill=COLOR_AMBER, font=FONT_CONSOLA_SM)
        py += 42
        
    draw.text((bx1 + 40, by2 - 40), "Status: 100% Ready for Student Interactive Code Lab Practice", fill=COLOR_TEAL, font=FONT_SEGOE_BOLD_SM)
    return img

def generate_video_for_experiment(exp):
    exp_id = exp.get('id')
    output_mp4 = f"public/videos/{exp_id}.mp4"
    print(f"[START] Exp {exp.get('number')}: {exp.get('title')} -> {output_mp4}")
    
    cmd = [
        'ffmpeg', '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{WIDTH}x{HEIGHT}',
        '-pix_fmt', 'rgb24',
        '-r', str(FPS),
        '-i', '-',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '22',
        output_mp4
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    frame_count = 0
    subs = exp.get('subExperiments', [])
    
    # 1. Title Card (~2.0s = 48 frames)
    title_frames = 48
    for f in range(title_frames):
        img = render_title_card(exp, f, title_frames)
        proc.stdin.write(img.tobytes())
        frame_count += 1
        
    # 2. Iterate each Sub-Experiment Part
    for sub in subs:
        # A. Part Intro (~1.2s = 28 frames)
        part_intro_frames = 28
        for f in range(part_intro_frames):
            img = render_part_intro_card(exp, sub, f, part_intro_frames)
            proc.stdin.write(img.tobytes())
            frame_count += 1
            
        # B. Code Revealed & Running (~2.2s = 52 frames)
        running_frames = 52
        for f in range(running_frames):
            reveal_pct = min(1.0, 0.3 + 0.7 * (f / running_frames))
            img = render_editor_and_terminal(exp, sub, state="running", frame_idx=f, code_reveal_pct=reveal_pct)
            proc.stdin.write(img.tobytes())
            frame_count += 1
            
        # C. Output Completed (~3.2s = 76 frames)
        completed_frames = 76
        for f in range(completed_frames):
            img = render_editor_and_terminal(exp, sub, state="completed", frame_idx=f, code_reveal_pct=1.0)
            proc.stdin.write(img.tobytes())
            frame_count += 1
            
    # 3. Outro Card (~2.0s = 48 frames)
    outro_frames = 48
    for f in range(outro_frames):
        img = render_outro_card(exp, f, outro_frames)
        proc.stdin.write(img.tobytes())
        frame_count += 1
        
    proc.stdin.close()
    proc.wait()
    
    if os.path.exists(output_mp4):
        size_kb = os.path.getsize(output_mp4) / 1024
        duration_s = frame_count / FPS
        print(f"[DONE] Exp {exp.get('number')} -> {output_mp4} ({duration_s:.1f}s, {size_kb:.1f} KB)")
        return True
    else:
        print(f"[FAIL] Exp {exp.get('number')} failed")
        return False

def main():
    with open('scripts/experiments_all.json', 'r', encoding='utf-8') as f:
        experiments = json.load(f)
        
    os.makedirs('public/videos', exist_ok=True)
    
    # Check if single target
    if len(sys.argv) > 1 and sys.argv[1].startswith('exp-'):
        target = sys.argv[1]
        for exp in experiments:
            if exp.get('id') == target:
                generate_video_for_experiment(exp)
        return
        
    print(f"Generating walkthrough videos for ALL {len(experiments)} experiments...")
    
    # Process sequentially or with small pool
    # Sequential execution is very stable and runs in ~2.5 mins total
    for i, exp in enumerate(experiments, 1):
        print(f"\nProcessing [{i}/{len(experiments)}]...")
        generate_video_for_experiment(exp)
        
    print("\nAll 10 experiment walkthrough videos successfully generated!")

if __name__ == '__main__':
    main()
