export default function CustomPropertiesProvider1(propertiesPanel) {
    propertiesPanel.registerProvider(this);
}

CustomPropertiesProvider1.prototype.getGroups = function (element) {
    return (groups) => {
        // Ajouter un groupe personnalisé
        groups.push(this._createCustomGroup(element));
        return groups;
    };
};

CustomPropertiesProvider1.prototype._createCustomGroup = function (element) {
    const group = {
        id: 'custom',
        label: 'Custom Properties',
        entries: [],
    };

    // Ajouter une propriété personnalisée
    group.entries.push({
        id: 'customProperty',
        label: 'Custom Property',
        type: 'string',
        modelProperty: 'customProperty',
    });

    return group;
};