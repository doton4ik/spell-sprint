import type { DiagnosticBlock, DiagnosticTask } from '../types/diagnostic'

export const diagnosticBlocks: DiagnosticBlock[] = [
  { id: 'spelling', label: 'A · Spelling & word form', description: 'Write 20 correct words.', total: 20 },
  { id: 'vocabulary', label: 'B · General vocabulary', description: 'Activate 20 everyday and academic words.', total: 20 },
  { id: 'grammar', label: 'C · Grammar correction', description: 'Correct 20 short sentences.', total: 20 },
  { id: 'business', label: 'D · Business English', description: 'Check 15 business terms.', total: 15 },
  { id: 'logistics', label: 'E · Logistics English', description: 'Check 15 logistics terms.', total: 15 },
  { id: 'production', label: 'F · Short production', description: 'Write 10 short professional sentences.', total: 10 },
]

const spelling = [
  ['accomodation', 'accommodation'], ['separate', 'separate'], ['definately', 'definitely'], ['goverment', 'government'],
  ['knowledge', 'knowledge'], ['occurence', 'occurrence'], ['developement', 'development'], ['maintainance', 'maintenance'],
  ['successfull', 'successful'], ['priviledge', 'privilege'], ['immediatly', 'immediately'], ['embarass', 'embarrass'],
  ['arguement', 'argument'], ['acheive', 'achieve'], ['independant', 'independent'], ['neccessary', 'necessary'],
  ['commited', 'committed'], ['begining', 'beginning'], ['availible', 'available'], ['collegue', 'colleague'],
]

const vocabulary = [
  ['достижение', 'achievement'], ['влиять', 'influence'], ['окружающая среда', 'environment'], ['возможность', 'opportunity'],
  ['исследование', 'research'], ['поведение', 'behaviour'], ['улучшать', 'improve'], ['преимущество', 'advantage'],
  ['ответственность', 'responsibility'], ['решение', 'solution'], ['объяснять', 'explain'], ['сравнивать', 'compare'],
  ['общество', 'society'], ['разнообразие', 'variety'], ['соглашаться', 'agree'], ['предполагать', 'assume'],
  ['доступный', 'available'], ['развивать', 'develop'], ['общение', 'communication'], ['предлагать', 'suggest'],
]

const grammar = [
  ['She don’t have enough time.', 'She doesn’t have enough time.'], ['I have went to the meeting.', 'I have gone to the meeting.'],
  ['There is many reasons.', 'There are many reasons.'], ['He is responsible on the report.', 'He is responsible for the report.'],
  ['We discussed about the issue.', 'We discussed the issue.'], ['Did you sent the invoice?', 'Did you send the invoice?'],
  ['The information are useful.', 'The information is useful.'], ['I look forward to meet you.', 'I look forward to meeting you.'],
  ['She has worked here since five years.', 'She has worked here for five years.'], ['If I will have time, I will call.', 'If I have time, I will call.'],
  ['The goods was delivered yesterday.', 'The goods were delivered yesterday.'], ['He explained me the process.', 'He explained the process to me.'],
  ['This task is more easier.', 'This task is easier.'], ['We need to make a decision quickly.', 'We need to make a decision quickly.'],
  ['I am interested to learn more.', 'I am interested in learning more.'], ['They didn’t knew the answer.', 'They didn’t know the answer.'],
  ['The manager asked where was the file.', 'The manager asked where the file was.'], ['I have less emails today.', 'I have fewer emails today.'],
  ['The meeting will be hold tomorrow.', 'The meeting will be held tomorrow.'], ['He suggested to change the plan.', 'He suggested changing the plan.'],
]

const business = [
  ['revenue', 'выручка'], ['expenses', 'расходы'], ['profit margin', 'маржа прибыли'], ['invoice', 'счёт'], ['negotiation', 'переговоры'],
  ['agreement', 'соглашение'], ['recruitment', 'подбор персонала'], ['performance', 'результативность'], ['target', 'цель'], ['cash flow', 'денежный поток'],
  ['complaint', 'жалоба'], ['market demand', 'рыночный спрос'], ['customer satisfaction', 'удовлетворённость клиентов'], ['stakeholder', 'заинтересованная сторона'], ['budget', 'бюджет'],
]

const logistics = [
  ['warehouse', 'склад'], ['replenishment', 'пополнение запасов'], ['order picking', 'комплектация заказа'], ['goods receipt', 'приёмка товара'], ['stock transfer', 'перемещение запасов'],
  ['storage location', 'место хранения'], ['safety stock', 'страховой запас'], ['demand planning', 'планирование спроса'], ['distribution center', 'распределительный центр'], ['lead time', 'срок выполнения'],
  ['transportation cost', 'транспортные расходы'], ['inventory accuracy', 'точность учёта запасов'], ['purchase order', 'заказ на поставку'], ['goods movement', 'движение товара'], ['physical inventory', 'физическая инвентаризация'],
]

const production = [
  ['Write: “The shipment arrived on time.”', 'The shipment arrived on time.'], ['Write: “Please send the updated invoice.”', 'Please send the updated invoice.'],
  ['Write: “We need to check the stock level.”', 'We need to check the stock level.'], ['Write: “The supplier confirmed the delivery date.”', 'The supplier confirmed the delivery date.'],
  ['Write: “I am responsible for warehouse operations.”', 'I am responsible for warehouse operations.'], ['Write: “Could you explain this process?”', 'Could you explain this process?'],
  ['Write: “There is a delay in transportation.”', 'There is a delay in transportation.'], ['Write: “The team achieved its target.”', 'The team achieved its target.'],
  ['Write: “We should improve inventory accuracy.”', 'We should improve inventory accuracy.'], ['Write: “The meeting starts at nine.”', 'The meeting starts at nine.'],
]

function tasksFromPairs(blockId: DiagnosticTask['blockId'], pairs: string[][], type: DiagnosticTask['type'], topic: string): DiagnosticTask[] {
  return pairs.map(([prompt, answer], index) => ({ id: `${blockId}-${index + 1}`, blockId, type, prompt, answer, topic }))
}

export const diagnosticTasks: DiagnosticTask[] = [
  ...tasksFromPairs('spelling', spelling, 'correct-spelling', 'Spelling'),
  ...tasksFromPairs('vocabulary', vocabulary, 'translate-ru-en', 'General English'),
  ...tasksFromPairs('grammar', grammar, 'correct-sentence', 'Grammar'),
  ...tasksFromPairs('business', business, 'translate-en-ru', 'Business English'),
  ...tasksFromPairs('logistics', logistics, 'translate-en-ru', 'Logistics English'),
  ...tasksFromPairs('production', production, 'correct-sentence', 'Short production'),
]
