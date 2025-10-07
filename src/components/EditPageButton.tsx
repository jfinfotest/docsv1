import React from 'react';

interface EditPageButtonProps {
    filePath: string;
}

const EditPageButton: React.FC<EditPageButtonProps> = ({ filePath }) => {
    // Disable the button completely since GitHub functionality is removed
    return null;
};

export default EditPageButton;