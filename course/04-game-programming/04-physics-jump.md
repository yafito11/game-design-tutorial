---
id: gprog-physics-504
title: Gravity, Jump & Coyote Time
phase: game-programming
difficulty: beginner
duration: 40
prerequisites: [gprog-collision-503]
tags:
  - physics
  - jump
---

# Gravity, Jump & Coyote Time

## Learning Objectives

Setelah lesson ini user mampu:

- Menerapkan gravity + jump velocity yang terasa enak
- Menambah coyote time, jump buffer, variable jump
- Mendarat stabil di atas platform (AABB split-axis)

## Concept

Jump enak bukan fisika real, tapi trik rasa: **coyote time** (masih bisa lompat 0.1 dtk setelah tinggalkan tepi), **buffer** (tekan lompat sedikit sebelum mendarat tetap dihitung), **variable jump** (lepas tombol = lompat pendek). Gravity sering 2-3x dunia nyata agar responsif.

## Why It Matters

Platformer gagal 90% karena lompat kaku — pemain menyalahkan kontrol, bukan skill mereka.

## Visual Explanation

```mermaid
flowchart TD
    G[Grounded?] -- Ya --> Gc[coyote=0.1]
    G -- Tidak --> Dc[coyote -= dt]
    J{Jump pressed?} -- Ya --> Bf[buffer=0.12]
    Bf + Dc --> JJ{coyote>0 & buffer>0?} -- Ya --> LOMPAT[vy=-jumpVel]
```

## Example

```ts
const GRAV = 2200, JUMP_VEL = 720;
const p = { y: 0, vy: 0, grounded: false, coyote: 0, buffer: 0 };

function updateJump(dt: number, jumpPressed: boolean, jumpHeld: boolean) {
  p.coyote = p.grounded ? 0.1 : Math.max(0, p.coyote - dt);
  if (jumpPressed) p.buffer = 0.12; else p.buffer = Math.max(0, p.buffer - dt);
  if (p.buffer > 0 && p.coyote > 0) {
    p.vy = -JUMP_VEL; p.buffer = 0; p.coyote = 0; p.grounded = false;
  }
  // variable jump: lepas tombol saat naik → potong velocity
  if (!jumpHeld && p.vy < -240) p.vy = -240;
  p.vy += GRAV * dt;
  p.y += p.vy * dt;
}
```

Resolusi mendarat: gerak Y → cek overlap → tempel atas platform + `vy=0, grounded=true`.

## AI Coding with OpenCode

Minta AI tuning angka + tambah 3 trik rasa tanpa ubah arsitektur.

## Example Prompt

```text
You are a senior game developer (platformer feel).
Context: @src/player.ts @src/physics.ts. Lompat sudah bisa tapi kaku.
Task: Tambahkan coyote 0.1, buffer 0.12, variable jump. Tuning GRAV/JUMP_VEL agar lompat ~3 tile.
Constraints: Hanya player.ts. Gerakan horizontal jangan berubah.
Acceptance Criteria: tsc lolos, lompat dari tepi masih bisa, tap = lompat pendek, tahan = tinggi.
```

## Practical Exercise

Set `GRAV=2200, JUMP_VEL=720`. Rasakan, lalu naikkan JUMP_VEL sampai 4 tile. Catat angkanya.

## Challenge

Tambahkan fast-fall (tahan bawah → gravity 1.5x) + landing dust (partikel 6 frame saat mendarat dengan vy besar).

## Common Mistakes

- Jump pakai `y -= 10` tetap (tanpa velocity) → tidak ada arc.
- Gravity terlalu kecil → lompat melayang seperti di bulan.
- Cek grounded hanya dari 1 titik → goyang di tepi. Cek overlap bawah setelah resolve.

## Debugging

Tembus platform saat jatuh cepat? `vy*dt > ketebalan`. Fix: substep Y (bagi gerak jadi 2-3 langkah) atau tebalkan platform. Double-jump misterius? `coyote` tidak di-reset saat lompat.

## Summary

Gravity besar + lompat instan + coyote + buffer + variable = kontrol "mahal".

## Next Lesson

→ `05-combat.md` — Health, Damage & Attack.
