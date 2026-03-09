# Sub-Skill: Generate Test Sessions

สร้าง Session Detail type `test` สำหรับแอปเรียนภาษาอังกฤษ
เน้นทดสอบความสามารถจริงจัง ระดับยากกว่า example ครอบคลุมเนื้อหาทั้ง session group
มี distractors ตัวเลือกมาก ต้องพิมพ์เอง เขียนประโยคเอง

## Input ที่รับจาก Workflow

- `sessionGroupName` — ชื่อ session group
- `objectives` — วัตถุประสงค์ของ session group
- `cefrLevel` — ระดับ CEFR
- `concept` — concept (คำศัพท์, กฎ, ข้อผิดพลาดที่พบบ่อย)

## Action Types ที่ใช้

| Action | หน้าที่ใน Test |
|--------|----------------|
| `choice` | เลือกคำตอบ (4 ตัวเลือก มี distractors ที่สมจริง) |
| `fill_sentence_by_typing` | พิมพ์เติมคำเอง (ไม่มีตัวเลือก) |
| `fill_sentence_with_choice` | เติมคำจากตัวเลือก (มี distractors เยอะ) |
| `reorder` | จัดลำดับ (5-6 คำ ประโยคยาว) |
| `write_sentence` | เขียนประโยคทั้งประโยค |
| `write_sentence_in_chat` | เขียนตอบในบทสนทนา |
| `match_card` | จับคู่ (5-6 คู่ ยากขึ้น) |

## Screen Template

### Pattern A: ครบทุก action type (5-6 screens)

```
Screen 1: "Multiple Choice"
  [choice] — 4 ตัวเลือก มี distractors ที่น่าเชื่อ
  [choice] — อีกข้อ

Screen 2: "Fill by Typing"
  [fill_sentence_by_typing] — พิมพ์เติมคำเอง
  [fill_sentence_by_typing] — อีกข้อ

Screen 3: "Fill with Choice"
  [fill_sentence_with_choice] — เติมคำจากตัวเลือก (มี distractors)

Screen 4: "Reorder"
  [reorder] — จัดลำดับคำ 5-6 คำ เป็นประโยคสมบูรณ์

Screen 5: "Write Sentence"
  [write_sentence] — เขียนประโยคจาก prompt

Screen 6: "Write in Chat" (optional)
  [write_sentence_in_chat] — เขียนตอบในบทสนทนา
```

### Pattern B: เน้น fill + write (4 screens)

```
Screen 1: "Choice"
  [choice] — 2-3 ข้อ

Screen 2: "Fill"
  [fill_sentence_by_typing] — 2 ข้อ

Screen 3: "Write"
  [write_sentence] — 1 ข้อ

Screen 4: "Reorder"
  [reorder] — 1 ข้อ
```

## JSON Template ตัวอย่าง (Pattern A)

```json
{
  "name": "Test - ทดสอบ Adjective",
  "type": "test",
  "cefrLevel": "A1",
  "sequence": 5,
  "isActive": true,
  "screens": [
    {
      "id": "uuid-1",
      "sequence": 0,
      "actions": [
        {
          "id": "uuid-1-1",
          "type": "choice",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "items": [
            {
              "text": { "text": "expensive", "translation": ["แพง"], "isBlank": false },
              "isCorrect": true
            },
            {
              "text": { "text": "expense", "translation": ["ค่าใช้จ่าย (นาม)"], "isBlank": false },
              "isCorrect": false
            },
            {
              "text": { "text": "expend", "translation": ["ใช้จ่าย (กริยา)"], "isBlank": false },
              "isCorrect": false
            },
            {
              "text": { "text": "expenditure", "translation": ["รายจ่าย (นาม)"], "isBlank": false },
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
          "type": "fill_sentence_by_typing",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "sentence": [
            { "text": "The", "isBlank": false, "inSentence": true },
            { "text": "weather", "isBlank": false, "inSentence": true },
            { "text": "is", "isBlank": false, "inSentence": true },
            { "text": "cold", "isBlank": true, "inSentence": true },
            { "text": "today.", "isBlank": false, "inSentence": true }
          ]
        },
        {
          "id": "uuid-2-2",
          "type": "fill_sentence_by_typing",
          "sequence": 1,
          "marginTop": 10,
          "marginBottom": 0,
          "sentence": [
            { "text": "She", "isBlank": false, "inSentence": true },
            { "text": "has", "isBlank": false, "inSentence": true },
            { "text": "long", "isBlank": true, "inSentence": true },
            { "text": "hair.", "isBlank": false, "inSentence": true }
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
          "type": "fill_sentence_with_choice",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "sentence": [
            {
              "text": { "text": "She", "translation": ["เธอ"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "bought", "translation": ["ซื้อ"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "a", "translation": [], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false },
              "isBlank": true,
              "inSentence": true
            },
            {
              "text": { "text": "dress.", "translation": ["ชุด"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "beauty", "translation": ["ความสวย (นาม)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            },
            {
              "text": { "text": "beautify", "translation": ["ทำให้สวย (กริยา)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            },
            {
              "text": { "text": "beautifully", "translation": ["อย่างสวยงาม (วิเศษณ์)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            }
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
          "marginTop": 10,
          "marginBottom": 0,
          "items": [
            {
              "text": { "text": "The", "translation": [], "isBlank": false },
              "sequence": 1
            },
            {
              "text": { "text": "old", "translation": ["แก่", "เก่า"], "isBlank": false },
              "sequence": 2
            },
            {
              "text": { "text": "man", "translation": ["ผู้ชาย"], "isBlank": false },
              "sequence": 3
            },
            {
              "text": { "text": "is", "translation": ["คือ"], "isBlank": false },
              "sequence": 4
            },
            {
              "text": { "text": "kind.", "translation": ["ใจดี"], "isBlank": false },
              "sequence": 5
            }
          ]
        }
      ]
    },
    {
      "id": "uuid-5",
      "sequence": 4,
      "actions": [
        {
          "id": "uuid-5-1",
          "type": "write_sentence",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "sentence": ["I", "am", "happy"],
          "expectSentence": ["I", "am", "happy"]
        }
      ]
    },
    {
      "id": "uuid-6",
      "sequence": 5,
      "actions": [
        {
          "id": "uuid-6-1",
          "type": "write_sentence_in_chat",
          "sequence": 0,
          "marginTop": 10,
          "marginBottom": 0,
          "sentence": ["The", "food", "is", "delicious"],
          "expectSentence": ["The", "food", "is", "delicious"],
          "position": "right"
        }
      ]
    }
  ]
}
```

## Guidelines เฉพาะ Test

1. **ระดับยากกว่า Example** — ตัวเลือก 4 ตัว, distractors สมจริง, ต้องพิมพ์เอง
2. **Distractors ต้องเป็นคำที่มีจริง** — ไม่ใช่คำมั่วๆ ต้องเป็นคำที่ผิด form (noun แทน adj, verb แทน adj)
3. **fill_sentence_by_typing ต้องมีคำตอบที่ชัดเจน** — 1 คำตอบที่ถูกต้อง ไม่กำกวม
4. **write_sentence ต้องมี expectSentence** — เป็นคำตอบที่คาดหวัง ใช้เป็น hint
5. **write_sentence_in_chat position: "right"** — ผู้เรียนเป็นฝั่งขวาเสมอ
6. **Reorder ใช้ประโยคสมบูรณ์** — 5-6 คำ ไม่ใช่แค่วลี
7. **ครอบคลุมเนื้อหาทั้ง session group** — ไม่ใช่แค่ส่วนเดียว
8. **เรียงจากง่ายไปยาก** — choice → fill_choice → fill_typing → reorder → write
9. **ปริมาณตาม CEFR**:
   - A1: 4-5 screens, ข้อยากปานกลาง
   - A2: 5-6 screens
   - B1: 6 screens, fill_typing + write_sentence เยอะ
   - B2+: 6 screens, write_sentence_in_chat + ประโยคยาว

## ความแตกต่างจาก Example

| | Example | Test |
|---|---------|------|
| ตัวเลือก Choice | 2-3 ตัว | 4 ตัว |
| Distractors | ง่าย เห็นชัด | สมจริง ต้องคิด |
| Fill | เลือกจากตัวเลือก | พิมพ์เอง + เลือกจากตัวเลือกที่ยาก |
| Reorder | 3-4 คำ (วลี) | 5-6 คำ (ประโยค) |
| Write | ไม่มี | มี write_sentence + write_sentence_in_chat |
| Match | 3-4 คู่ | 5-6 คู่ (ใช้เมื่อเหมาะสม) |
