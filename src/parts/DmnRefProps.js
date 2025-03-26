import {html} from 'htm/preact';
import {isSelectEntryEdited, SelectEntry} from '@bpmn-io/properties-panel';
import {useService} from 'bpmn-js-properties-panel';
import {getFormsByCode} from "../service/formsService.jsx";

export default function(element) {
    return [
        {
            id: 'decisionRef',
            element,
            component: DmnRef,
            isEdited: isSelectEntryEdited
        }
    ];
}

function DmnRef(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    // const [options, setOptions] = useState([]);  // Ajouter un état pour les options

    const getValue = () => {
        return element.businessObject.decisionRef || '';
    }

    const setValue = value => {
        if (value === "none") {
            return modeling.updateProperties(element, {
            decisionRef: ''
        });}
          else{
            return modeling.updateProperties(element, {
                decisionRef: value,
            });
        }

    }


    const getOptions = async () => {
        let options = [
            {
                value: 'none',
                label: translate('none') // Option par défaut
            }
        ];

        // Récupérer les données depuis le localStorage
        const storedForms = localStorage.getItem("Dmns");

        // Vérifie si les données existent et sont bien un tableau
        if (storedForms) {
            try {
                const forms = JSON.parse(storedForms);

                if (Array.isArray(forms)) {
                    // Ajouter les options à partir des données récupérées
                    forms.forEach(form => {
                        options.push({
                            value: form.formId, // Utilise formId comme valeur
                            label: translate(form.formId) // Traduction du formId comme label
                        });
                    });
                } else {
                    console.error('Le contenu de "Forms" n\'est pas un tableau valide.');
                }
            } catch (error) {
                console.error('Erreur lors du parsing des données du localStorage:', error);
            }
        } else {
            console.error('Aucune donnée "Forms" trouvée dans le localStorage.');
        }

        return options;
    };


    return html`
        <${SelectEntry} 
            id=${id} 
            element=${element} 
            description=${translate('')} 
            label=${translate('DmnRef')} 
            getValue=${getValue} 
            setValue=${setValue} 
            getOptions=${getOptions}  // Passer les options récupérées
            debounce=${debounce} 
        />
    `;
}


// import { html } from 'htm/preact';
//
// import {TextFieldEntry, isTextFieldEntryEdited, SelectEntry} from '@bpmn-io/properties-panel';
// import { useService } from 'bpmn-js-properties-panel';
// import {getFormsByCode} from "../service/formsService.jsx";
//
// export default function(element) {
//
//     return [
//         {
//             id: 'formRef',
//             element,
//             component: FormRef1,
//             isEdited: isTextFieldEntryEdited
//         }
//     ];
// }
//
// function FormRef(props) {
//     const { element, id } = props;
//
//     const modeling = useService('modeling');
//     const translate = useService('translate');
//     const debounce = useService('debounceInput');
//
//     const getValue = () => {
//         return element.businessObject.formRef || '';
//     }
//
//     const setValue = value => {
//         return modeling.updateProperties(element, {
//             formRef: value,
//
//         });
//     }
//
//
//     return html`<${TextFieldEntry}
//     id=${ id }
//     element=${ element }
//     description=${ translate('Apply a black magic spell') }
//     label=${ translate('FormRef') }
//     getValue=${ getValue }
//     setValue=${ setValue }
//     debounce=${ debounce }
//   />`
// }
//
//
//
// function FormRef1(props) {
//     const { element, id } = props;
//     // console.log(JSON.parse(localStorage.getItem("formData")))
//     const modeling = useService('modeling');
//     const translate = useService('translate');
//     const debounce = useService('debounceInput');
//
//     const getValue = () => {
//         return element.businessObject.formRef || '';
//     }
//
//     const setValue = value => {
//         if(value==="none") return;
//         return modeling.updateProperties(element, {
//             formRef: value,
//             formRefBinding:"latest"
//         });
//     }
//     // getFormsByCode(JSON.parse(localStorage.getItem("formData")).code).then(r=>console.log(r));
//     //
//     // const getOptions = () => {
//     //
//     //     const options = [{
//     //         value: 'none',
//     //         label: translate('none')
//     //     },{
//     //         value: 'Form_Octroi_de_l_autorisation_d_exploration',
//     //         label: translate('Form_Octroi_de_l_autorisation_d_exploration')
//     //     }, {
//     //         value: 'Form_Octroi_de_l_autorisation_d_exploration',
//     //         label: translate('Form_Octroi_de_l_autorisation_d_exploration')
//     //     }, {
//     //         value: 'Form_Octroi_de_l_autorisation_d_exploration',
//     //         label: translate('Form_Octroi_de_l_autorisation_d_exploration')
//     //     }];
//     //     return options;
//     // };
//
//     const getOptions = async () => {
//         const formData = JSON.parse(localStorage.getItem("formData"));
//         if (formData && formData.code) {
//             try {
//                 const response = await getFormsByCode(formData.code); // Appel à l'API ou à la méthode
//                 const optionsList = response.map(form => ({
//                     value: form.codeProcess, // Utilise le code du formulaire comme valeur
//                     label: translate(form.codeProcess) // Utilise le nom du formulaire comme label
//                 }));
//                 return optionsList;
//             } catch (error) {
//                 console.error("Erreur lors de la récupération des options:", error);
//             }
//         }
//     };
//
//     return html`<${SelectEntry}
//     id=${ id }
//     element=${ element }
//     description=${ translate('') }
//     label=${ translate('FormRef') }
//     getValue=${ getValue }
//     setValue=${ setValue }
//     getOptions=${ getOptions }
//     debounce=${ debounce }
//   />`
// }
