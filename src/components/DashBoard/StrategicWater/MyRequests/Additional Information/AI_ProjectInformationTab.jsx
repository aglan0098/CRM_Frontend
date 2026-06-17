import React from 'react';
import { FaEye } from 'react-icons/fa';

const AI_ProjectInformationTab = ({ language }) => {
    const infoItems = [
        { label: 'National Address', value: 'RSD35275' },
        { label: 'Project Investment Amount', value: 'RSD35275' },
        { label: 'Ownership Structure and Shareholders\' Equity', value: 'Ownership Structure.PDF', isFile: true },
        { label: 'Accounting System/Standard Followed', value: 'Accounting System.PDF', isFile: true },
        { label: 'Site Plan of the Land and Buildings Where the Project Will Be Carried Out', value: 'Site Plan.PDF', isFile: true },
        { label: 'Land and Building Ownership Deed or Proof of Right to Use for Benefit', value: 'Land and Building Ownership.PDF', isFile: true },
        { label: 'Financial Statements for The Last Three Years of the Project', value: 'Financial Statements.PDF', isFile: true },
        { label: 'Executed Contracts Information', value: 'Executed Contracts Information.PDF', isFile: true },
        { label: 'Certificate of Compliance for Installation of Security Surveillance Cameras', value: 'Certificate of Compliance.PDF', isFile: true },
    ];

    return (
         <div className="p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {infoItems.map(item => (
                    <div key={item.label}>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{item.label}</label>
                        {item.isFile ? (
                             <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white">
                                <span className="text-sm font-medium text-gray-800">{item.value}</span>
                                <button className="text-gray-500 hover:text-blue-600 transition-colors"><FaEye /></button>
                            </div>
                        ) : (
                            <p className="bg-gray-100 text-gray-800 px-4 py-3 rounded-md w-full">{item.value}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AI_ProjectInformationTab;