import type { LibraryWord, WordLibrary } from '../types/library'

function words(topic: string, values: Array<[string, string, LibraryWord['difficulty'], number, string?, string?, string?]>): LibraryWord[] {
  return values.map(([word, translation, difficulty, risk, rule, example, partOfSpeech]) => ({
    id: `${topic}-${word}`.toLowerCase().replaceAll(' ', '-'), word, translation, topic, difficulty, risk, rule, example, partOfSpeech,
  }))
}

export const builtInLibraries: WordLibrary[] = [
  { id: 'logistics-core', name: 'Logistics Core', topic: 'Logistics', source: 'built-in', words: words('Logistics', [
    ['warehouse', 'склад', 'easy', 3, 'A building where goods are stored', 'The goods are in the warehouse.', 'noun'], ['inventory', 'запасы', 'medium', 4], ['stock', 'товарный запас', 'easy', 3], ['supplier', 'поставщик', 'easy', 3], ['shipment', 'поставка / отгрузка', 'medium', 4], ['delivery', 'доставка', 'easy', 3], ['replenishment', 'пополнение запасов', 'hard', 5], ['order picking', 'комплектация заказа', 'medium', 4], ['goods receipt', 'приёмка товара', 'medium', 4], ['stock transfer', 'перемещение запаса', 'medium', 4], ['storage location', 'место хранения', 'medium', 4], ['warehouse layout', 'планировка склада', 'hard', 4], ['safety stock', 'страховой запас', 'hard', 5], ['demand planning', 'планирование спроса', 'hard', 5], ['distribution center', 'распределительный центр', 'hard', 4], ['lead time', 'срок поставки', 'medium', 4], ['transportation cost', 'транспортные расходы', 'hard', 4], ['inventory accuracy', 'точность учёта запасов', 'hard', 5],
  ]) },
  { id: 'business-core', name: 'Business Essentials', topic: 'Business', source: 'built-in', words: words('Business', [
    ['revenue', 'выручка', 'medium', 4], ['expenses', 'расходы', 'medium', 4], ['profit', 'прибыль', 'medium', 3], ['profit margin', 'маржа прибыли', 'hard', 5], ['invoice', 'счёт-фактура', 'medium', 4], ['negotiation', 'переговоры', 'medium', 4], ['agreement', 'соглашение', 'easy', 3], ['deadline', 'крайний срок', 'easy', 3], ['recruitment', 'подбор персонала', 'hard', 4], ['performance', 'результативность', 'medium', 4], ['target', 'цель', 'easy', 3], ['customer satisfaction', 'удовлетворённость клиентов', 'hard', 4], ['market demand', 'рыночный спрос', 'hard', 4], ['cash flow', 'денежный поток', 'hard', 5], ['complaint', 'жалоба', 'medium', 3],
  ]) },
  { id: 'general-active', name: 'General English: Active Vocabulary', topic: 'General English', source: 'built-in', words: words('General English', [
    ['environment', 'окружающая среда', 'medium', 4], ['opportunity', 'возможность', 'medium', 4], ['achievement', 'достижение', 'medium', 3], ['communication', 'общение', 'medium', 3], ['research', 'исследование', 'medium', 3], ['society', 'общество', 'medium', 3], ['technology', 'технология', 'easy', 2], ['culture', 'культура', 'easy', 2], ['responsibility', 'ответственность', 'medium', 4],
  ]) },
  { id: 'study-career', name: 'Study & Career', topic: 'Study and Career', source: 'built-in', words: words('Study and Career', [
    ['assignment', 'задание', 'medium', 3], ['research', 'исследование', 'medium', 3], ['deadline', 'крайний срок', 'easy', 3], ['presentation', 'презентация', 'easy', 2], ['interview', 'собеседование', 'medium', 3], ['qualification', 'квалификация', 'hard', 4], ['experience', 'опыт', 'easy', 2], ['responsibility', 'ответственность', 'medium', 3], ['achievement', 'достижение', 'medium', 3],
  ]) },
  { id: 'travel', name: 'Travel Essentials', topic: 'Travel', source: 'built-in', words: words('Travel', [
    ['luggage', 'багаж', 'medium', 3], ['departure', 'отправление', 'medium', 3], ['arrival', 'прибытие', 'medium', 3], ['accommodation', 'проживание', 'hard', 4], ['directions', 'направления', 'medium', 4], ['ticket', 'билет', 'easy', 2], ['reservation', 'бронирование', 'medium', 3], ['delay', 'задержка', 'easy', 2], ['border', 'граница', 'easy', 2], ['sightseeing', 'осмотр достопримечательностей', 'hard', 4],
  ]) },
  { id: 'sap-logistics', name: 'SAP / Professional Logistics', topic: 'SAP / Professional Logistics', source: 'built-in', words: words('SAP / Professional Logistics', [
    ['material', 'материал', 'easy', 3], ['purchase order', 'заказ на поставку', 'medium', 4], ['goods movement', 'движение товара', 'hard', 5], ['storage location', 'место хранения', 'medium', 4], ['warehouse task', 'складская задача', 'hard', 5], ['inbound processing', 'входящая обработка', 'hard', 5], ['outbound processing', 'исходящая обработка', 'hard', 5], ['physical inventory', 'физическая инвентаризация', 'hard', 5], ['stock transfer', 'перемещение запаса', 'medium', 4], ['material document', 'документ материала', 'hard', 5],
  ]) },
  { id: 'sports', name: 'Sports', topic: 'Sports', source: 'built-in', words: words('Sports', [
    ['training', 'тренировка', 'easy', 2], ['match', 'матч', 'easy', 2], ['tournament', 'турнир', 'medium', 3], ['goalkeeper', 'вратарь', 'medium', 3], ['defender', 'защитник', 'medium', 3], ['score', 'счёт', 'easy', 2], ['performance', 'выступление', 'medium', 3], ['injury', 'травма', 'medium', 3],
  ]) },
]
