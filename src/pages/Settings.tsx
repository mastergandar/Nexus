
import React from 'react';
import { User, Shield, Bell, Palette, Database, Key } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Настройки</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Профиль пользователя</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Имя</label>
                <input
                  type="text"
                  defaultValue="Георгий"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Фамилия</label>
                <input
                  type="text"
                  defaultValue="Джонсон"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="johnson@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            <button className="btn-primary mt-4">Сохранить изменения</button>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <Shield className="w-5 h-5 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Безопасность</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Текущий пароль</label>
                <input
                  type="password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Новый пароль</label>
                <input
                  type="password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Подтвердите пароль</label>
                <input
                  type="password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            <button className="btn-primary mt-4">Изменить пароль</button>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <Key className="w-5 h-5 text-orange-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">API интеграции</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Avito API ключ</label>
                <input
                  type="password"
                  placeholder="Введите ваш API ключ"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">n8n Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://your-n8n-instance.com/webhook"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            <button className="btn-primary mt-4">Сохранить API настройки</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <Bell className="w-5 h-5 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Уведомления</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Email уведомления', checked: true },
                { label: 'Push уведомления', checked: false },
                { label: 'SMS уведомления', checked: true },
                { label: 'Уведомления о балансе', checked: true },
                { label: 'Уведомления о модерации', checked: true },
              ].map((item, index) => (
                <label key={index} className="flex items-center justify-between">
                  <span className="text-white">{item.label}</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" defaultChecked={item.checked} />
                    <div className={`w-10 h-6 rounded-full ${item.checked ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${item.checked ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <Palette className="w-5 h-5 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Интерфейс</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Тема</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option>Темная (по умолчанию)</option>
                  <option>Светлая</option>
                  <option>Авто</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Язык</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option>Русский</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <Database className="w-5 h-5 text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Данные</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-left">Экспорт данных</button>
              <button className="w-full btn-secondary text-left">Очистить кэш</button>
              <button className="w-full text-red-400 hover:text-red-300 transition-colors text-left">
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
