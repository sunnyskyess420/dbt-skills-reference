import re

# 1. Update worksheet-detail.tsx - add imports and conditional renders
with open('/home/z/my-project/dbt-skills-reference-repo/src/components/dbt/worksheets/worksheet-detail.tsx', 'r') as f:
    content = f.read()

new_imports = [
    'import { WiseMindForm } from "./wise-mind-form";',
    'import { WhatSkillsForm } from "./what-skills-form";',
    'import { HowSkillsForm } from "./how-skills-form";',
    'import { LovingKindnessForm } from "./loving-kindness-form";',
    'import { BalancingDoingBeingForm } from "./balancing-doing-being-form";',
    'import { StopSkillForm } from "./stop-skill-form";',
    'import { TippForm } from "./tipp-form";',
    'import { AcceptsForm } from "./accepts-form";',
    'import { SelfSoothingForm } from "./self-soothing-form";',
    'import { ImproveForm } from "./improve-form";',
    'import { HalfSmilingForm } from "./half-smiling-form";',
    'import { EmotionModelForm } from "./emotion-model-form";',
    'import { ProblemSolvingForm } from "./problem-solving-form";',
    'import { PositivesShortForm } from "./positives-short-form";',
    'import { PositivesLongForm } from "./positives-long-form";',
    'import { SleepHygieneForm } from "./sleep-hygiene-form";',
    'import { ExtremeEmotionsForm } from "./extreme-emotions-form";',
    'import { ClearMindForm } from "./clear-mind-form";',
    'import { FindingPeopleForm } from "./finding-people-form";',
    'import { MindfulnessOthersForm } from "./mindfulness-others-form";',
    'import { EndingRelationshipsForm } from "./ending-relationships-form";',
    'import { OptionsProblemsForm } from "./options-problems-form";',
    'import { DialecticalAbstinenceForm } from "./dialectical-abstinence-form";',
    'import { BehaviorChangeForm } from "./behavior-change-form";',
]

import_block = '\n'.join(new_imports)
content = content.replace(
    'import { BeingEffectiveForm } from "./being-effective-form";',
    'import { BeingEffectiveForm } from "./being-effective-form";\n' + import_block
)

new_renders = [
    ('wise-mind', 'WiseMindForm'),
    ('what-skills', 'WhatSkillsForm'),
    ('how-skills', 'HowSkillsForm'),
    ('loving-kindness', 'LovingKindnessForm'),
    ('balancing-doing-being', 'BalancingDoingBeingForm'),
    ('stop-skill', 'StopSkillForm'),
    ('tipp', 'TippForm'),
    ('accepts', 'AcceptsForm'),
    ('self-soothing', 'SelfSoothingForm'),
    ('improve', 'ImproveForm'),
    ('half-smiling', 'HalfSmilingForm'),
    ('emotion-model', 'EmotionModelForm'),
    ('problem-solving', 'ProblemSolvingForm'),
    ('positives-short', 'PositivesShortForm'),
    ('positives-long', 'PositivesLongForm'),
    ('sleep-hygiene', 'SleepHygieneForm'),
    ('extreme-emotions', 'ExtremeEmotionsForm'),
    ('clear-mind', 'ClearMindForm'),
    ('finding-people', 'FindingPeopleForm'),
    ('mindfulness-others', 'MindfulnessOthersForm'),
    ('ending-relationships', 'EndingRelationshipsForm'),
    ('options-problems', 'OptionsProblemsForm'),
    ('dialectical-abstinence', 'DialecticalAbstinenceForm'),
    ('behavior-change', 'BehaviorChangeForm'),
]

render_block = '\n'.join(f'          {{entry.type === "{t}" && (\n            <{c} entry={{entry}} onChange={{onChangeData}} />\n          )}}' for t, c in new_renders)

content = content.replace(
    '          {{entry.type === "being-effective" && (\n            <BeingEffectiveForm entry={{entry}} onChange={{onChangeData}} />\n          )}}',
    '          {{entry.type === "being-effective" && (\n            <BeingEffectiveForm entry={{entry}} onChange={{onChangeData}} />\n          )}}\n' + render_block
)

with open('/home/z/my-project/dbt-skills-reference-repo/src/components/dbt/worksheets/worksheet-detail.tsx', 'w') as f:
    f.write(content)
print('worksheet-detail.tsx updated')

# 2. Update worksheet-list.tsx groups
with open('/home/z/my-project/dbt-skills-reference-repo/src/components/dbt/worksheets/worksheet-list.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["chain-analysis", "missing-links"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["chain-analysis", "missing-links", "options-problems"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["pros-cons", "radical-acceptance", "crisis-survival-tracker", "mindfulness-thoughts", "turning-mind-willingness"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["pros-cons", "radical-acceptance", "crisis-survival-tracker", "mindfulness-thoughts", "turning-mind-willingness", "stop-skill", "tipp", "accepts", "self-soothing", "improve", "half-smiling", "clear-mind", "dialectical-abstinence"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["diary-card", "check-the-facts", "opposite-action", "values-to-actions", "pleasant-events-diary", "emotion-diary", "cope-ahead", "build-mastery", "please-tracker", "nightmare-protocol", "mindfulness-emotions", "myths-emotions"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["diary-card", "check-the-facts", "opposite-action", "values-to-actions", "pleasant-events-diary", "emotion-diary", "cope-ahead", "build-mastery", "please-tracker", "nightmare-protocol", "mindfulness-emotions", "myths-emotions", "emotion-model", "problem-solving", "positives-short", "positives-long", "sleep-hygiene", "extreme-emotions"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["dear-man-script", "dialectics-practice", "self-validation", "dime-game", "clarifying-priorities", "troubleshooting-ie", "validating-others", "being-effective"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["dear-man-script", "dialectics-practice", "self-validation", "dime-game", "clarifying-priorities", "troubleshooting-ie", "validating-others", "being-effective", "finding-people", "mindfulness-others", "ending-relationships", "behavior-change"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["walking-middle-path"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["walking-middle-path", "wise-mind", "what-skills", "how-skills", "loving-kindness", "balancing-doing-being"].includes(t.id))'
)

with open('/home/z/my-project/dbt-skills-reference-repo/src/components/dbt/worksheets/worksheet-list.tsx', 'w') as f:
    f.write(content)
print('worksheet-list.tsx updated')

# 3. Update page.tsx EMPTY_STATE_GROUPS
with open('/home/z/my-project/dbt-skills-reference-repo/src/app/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["chain-analysis", "missing-links"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["chain-analysis", "missing-links", "options-problems"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["pros-cons", "radical-acceptance", "crisis-survival-tracker", "mindfulness-thoughts", "turning-mind-willingness"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["pros-cons", "radical-acceptance", "crisis-survival-tracker", "mindfulness-thoughts", "turning-mind-willingness", "stop-skill", "tipp", "accepts", "self-soothing", "improve", "half-smiling", "clear-mind", "dialectical-abstinence"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["diary-card", "check-the-facts", "opposite-action", "values-to-actions", "pleasant-events-diary", "emotion-diary", "cope-ahead", "build-mastery", "please-tracker", "nightmare-protocol", "mindfulness-emotions", "myths-emotions"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["diary-card", "check-the-facts", "opposite-action", "values-to-actions", "pleasant-events-diary", "emotion-diary", "cope-ahead", "build-mastery", "please-tracker", "nightmare-protocol", "mindfulness-emotions", "myths-emotions", "emotion-model", "problem-solving", "positives-short", "positives-long", "sleep-hygiene", "extreme-emotions"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["dear-man-script", "dialectics-practice", "self-validation", "dime-game", "clarifying-priorities", "troubleshooting-ie", "validating-others", "being-effective"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["dear-man-script", "dialectics-practice", "self-validation", "dime-game", "clarifying-priorities", "troubleshooting-ie", "validating-others", "being-effective", "finding-people", "mindfulness-others", "ending-relationships", "behavior-change"].includes(t.id))'
)

content = content.replace(
    'types: WORKSHEET_TYPES.filter((t) => ["walking-middle-path"].includes(t.id))',
    'types: WORKSHEET_TYPES.filter((t) => ["walking-middle-path", "wise-mind", "what-skills", "how-skills", "loving-kindness", "balancing-doing-being"].includes(t.id))'
)

with open('/home/z/my-project/dbt-skills-reference-repo/src/app/page.tsx', 'w') as f:
    f.write(content)
print('page.tsx updated')

# 4. Update PDF exports
with open('/home/z/my-project/dbt-skills-reference-repo/src/lib/worksheet-pdf.ts', 'r') as f:
    content = f.read()

# Add new icon imports if needed
if 'Sparkles,' not in content:
    # Find the lucide-react import and add new icons
    content = content.replace(
        'import {',
        'import {\n  Sparkles, Eye, Compass, Heart, YinYang, Octagon, Zap, Shuffle, Flower2, Sparkle, SmilePlus, Puzzle, Sun, Mountain, BedDouble, Siren, CircleDot, UserPlus, ScanEye, UserMinus, GitFork, ShieldHalf, Repeat,'
    )

# Add generic fallback for new worksheet types in the switch
new_cases = ""
for t in ['wise-mind','what-skills','how-skills','loving-kindness','balancing-doing-being','stop-skill','tipp','accepts','self-soothing','improve','half-smiling','emotion-model','problem-solving','positives-short','positives-long','sleep-hygiene','extreme-emotions','clear-mind','finding-people','mindfulness-others','ending-relationships','options-problems','dialectical-abstinence','behavior-change']:
    new_cases += f'      case "{t}": generateGenericWorksheet(doc, entry); break;\n'

content = content.replace(
    '      case "being-effective": generateBeingEffective(doc, entry); break;',
    '      case "being-effective": generateBeingEffective(doc, entry); break;\n' + new_cases
)

# Add generateGenericWorksheet function before the last closing brace or after the last generate function
if 'generateGenericWorksheet' not in content:
    content = content.replace(
        'export function exportToPdf',
        '''function generateGenericWorksheet(doc: any, entry: WorksheetEntry) {\n  const meta = getWorksheetTypeMeta(entry.type);\n  const d = entry.data;\n  let y = 20;\n  const lm = 20;\n  const pw = doc.internal.pageSize.getWidth() - lm * 2;\n  \n  writeTitle(doc, entry.title, lm, y, pw); y += 12;\n  writeSubtitle(doc, meta.name + " — " + meta.reference, lm, y, pw); y += 10;\n  \n  const keys = Object.keys(d).filter(k => d[k] !== "" && d[k] !== 0 && d[k] !== false && d[k] !== undefined);\n  for (const key of keys) {\n    if (y > 270) { doc.addPage(); y = 20; }\n    const label = key.replace(/([A-Z])/g, \' $1\').replace(/^./, s => s.toUpperCase());\n    writeSectionTitle(doc, label, lm, y, pw); y += 8;\n    const val = String(d[key]);\n    const lines = doc.splitTextToSize(val, pw - 10);\n    for (const line of lines) {\n      if (y > 270) { doc.addPage(); y = 20; }\n      doc.text(line, lm + 5, y); y += 6;\n    }\n    y += 4;\n  }\n}\n\nexport function exportToPdf'''
    )

with open('/home/z/my-project/dbt-skills-reference-repo/src/lib/worksheet-pdf.ts', 'w') as f:
    f.write(content)
print('worksheet-pdf.ts updated')

# 5. Update CSV exports
with open('/home/z/my-project/dbt-skills-reference-repo/src/lib/worksheet-csv.ts', 'r') as f:
    content = f.read()

new_csv_cases = ""
for t in ['wise-mind','what-skills','how-skills','loving-kindness','balancing-doing-being','stop-skill','tipp','accepts','self-soothing','improve','half-smiling','emotion-model','problem-solving','positives-short','positives-long','sleep-hygiene','extreme-emotions','clear-mind','finding-people','mindfulness-others','ending-relationships','options-problems','dialectical-abstinence','behavior-change']:
    new_csv_cases += f'      case "{t}": return genericCsvRow(d);\n'

content = content.replace(
    '      case "being-effective": return [d.situation, d.objective, d.fair, d.values, d.script];',
    '      case "being-effective": return [d.situation, d.objective, d.fair, d.values, d.script];\n' + new_csv_cases
)

if 'genericCsvRow' not in content:
    content = content.replace(
        'export function',
        '''function genericCsvRow(d: Record<string, any>): string[] {\n  return Object.values(d).map(v => String(v ?? ""));\n}\n\nexport function'''
    )

with open('/home/z/my-project/dbt-skills-reference-repo/src/lib/worksheet-csv.ts', 'w') as f:
    f.write(content)
print('worksheet-csv.ts updated')

print('ALL DONE')
