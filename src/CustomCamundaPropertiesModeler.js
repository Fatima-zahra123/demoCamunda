import {is} from "bpmn-js/lib/util/ModelUtil";
import _ from "underscore";
import {CamundaPlatformPropertiesProviderModule} from "bpmn-js-properties-panel";
export default function CustomCamundaPropertiesProvider(propertiesPanel) {
    console.log('CustomCamundaPropertiesProvider initialized');
    console.log('propertiesPanel:', propertiesPanel); // Debug log
    if (!propertiesPanel) {
        console.error('propertiesPanel is undefined'); // Debug log
    }


    propertiesPanel.registerProvider(this);
    console.log(CamundaPlatformPropertiesProviderModule)

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
            console.log('Group:', group); // Debug log
            // Masquer le champ "assignee" dans le groupe "General"
            if (group.id === 'general') {
                group.entries = group.entries.filter((entry) => entry.id !== 'assignee');
                console.log('Element type:', element.type); // Debug log
                group.entries = group.entries.filter((entry) => entry.id !== 'isExecutable');
            }

            // Masquer le champ "formKey" pour les éléments non UserTask
            if (group.id === 'forms' && element.type !== 'bpmn:UserTask') {
                console.log('Element typessssss:', element.type); // Debug log
                group.entries = group.entries.filter((entry) => entry.id !== 'formKey');
            }

            return group;
        });

        return filteredGroups;
    };
};


//rendre un champ read-only
CustomCamundaPropertiesProvider.prototype.getGroups = function (element) {
    return (groups) => {
        const modifiedGroups = groups.map((group) => {
            if (group.id === 'general') {
                // Cibler le groupe "Forms"
                group.entries = group.entries.map((entry) => {
                    if (entry.id === 'isExecutable') {
                        return {
                            ...entry,// Conserver les autres propriétés du champ
                        };
                    }
                    return entry;
                });
            }
            return group;
        });

        return modifiedGroups;
    };
};