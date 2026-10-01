# Glossary Game Development

> Format tiap istilah: Term → Definition → Simple Explanation → Example → Related Terms.

## Game Loop
- **Definition:** Siklus inti yang berjalan tiap frame: process input → update state → render.
- **Simple:** Jantung game yang berdetak 60x/detik.
- **Example:** `while(running){ handleInput(); update(dt); render(); }`
- **Related:** Delta Time, FPS, Update, Render.

## Gameplay
- **Definition:** Interaksi yang dilakukan pemain dari detik ke detik.
- **Simple:** Apa yang kamu *lakukan* di game.
- **Example:** Lompat, tembak, hindari rintangan di platformer.
- **Related:** Mechanic, Core Loop.

## Mechanic
- **Definition:** Aturan + aksi atomik yang membentuk gameplay (jump, dash, shoot).
- **Simple:** Kata kerja dalam game.
- **Example:** "Hold space untuk charge jump".
- **Related:** Core Loop, Rules.

## Core Loop
- **Definition:** Siklus aksi-imbalan utama yang diulang pemain.
- **Simple:** Alasan pemain main "satu putaran lagi".
- **Example:** Vampire Survivors: bergerak → bunuh → level up → pilih upgrade → ulangi.
- **Related:** Progression, Reward.

## Entity
- **Definition:** Objek apapun di dunia game (player, enemy, koin).
- **Simple:** Kata benda dalam game.
- **Example:** Player entity dengan posisi + sprite + HP.
- **Related:** Component, Scene, Prefab.

## Component
- **Definition:** Potongan data/perilaku yang ditempel ke Entity (Transform, Health, Sprite).
- **Simple:** Lego yang disusun jadi Entity.
- **Example:** `entity.add(new Health(100))`.
- **Related:** Entity Component System, Modular Architecture.

## Scene
- **Definition:** Wadah satu level/area: kumpulan entity + sistem + UI.
- **Simple:** Satu "panggung" permainan.
- **Example:** Scene `Level_01`, `MainMenu`, `GameOver`.
- **Related:** Scene Manager.

## Prefab
- **Definition:** Template entity yang bisa di-spawn berulang.
- **Simple:** Cetakan kue untuk enemy/koin.
- **Example:** Prefab `Goblin` dipakai spawn 20x.
- **Related:** Spawn, Despawn.

## Sprite / Texture / Tilemap
- **Definition:** Sprite: gambar 2D entity. Texture: data gambar di GPU. Tilemap: grid tile pembentuk level.
- **Simple:** Sprite = stiker, Tilemap = lantai keramik dari stiker kecil.
- **Example:** Sprite sheet player 4x4 frame, tileset dungeon 16x16.
- **Related:** Sprite Sheet, Tileset.

## Collider / Hitbox / Hurtbox
- **Definition:** Collider: area logika tabrakan. Hitbox: area yang memberi damage. Hurtbox: area yang menerima damage.
- **Simple:** Kotak tak terlihat untuk deteksi kena.
- **Example:** Hitbox pedang 48x32 di depan player.
- **Related:** Collision, Rigidbody.

## Rigidbody / Transform / Vector
- **Definition:** Rigidbody: simulasi fisika (massa, velocity). Transform: posisi+rotasi+scale. Vector: arah + besar.
- **Simple:** Transform = di mana, Rigidbody = bagaimana bergerak, Vector = ke mana.
- **Example:** `velocity = new Vector2(5, 0)`.
- **Related:** Physics, Delta Time.

## Delta Time / FPS
- **Definition:** Delta Time: detik antar frame. FPS: frame per detik.
- **Simple:** Delta time bikin gerakan sama cepat di 30fps maupun 144fps.
- **Example:** `x += speed * dt`.
- **Related:** Game Loop.

## Input / State Machine
- **Definition:** Input: keyboard/mouse/touch/gamepad. State Machine: diagram status (idle, run, jump, attack) + transisi.
- **Simple:** Input = setir, State Machine = gigi mobil.
- **Example:** `if (grounded && jumpPressed) state = JUMP`.
- **Related:** Animation State, Event.

## NPC / Boss
- **Definition:** NPC: karakter non-pemain (quest giver, pedagang). Boss: enemy klimaks dengan pola serangan.
- **Simple:** NPC = warga desa, Boss = ujian akhir.
- **Example:** NPC dialog + quest, Boss 3 fase serangan.
- **Related:** Enemy AI, Quest.

## HUD / UI / UX
- **Definition:** HUD: info in-game (HP, skor). UI: semua antarmuka (menu, tombol). UX: rasa kemudahan menggunakannya.
- **Simple:** HUD = speedometer, UI = dashboard, UX = nyaman dikendarai.
- **Example:** Health bar + minimap + pause menu.
- **Related:** Main Menu, Accessibility.

## VFX / SFX
- **Definition:** VFX: efek visual (partikel, screen shake). SFX: efek suara pendek (lompat, tembak).
- **Simple:** VFX = kembang api mata, SFX = kembang api telinga.
- **Example:** Partikel ledakan + suara `boom.wav`.
- **Related:** Animation, Audio Manager.

## Spawn / Despawn
- **Definition:** Membuat / menghapus entity saat runtime.
- **Simple:** Lahir dan mati objek game.
- **Example:** Spawn enemy tiap 2 detik, despawn koin yang diambil.
- **Related:** Object Pooling, Prefab.

## Procedural Generation
- **Definition:** Membuat konten (level, loot) via algoritma + seed.
- **Simple:** Level tak terbatas tanpa gambar manual semua.
- **Example:** Roguelike dungeon seed harian.
- **Related:** Random, Seed.

## Game State / Save State
- **Definition:** Game State: status global (menu, playing, paused, gameover). Save State: snapshot progres ke disk.
- **Simple:** Game State = mode, Save = bookmark.
- **Example:** `{ level: 3, hp: 80, inventory: [...] }` di localStorage.
- **Related:** Save Manager.

## Build / Deployment
- **Definition:** Build: bundel game jadi file jalan (exe, apk, web bundle). Deployment: mempublikasikannya (itch.io, Steam, web hosting).
- **Simple:** Build = bungkus kado, Deploy = kirim kado.
- **Example:** `npm run build` → upload ke itch.io.
- **Related:** Optimization, Testing.
