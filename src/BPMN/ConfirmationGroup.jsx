import React from 'react';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;