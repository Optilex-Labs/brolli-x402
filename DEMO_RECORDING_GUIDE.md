# Brolli Agentic Conversion - Demo Recording Guide

**Purpose:** Step-by-step instructions to record the terminal demo for the hackathon video.

**Time Required:** 20 minutes (recording + retakes)

**Final Output:** 30-second terminal recording showing agent decision-making

---

## Prerequisites

### 1. Terminal Setup

**Font & Colors:**
- Open Terminal preferences (Cmd+,)
- Profile: Choose a high-contrast theme (e.g., "Pro" or "Homebrew")
- Font: Menlo or Monaco, size 18pt
- Window size: 1280x720 or larger

**Clean Environment:**
- Close all other applications
- Hide dock (Cmd+Option+D)
- Hide menu bar (System Settings > Desktop & Dock > Automatically hide menu bar)
- Clear terminal history: `clear`

### 2. Frontend Setup (for API demo)

Make sure your frontend is running:
```bash
cd packages/nextjs
yarn dev
```

Keep it running in a separate terminal window (don't record this one).

### 3. Test Run

**Before recording, test the scripts:**

```bash
cd packages/eliza-agents

# Test agent conversation
npx tsx scripts/demo-agentic-conversion.ts

# Test API call (optional)
./scripts/demo-risk-api.sh
```

If you see any errors, fix them before recording.

---

## Recording 1: Agent Decision-Making (Primary Demo)

### Setup

1. Open a fresh terminal window
2. Set font size to 18pt
3. Resize window to fill most of your screen (leave some margin)
4. Navigate to the project:
   ```bash
   cd /Users/nina/ranger-se2/brolli/packages/eliza-agents
   ```
5. Clear the screen: `clear`

### Recording Steps

**Using QuickTime:**
1. Open QuickTime Player
2. File > New Screen Recording
3. Click the arrow next to record button
4. Choose "Built-in Microphone" (if you want voiceover) or "None"
5. Click the red record button
6. Select your terminal window (click to record that window only)

**Recording the Demo:**
1. Press record
2. Wait 2 seconds (don't touch anything)
3. Type slowly and clearly:
   ```bash
   npx tsx scripts/demo-agentic-conversion.ts
   ```
4. Press Enter
5. Let the script run completely (it has built-in pauses)
6. Wait 3 seconds after it finishes
7. Stop recording (Cmd+Control+Esc)

**Save the Recording:**
1. File > Save
2. Name: `agent-decision.mov`
3. Location: Desktop or Downloads

### What You'll See

The script will show:
- 🤖 AI Agent analyzing project (2 sec)
- 📋 Project description (2 sec)
- 🔍 Assessing patent risk (2 sec)
- ⚠️ Risk results with patents and scores (5 sec)
- 💰 ROI calculation (3 sec)
- 🤖 Purchase decision (2 sec)
- 💳 Initiating x402 payment (3 sec)

**Total runtime: ~30 seconds**

### Retakes

If you need to do another take:
1. Type `clear` in the terminal
2. Wait for the prompt to return
3. Start recording again

**Common issues:**
- **Script runs too fast:** Edit the `sleep()` times in `demo-agentic-conversion.ts`
- **Text is too small:** Increase font size (18-20pt)
- **Window is cut off:** Resize terminal to be slightly smaller

---

## Recording 2: API Call Demo (Optional)

**Only do this if you want to show the raw API call before the agent demo.**

### Setup

Same as Recording 1.

### Recording Steps

1. Start QuickTime recording
2. Wait 2 seconds
3. Type:
   ```bash
   ./scripts/demo-risk-api.sh
   ```
4. Press Enter
5. Let it run completely (~15 sec)
6. Wait 2 seconds
7. Stop recording

**Save as:** `api-call.mov`

---

## Post-Recording Checklist

After recording, verify:

- [ ] Video is clear and readable
- [ ] Terminal window is fully visible (not cut off)
- [ ] All text is legible at full screen
- [ ] Script completed without errors
- [ ] Timing feels natural (not too fast or slow)
- [ ] File is saved as .mov format

**File Sizes:**
- `agent-decision.mov`: ~20-50 MB (30 sec)
- `api-call.mov`: ~10-25 MB (15 sec)

---

## Editing Tips for iMovie

### Trimming

If your recording has extra time at the beginning/end:
1. Import to iMovie
2. Select clip
3. Drag yellow handles to trim
4. Remove first 2 seconds (blank screen)
5. Remove last 2 seconds (cursor blinking)

### Text Overlays

Add a title overlay at the start:
- Text: "Stage 1: AI Agent Risk Assessment"
- Font: Futura Bold, size 48pt
- Position: Lower third
- Duration: 3 seconds, then fade out

### Color Correction

If the terminal looks too dark:
1. Select clip
2. Click "Adjust" button (above viewer)
3. Increase brightness slightly (5-10%)
4. Increase contrast slightly (5-10%)

---

## Timeline Assembly

Once you have `agent-decision.mov`:

**Full Demo Timeline (2:00):**
```
00:00 - 00:05  Title card: "Brolli: Agentic License Vending Machine"
00:05 - 00:35  agent-decision.mov (your terminal recording)
00:35 - 01:15  x402-payment.mov (your existing x402 demo)
01:15 - 01:45  basescan-verification.mov (your existing BaseScan video)
01:45 - 02:00  End card: "brolli.vercel.app/agents"
```

### Transitions
- Cross Dissolve between segments (0.5 sec)
- Keep terminal recording at 100% opacity
- No effects needed (keep it clean)

---

## Troubleshooting

### Script Errors

**Error: `tsx: command not found`**
```bash
# Fix: Install tsx globally
npm install -g tsx

# Or use npx (no install needed)
npx tsx scripts/demo-agentic-conversion.ts
```

**Error: `Cannot find module '../index'`**
```bash
# Fix: Make sure you're in the right directory
cd packages/eliza-agents
pwd  # Should end with /eliza-agents
```

### Recording Issues

**Terminal text is blurry:**
- Increase font size to 20pt
- Use a monospace font (Menlo, Monaco, or SF Mono)
- Disable terminal transparency

**QuickTime won't record:**
- Grant screen recording permission: System Settings > Privacy & Security > Screen Recording
- Restart QuickTime Player

**Video file is huge:**
- This is normal for .mov files
- iMovie will compress when exporting
- Final video will be much smaller

---

## Alternative: OBS Studio (Free)

If QuickTime doesn't work:

1. Download OBS Studio (free): https://obsproject.com/
2. Create new scene
3. Add source: Window Capture
4. Select your terminal window
5. Start recording
6. Stop when done
7. Find video in Videos folder

---

## Testing Your Recording

Before starting iMovie:

1. Open the .mov file
2. Watch at full screen
3. Check that text is readable
4. Verify audio is silent (or clear if you added voiceover)
5. Confirm video is 30 seconds or less

**If everything looks good, proceed to iMovie assembly!**

---

## Next Steps

1. ✅ Record `agent-decision.mov`
2. ⏭️ Open iMovie
3. ⏭️ Import your 3 video clips:
   - agent-decision.mov (new)
   - x402-payment.mov (existing)
   - basescan-verification.mov (existing)
4. ⏭️ Follow the timeline structure from the plan
5. ⏭️ Add title cards and text overlays
6. ⏭️ Export as 1080p video
7. ⏭️ Upload for hackathon submission

---

## Quick Reference

**Commands:**
```bash
# Navigate to project
cd /Users/nina/ranger-se2/brolli/packages/eliza-agents

# Record agent demo
npx tsx scripts/demo-agentic-conversion.ts

# Record API demo (optional)
./scripts/demo-risk-api.sh

# Test run (no recording)
clear && npx tsx scripts/demo-agentic-conversion.ts
```

**Recording Checklist:**
- [ ] Terminal: 18pt font, high contrast
- [ ] QuickTime: Window recording mode
- [ ] Clear screen before starting
- [ ] Let script run completely
- [ ] Save as agent-decision.mov

**Good luck with your recording! 🎬**

