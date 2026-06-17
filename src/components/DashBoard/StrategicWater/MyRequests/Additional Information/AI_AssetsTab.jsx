import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const translations = {
    en: {
        assets: 'Assets',
        plantName: 'Plant Name',
        city: 'City',
        techType: 'Technology Type',
        designCap: 'Design Capacity',
        opDate: 'Commercial Operation Date',
        landPlan: 'Land Layout Plan',
        opPermit: 'Operational Permit...',
        view: 'View',
        pagination: '1–10 of 16',
    },
    ar: {
        assets: 'الأصول',
        plantName: 'اسم المحطة',
        city: 'المدينة',
        techType: 'نوع التقنية',
        designCap: 'السعة التصميمية',
        opDate: 'تاريخ التشغيل التجاري',
        landPlan: 'مخطط الأرض',
        opPermit: 'تصريح التشغيل...',
        view: 'عرض',
        pagination: '١–١٠ من ١٦',
    }
};

const AI_AssetsTab = ({ language }) => {
    const t = translations[language];
    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t.assets}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.plantName}</th>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.city}</th>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.techType}</th>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.designCap}</th>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.opDate}</th>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.landPlan}</th>
                            <th className="p-3 border-b text-sm bg-gray-50 font-semibold text-gray-600">{t.opPermit}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(10)].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-3 border-b text-sm text-gray-700">Purified plant N.o {i + 1}</td>
                                <td className="p-3 border-b text-sm text-gray-700">Riyadh</td>
                                <td className="p-3 border-b text-sm text-gray-700">Reverse Osmosis Technology</td>
                                <td className="p-3 border-b text-sm text-gray-700">6000</td>
                                <td className="p-3 border-b text-sm text-gray-700">27-03-2024</td>
                                <td className="p-3 border-b text-sm text-gray-700"><a href="#" className="text-blue-600 font-semibold hover:underline">{t.view}</a></td>
                                <td className="p-3 border-b text-sm text-gray-700"><a href="#" className="text-blue-600 font-semibold hover:underline">{t.view}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end items-center gap-4 mt-4 p-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">{t.pagination}</span>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border text-gray-600 hover:bg-gray-100"><FaChevronLeft size={12} /></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border text-gray-600 hover:bg-gray-100"><FaChevronRight size={12} /></button>
                </div>
            </div>
        </div>
    );
};

export default AI_AssetsTab;