import { Button } from '@/shared/ui/button';

interface ProfileTabProps {
    email: string;
    phone: string;
    position: string;
    specialization: string;
    company: string;
    office: string;
}

export function ProfileTab({ email, phone, position, specialization, company, office }: ProfileTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 font-semibold text-gray-900">Личная информация</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                        <input
                            type="text"
                            defaultValue="Петров"
                            className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            defaultValue="Александр"
                            className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Отчество</label>
                        <input
                            type="text"
                            defaultValue="Иванович"
                            className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-4 font-semibold text-gray-900">Контактные данные</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            defaultValue={email}
                            className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Телефон</label>
                        <input
                            type="tel"
                            defaultValue={phone}
                            className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-4 font-semibold text-gray-900">Профессиональная информация</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Должность</label>
                        <input
                            type="text"
                            defaultValue={position}
                            className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Специализация</label>
                        <select className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                            <option>{specialization}</option>
                            <option>Гражданское право</option>
                            <option>Уголовное право</option>
                            <option>Корпоративное право</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Компания</label>
                    <input
                        type="text"
                        defaultValue={company}
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Адрес офиса</label>
                    <input
                        type="text"
                        defaultValue={office}
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <Button>Сохранить изменения</Button>
        </div>
    );
}
