import {Group} from "@bpmn-io/properties-panel";

class CustomPropertiesProvider {
    constructor(propertiesPanel , injector) {
        // propertiesPanel.registerProvider(500, this);
        propertiesPanel.registerProvider(this);
        this._injector = injector;// Priority: 500
    }

    getGroups(element) {
        console.log(element)
        return (groups) => {
            // Add a custom group
            groups.push({
                id: 'custom-group',
                label: 'Custom Properties',
                Component:Group,
                entries: [
                    {
                        id: 'formKey',
                        label: 'Custom Property',
                        type: 'String',
                        isEdited : true,
                        modelProperty: 'formKey',
                        description: 'A custom property for demonstration purposes',
                        get: (element) => {
                            const businessObject = element.businessObject;
                            return {
                                customProperty: businessObject.formKey
                            };
                        },
                        set: (element, values) => {
                            const businessObject = element.businessObject;
                            businessObject.set('formKey', values.customProperty);
                        }
                    }
                ]
            });

            return groups;
        };
    }
}

CustomPropertiesProvider.$inject = ['propertiesPanel' , 'injector'];

// Register the custom provider
export default {
    __init__: ['customPropertiesProvider'],
    customPropertiesProvider: ['type', CustomPropertiesProvider]
};