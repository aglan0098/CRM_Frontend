import React from 'react';
import { FaEye } from 'react-icons/fa';

const ContractsTab = ({ language }) => {
    const contractItems = [
        { label: 'Other Party', value: 'Other Party Name' },
        { label: 'Current Contract Status', value: 'Under Execution' },
        { label: 'Contract Type', value: 'Retail' },
        { label: 'Contract Duration (in months)', value: '60' },
        { label: 'Annual Pricing Rate', value: '12000000' },
        { label: 'Contracted Quantity', value: '8' },
    ];
    return (
        <div className="p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contracts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {contractItems.map(item => (
                    <div key={item.label}>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{item.label}</label>
                        <p className="bg-gray-100 text-gray-800 px-4 py-3 rounded-md w-full">{item.value}</p>
                    </div>
                ))}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <textarea className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600" rows="4" readOnly>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Contract File</label>
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white">
                        <span className="text-sm font-medium text-gray-800">National Address.PDF</span>
                        <button className="text-gray-500 hover:text-blue-600 transition-colors"><FaEye /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractsTab;