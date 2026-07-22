---
id: StoryEngine
title: Story Engine Architecture & Narrative Choreography
sidebar_label: Story Engine
---

# Momenta — Story Engine Architecture & Narrative Choreography

---

## 1. Story Engine Architecture

The **Story Engine** is the runtime choreography system responsible for assembling discrete story nodes (headings, memory text, photo beats, quotes) into a fluid, multi-act narrative sequence.

```mermaid
graph TD
    Manifest[Story Manifest JSON] --> Driver[Timeline Choreographer]
    
    subgraph Act Orchestration Engine
      Driver --> Act1[Act 1: Atmospheric Hook]
      Driver --> Act2[Act 2: Sequenced Memory Beats]
      Driver --> Act3[Act 3: Narrative Climax]
      Driver --> Act4[Act 4: Interactive Gesture Reveal]
    end

    subgraph Hardware Execution Drivers
      Act1 & Act2 & Act3 & Act4 --> WebAudio[WebAudio BGM Controller]
      Act1 & Act2 & Act3 & Act4 --> DOMRenderer[Framer Motion Typography Renderer]
      Act1 & Act2 & Act3 & Act4 --> Canvas3D[Three.js / WebGL Shader Controller]
    end
```

---

## 2. Multi-Act Narrative Structure Rules

```mermaid
sequenceDiagram
    autonumber
    actor Recipient
    participant Engine as Story Engine
    participant Act1 as Act 1 (Hook)
    participant Act2 as Act 2 (Memories)
    participant Act3 as Act 3 (Climax)
    participant Act4 as Act 4 (Gesture)

    Recipient->>Engine: Tap "Open Story"
    Engine->>Act1: Initialize (Fade-in ambient background & title text)
    Act1-->>Engine: Act 1 Complete (Duration: 5000ms)
    Engine->>Act2: Transition to Act 2 (Parallax photos & memory text beats)
    Recipient->>Act2: Swipe / Scroll through memory cards
    Act2-->>Engine: All Memory Beats Read
    Engine->>Act3: Trigger Act 3 (Typography swell & emotional message core)
    Act3-->>Engine: Climax Text Complete
    Engine->>Act4: Render Gesture Prompt (Wax Seal / Candle Blow)
    Recipient->>Act4: Execute Physical Gesture
    Act4-->>Engine: Gesture Physics Completed -> Show Keepsake Controls
```

---

## 3. Node Transition & Parallax Specifications

```typescript
export interface NodeChoreographySpec {
  nodeId: string;
  actIndex: 1 | 2 | 3 | 4;
  enterAnimation: {
    type: 'FADE_UP' | 'ZOOM_SLIGHT' | 'BLUR_REVEAL';
    durationMs: number;
    easingCurve: [number, number, number, number]; // Cubic Bezier e.g. [0.16, 1, 0.3, 1]
  };
  exitAnimation: {
    type: 'FADE_OUT' | 'PARALLAX_SLIDE_LEFT';
    durationMs: number;
  };
  audioCue: {
    duckBgmVolume: number; // e.g. 0.3 (duck to 30% volume)
    triggerSFX?: string;
  };
}
```

---

## 4. Adaptive Screen & Viewport Response

- **Mobile Viewport (< 768px)**: Vertical single-column swipe sequence. Touch swipe velocity (`deltaY`) mapped directly to timeline progress.
- **Desktop Viewport (>= 768px)**: Horizontal multi-layered card parallax with subtle 3D tilt tracking cursor motion (`perspective: 1000px`, `rotateX/Y` up to $\pm 8^\circ$).
