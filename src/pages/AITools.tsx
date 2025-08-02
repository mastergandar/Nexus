
import React from 'react';
import { Bot, Image, FileText, BarChart3, Sparkles } from 'lucide-react';

const AITools = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">ИИ-инструменты</h1>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-medium">AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg mr-4">
              <Image className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Генерация изображений</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Создавайте качественные изображения для ваших объявлений с помощью ИИ
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Сгенерировано сегодня:</span>
              <span className="text-white">24 изображения</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Успешных генераций:</span>
              <span className="text-green-400">92%</span>
            </div>
          </div>
          <button className="w-full btn-primary mt-4">
            Генерировать изображение
          </button>
        </div>

        <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Генерация текстов</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Создавайте привлекательные описания для товаров автоматически
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Сгенерировано сегодня:</span>
              <span className="text-white">156 описаний</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Средняя длина:</span>
              <span className="text-blue-400">180 символов</span>
            </div>
          </div>
          <button className="w-full btn-primary mt-4">
            Генерировать текст
          </button>
        </div>

        <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Анализ статистики</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Получайте insights и рекомендации на основе данных ваших объявлений
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Последний анализ:</span>
              <span className="text-white">2 часа назад</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Рекомендаций:</span>
              <span className="text-green-400">8 активных</span>
            </div>
          </div>
          <button className="w-full btn-primary mt-4">
            Анализировать данные
          </button>
        </div>

        <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg mr-4">
              <Bot className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">ИИ-помощник</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Задавайте вопросы и получайте персональные рекомендации
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Статус:</span>
              <span className="text-green-400">Онлайн</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Запросов сегодня:</span>
              <span className="text-orange-400">47</span>
            </div>
          </div>
          <button className="w-full btn-primary mt-4">
            Начать диалог
          </button>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Недавние ИИ-генерации</h3>
        <div className="space-y-4">
          {[
            { type: 'Изображение', title: 'iPhone 14 Pro - фото товара', time: '5 мин назад', status: 'Успешно' },
            { type: 'Текст', title: 'Описание MacBook Air M2', time: '12 мин назад', status: 'Успешно' },
            { type: 'Анализ', title: 'Статистика за неделю', time: '1 час назад', status: 'Завершено' },
            { type: 'Изображение', title: 'PlayStation 5 - баннер', time: '2 часа назад', status: 'Успешно' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  item.status === 'Успешно' || item.status === 'Завершено' ? 'bg-green-400' : 'bg-orange-400'
                }`}></div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 text-sm">{item.status}</p>
                <p className="text-gray-400 text-xs">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Настройки ИИ</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Стиль генерации изображений</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option>Реалистичный</option>
                <option>Минималистичный</option>
                <option>Художественный</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Длина описаний</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option>Краткие (до 100 символов)</option>
                <option>Средние (100-250 символов)</option>
                <option>Подробные (250+ символов)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Статистика использования</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Изображений за месяц:</span>
              <span className="text-white font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Текстов за месяц:</span>
              <span className="text-white font-medium">2,890</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Анализов за месяц:</span>
              <span className="text-white font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Экономия времени:</span>
              <span className="text-green-400 font-medium">~45 часов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
