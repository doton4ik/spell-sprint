import { canonicalTopic, stableWordId } from './libraryTaxonomy'
import type { LibraryDifficulty, LibraryKind, LibraryWord, WordLibrary } from '../types/library'

type Seed = [word: string, translation: string, subtopic: string, difficulty: LibraryDifficulty, risk: number, partOfSpeech?: string]
function words(library: string, topicName: string, values: Seed[]): LibraryWord[] {
  const topic = canonicalTopic('', topicName)
  return values.map(([word, translation, subtopic, difficulty, risk, partOfSpeech]) => ({
    id: stableWordId(topic.topicId, subtopic, word), wordId: stableWordId(topic.topicId, subtopic, word), word, translation, topicId: topic.topicId, topic: topic.topic, subtopic, difficulty, risk,
    partOfSpeech: partOfSpeech ?? '', library, source: 'built-in',
  }))
}
function library(id: string, name: string, topic: string, kind: LibraryKind, values: Seed[], includes?: string[]): WordLibrary {
  return { id, name, topic: canonicalTopic('', topic).topic, kind, source: 'built-in', includes, words: words(name, topic, values) }
}

export const builtInLibraries: WordLibrary[] = [
  library('shared-inventory-fundamentals', 'Shared — Inventory Fundamentals', 'Logistics', 'shared', [
    ['inventory', 'запасы', 'Inventory Control', 'medium', 4], ['stock', 'товарный запас', 'Inventory Control', 'easy', 3], ['replenishment', 'пополнение запасов', 'Inventory Control', 'hard', 5], ['safety stock', 'страховой запас', 'Inventory Control', 'hard', 5], ['demand planning', 'планирование спроса', 'Inventory Control', 'hard', 5], ['inventory accuracy', 'точность учёта запасов', 'Inventory Control', 'hard', 5], ['storage location', 'место хранения', 'Receiving and Storage', 'medium', 4],
  ]),
  library('shared-professional-essentials', 'Shared — Professional Essentials', 'General English', 'shared', [
    ['deadline', 'крайний срок', 'Professional Communication', 'easy', 3], ['research', 'исследование', 'Professional Communication', 'medium', 3], ['responsibility', 'ответственность', 'Professional Communication', 'medium', 3], ['achievement', 'достижение', 'Professional Communication', 'medium', 3], ['presentation', 'презентация', 'Professional Communication', 'easy', 2], ['communication', 'общение', 'Professional Communication', 'medium', 3],
  ]),
  library('supply-chain-core', 'Supply Chain Core', 'Logistics', 'core', [
    ['supplier', 'поставщик', 'Supply Chain', 'easy', 3], ['shipment', 'поставка / отгрузка', 'Supply Chain', 'medium', 4], ['delivery', 'доставка', 'Supply Chain', 'easy', 3], ['goods receipt', 'приёмка товара', 'Receiving and Storage', 'medium', 4], ['order picking', 'комплектация заказа', 'Order Fulfilment', 'medium', 4], ['warehouse layout', 'планировка склада', 'Receiving and Storage', 'hard', 4], ['distribution center', 'распределительный центр', 'Supply Chain', 'hard', 4], ['lead time', 'срок поставки', 'Supply Chain', 'medium', 4], ['transportation cost', 'транспортные расходы', 'Supply Chain', 'hard', 4],
  ], ['shared-inventory-fundamentals']),
  library('warehouse-operations-sap', 'Warehouse Operations — SAP', 'Warehouse Operations', 'topic', [
    ['material', 'материал', 'SAP Warehouse Processes', 'easy', 3], ['purchase order', 'заказ на поставку', 'SAP Warehouse Processes', 'medium', 4], ['goods movement', 'движение товара', 'SAP Warehouse Processes', 'hard', 5], ['warehouse task', 'складская задача', 'SAP Warehouse Processes', 'hard', 5], ['inbound processing', 'входящая обработка', 'SAP Warehouse Processes', 'hard', 5], ['outbound processing', 'исходящая обработка', 'SAP Warehouse Processes', 'hard', 5], ['physical inventory', 'физическая инвентаризация', 'Inventory Control', 'hard', 5], ['material document', 'документ материала', 'SAP Warehouse Processes', 'hard', 5],
  ], ['shared-inventory-fundamentals']),
  library('business-office-core', 'Business and Office Core', 'Business and Office', 'core', [
    ['revenue', 'выручка', 'Finance and Planning', 'medium', 4], ['expenses', 'расходы', 'Finance and Planning', 'medium', 4], ['profit', 'прибыль', 'Finance and Planning', 'medium', 3], ['profit margin', 'маржа прибыли', 'Finance and Planning', 'hard', 5], ['invoice', 'счёт-фактура', 'Finance and Planning', 'medium', 4], ['negotiation', 'переговоры', 'Meetings and Negotiation', 'medium', 4], ['agreement', 'соглашение', 'Meetings and Negotiation', 'easy', 3], ['recruitment', 'подбор персонала', 'Meetings and Negotiation', 'hard', 4], ['target', 'цель', 'Finance and Planning', 'easy', 3], ['customer satisfaction', 'удовлетворённость клиентов', 'Meetings and Negotiation', 'hard', 4], ['market demand', 'рыночный спрос', 'Finance and Planning', 'hard', 4], ['cash flow', 'денежный поток', 'Finance and Planning', 'hard', 5], ['complaint', 'жалоба', 'Meetings and Negotiation', 'medium', 3],
  ], ['shared-professional-essentials']),
  library('general-english-active', 'General English — Active Vocabulary', 'General English', 'core', [
    ['environment', 'окружающая среда', 'Active Vocabulary', 'medium', 4], ['opportunity', 'возможность', 'Active Vocabulary', 'medium', 4], ['society', 'общество', 'Active Vocabulary', 'medium', 3], ['technology', 'технология', 'Active Vocabulary', 'easy', 2], ['culture', 'культура', 'Active Vocabulary', 'easy', 2],
  ], ['shared-professional-essentials']),
  library('study-career-core', 'Study and Career Core', 'Study and Career', 'core', [
    ['assignment', 'задание', 'Learning and Research', 'medium', 3], ['interview', 'собеседование', 'Career Development', 'medium', 3], ['qualification', 'квалификация', 'Career Development', 'hard', 4], ['experience', 'опыт', 'Career Development', 'easy', 2],
  ], ['shared-professional-essentials']),
  library('travel-culture-core', 'Travel and Culture Core', 'Travel and Culture', 'core', [
    ['luggage', 'багаж', 'Travel Planning', 'medium', 3], ['departure', 'отправление', 'Travel Planning', 'medium', 3], ['arrival', 'прибытие', 'Travel Planning', 'medium', 3], ['accommodation', 'проживание', 'At the Destination', 'hard', 4], ['directions', 'направления', 'At the Destination', 'medium', 4], ['ticket', 'билет', 'Travel Planning', 'easy', 2], ['reservation', 'бронирование', 'Travel Planning', 'medium', 3], ['delay', 'задержка', 'Travel Planning', 'easy', 2], ['border', 'граница', 'Travel Planning', 'easy', 2], ['sightseeing', 'осмотр достопримечательностей', 'At the Destination', 'hard', 4],
  ]),
  library('sport-fitness-core', 'Sport and Fitness Core', 'Sport and Fitness', 'core', [
    ['training', 'тренировка', 'Training and Competition', 'easy', 2], ['match', 'матч', 'Training and Competition', 'easy', 2], ['tournament', 'турнир', 'Training and Competition', 'medium', 3], ['goalkeeper', 'вратарь', 'Training and Competition', 'medium', 3], ['defender', 'защитник', 'Training and Competition', 'medium', 3], ['score', 'счёт', 'Training and Competition', 'easy', 2], ['injury', 'травма', 'Health and Recovery', 'medium', 3],
  ]),
  library('everyday-life-daily-routines', 'Everyday Life — Daily Routines', 'Everyday Life', 'topic', [
    ['breakfast', 'завтрак', 'Daily Routines', 'easy', 2], ['commute', 'дорога на работу', 'Daily Routines', 'medium', 3], ['household chores', 'домашние дела', 'Daily Routines', 'medium', 3], ['appointment', 'запланированная встреча', 'Home and Services', 'medium', 3], ['receipt', 'чек', 'Home and Services', 'easy', 2],
  ]),
  library('transport-trade-road-freight', 'Transport and Trade — Road Freight', 'Transport and Trade', 'topic', [
    ['freight', 'груз', 'Road Freight', 'medium', 4], ['consignment', 'партия груза', 'Road Freight', 'hard', 5], ['carrier', 'перевозчик', 'Road Freight', 'medium', 4], ['customs clearance', 'таможенное оформление', 'Customs and Trade', 'hard', 5], ['bill of lading', 'коносамент', 'Customs and Trade', 'hard', 5],
  ]),
]
