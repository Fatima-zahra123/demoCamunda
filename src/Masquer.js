import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export default function CustomPropertiesProvider(propertiesPanel, injector) {
    this.getGroups = function(element) {
        return function(groups) {
            // Filtrer les groupes de propriétés
            groups = groups.map(group => {
                if (group.id === 'camunda-forms') {
                    // Masquer l'entrée "formKey"
                    group.entries = group.entries.filter(entry => entry.id !== 'formKey');
                }
                return group;
            });
            return groups;
        };
    };

    propertiesPanel.registerProvider(this);
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'injector'];