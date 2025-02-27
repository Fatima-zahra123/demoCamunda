import { html } from 'htm/preact';

import {TextFieldEntry, isTextFieldEntryEdited, SelectEntry, isSelectEntryEdited} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {

    return [
        {
            id: 'formKey',
            element,
            component: FormKey,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: 'formType',
            element,
            component: FormType,
            isEdited: isSelectEntryEdited
        }

    ];
}

function FormKey(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.formKey || '';
    }

    const setValue = value => {
        return modeling.updateProperties(element, {
            formKey: value
        });
    }

    return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('add form key') }
    label=${ translate('FormKey') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />`
}

function FormType(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.formType || '';
    }

    const setValue = value => {
        return modeling.updateProperties(element, {
            formType: value
        });
    }
    const getOptions = () => {
        const options = [{
            value: 'deployment',
            label: translate('deployment')
        }, {
            value: 'latest',
            label: translate('latest')
        }, {
            value: 'version',
            label: translate('version')
        }];
        return options;
    };
    return SelectEntry({
        element,
        id: 'formType',
        label: translate('form Type'),
        getValue,
        setValue,
        getOptions
    });

}
