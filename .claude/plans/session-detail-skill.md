แผน: Session Detail Skill
วันที่: 2026-03-10
สถานะ: เสร็จสิ้น (updated 2026-03-10)

> **หมายเหตุ (2026-03-10):** อัพเดท skill files ทั้งหมดให้ตรง schema ปัจจุบัน:
> - เพิ่ม marginTop/marginBottom ใน JSON examples ทุก action
> - เพิ่ม height: 200 ใน Image actions
> - เปลี่ยน audioUrl: "" เป็น null ตาม Zod schema
> - แก้ import paths ใน script template (./src → ../src)
> - แก้ Zod schema bugs: ImageAction+height, FillSentenceByTyping+inSentence, ExplainAction+explanation

========================================
สรุปภาพรวม
========================================

สร้าง Workflow + Sub-Skills สำหรับ auto-generate Session Detail content
จากเป้าหมาย (Topic + Session Groups + วัตถุประสงค์) ที่ผู้ใช้ระบุเป็น plain text

โครงสร้าง:
  .claude/skills/
    generate-session-content.md    ← WORKFLOW (parse → คิด concept → เรียก sub-skills → plan preview → script)
    generate-reading-sessions.md   ← Sub-skill: สร้าง content reading
    generate-vocab-sessions.md     ← Sub-skill: สร้าง content vocab
    generate-listening-sessions.md ← Sub-skill: สร้าง content listening
    generate-grammar-sessions.md   ← Sub-skill: สร้าง content grammar
    generate-example-sessions.md   ← Sub-skill: สร้าง content example
    generate-test-sessions.md      ← Sub-skill: สร้าง content test


========================================
ไฟล์ที่เกี่ยวข้อง
========================================

  [สร้างใหม่] .claude/skills/generate-session-content.md      — Workflow หลัก (STEP 1-4)
  [สร้างใหม่] .claude/skills/generate-reading-sessions.md     — Sub-skill: Reading
  [สร้างใหม่] .claude/skills/generate-vocab-sessions.md       — Sub-skill: Vocab
  [สร้างใหม่] .claude/skills/generate-listening-sessions.md   — Sub-skill: Listening
  [สร้างใหม่] .claude/skills/generate-grammar-sessions.md     — Sub-skill: Grammar
  [สร้างใหม่] .claude/skills/generate-example-sessions.md     — Sub-skill: Example
  [สร้างใหม่] .claude/skills/generate-test-sessions.md        — Sub-skill: Test


========================================
Workflow: generate-session-content (STEP 1-4)
========================================

ผู้ใช้เรียก workflow พร้อม input text → ทำงาน 4 ขั้นตอน

--- STEP 1: Parse Input ---

รับ input แบบ plain text:

  Topic 1 - ความหมายและประเภทของคำคุณศัพท์ (Adjective)
      - วัตถุประสงค์
          - อธิบายได้ว่า คำคุณศัพท์ คืออะไร
          - รู้จักคำคุณศัพท์ (Adjective) ในภาษาอังกฤษในแต่ล่ะประเภท
          - สามารถบอกคำคุณศัพท์ (Adjective)ในประโยคภาษาอังกฤษได้
      - Session Group 1 - ความหมายของคำคุณศัพท์ (Adjective)
          - วัตถุประสงค์
              - ระบุคำคุณศัพท์ในประโยคได้
      - Session Group 2 - การสังเกตคำคุณศัพท์จาก Suffix
          - วัตถุประสงค์
              - รู้จักคำคุณศัพท์ที่เกิดจากการเอาคำนาม หรือคำกริยา มาเติม Suffix
      - ...

พร้อม parameters: unitId, cefrLevel

กฎการ parse:
  - บรรทัดที่ขึ้นต้นด้วย "Topic" → สร้าง topic object
  - บรรทัด "วัตถุประสงค์" ใต้ Topic → objectives ของ topic
  - บรรทัดที่ขึ้นต้นด้วย "Session Group" → สร้าง session group object
  - บรรทัด "วัตถุประสงค์" ใต้ Session Group → objectives ของ session group นั้น

Parse ผลลัพธ์:
  {
    topic: {
      name: "ความหมายและประเภทของคำคุณศัพท์ (Adjective)",
      objectives: [
        "อธิบายได้ว่า คำคุณศัพท์ คืออะไร",
        "รู้จักคำคุณศัพท์ (Adjective) ในภาษาอังกฤษในแต่ล่ะประเภท",
        "สามารถบอกคำคุณศัพท์ (Adjective)ในประโยคภาษาอังกฤษได้"
      ]
    },
    sessionGroups: [
      {
        name: "ความหมายของคำคุณศัพท์ (Adjective)",
        objectives: ["ระบุคำคุณศัพท์ในประโยคได้"]
      },
      {
        name: "การสังเกตคำคุณศัพท์จาก Suffix",
        objectives: ["รู้จักคำคุณศัพท์ที่เกิดจากการเอาคำนาม หรือคำกริยา มาเติม Suffix"]
      },
      ...
    ]
  }


--- STEP 2: Generate Plan (Preview) ---

Workflow จะคิด concept หลักจากวัตถุประสงค์ของแต่ละ session group แล้ว
เรียก sub-skills ทั้ง 6 ตัว เพื่อ generate session details:

  สำหรับแต่ละ Session Group:
    1. อ่าน objectives → คิด concept (คำศัพท์, ประโยคตัวอย่าง, สถานการณ์)
    2. เรียก generate-reading-sessions   → ได้ reading session(s)
    3. เรียก generate-vocab-sessions     → ได้ vocab session(s)
    4. เรียก generate-listening-sessions → ได้ listening session(s)
    5. เรียก generate-grammar-sessions   → ได้ grammar session(s)
    6. เรียก generate-example-sessions   → ได้ example session(s)
    7. เรียก generate-test-sessions      → ได้ test session(s)

สร้าง plan preview file ที่ `.claude/plans/session-content-preview.md`

ตัวอย่าง plan preview (Session Group 1):

  ========================================
  Session Group 1: ความหมายของคำคุณศัพท์ (Adjective)
  วัตถุประสงค์: ระบุคำคุณศัพท์ในประโยคได้
  ========================================

  --- Session: Reading - ความหมายของคำคุณศัพท์ (1/1) ---
  CEFR: A1 | Screens: 3

    Screen 1: "Introduction"
      [explain] หัวข้อ: "Adjective คืออะไร?"
        text: "Adjective (คำคุณศัพท์) คือคำที่ใช้ขยายคำนาม..."
      [image] ภาพประกอบ adjective

    Screen 2: "Reading Passage"
      [reading] "Tom has a big house. The house is beautiful..."
        คำศัพท์: big(ใหญ่), beautiful(สวย), tall(สูง)...
      [explain] สรุปคำ adjective ที่เจอในบทอ่าน

    Screen 3: "Conversation"
      [chat] Anna: "Look at that tall building!"
      [chat] Ben: "Yes, it's very beautiful."
      [chat] Anna: "I like the old temple too."
      [chat] Ben: "The small garden is nice."

  --- Session: Vocab - คำศัพท์ Adjective พื้นฐาน (1/1) ---
  CEFR: A1 | Screens: 4

    Screen 1: "Vocabulary List"
      [explain] "คำคุณศัพท์พื้นฐานที่ควรรู้"
      [column] [image: รูปบ้านใหญ่] + [reading: "big = ใหญ่"]

    Screen 2: "Vocabulary Details"
      [reading] "big (ใหญ่) → The elephant is big."
      [reading] "small (เล็ก) → The mouse is small."
      [reading] "tall (สูง) → He is tall."
      [reading] "beautiful (สวย) → She is beautiful."

    Screen 3: "Match Practice"
      [match_card] big↔ใหญ่, small↔เล็ก, tall↔สูง, beautiful↔สวย

    Screen 4: "Quick Check"
      [choice] "big" แปลว่าอะไร?
        ✓ ใหญ่  ✗ เล็ก  ✗ สวย

  --- Session: Listening - ฟังคำคุณศัพท์ (1/1) ---
  CEFR: A1 | Screens: 3

    Screen 1: "Listen to Conversation"
      [explain] "ฟังบทสนทนาต่อไปนี้"
      [audio] (audio placeholder)
      [chat] Anna: "This is a beautiful park." (audioUrl: "")
      [chat] Ben: "Yes, and the flowers are colorful." (audioUrl: "")

    Screen 2: "Listen & Answer"
      [audio] (audio placeholder)
      [choice] "Anna said the park is ___"
        ✓ beautiful  ✗ ugly  ✗ small

    Screen 3: "Listen & Fill"
      [audio] (audio placeholder)
      [fill_sentence_with_choice] "The flowers are ___."
        ✓ colorful  ✗ boring  ✗ expensive

  --- Session: Grammar - กฎการใช้ Adjective (1/1) ---
  CEFR: A1 | Screens: 4

    Screen 1: "Grammar Rule"
      [explain] (center, 20px) "ตำแหน่งของ Adjective ในประโยค"
      [explain] "Adjective วางได้ 2 ตำแหน่ง:
        1. หน้า Noun: a big house
        2. หลัง Verb to be: The house is big."

    Screen 2: "Structure"
      [image] ภาพโครงสร้าง Subject + be + Adjective
      [explain] "Pattern: Subject + is/am/are + Adjective"

    Screen 3: "Examples"
      [reading] "✓ She is beautiful." (highlight: beautiful)
      [reading] "✓ A tall man is standing." (highlight: tall)
      [reading] "✗ She is beauty." (ผิด — beauty เป็น noun)

    Screen 4: "Practice"
      [explain] "ลองทำดู"
      [fill_sentence_with_choice] "The cat is ___."
        ✓ small  ✗ smallness  ✗ smally

  --- Session: Example - ฝึกพื้นฐาน (1/1) ---
  CEFR: A1 | Screens: 4

    Screen 1: "Basic Choice"
      [explain] "คำไหนเป็น Adjective?"
      [choice] ✓ beautiful  ✗ beauty  ✗ beautify

    Screen 2: "Fill In"
      [fill_sentence_with_choice] "He has a ___ car." ✓ new  ✗ news

    Screen 3: "Match"
      [match_card] big↔ใหญ่, happy↔มีความสุข, old↔เก่า/แก่

    Screen 4: "Reorder"
      [reorder] "a" → "beautiful" → "garden" (= a beautiful garden)

  --- Session: Test - ทดสอบ (1/1) ---
  CEFR: A1 | Screens: 5

    Screen 1: "Multiple Choice"
      [choice] "Which word is an adjective?"
        ✓ expensive  ✗ expense  ✗ expend  ✗ expenditure

    Screen 2: "Fill by Typing"
      [fill_sentence_by_typing] "The weather is ___ today." (cold)

    Screen 3: "Fill with Choice"
      [fill_sentence_with_choice] "She bought a ___ dress."
        ✓ beautiful  ✗ beauty  ✗ beautify  ✗ beautifully

    Screen 4: "Reorder"
      [reorder] "The" → "old" → "man" → "is" → "kind" (= The old man is kind)

    Screen 5: "Write Sentence"
      [write_sentence] เขียนประโยคโดยใช้ "happy"
        expectSentence: "I am happy"

  ========================================
  Session Group 2: การสังเกตคำคุณศัพท์จาก Suffix
  วัตถุประสงค์: ...
  ========================================
  ... (ทำซ้ำแบบเดียวกันทุก session group โดยเนื้อหาตรง objectives)


--- STEP 3: User Review ---

แสดง plan preview ให้ผู้ใช้ดู ถามว่า:
  - ตัวอย่างเนื้อหาโอเคไหม?
  - ต้องปรับ action types หรือจำนวน screens ไหม?
  - ต้องเพิ่ม/ลด session details ใน type ไหนไหม?
  - เนื้อหาตรงกับวัตถุประสงค์ไหม?

ผู้ใช้สามารถ:
  a) Approve → ไปขั้นตอน 4
  b) ขอแก้ไข → กลับขั้นตอน 2 แก้ไขตาม feedback
  c) ยกเลิก


--- STEP 4: Generate Script & Execute ---

เมื่อผู้ใช้ approve:
  1. แปลง plan preview เป็น JSON data ที่ตรงกับ DB schema
  2. สร้าง script file ที่ scripts/seed-session-<topic-slug>.ts
  3. Script จะ:
     - Connect DB
     - สร้าง Topic (ถ้ายังไม่มี)
     - สร้าง Session Groups
     - สร้าง Session Details ทั้งหมดพร้อม screens/actions
     - Log ผลลัพธ์
  4. ผู้ใช้สั่งรัน: npx tsx --env-file=.env scripts/seed-session-<topic-slug>.ts


========================================
Sub-Skills: การออกแบบ Action Forms ตาม Session Type
========================================

แต่ละ sub-skill จะรับ concept จาก workflow แล้ว generate session details ตาม template

----------------------------------------
generate-reading-sessions.md
วัตถุประสงค์: อ่านเรื่องสั้น/บทสนทนา สังเกตรูปประโยค เห็นคำศัพท์
----------------------------------------

  Action types ที่ใช้: explain, reading, chat, image, column
  Screen Layout (2-3 screens):

  Screen 1 — "Introduction"
    Action 1: explain — หัวข้อและคำแนะนำการอ่าน
    Action 2: image — ภาพประกอบ (url: "" placeholder)

  Screen 2 — "Reading Passage"
    Action 1: reading — เนื้อเรื่องสั้น/บทความ (text: Word[], isReadable: true)
    Action 2: explain — คำศัพท์ highlight + ความหมาย

  Screen 3 — "Conversation" (optional)
    Action 1: chat — บทสนทนาฝั่ง left (sender A)
    Action 2: chat — บทสนทนาฝั่ง right (sender B)
    Action 3: chat — บทสนทนาฝั่ง left (sender A)
    Action 4: chat — บทสนทนาฝั่ง right (sender B)

----------------------------------------
generate-vocab-sessions.md
วัตถุประสงค์: ท่องคำศัพท์ จำคำศัพท์
----------------------------------------

  Action types ที่ใช้: explain, reading, column, match_card, choice
  Screen Layout (3-4 screens):

  Screen 1 — "Vocabulary List"
    Action 1: explain — หัวข้อคำศัพท์ที่จะเรียน
    Action 2: column — [image + reading] แสดงคำศัพท์ + ภาพ + ความหมาย

  Screen 2 — "Vocabulary Details"
    Action 1: reading — คำศัพท์พร้อมตัวอย่างประโยค (text: Word[] with translation)
    Action 2: reading — คำศัพท์ตัวต่อไป

  Screen 3 — "Vocabulary Practice"
    Action 1: match_card — จับคู่คำศัพท์กับความหมาย (EN ↔ TH)

  Screen 4 — "Quick Check"
    Action 1: choice — เลือกความหมายที่ถูกต้องของคำศัพท์

----------------------------------------
generate-listening-sessions.md
วัตถุประสงค์: ฟังเยอะๆ เข้าใจจากการฟัง
----------------------------------------

  Action types ที่ใช้: explain, audio, chat, choice, fill_sentence_with_choice
  Screen Layout (2-3 screens):

  Screen 1 — "Listen"
    Action 1: explain — คำแนะนำ "ฟังบทสนทนาต่อไปนี้"
    Action 2: audio — ไฟล์เสียง (audio: "" placeholder)
    Action 3: chat — บทสนทนาพร้อม audioUrl (isDisplay: true, isReadable: true)
    Action 4: chat — ตอบกลับ

  Screen 2 — "Listen & Answer"
    Action 1: audio — เสียงคำถาม (audio: "")
    Action 2: choice — ตอบคำถามจากที่ฟัง

  Screen 3 — "Listen & Fill"
    Action 1: audio — เสียงประโยค (audio: "")
    Action 2: fill_sentence_with_choice — เติมคำจากที่ฟัง

  หมายเหตุ: audioUrl ใส่ "" ไปก่อน (ไม่มี audio จริง)

----------------------------------------
generate-grammar-sessions.md
วัตถุประสงค์: สอนไวยากรณ์ตาม Session Group topic
----------------------------------------

  Action types ที่ใช้: explain, reading, image, fill_sentence_with_choice
  Screen Layout (3-4 screens):

  Screen 1 — "Grammar Rule"
    Action 1: explain — อธิบายกฎไวยากรณ์ (alignment: center, size: 20)
    Action 2: explain — รายละเอียดกฎ (alignment: left, size: 16)

  Screen 2 — "Structure"
    Action 1: image — ภาพโครงสร้างไวยากรณ์ (url: "")
    Action 2: explain — สูตร/pattern

  Screen 3 — "Examples"
    Action 1: reading — ตัวอย่างประโยคที่ถูกต้อง (text with highlight)
    Action 2: reading — ตัวอย่างประโยคที่ผิด (เพื่อเปรียบเทียบ)

  Screen 4 — "Practice"
    Action 1: explain — "ลองทำดู"
    Action 2: fill_sentence_with_choice — เติมคำตามกฎที่เรียน

----------------------------------------
generate-example-sessions.md
วัตถุประสงค์: ทดสอบเบสิค ให้เห็นภาพการใช้งาน
----------------------------------------

  Action types ที่ใช้: choice, fill_sentence_with_choice, match_card, reorder, explain
  Screen Layout (3-5 screens):

  Screen 1 — "Basic Choice"
    Action 1: explain — คำถาม/โจทย์
    Action 2: choice — เลือกคำตอบ (2-3 ตัวเลือก ง่าย)

  Screen 2 — "Fill In"
    Action 1: fill_sentence_with_choice — เติมคำจากตัวเลือก (sentence ง่าย)

  Screen 3 — "Match"
    Action 1: match_card — จับคู่ (3-4 คู่ ง่าย)

  Screen 4 — "Reorder"
    Action 1: reorder — จัดลำดับคำในประโยค (3-4 คำ)

  Screen 5 — "Summary"
    Action 1: explain — สรุปสิ่งที่เรียนรู้

----------------------------------------
generate-test-sessions.md
วัตถุประสงค์: ทดสอบจริง ระดับยากกว่า example
----------------------------------------

  Action types ที่ใช้: choice, fill_sentence_by_typing, fill_sentence_with_choice,
    reorder, write_sentence, write_sentence_in_chat, match_card
  Screen Layout (4-6 screens):

  Screen 1 — "Multiple Choice"
    Action 1: choice — เลือกคำตอบ (4 ตัวเลือก มี distractors)

  Screen 2 — "Fill by Typing"
    Action 1: fill_sentence_by_typing — พิมพ์เติมคำเอง (ไม่มีตัวเลือก)

  Screen 3 — "Fill with Choice"
    Action 1: fill_sentence_with_choice — เติมคำจากตัวเลือก (มี distractors)

  Screen 4 — "Reorder"
    Action 1: reorder — จัดลำดับ (5-6 คำ ยากขึ้น)

  Screen 5 — "Write Sentence"
    Action 1: write_sentence — เขียนประโยคจาก prompt

  Screen 6 — "Write in Chat"
    Action 1: write_sentence_in_chat — เขียนตอบในบทสนทนา


========================================
ลำดับการ implement
========================================

ขั้นที่ 1: สร้าง Workflow generate-session-content.md
  — STEP 1-4 ทั้งหมดอยู่ในไฟล์นี้
  — ระบุ data structure, JSON format, กฎการ parse input
  — ระบุว่าต้องเรียก sub-skills อะไรบ้าง

ขั้นที่ 2: สร้าง Sub-Skills 6 ตัว
  — แต่ละตัวมี:
    - Action types ที่ใช้ + JSON template
    - ตัวอย่าง data ที่ generate ออกมา (full JSON)
    - guidelines สำหรับ content quality
    - กฎเรื่อง Word[], Screen, Action format

ขั้นที่ 3: ทดสอบ
  — เรียก workflow ด้วย input ตัวอย่าง (Adjective topic)
  — ดู plan preview ว่าถูกต้อง
  — approve แล้วรัน script save to DB


========================================
ความเสี่ยงและข้อควรระวัง
========================================

- Audio/Image URLs ทั้งหมดจะเป็น "" placeholder
- เนื้อหาที่ AI generate อาจต้อง review/แก้ไขก่อนใช้งานจริง
- ต้องมี Unit ID ที่ valid อยู่ใน DB ก่อนรัน script
- ต้องมี User ID สำหรับ createdBy field (ใช้ Super Admin)
- Screen/Action ID ต้อง generate เป็น unique string (ใช้ crypto.randomUUID)
- Sequence numbers ต้องเรียงถูกต้อง (0, 1, 2, ...)
- Session Detail สามารถแบ่งเป็นหลาย sessions ซ้ำ type ได้
  (เช่น Reading 1, Reading 2) เพื่อไม่ให้อัดกันเกินไปใน session เดียว


========================================
หมายเหตุ
========================================

- Workflow + Sub-skills เป็น Markdown prompt instructions (ไม่ใช่ executable code)
- Claude จะอ่าน prompt แล้ว generate content + script ตาม instructions
- Script ที่ generate ออกมาใช้ Mongoose models ที่มีอยู่แล้วใน project
- ทุก action type มี default content จาก getDefaultContent() ใน action.types.ts
- Word type รองรับ formatting (bold, italic, underline, highlight) และ translation[]
