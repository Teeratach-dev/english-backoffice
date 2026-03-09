# Sub-Skill: Generate Vocab Sessions

สร้าง Session Detail type `vocab` สำหรับแอปเรียนภาษาอังกฤษ
เน้นให้ผู้เรียนท่องคำศัพท์ จดจำคำศัพท์ เข้าใจความหมายและวิธีใช้

## Input ที่รับจาก Workflow

- `sessionGroupName` — ชื่อ session group
- `objectives` — วัตถุประสงค์ของ session group
- `cefrLevel` — ระดับ CEFR
- `concept` — concept (คำศัพท์หลัก, ประโยคตัวอย่าง)

## Action Types ที่ใช้

| Action | หน้าที่ใน Vocab |
|--------|-----------------|
| `explain` | หัวข้อ คำอธิบาย |
| `reading` | แสดงคำศัพท์ + ตัวอย่างประโยค |
| `column` | layout คู่ (ภาพ + คำศัพท์) |
| `match_card` | ฝึกจับคู่คำศัพท์กับความหมาย |
| `choice` | ทดสอบเลือกความหมายที่ถูก |

## Screen Template

### Pattern A: คำศัพท์ + จับคู่ + เลือก (4 screens)

```
Screen 1: "Vocabulary List"
  [explain] — หัวข้อคำศัพท์ที่จะเรียน (center, size 20)
  [column] — [image: ภาพประกอบ] + [reading: คำศัพท์ = ความหมาย]

Screen 2: "Vocabulary Details"
  [reading] — คำศัพท์ที่ 1 พร้อมตัวอย่างประโยค (คำศัพท์ highlight)
  [reading] — คำศัพท์ที่ 2 พร้อมตัวอย่างประโยค
  [reading] — คำศัพท์ที่ 3 พร้อมตัวอย่างประโยค
  [reading] — คำศัพท์ที่ 4 พร้อมตัวอย่างประโยค

Screen 3: "Match Practice"
  [match_card] — จับคู่คำศัพท์ EN ↔ ความหมาย TH (4-6 คู่)

Screen 4: "Quick Check"
  [choice] — "คำนี้แปลว่าอะไร?" (3 ตัวเลือก)
  [choice] — อีกข้อ
```

### Pattern B: คำศัพท์เยอะ แบ่ง 2 sessions (3 screens ต่อ session)

```
Session "Vocab 1":
  Screen 1: "Vocabulary 1-4"
    [reading] — คำศัพท์ 4 คำ พร้อมตัวอย่าง
  Screen 2: "Match 1"
    [match_card] — จับคู่ 4 คำแรก
  Screen 3: "Check 1"
    [choice] — ทดสอบคำแรก

Session "Vocab 2":
  Screen 1: "Vocabulary 5-8"
    [reading] — คำศัพท์ 4 คำ พร้อมตัวอย่าง
  Screen 2: "Match 2"
    [match_card] — จับคู่ 4 คำหลัง
  Screen 3: "Check 2"
    [choice] — ทดสอบคำหลัง
```

## JSON Template ตัวอย่าง

```json
{
  "name": "Vocab - คำศัพท์ Adjective พื้นฐาน",
  "type": "vocab",
  "cefrLevel": "A1",
  "sequence": 1,
  "isActive": true,
  "screens": [
    {
      "id": "uuid-1",
      "sequence": 0,
      "actions": [
        {
          "id": "uuid-1-1",
          "type": "explain",
          "sequence": 0,
          "text": [
            { "text": "คำคุณศัพท์พื้นฐานที่ควรรู้", "translation": [], "isBlank": false, "bold": true }
          ],
          "alignment": "center",
          "size": 20
        },
        {
          "id": "uuid-1-2",
          "type": "column",
          "sequence": 1,
          "actions": [
            {
              "type": "image",
              "url": ""
            },
            {
              "type": "reading",
              "text": [
                { "text": "big", "translation": ["ใหญ่"], "isBlank": false, "bold": true },
                { "text": "=", "translation": [], "isBlank": false },
                { "text": "ใหญ่", "translation": [], "isBlank": false }
              ],
              "audioUrl": "",
              "isHide": false,
              "isReadable": true
            }
          ]
        }
      ]
    },
    {
      "id": "uuid-2",
      "sequence": 1,
      "actions": [
        {
          "id": "uuid-2-1",
          "type": "reading",
          "sequence": 0,
          "text": [
            { "text": "big", "translation": ["ใหญ่"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "(ใหญ่)", "translation": [], "isBlank": false },
            { "text": "→", "translation": [], "isBlank": false },
            { "text": "The", "translation": [], "isBlank": false },
            { "text": "elephant", "translation": ["ช้าง"], "isBlank": false },
            { "text": "is", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "big.", "translation": ["ใหญ่"], "isBlank": false, "bold": true }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-2-2",
          "type": "reading",
          "sequence": 1,
          "text": [
            { "text": "small", "translation": ["เล็ก"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "(เล็ก)", "translation": [], "isBlank": false },
            { "text": "→", "translation": [], "isBlank": false },
            { "text": "The", "translation": [], "isBlank": false },
            { "text": "mouse", "translation": ["หนู"], "isBlank": false },
            { "text": "is", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "small.", "translation": ["เล็ก"], "isBlank": false, "bold": true }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-2-3",
          "type": "reading",
          "sequence": 2,
          "text": [
            { "text": "tall", "translation": ["สูง"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "(สูง)", "translation": [], "isBlank": false },
            { "text": "→", "translation": [], "isBlank": false },
            { "text": "He", "translation": ["เขา(ผู้ชาย)"], "isBlank": false },
            { "text": "is", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "tall.", "translation": ["สูง"], "isBlank": false, "bold": true }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-2-4",
          "type": "reading",
          "sequence": 3,
          "text": [
            { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "(สวยงาม)", "translation": [], "isBlank": false },
            { "text": "→", "translation": [], "isBlank": false },
            { "text": "She", "translation": ["เธอ"], "isBlank": false },
            { "text": "is", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "beautiful.", "translation": ["สวยงาม"], "isBlank": false, "bold": true }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        }
      ]
    },
    {
      "id": "uuid-3",
      "sequence": 2,
      "actions": [
        {
          "id": "uuid-3-1",
          "type": "match_card",
          "sequence": 0,
          "items": [
            { "left": { "text": "big" }, "right": { "text": "ใหญ่" } },
            { "left": { "text": "small" }, "right": { "text": "เล็ก" } },
            { "left": { "text": "tall" }, "right": { "text": "สูง" } },
            { "left": { "text": "beautiful" }, "right": { "text": "สวยงาม" } }
          ]
        }
      ]
    },
    {
      "id": "uuid-4",
      "sequence": 3,
      "actions": [
        {
          "id": "uuid-4-1",
          "type": "choice",
          "sequence": 0,
          "items": [
            {
              "text": { "text": "ใหญ่", "translation": [], "isBlank": false },
              "isCorrect": true
            },
            {
              "text": { "text": "เล็ก", "translation": [], "isBlank": false },
              "isCorrect": false
            },
            {
              "text": { "text": "สวย", "translation": [], "isBlank": false },
              "isCorrect": false
            }
          ]
        }
      ]
    }
  ]
}
```

## Guidelines เฉพาะ Vocab

1. **คำศัพท์ต้องเกี่ยวข้องกับหัวข้อโดยตรง** — ไม่ใส่คำที่ไม่เกี่ยว
2. **ทุกคำต้องมีตัวอย่างประโยค** — ไม่ใช่แค่คำ + ความหมาย
3. **Match Card ต้อง 4-6 คู่** — ไม่น้อยเกินไป ไม่มากเกินไป
4. **Choice ต้องมี 3 ตัวเลือก** — 1 ถูก + 2 ผิดที่สมจริง (ไม่ใช่คำมั่วๆ)
5. **ถ้าคำศัพท์เกิน 6 คำ ให้แบ่งเป็นหลาย Vocab sessions**
6. **คำศัพท์ต้องเรียงจากง่ายไปยาก** — คำที่ใช้บ่อยก่อน
7. **ปริมาณคำศัพท์ตาม CEFR**:
   - A1: 4-6 คำ, คำง่ายๆ ใช้ในชีวิตประจำวัน
   - A2: 6-8 คำ
   - B1: 8-10 คำ
   - B2+: 10-12 คำ, คำเฉพาะทาง
