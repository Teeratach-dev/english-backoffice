# Sub-Skill: Generate Example Sessions

สร้าง Session Detail type `example` สำหรับแอปเรียนภาษาอังกฤษ
เน้นทดสอบความรู้ขั้นพื้นฐาน ให้ผู้เรียนเห็นภาพการใช้งานจริงของสิ่งที่เรียนมา
ระดับง่าย ตัวเลือกน้อย ไม่มี distractors ที่ซับซ้อน

## Input ที่รับจาก Workflow

- `sessionGroupName` — ชื่อ session group
- `objectives` — วัตถุประสงค์ของ session group
- `cefrLevel` — ระดับ CEFR
- `concept` — concept (คำศัพท์, ประโยค, กฎที่เรียนมา)

## Action Types ที่ใช้

| Action | หน้าที่ใน Example |
|--------|-------------------|
| `explain` | โจทย์ คำถาม สรุป |
| `choice` | เลือกคำตอบ (2-3 ตัวเลือก ง่าย) |
| `fill_sentence_with_choice` | เติมคำจากตัวเลือก (ตัวเลือกน้อย) |
| `match_card` | จับคู่ (3-4 คู่ ง่าย) |
| `reorder` | จัดลำดับคำ (3-4 คำ สั้น) |

## Screen Template

### Pattern A: ผสมหลาย action types (4-5 screens)

```
Screen 1: "Basic Choice"
  [explain] — โจทย์/คำถาม
  [choice] — 2-3 ตัวเลือก (ง่าย ชัดเจน)

Screen 2: "Fill In"
  [fill_sentence_with_choice] — ประโยคสั้นๆ เติม 1 คำ

Screen 3: "Match"
  [match_card] — จับคู่ 3-4 คู่

Screen 4: "Reorder"
  [reorder] — เรียงคำ 3-4 คำ เป็นวลี/ประโยคสั้น

Screen 5: "Summary" (optional)
  [explain] — สรุปสิ่งที่เรียนรู้
```

### Pattern B: เน้น choice + fill (3 screens)

```
Screen 1: "Choose"
  [explain] — คำถาม
  [choice] — เลือกคำตอบ
  [choice] — อีกข้อ

Screen 2: "Fill"
  [fill_sentence_with_choice] — เติมคำ 2 ข้อ

Screen 3: "Summary"
  [explain] — สรุป
```

## JSON Template ตัวอย่าง (Pattern A)

```json
{
  "name": "Example - ฝึกพื้นฐาน Adjective",
  "type": "example",
  "cefrLevel": "A1",
  "sequence": 4,
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
            { "text": "คำไหนเป็น", "translation": [], "isBlank": false },
            { "text": "Adjective?", "translation": ["คำคุณศัพท์"], "isBlank": false, "bold": true }
          ],
          "alignment": "center",
          "size": 18
        },
        {
          "id": "uuid-1-2",
          "type": "choice",
          "sequence": 1,
          "items": [
            {
              "text": { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false },
              "isCorrect": true
            },
            {
              "text": { "text": "beauty", "translation": ["ความสวย (นาม)"], "isBlank": false },
              "isCorrect": false
            },
            {
              "text": { "text": "beautify", "translation": ["ทำให้สวย (กริยา)"], "isBlank": false },
              "isCorrect": false
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
          "type": "fill_sentence_with_choice",
          "sequence": 0,
          "sentence": [
            {
              "text": { "text": "He", "translation": ["เขา"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "has", "translation": ["มี"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "a", "translation": [], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "new", "translation": ["ใหม่"], "isBlank": false },
              "isBlank": true,
              "inSentence": true
            },
            {
              "text": { "text": "car.", "translation": ["รถยนต์"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "news", "translation": ["ข่าว (นาม)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            }
          ]
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
            { "left": { "text": "happy" }, "right": { "text": "มีความสุข" } },
            { "left": { "text": "old" }, "right": { "text": "เก่า / แก่" } }
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
          "type": "reorder",
          "sequence": 0,
          "items": [
            {
              "text": { "text": "a", "translation": [], "isBlank": false },
              "sequence": 1
            },
            {
              "text": { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false },
              "sequence": 2
            },
            {
              "text": { "text": "garden", "translation": ["สวน"], "isBlank": false },
              "sequence": 3
            }
          ]
        }
      ]
    }
  ]
}
```

## Guidelines เฉพาะ Example

1. **ระดับง่าย** — ตัวเลือก 2-3 ตัว คำตอบชัดเจน ไม่กำกวม
2. **ไม่มี distractors ซับซ้อน** — ตัวเลือกผิดต้องเห็นได้ชัดว่าผิด (สำหรับคนที่เรียนมาแล้ว)
3. **ใช้คำศัพท์ที่เรียนมาแล้ว** — จาก reading + vocab sessions
4. **Reorder ใช้วลีสั้น** — 3-4 คำ ไม่ใช่ประโยคยาว
5. **Match Card 3-4 คู่** — ไม่มากเกินไป
6. **มี Summary screen** (optional) — สรุปสิ่งที่เรียนรู้จาก session group นี้
7. **ปริมาณตาม CEFR**:
   - A1: 3-4 screens, ข้อง่ายๆ
   - A2: 4-5 screens
   - B1+: 5 screens, หลากหลาย action types
8. **เรียงจากง่ายไปยาก** — choice → fill → match → reorder
