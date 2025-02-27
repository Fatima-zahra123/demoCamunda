class CustomPropertiesProvider {
    constructor(propertiesPanel) {
        console.log('propertiesPanel', propertiesPanel);
        propertiesPanel.registerProvider(800, this);
    }

    getGroups(element) {
        console.log('element', element);
        return (groups) => {
            if (element.type === 'bpmn:UserTask') {
                groups.push(this._createFormGroup(element));
            }
            return groups;
        };
    }

    _createFormGroup(element) {
        return {
            id: 'form',
            label: 'Form Properties',
            entries: [
                {
                    id: 'formKey',
                    label: 'Form Key',
                    type: 'string',
                    modelProperty: 'formKey',
                    get: (element) => ({ formKey: element.businessObject.get('formKey') || '' }),
                    set: (element, values) => {
                        element.businessObject.set('formKey', values.formKey || '');
                    }
                }
            ]
        };
    }
}

CustomPropertiesProvider.$inject = ['propertiesPanel','injector'];

export default CustomPropertiesProvider;
