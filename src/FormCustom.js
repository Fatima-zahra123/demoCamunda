export default function FormPropertiesProvider(propertiesPanel) {
    propertiesPanel.registerProvider(this);
}

FormPropertiesProvider.prototype.getGroups = function (element) {
    return (groups) => {
        // Vérifier si l'élément est une User Task
        if (element.type === 'bpmn:UserTask') {
            // Ajouter le groupe "Form" uniquement pour les User Task
            groups.push(this._createFormGroup(element));
        }
        return groups;
    };
};

FormPropertiesProvider.prototype._createFormGroup = function (element) {
    const group = {
        id: 'form',
        label: 'Form',
        entries: [],
    };

    // Ajouter des champs pour le formulaire
    // group.entries.push({
    //     id: 'formKey',
    //     label: 'Form Key',
    //     type: 'String',
    //     html: '<input type="text" name="formType" />',
    //     modelProperty: 'formKey',
    //     description: 'La clé du formulaire à utiliser pour cette tâche.',
    // });

    group.entries.push({
        id: 'formKey',
        label: 'Form Key',
        type: 'String',
        modelProperty: 'formKey', // Propriété à lire/écrire
        get: function (element) {
            console.log(element.businessObject.isExecutable);
            // Lire la propriété formKey de l'élément
            return element.businessObject.isExecutable;
        },
        set: function (element, values) {
            // Écrire la propriété formKey dans l'élément
            const businessObject = element.businessObject;
            businessObject.set('formKey', values.formKey || '');
        },
        description: 'La clé du formulaire à utiliser pour cette tâche.',
    });

//     group.entries.push({
//         id: 'formFields',
//         label: 'Form Fields',
//         type: 'text',
//         modelProperty: 'formFields',
//         description: 'Les champs du formulaire (au format JSON).',
//     });
//
// group.entries.push({
//         id: 'customField',
//         description: 'Enter a custom value',
//         label: 'Custom Field',
//         type: "text",
//         modelProperty: 'customField',
//         get: function(element) {
//             return { customField: element.businessObject.customField || '' };
//         },
//         set: function(element, values) {
//             const bo = element.businessObject;
//             bo.customField = values.customField;
//             return element;
//         }
//     });
    return group;
};