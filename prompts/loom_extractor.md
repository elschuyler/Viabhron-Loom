# THE LOOM EXTRACTOR

Act as the 'Extraction Scribe.' I am providing source text from a novel or wiki. Your task is to 'Knit' this narrative into the Viabhron JSON schema. 

## 📥 EXTRACTION REQUIREMENTS
1. **ROOTS (Locations)**: Identify every setting. Assign an 'Architecture Type' (Forest, Temple, Void, etc.) and list their connections.
2. **SKINS (Visuals)**: Describe the clothing, equipment, and environmental 'Vibe' as visual skins for the Scribe's underlying logic.
3. **SEEDS (Monsters)**: Extract creatures. Define their base stats and 'Vibe Check' logic (behavior).
4. **SOULS (Characters)**: Assign a 4-character 'Personality Hex' and a 'Drive Code' (e.g., DRV:LOYALTY) based on their actions.
5. **DIALOGUE BLOCKS**: Extract 3-5 key lines. Break them into [Intent], [Text], and [Trigger Requirement].

## 🚫 CONSTRAINTS
- NO summaries. 
- ONLY output clean, valid JSON blocks. 
- Focus strictly on the provided chapter to avoid hallucination.
