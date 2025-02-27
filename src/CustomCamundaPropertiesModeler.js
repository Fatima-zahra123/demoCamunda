export default function CustomCamundaPropertiesProvider(propertiesPanel) {
    console.log('CustomCamundaPropertiesProvider initialized');
    console.log('propertiesPanel:', propertiesPanel); // Debug log
    if (!propertiesPanel) {
        console.error('propertiesPanel is undefined'); // Debug log
    }
    propertiesPanel.registerProvider(this);
}
// masquer un groupe
CustomCamundaPropertiesProvider.prototype.getGroups = function (element) {
    console.log('getGroups called for element:', element); // Debug log
    return (groups) => {
        console.log('Original groups:', groups); // Debug log
        // Example: Filter out the "General" group
        const filteredGroups = groups.filter((group) => group.id !== 'genaral');
        console.log('Filtered groups:', filteredGroups); // Debug log
        return filteredGroups;
    };
};

//masquer un champ dans un groupe
CustomCamundaPropertiesProvider.prototype.getGroups = function (element) {
    return (groups) => {
        const filteredGroups = groups.map((group) => {
            // Masquer le champ "assignee" dans le groupe "General"
            if (group.id === 'general') {
                group.entries = group.entries.filter((entry) => entry.id !== 'assignee');
            }

            // Masquer le champ "formKey" pour les éléments non UserTask
            if (group.id === 'forms' && element.type !== 'bpmn:UserTask') {
                group.entries = group.entries.filter((entry) => entry.id !== 'formKey');
            }

            return group;
        });

        return filteredGroups;
    };
};